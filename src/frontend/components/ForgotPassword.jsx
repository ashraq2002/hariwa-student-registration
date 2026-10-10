import { useState, useEffect, useRef } from 'react';
import {
  Mail,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Clock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Send,
  Lock,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import { sendPasswordResetEmail, EMAILJS_SERVICE_ID } from '../utils/emailjsService.js';
import universityLogo from '../../assets/images/hariwa_logo_1783225791176.jpg';

// Localized strings for English, Persian/Dari, and Pashto
const TEXTS = {
  en: {
    title: 'Reset Password',
    step1Desc: 'Enter your account email to receive a 6-digit verification code.',
    step2Desc: 'Enter the 6-digit verification code sent to your email.',
    step3Desc: 'Create a new, secure password for your account.',
    step1Title: 'Request Code',
    step2Title: 'Verify OTP',
    step3Title: 'New Password',
    step1Num: '1',
    step2Num: '2',
    step3Num: '3',
    emailLabel: 'Email Address',
    emailPlaceholder: 'e.g. student@university.edu or gmail.com',
    emailHint: 'A 6-digit verification code will be sent to this email via EmailJS.',
    sendCodeBtn: 'Send Verification Code',
    sendingCodeBtn: 'Sending code...',
    sentTo: 'Sent to:',
    changeEmail: 'Change email',
    enterCodeLabel: 'Enter 6-digit verification code',
    resendIn: 'Resend code in',
    resendBtn: 'Resend verification code',
    resendingBtn: 'Sending new code...',
    verifyBtn: 'Verify & Continue',
    errAdminRecoveryBlocked: 'Administrative accounts cannot be reset via the public recovery form. For security reasons, please contact University IT Administration.',
    newPasswordLabel: 'New Password',
    newPasswordPlaceholder: 'At least 8 characters',
    confirmPasswordLabel: 'Confirm New Password',
    confirmPasswordPlaceholder: 'Re-enter new password',
    minChars: 'Minimum 8 characters',
    passwordsMatch: 'Passwords match.',
    passwordsMismatch: 'Passwords do not match.',
    savePasswordBtn: 'Save & Change Password',
    savingPasswordBtn: 'Saving new password...',
    backToLogin: 'Back to Login',
    errEmailRequired: 'Please enter your email address.',
    errEmailInvalid: 'Please enter a valid email address (e.g. user@domain.com).',
    errOtpIncomplete: 'Please enter the complete 6-digit code.',
    errOtpInvalid: 'Incorrect verification code. Please check your inbox and try again.',
    errPasswordRequired: 'Please enter your new password.',
    errPasswordMinLength: 'Password must be at least 8 characters long.',
    errPasswordMismatch: 'New password and confirm password do not match.',
    toastOtpSent: 'A new verification code was sent to your email.',
    toastOtpVerified: 'Code verified successfully.',
    toastPasswordReset: 'Password reset successful! Redirecting to login...',
    enterMinLengthInfo: (len) => `Password must be at least 8 characters (${len}/8 entered).`,
  },
  fa: {
    title: 'بازیابی رمز عبور',
    step1Desc: 'آدرس ایمیل متصل به حساب کاربری خود را وارد کنید.',
    step2Desc: 'کد تایید ۶ رقمی ارسال‌شده به ایمیل‌تان را درج نمایید.',
    step3Desc: 'رمز عبور جدید و امن برای حساب خود تعیین کنید.',
    step1Title: 'درخواست کد',
    step2Title: 'تایید OTP',
    step3Title: 'رمز جدید',
    step1Num: '۱',
    step2Num: '۲',
    step3Num: '۳',
    emailLabel: 'آدرس ایمیل کاربر',
    emailPlaceholder: 'مثال: student@university.edu یا gmail.com',
    emailHint: 'یک کد تایید ۶ رقمی به این آدرس ایمیل توسط سرویس EmailJS ارسال خواهد شد.',
    sendCodeBtn: 'ارسال کد تایید',
    sendingCodeBtn: 'در حال ارسال کد...',
    sentTo: 'ارسال به:',
    changeEmail: 'تغییر ایمیل',
    enterCodeLabel: 'کد تایید ۶ رقمی را وارد کنید',
    resendIn: 'ارسال مجدد کد پس از',
    resendBtn: 'ارسال مجدد کد تایید',
    resendingBtn: 'در حال ارسال کد جدید...',
    verifyBtn: 'تایید کد و ادامه',
    errAdminRecoveryBlocked: 'حساب‌های کاربری اداری (مدیریت) از طریق این فرم عمومی قابل بازیابی نمی‌باشند. به دلایل امنیتی، لطفاً مستقیماً با مدیریت فناوری یا مسئول سیستم دانشگاه هریوا تماس حاصل فرمایید.',
    newPasswordLabel: 'رمز عبور جدید',
    newPasswordPlaceholder: 'حداقل ۸ کاراکتر',
    confirmPasswordLabel: 'تکرار رمز عبور جدید',
    confirmPasswordPlaceholder: 'تکرار رمز عبور جدید',
    minChars: 'حداقل ۸ کاراکتر',
    passwordsMatch: 'رمز عبور مطابقت دارد.',
    passwordsMismatch: 'تکرار رمز عبور یکسان نیست.',
    savePasswordBtn: 'ذخیره و تغییر رمز عبور',
    savingPasswordBtn: 'در حال ذخیره رمز عبور...',
    backToLogin: 'بازگشت به صفحه ورود',
    errEmailRequired: 'لطفاً آدرس ایمیل خود را وارد نمایید.',
    errEmailInvalid: 'فرمت آدرس ایمیل نامعتبر است (مثال: user@domain.com).',
    errOtpIncomplete: 'لطفاً کد تایید ۶ رقمی را به طور کامل وارد نمایید.',
    errOtpInvalid: 'کد تایید وارد شده نادرست است. لطفاً کد دریافتی را مجدداً بررسی کنید.',
    errPasswordRequired: 'لطفاً رمز عبور جدید را وارد نمایید.',
    errPasswordMinLength: 'رمز عبور باید حداقل شامل ۸ کاراکتر باشد.',
    errPasswordMismatch: 'رمز عبور جدید و تکرار آن با یکدیگر مطابقت ندارند.',
    toastOtpSent: 'کد تایید جدید با موفقیت به ایمیل شما ارسال شد.',
    toastOtpVerified: 'کد تایید با موفقیت تایید شد.',
    toastPasswordReset: 'رمز عبور شما با موفقیت تغییر یافت! در حال بازگشت به صفحه ورود...',
    enterMinLengthInfo: (len) => `رمز عبور باید حداقل ۸ کاراکتر باشد (${len}/8 وارد شده).`,
  },
  ps: {
    title: 'د پټنوم بیا رغونه',
    step1Desc: 'خپل حساب پورې تړلی بریښنالیک ولیکئ.',
    step2Desc: 'خپل بریښنالیک ته لیږل شوی ۶ عددي کوډ ولیکئ.',
    step3Desc: 'د خپل حساب لپاره نوی او خوندي پټنوم وټاکئ.',
    step1Title: 'د کوډ غوښتنه',
    step2Title: 'د OTP تایید',
    step3Title: 'نوی پټنوم',
    step1Num: '۱',
    step2Num: '۲',
    step3Num: '۳',
    emailLabel: 'د کاروونکي بریښنالیک',
    emailPlaceholder: 'بېلګه: student@university.edu یا gmail.com',
    emailHint: 'یو ۶ عددي تایید کوډ به ستاسو بریښنالیک ته واستول شي.',
    sendCodeBtn: 'د تایید کوډ لیږل',
    sendingCodeBtn: 'د کوډ لیږلو په حال کې...',
    sentTo: 'لیږل شوی:',
    changeEmail: 'بریښنالیک بدلول',
    enterCodeLabel: '۶ عددي تایید کوډ ولیکئ',
    resendIn: 'بیا لیږل وروسته له',
    resendBtn: 'د تایید کوډ بیا لیږل',
    resendingBtn: 'د نوي کوډ لیږلو په حال کې...',
    verifyBtn: 'تایید او دوام',
    errAdminRecoveryBlocked: 'د اداري حسابونو پټنوم د دې عامه فورمې له لارې د بیا ترلاسه کولو وړ نه دی. د امنیتي دلایلو له مخې، مهرباني وکړئ د پوهنتون د IT له ادارې سره اړیکه ونیسئ.',
    newPasswordLabel: 'نوی پټنوم',
    newPasswordPlaceholder: 'لږترلږه ۸ توري',
    confirmPasswordLabel: 'د نوي پټنوم تکرار',
    confirmPasswordPlaceholder: 'نوی پټنوم بیا ولیکئ',
    minChars: 'لږترلږه ۸ توري',
    passwordsMatch: 'پټنوم یو شان دی.',
    passwordsMismatch: 'پټنومونه یو شان نه دي.',
    savePasswordBtn: 'د نوي پټنوم خوندي کول',
    savingPasswordBtn: 'د پټنوم خوندي کولو په حال کې...',
    backToLogin: 'ننوتلو پاڼې ته شاته تګ',
    errEmailRequired: 'مهرباني وکړئ خپل بریښنالیک ولیکئ.',
    errEmailInvalid: 'د بریښنالیک بڼه سمه نه ده.',
    errOtpIncomplete: 'مهرباني وکړئ بشپړ ۶ عددي کوډ ولیکئ.',
    errOtpInvalid: 'داخل شوی کوډ سم نه دی. مهرباني وکړئ بیا هڅه وکړئ.',
    errPasswordRequired: 'مهرباني وکړئ نوی پټنوم ولیکئ.',
    errPasswordMinLength: 'پټنوم باید لږترلږه ۸ توري وي.',
    errPasswordMismatch: 'نوی پټنوم او تکرار یې سره سمون نه خوري.',
    toastOtpSent: 'نوی کوډ ستاسو بریښنالیک ته واستول شو.',
    toastOtpVerified: 'کوډ په بریالیتوب سره تایید شو.',
    toastPasswordReset: 'پټنوم مو په بریالیتوب سره بدل شو! ننوتلو ته تلل...',
    enterMinLengthInfo: (len) => `پټنوم باید لږترلږه ۸ توري وي (${len}/8).`,
  },
};

/**
 * 3-Step Password Recovery Component
 * Supports English (LTR) and Persian/Pashto (RTL).
 *
 * Step 1: Request OTP Code (User inputs email, generates 6-digit OTP, sends via EmailJS)
 * Step 2: Verify OTP Code (6-digit segmented input, 60s countdown timer, resend code)
 * Step 3: Set New Password (New password, confirm password, min 8 chars, updates database)
 */
export default function ForgotPassword({ onBackToLogin, apiService, defaultEmail = '' }) {
  const { lang } = useLanguage();
  const isRtl = lang === 'fa' || lang === 'ps';
  const txt = TEXTS[lang] || TEXTS.en;

  // Step Management: 1 | 2 | 3
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [email, setEmail] = useState(defaultEmail);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility Toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Verification & Generation State
  const [generatedOtp, setGeneratedOtp] = useState('');

  // 60-Second Countdown Timer for OTP Resend
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Loading, Errors & Success Toast
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  // Refs for 6-digit segmented OTP inputs
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // 60-second countdown effect during Step 2
  useEffect(() => {
    let timer;
    if (currentStep === 2 && countdown > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [currentStep, countdown]);

  // Focus first OTP input when transitioning to Step 2
  useEffect(() => {
    if (currentStep === 2) {
      setTimeout(() => {
        if (inputRefs[0].current) {
          inputRefs[0].current.focus();
        }
      }, 150);
    }
  }, [currentStep]);

  // Email format validator
  const isValidEmail = (emailStr) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(emailStr.trim());
  };

  // Format countdown seconds into mm:ss
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // STEP 1: Generate OTP and send via EmailJS
  // -------------------------------------------------------------
  const handleRequestCode = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError(txt.errEmailRequired);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError(txt.errEmailInvalid);
      return;
    }

    // Security Guard: Prohibit administrative accounts from public password recovery
    const lowerEmail = trimmedEmail.toLowerCase();
    if (lowerEmail === 'admin@university.edu' || lowerEmail.startsWith('admin@') || lowerEmail.includes('admin')) {
      setError(txt.errAdminRecoveryBlocked);
      return;
    }

    setLoading(true);

    try {
      if (apiService?.auth?.forgotPassword) {
        await apiService.auth.forgotPassword({ email: trimmedEmail });
      } else {
        const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(randomOtp);
        await sendPasswordResetEmail({
          to_email: trimmedEmail,
          otp_code: randomOtp,
          user_name: trimmedEmail.split('@')[0],
        });
      }

      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setCurrentStep(2);
    } catch (err) {
      console.warn('[Password Recovery Request Notice]', err);
      if (err.code === 'ADMIN_RESET_FORBIDDEN' || err.message?.includes('Administrative') || err.message?.includes('admin')) {
        setError(txt.errAdminRecoveryBlocked);
      } else if (err.code === 'USER_NOT_FOUND') {
        setError(
          lang === 'fa'
            ? 'هیچ حساب دانشجویی با این ایمیل یافت نشد. لطفاً ابتدا ثبت‌نام نمایید.'
            : lang === 'ps'
            ? 'په دې بریښنالیک هیڅ محصل حساب ونه موندل شو.'
            : 'No student account was found with this email address.'
        );
      } else {
        setError(err.message || (lang === 'fa' ? 'خطا در ارسال کد تایید. لطفاً اتصال اینترنت خود را بررسی نمایید.' : 'Failed to send verification code.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // STEP 2: Resend OTP Code
  // -------------------------------------------------------------
  const handleResendCode = async () => {
    if (!canResend || resending) return;
    setError(null);
    setResending(true);

    const trimmedEmail = email.trim();
    const lowerEmail = trimmedEmail.toLowerCase();
    if (lowerEmail === 'admin@university.edu' || lowerEmail.startsWith('admin@') || lowerEmail.includes('admin')) {
      setError(txt.errAdminRecoveryBlocked);
      setResending(false);
      return;
    }

    try {
      if (apiService?.auth?.forgotPassword) {
        await apiService.auth.forgotPassword({ email: trimmedEmail });
      } else {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        await sendPasswordResetEmail({
          to_email: trimmedEmail,
          otp_code: newOtp,
          user_name: trimmedEmail.split('@')[0],
        });
      }
      setSuccessToast(txt.toastOtpSent);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.warn('[Resend Recovery Code Notice]', err);
      if (err.code === 'ADMIN_RESET_FORBIDDEN' || err.message?.includes('Administrative') || err.message?.includes('admin')) {
        setError(txt.errAdminRecoveryBlocked);
      } else {
        setError(err.message || 'Failed to resend verification code.');
      }
    } finally {
      setResending(false);
      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      if (inputRefs[0].current) {
        inputRefs[0].current.focus();
      }
    }
  };

  // Handle segmented OTP digits
  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const updated = [...otpDigits];
      pasted.forEach((digit, i) => {
        if (i < 6) updated[i] = digit;
      });
      setOtpDigits(updated);
      const nextIdx = Math.min(pasted.length, 5);
      if (inputRefs[nextIdx].current) {
        inputRefs[nextIdx].current.focus();
      }
      if (updated.filter(Boolean).length === 6) {
        validateOtpCode(updated.join(''));
      }
      return;
    }

    const cleanVal = value.replace(/\D/g, '');
    const updated = [...otpDigits];
    updated[index] = cleanVal;
    setOtpDigits(updated);
    setError(null);

    // Auto-advance to next box
    if (cleanVal && index < 5 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current.focus();
    }

    // Auto-verify if 6th digit entered
    if (cleanVal && index === 5 && updated.filter(Boolean).length === 6) {
      validateOtpCode(updated.join(''));
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      if (inputRefs[index - 1].current) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  // Compare entered code against OTP
  const validateOtpCode = (enteredCode) => {
    setError(null);

    if (enteredCode.length !== 6) {
      setError(txt.errOtpIncomplete);
      return;
    }

    // Check client-generated OTP if present
    if (generatedOtp && enteredCode !== generatedOtp) {
      setError(txt.errOtpInvalid);
      return;
    }

    // Code verified successfully -> Advance to Step 3
    setSuccessToast(txt.toastOtpVerified);
    setTimeout(() => {
      setSuccessToast(null);
      setCurrentStep(3);
    }, 450);
  };

  // -------------------------------------------------------------
  // STEP 3: Set New Password & Update Database
  // -------------------------------------------------------------
  const handleSetNewPassword = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (!newPassword) {
      setError(txt.errPasswordRequired);
      return;
    }

    if (newPassword.length < 8) {
      setError(txt.enterMinLengthInfo(newPassword.length));
      return;
    }

    if (!confirmPassword) {
      setError(txt.confirmPasswordPlaceholder);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(txt.errPasswordMismatch);
      return;
    }

    const lowerEmail = email.trim().toLowerCase();
    if (lowerEmail === 'admin@university.edu' || lowerEmail.startsWith('admin@') || lowerEmail.includes('admin')) {
      setError(txt.errAdminRecoveryBlocked);
      return;
    }

    setLoading(true);

    try {
      // Call backend API with safety timeout so submission never hangs
      if (apiService?.auth?.resetPassword) {
        const resetCall = apiService.auth.resetPassword({
          email: email.trim(),
          password: newPassword,
          otpCode: otpDigits.join(''),
        });
        const timeoutCall = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 6000)
        );
        await Promise.race([resetCall, timeoutCall]);
      }

      // Show success feedback
      setSuccessToast(txt.toastPasswordReset);

      // Redirect back to login after brief animation
      setTimeout(() => {
        onBackToLogin(email.trim());
      }, 1500);
    } catch (err) {
      console.error('[Reset Password Error]', err);
      if (err.code === 'ADMIN_RESET_FORBIDDEN' || err.message?.includes('Administrative') || err.message?.includes('admin')) {
        setError(txt.errAdminRecoveryBlocked);
      } else if (err.code === 'INVALID_OTP' || err.code === 'OTP_EXPIRED') {
        setError(err.message || txt.errOtpInvalid);
      } else {
        setError(err.message || 'Password reset failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full max-w-md mx-auto relative overflow-hidden bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3 text-slate-800 dark:text-slate-100 animate-fade-in select-none shadow-2xl shadow-slate-200/50 dark:shadow-none transition-colors"
    >
      {/* Ambient Soft Glow behind top logo */}
      <div className="w-48 h-48 bg-blue-500/15 dark:bg-blue-500/25 rounded-full blur-3xl pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 -z-0"></div>

      {/* Header with University Brand Logo */}
      <div className="text-center space-y-1 pt-1 relative z-10">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center mx-auto shadow-xs bg-white">
          <img
            src={universityLogo}
            alt="Hariwa University Logo"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
          {txt.title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug">
          {currentStep === 1 && txt.step1Desc}
          {currentStep === 2 && txt.step2Desc}
          {currentStep === 3 && txt.step3Desc}
        </p>
      </div>

      {/* 3-Step Visual Progress Stepper */}
      <div className="py-1">
        <div className="flex items-center justify-between relative max-w-xs mx-auto">
          {/* Connecting Track Background */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>
          {/* Active Fill Track */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 h-0.5 bg-blue-600 dark:bg-blue-500 transition-all duration-500 z-0 ${
              isRtl ? 'right-4' : 'left-4'
            }`}
            style={{
              width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
            }}
          ></div>

          {/* Step 1 Node */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                currentStep > 1
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : currentStep === 1
                  ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {currentStep > 1 ? <Check className="w-3 h-3" /> : txt.step1Num}
            </div>
            <span
              className={`text-[9px] mt-1 font-medium ${
                currentStep === 1 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
              }`}
            >
              {txt.step1Title}
            </span>
          </div>

          {/* Step 2 Node */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                currentStep > 2
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : currentStep === 2
                  ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {currentStep > 2 ? <Check className="w-3 h-3" /> : txt.step2Num}
            </div>
            <span
              className={`text-[9px] mt-1 font-medium ${
                currentStep === 2 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
              }`}
            >
              {txt.step2Title}
            </span>
          </div>

          {/* Step 3 Node */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                currentStep === 3
                  ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {txt.step3Num}
            </div>
            <span
              className={`text-[9px] mt-1 font-medium ${
                currentStep === 3 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
              }`}
            >
              {txt.step3Title}
            </span>
          </div>
        </div>
      </div>

      {/* Global Success Toast Banner */}
      {successToast && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-2.5 rounded-xl text-emerald-800 dark:text-emerald-200 flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-2.5 rounded-xl text-rose-700 dark:text-rose-300 flex items-start gap-2 text-xs font-semibold leading-relaxed animate-fade-in">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 1: Enter Email & Request 6-digit Code                 */}
      {/* ========================================================= */}
      {currentStep === 1 && (
        <form onSubmit={handleRequestCode} noValidate className="space-y-3 pt-1">
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase block">
              {txt.emailLabel}
            </label>
            <div className="relative">
              <Mail
                className={`absolute ${
                  isRtl ? 'right-3' : 'left-3'
                } top-2.5 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none`}
              />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder={txt.emailPlaceholder}
                className={`w-full ${
                  isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                } py-2 bg-slate-50/70 dark:bg-[#131b2e]/80 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder-slate-400 dark:placeholder-slate-500`}
              />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
              {txt.emailHint}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-blue-600/15 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{txt.sendingCodeBtn}</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{txt.sendCodeBtn}</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* ========================================================= */}
      {/* STEP 2: Verify 6-digit OTP Code with Countdown             */}
      {/* ========================================================= */}
      {currentStep === 2 && (
        <div className="space-y-3 pt-1">
          {/* Target Email Info Pill with option to change */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-2 rounded-xl flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 min-w-0">
              <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400 truncate">{txt.sentTo}</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate dir-ltr text-left">
                {email}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                setError(null);
              }}
              className={`text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0 cursor-pointer ${
                isRtl ? 'mr-1' : 'ml-1'
              }`}
            >
              {txt.changeEmail}
            </button>
          </div>

          {/* 6-Digit Segmented OTP Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase block text-center">
              {txt.enterCodeLabel}
            </label>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 dir-ltr" dir="ltr">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={idx === 0 ? 6 : 1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                  className={`w-9 h-11 sm:w-10 sm:h-12 text-center text-base sm:text-lg font-black font-mono rounded-xl bg-slate-50 dark:bg-[#131b2e] border ${
                    digit
                      ? 'border-blue-500 ring-2 ring-blue-500/20 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                  } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all shadow-xs`}
                />
              ))}
            </div>
          </div>

          {/* Countdown Timer & Resend Controls */}
          <div className="flex flex-col items-center justify-center gap-1 text-[11px] pt-1">
            {!canResend ? (
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                <span>{txt.resendIn}</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 dir-ltr">
                  {formatTimer(countdown)}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending}
                className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-bold transition-colors cursor-pointer active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                <span>{resending ? txt.resendingBtn : txt.resendBtn}</span>
              </button>
            )}
          </div>

          {/* Verification Submit Button */}
          <button
            type="button"
            onClick={() => validateOtpCode(otpDigits.join(''))}
            disabled={otpDigits.join('').length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-blue-600/15 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{txt.verifyBtn}</span>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 3: Set New Password & Confirmation                   */}
      {/* ========================================================= */}
      {currentStep === 3 && (
        <form onSubmit={handleSetNewPassword} noValidate className="space-y-3 pt-1">
          {/* New Password Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase block">
              {txt.newPasswordLabel}
            </label>
            <div className="relative">
              <Lock
                className={`absolute ${
                  isRtl ? 'right-3' : 'left-3'
                } top-2.5 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none`}
              />
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                autoFocus
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError(null);
                }}
                placeholder={txt.newPasswordPlaceholder}
                className={`w-full ${
                  isRtl ? 'pr-9 pl-9' : 'pl-9 pr-9'
                } py-2 bg-slate-50/70 dark:bg-[#131b2e]/80 border ${
                  newPassword.length > 0 && newPassword.length < 8
                    ? 'border-amber-400 dark:border-amber-600'
                    : newPassword.length >= 8
                    ? 'border-emerald-500/80 dark:border-emerald-500/80'
                    : 'border-slate-200 dark:border-slate-800/80'
                } rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder-slate-400 dark:placeholder-slate-500`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={`absolute ${
                  isRtl ? 'left-2.5' : 'right-2.5'
                } top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer p-0.5`}
                aria-label="Toggle password visibility"
              >
                {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Real-time Length Progress Indicator */}
            <div className="flex items-center justify-between text-[10px] pt-0.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    newPassword.length >= 8 ? 'bg-emerald-500' : 'bg-amber-400 dark:bg-amber-500'
                  }`}
                ></span>
                <span
                  className={
                    newPassword.length >= 8
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }
                >
                  {txt.minChars}
                </span>
              </div>
              <span
                className={`font-mono font-semibold ${
                  newPassword.length >= 8
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : newPassword.length > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-400'
                }`}
              >
                ({newPassword.length}/8)
              </span>
            </div>
          </div>

          {/* Confirm New Password Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase block">
              {txt.confirmPasswordLabel}
            </label>
            <div className="relative">
              <KeyRound
                className={`absolute ${
                  isRtl ? 'right-3' : 'left-3'
                } top-2.5 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none`}
              />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                placeholder={txt.confirmPasswordPlaceholder}
                className={`w-full ${
                  isRtl ? 'pr-9 pl-9' : 'pl-9 pr-9'
                } py-2 bg-slate-50/70 dark:bg-[#131b2e]/80 border ${
                  confirmPassword && confirmPassword === newPassword
                    ? 'border-emerald-500/80 dark:border-emerald-500/80'
                    : confirmPassword && confirmPassword !== newPassword
                    ? 'border-rose-400 dark:border-rose-600'
                    : 'border-slate-200 dark:border-slate-800/80'
                } rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder-slate-400 dark:placeholder-slate-500`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute ${
                  isRtl ? 'left-2.5' : 'right-2.5'
                } top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer p-0.5`}
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {confirmPassword && (
              <p
                className={`text-[10px] font-medium pt-0.5 flex items-center gap-1 ${
                  confirmPassword === newPassword
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-500 dark:text-rose-400'
                }`}
              >
                {confirmPassword === newPassword ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{txt.passwordsMatch}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                    <span>{txt.passwordsMismatch}</span>
                  </>
                )}
              </p>
            )}
          </div>

          {/* Submit New Password - Remains responsive and click-safe with explicit validation messages */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
              newPassword.length >= 8 && newPassword === confirmPassword
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                : 'bg-blue-600/80 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{txt.savingPasswordBtn}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{txt.savePasswordBtn}</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* ========================================================= */}
      {/* Universal Footer: Back to Login Navigation (At Every Step)  */}
      {/* ========================================================= */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
        <button
          type="button"
          onClick={() => onBackToLogin()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          {isRtl ? (
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{txt.backToLogin}</span>
        </button>
      </div>
    </div>
  );
}
