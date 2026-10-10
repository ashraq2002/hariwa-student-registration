import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { db } from '../models/db.js';

// Cryptographic secret for signing JSON Web Tokens (HMAC-SHA256)
const JWT_SECRET = process.env.JWT_SECRET || 'asu-hariwa-portal-jwt-secret-key-2026-production';
const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days expiration

/**
 * Standard RFC 7519 JSON Web Token (JWT) Generator using jsonwebtoken
 */
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified !== undefined ? user.isEmailVerified : true,
  };

  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: TOKEN_EXPIRY_SECONDS,
  });
};

/**
 * Verifies and decodes JSON Web Token with jsonwebtoken package
 * Also provides fallback for legacy active session tokens
 */
export const verifyAndDecodeToken = (token) => {
  if (!token || typeof token !== 'string') return null;

  // 1. Standard RFC 7519 JWT Format: header.payload.signature verified via jsonwebtoken
  if (token.includes('.')) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
      return decoded;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const decoded = jwt.decode(token);
        return { expired: true, ...(decoded || {}) };
      }
      console.warn('[Security Warning] JWT verification failed:', err.message);
      return null;
    }
  }

  // 2. Backward compatibility fallback for legacy active session tokens
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split('_');
    if (parts.length >= 4 && parts[0] === 'tk' && parts[parts.length - 1] === 'uniport') {
      return {
        id: parts[1],
        userId: parts[1],
        role: parts[2],
        isLegacy: true,
      };
    }
  } catch (e) {
    // Non-blocking parse fallback
  }

  return null;
};

export const decodeToken = verifyAndDecodeToken;

// Auth Middleware: Decodes JWT, validates signature & expiration, checks role integrity
export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required. Please log in.', code: 'AUTH_REQUIRED' });
  }

  const token = authHeader.split(' ')[1];
  const credentials = verifyAndDecodeToken(token);

  if (!credentials) {
    return res.status(401).json({ error: 'Malformed or invalid credential token. Please log in again.', code: 'INVALID_TOKEN' });
  }

  if (credentials.expired) {
    return res.status(401).json({ error: 'Session token has expired. Please log in again.', code: 'TOKEN_EXPIRED' });
  }

  const userId = credentials.userId || credentials.id;
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'User does not exist in the active registry.', code: 'USER_NOT_FOUND' });
  }

  // Check role integrity
  if (user.role !== credentials.role) {
    return res.status(403).json({ error: 'Role signature mismatch detected.', code: 'ROLE_MISMATCH' });
  }

  // Attach verified user information to request
  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified !== undefined ? user.isEmailVerified : true,
  };
  next();
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts access strictly to authorized roles (e.g. 'admin', 'student')
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required before accessing this endpoint.', code: 'AUTH_REQUIRED' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied: This operation requires one of the following roles: [${allowedRoles.join(', ')}]. Your role is '${req.user.role}'.`,
        code: 'FORBIDDEN_ROLE',
        userRole: req.user.role,
        requiredRoles: allowedRoles,
      });
    }

    next();
  };
};

/**
 * Middleware requiring email to be verified before accessing sensitive endpoints
 */
export const requireVerifiedEmail = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.', code: 'AUTH_REQUIRED' });
  }

  if (req.user.isEmailVerified === false) {
    return res.status(403).json({
      error: 'Email verification is required before accessing this portal feature.',
      requireVerification: true,
      email: req.user.email,
      code: 'EMAIL_NOT_VERIFIED',
    });
  }

  next();
};

export const requireAdmin = requireRole('admin');
export const requireStudent = requireRole('student');
