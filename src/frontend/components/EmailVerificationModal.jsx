import { useState, useEffect, useRef } from 'react';
import { Mail, KeyRound, ShieldAlert, CheckCircle2, RefreshCw, Clock, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import { api } from '../models/api.js';

export default function EmailVerificationModal({
  email,
  onVerified,
  onCancel,
  apiService = api,
  initialOtpCode = '',
  initialMessage = '',
}) {
  const { t, lang } = useLanguage();
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(null);
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [successMsg, setSuccessMsg] = useState(initialMessage || null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [activeHintCode, setActiveHintCode] = useState(initialOtpCode || '');

  // 10-minute countdown timer matching backend 10-minute OTP expiration (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);
  // 30-second cooldown for resend button
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    // Focus first slot on mount
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  // Auto-fill helper if initial code was supplied
  const fillCode = (code) => {
    const digits = String(code).replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 6) {
      setOtpDigits(digits);
      if (inputRefs[5].current) {
        inputRefs[5].current.focus();
      }
      triggerVerification(digits.join(''));
    }
  };

  // OTP Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Resend cooldown timer effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste of full 6-digit code
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pastedDigits.forEach((digit, i) => {
        if (i < 6) newDigits[i] = digit;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pastedDigits.length, 5);
      if (inputRefs[nextIndex].current) {
        inputRefs[nextIndex].current.focus();
      }
      if (newDigits.filter(Boolean).length === 6) {
        triggerVerification(newDigits.join(''));
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setError(null);

    // Auto-advance to next input slot
    if (digit && index < 5 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current.focus();
    }

    // If 6th digit entered, auto submit
    if (digit && index === 5 && newDigits.filter(Boolean).length === 6) {
      triggerVerification(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      if (inputRefs[index - 1].current) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const triggerVerification = async (codeToVerify) => {
    if (codeToVerify.length !== 6) return;

    if (timeLeft <= 0) {
      setError(lang === 'fa' ? 'کد تایید منقضی شده است. لطفاً کد جدید درخوست کنید.' : 'Verification code expired. Please click Resend Code to receive a new OTP.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const client = apiService?.auth ? apiService : api;
      const data = await client.auth.verifyOTP({
        email,
        otpCode: codeToVerify,
      });

      setAttemptsLeft(null);
      setSuccessMsg(data.message || (lang === 'fa' ? 'ایمیل شما با موفقیت تایید گردید!' : lang === 'ps' ? 'ستاسو برېښنالیک په بریا تایید شو!' : 'Email successfully verified!'));
      
      setTimeout(() => {
        if (onVerified) {
          onVerified(data.token, data.user);
        }
      }, 700);
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code. Please try again.');
      if (typeof err.attemptsRemaining === 'number') {
        setAttemptsLeft(err.attemptsRemaining);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const fullCode = otpDigits.join('');

    if (fullCode.length !== 6) {
      setError(lang === 'fa' ? 'لطفاً کد ۶ رقمی کامل را وارد نمایید.' : lang === 'ps' ? 'مهرباني وکړئ بشپړ ۶ عددي کوډ دننه کړئ.' : 'Please enter all 6 digits of your verification code.');
      return;
    }

    await triggerVerification(fullCode);
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;

    setError(null);
    setSuccessMsg(null);
    setAttemptsLeft(null);
    setResending(true);

    try {
      const client = apiService?.auth ? apiService : api;
      const data = await client.auth.resendOTP({ email });
      setTimeLeft(600); // Reset 10-minute timer matching backend
      setResendCooldown(30); // 30 second cooldown
      setOtpDigits(['', '', '', '', '', '']);
      if (data.otpCode) {
        setActiveHintCode(data.otpCode);
      }
      setSuccessMsg(data.message || (lang === 'fa' ? 'کد جدید ۶ رقمی به ایمیل شما ارسال شد.' : lang === 'ps' ? 'نوی ۶ عددي کوډ ستاسو برېښنالیک ته واستول شو.' : 'A new 6-digit verification code has been dispatched to your email.'));

      if (inputRefs[0].current) {
        inputRefs[0].current.focus();
      }

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-sm mx-auto my-1 sm:my-3 p-2 shrink-0 w-full animate-fade-in">
      <div className="glass-panel shadow-2xl rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden text-slate-800 dark:text-slate-100">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-blue-600"></div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'بازگشت' : 'Back'}</span>
          </button>
        )}

        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white flex items-center justify-center mx-auto shadow-sm shadow-indigo-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t('emailVerification')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight max-w-xs mx-auto">
            {t('enterOtpDesc')}
          </p>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-bold mt-0.5">
            <Send className="w-3 h-3 text-indigo-500" />
            <span className="truncate max-w-[200px]">{email}</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 p-2.5 rounded-xl text-rose-700 dark:text-rose-300 flex flex-col gap-1 text-[11px] font-semibold leading-normal">
            <div className="flex items-start gap-1.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
            {attemptsLeft !== null && (
              <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold px-5">
                {lang === 'fa'
                  ? `فرصت‌های باقیمانده: ${attemptsLeft}`
                  : `Attempts remaining before code is revoked: ${attemptsLeft}`}
              </p>
            )}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 p-2.5 rounded-xl text-emerald-700 dark:text-emerald-300 flex items-start gap-1.5 text-[11px] font-semibold leading-normal">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Development/Preview Code Helper */}
        {activeHintCode && (
          <div className="p-2 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/70 flex items-center justify-between text-[11px] text-indigo-700 dark:text-indigo-300">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{lang === 'fa' ? 'کد تایید آماده:' : 'Verification OTP:'}</span>
              <strong className="font-mono tracking-wider font-bold text-xs">{activeHintCode}</strong>
            </div>
            <button
              type="button"
              onClick={() => fillCode(activeHintCode)}
              className="px-2 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
            >
              {lang === 'fa' ? 'درج خودکار' : 'Auto-fill'}
            </button>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-3">
          {/* 6-Digit Code Slots */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-indigo-500" />
                {t('otpLabel')}
              </span>
              <span className={`font-mono flex items-center gap-1 ${timeLeft < 30 ? 'text-rose-500 font-extrabold animate-pulse' : 'text-slate-400'}`}>
                <Clock className="w-3 h-3" />
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-1 dir-ltr" dir="ltr">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  className="w-9 h-11 sm:w-10 sm:h-12 text-center text-lg font-bold font-mono bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-xs"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otpDigits.join('').length !== 6}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-sm shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('verifyButton')}</span>
              </>
            )}
          </button>
        </form>

        {/* Resend OTP Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between gap-2 text-[10.5px]">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {lang === 'fa' ? 'کدی دریافت نکردید؟' : "Didn't receive code?"}
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer disabled:cursor-not-allowed text-[10.5px]"
          >
            <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
            <span>
              {resendCooldown > 0
                ? (lang === 'fa' ? `ارسال مجدد (${resendCooldown}s)` : `Resend in ${resendCooldown}s`)
                : t('resendOtp')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
