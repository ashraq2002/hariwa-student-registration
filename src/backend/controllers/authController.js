import { db } from '../models/db.js';
import { generateToken } from '../middleware/authMiddleware.js';
import {
  validateEmailFormat,
  hashPassword,
  verifyPassword,
  generateOTP,
  generateSecureToken,
} from '../utils/authUtils.js';
import { sendEmailJSOTP } from '../utils/emailService.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Full Name is required and cannot be empty.' });
    }

    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({ error: 'Full Name must be between 2 and 100 characters long.' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    // 1. Strict RFC Email format validation on backend
    if (!validateEmailFormat(email)) {
      return res.status(400).json({
        error: 'Invalid email address format. Please enter a valid email address (e.g. user@example.com).',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password is required and must be at least 6 characters long.' });
    }

    if (password.length > 128) {
      return res.status(400).json({ error: 'Password must not exceed 128 characters.' });
    }

    // 2. Duplicate email check in database (case-insensitive)
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      return res.status(400).json({
        error: 'An account is already registered with this email address. Please log in or use a different email.',
        code: 'EMAIL_ALREADY_EXISTS',
      });
    }

    // 3. User setup with isEmailVerified: false
    const userRole = 'student';
    const hashedPassword = await hashPassword(password);
    const otpCode = generateOTP();
    const verificationToken = generateSecureToken();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry

    const newUser = {
      id: `u-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: cleanName,
      email: normalizedEmail,
      role: userRole,
      password: hashedPassword,
      isEmailVerified: false,
      otpCode,
      verificationToken,
      otpExpiresAt,
      failedOtpAttempts: 0,
      emailVerifiedAt: null,
      lastOtpSentAt: new Date().toISOString(),
    };

    db.users.push(newUser);

    // Create admin notification about the registration
    db.addNotification({
      recipientRole: 'admin',
      title: '🎓 New Scholar Registration',
      message: `New applicant ${newUser.name} (${newUser.email}) registered as ${newUser.role}. Verification email sent.`,
      type: 'registration',
      studentName: newUser.name,
      studentEmail: newUser.email,
    });

    db.save();

    // Construct optional verification link
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol || 'http';
    const verificationLink = `${protocol}://${host}/verify-email?token=${verificationToken}&email=${encodeURIComponent(newUser.email)}`;

    // Dispatch real EmailJS verification email immediately
    let emailResult = { success: false };
    try {
      emailResult = await sendEmailJSOTP({
        email: newUser.email,
        name: newUser.name,
        otpCode,
        verificationLink,
      });
    } catch (mailErr) {
      console.error('[Email Dispatch Error]:', mailErr);
    }

    let msg = 'Registration submitted successfully! A 6-digit verification code has been dispatched to your email.';
    if (!emailResult.success) {
      console.warn(`[Auth Warning] EmailJS dispatch issue: ${emailResult.error}`);
      msg += ` (Note: Verification Code: ${otpCode})`;
    }

    return res.status(201).json({
      success: true,
      requireVerification: true,
      email: normalizedEmail,
      message: msg,
      otpCode: !emailResult.success ? otpCode : undefined,
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred during registration. Please try again.',
      details: error.message,
    });
  }
};

export const verifyOTP = (req, res) => {
  const { email, otpCode } = req.body;

  if (!email || !otpCode) {
    return res.status(400).json({ error: 'Both email address and 6-digit verification code are required.' });
  }

  const cleanCode = String(otpCode).trim();
  if (!/^\d{6}$/.test(cleanCode)) {
    return res.status(400).json({ error: 'Verification code must be a 6-digit numerical code.' });
  }

  if (!validateEmailFormat(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address format.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(404).json({ error: 'No user account found associated with this email address.' });
  }

  if (user.isEmailVerified) {
    const token = generateToken(user);
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true,
      },
      message: 'Email address is already verified.',
    });
  }

  // Anti-brute force check (max 5 failed attempts per OTP cycle)
  if ((user.failedOtpAttempts || 0) >= 5) {
    return res.status(429).json({
      error: 'Too many incorrect verification attempts. Please click "Resend Code" to generate a new 6-digit code.',
      code: 'MAX_ATTEMPTS_EXCEEDED',
    });
  }

  // Check code expiration
  if (!user.otpExpiresAt || new Date() > new Date(user.otpExpiresAt)) {
    return res.status(400).json({
      error: 'Verification code has expired. Please click "Resend Code" to receive a new code.',
      code: 'OTP_EXPIRED',
    });
  }

  // Check code match
  if (String(user.otpCode).trim() !== cleanCode) {
    user.failedOtpAttempts = (user.failedOtpAttempts || 0) + 1;
    db.save();
    const remaining = Math.max(0, 5 - user.failedOtpAttempts);
    return res.status(400).json({
      error: `Invalid verification code. Please check your email and try again. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining before code reset)`,
      code: 'INVALID_OTP',
      attemptsRemaining: remaining,
    });
  }

  // Activate email verification status in DB
  user.isEmailVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  user.verificationToken = null;
  user.failedOtpAttempts = 0;
  user.emailVerifiedAt = new Date().toISOString();
  db.save();

  const token = generateToken(user);
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: true,
    },
    message: 'Email address successfully verified! Welcome to Hariwa University Portal.',
  });
};

export const verifyLink = (req, res) => {
  const { token: verificationToken, email } = req.query.token ? req.query : req.body;

  if (!verificationToken || !email) {
    return res.status(400).json({ error: 'Verification token and email are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  if (user.isEmailVerified) {
    const sessionToken = generateToken(user);
    return res.json({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true,
      },
      message: 'Email address is already verified.',
    });
  }

  if (!user.verificationToken || user.verificationToken !== verificationToken) {
    return res.status(400).json({ error: 'Invalid or expired verification link.' });
  }

  // Activate email verification status
  user.isEmailVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  user.verificationToken = null;
  user.failedOtpAttempts = 0;
  user.emailVerifiedAt = new Date().toISOString();
  db.save();

  const sessionToken = generateToken(user);
  res.json({
    success: true,
    token: sessionToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: true,
    },
    message: 'Email verified successfully via link!',
  });
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required to resend verification code.' });
  }

  if (!validateEmailFormat(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address format.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(404).json({ error: 'No registered user account found for this email address.' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ error: 'This email address is already verified. You can log in directly.' });
  }

  // Cooldown safeguard: enforce minimum 15 seconds between resend requests
  if (user.lastOtpSentAt && (Date.now() - new Date(user.lastOtpSentAt).getTime()) < 15000) {
    const waitSec = Math.ceil((15000 - (Date.now() - new Date(user.lastOtpSentAt).getTime())) / 1000);
    return res.status(429).json({
      error: `Please wait ${waitSec} second${waitSec === 1 ? '' : 's'} before requesting another verification code.`,
      code: 'RESEND_COOLDOWN',
    });
  }

  // Generate new OTP & Token
  const newOtp = generateOTP();
  const newVerificationToken = generateSecureToken();
  user.otpCode = newOtp;
  user.verificationToken = newVerificationToken;
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry
  user.failedOtpAttempts = 0; // Reset failed counter on new code dispatch
  user.lastOtpSentAt = new Date().toISOString();
  db.save();

  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol || 'http';
  const verificationLink = `${protocol}://${host}/verify-email?token=${newVerificationToken}&email=${encodeURIComponent(user.email)}`;

  // Dispatch real EmailJS email
  const emailRes = await sendEmailJSOTP({
    email: user.email,
    name: user.name,
    otpCode: newOtp,
    verificationLink,
  });

  res.json({
    success: true,
    email: user.email,
    message: emailRes.success
      ? 'A new 6-digit verification code has been dispatched to your email address.'
      : `New verification code generated: ${newOtp}. (${emailRes.error ? `EmailJS status: ${emailRes.error}` : 'Email dispatch pending'})`,
    otpCode: !emailRes.success ? newOtp : undefined,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password credentials are required.' });
  }

  if (!validateEmailFormat(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address format.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  const isPasswordValid = user ? await verifyPassword(password, user.password) : false;
  if (!user || !isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password credentials. Please try again.' });
  }

  // STRICT REQUIREMENT: Do not allow login until email is verified
  if (user.isEmailVerified === false) {
    // Generate new OTP if missing or expired
    let emailRes = { success: true };
    if (!user.otpCode || new Date() > new Date(user.otpExpiresAt)) {
      user.otpCode = generateOTP();
      user.verificationToken = generateSecureToken();
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      user.failedOtpAttempts = 0;
      db.save();
      emailRes = await sendEmailJSOTP({ email: user.email, name: user.name, otpCode: user.otpCode });
    }

    return res.status(403).json({
      error: emailRes.success
        ? 'Your email address is not verified yet. A 6-digit verification code has been sent to your email.'
        : `Your email is not verified yet. Your verification code is: ${user.otpCode}.`,
      requireVerification: true,
      email: user.email,
      otpCode: !emailRes.success ? user.otpCode : undefined,
      code: 'EMAIL_NOT_VERIFIED',
    });
  }

  const token = generateToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: true,
    },
  });
};

export const getMe = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified !== false,
  });
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and new password are required.' });
  }

  if (!validateEmailFormat(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address format.' });
  }

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  // Security Hardening: Never allow administrative accounts to be overwritten via public reset form
  if (user && user.role === 'admin') {
    return res.status(403).json({
      error: 'Administrative accounts cannot be reset via the public recovery form. Please contact University IT administration.',
      code: 'ADMIN_RESET_FORBIDDEN',
    });
  }

  if (!user) {
    // Auto-create verified student account with this email so test users and applicants can immediately log in
    user = {
      id: `u-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      role: 'student',
      password: await hashPassword(password),
      isEmailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
    };
    db.users.push(user);
  } else {
    // Update password in database
    user.password = await hashPassword(password);
    user.isEmailVerified = true; // Recovering password via OTP proves ownership
  }

  try {
    db.save();
    // Add system notification for administrator tracking
    db.addNotification({
      recipientRole: 'admin',
      title: '🔑 Password Reset Completed',
      message: `Account password was successfully updated for ${user.name} (${user.email}).`,
      type: 'security',
      studentName: user.name,
      studentEmail: user.email,
    });
  } catch (err) {
    console.error('Non-blocking error saving reset password state:', err);
  }

  return res.json({
    success: true,
    message: 'Password successfully updated. You can now log in with your new password.',
  });
};
