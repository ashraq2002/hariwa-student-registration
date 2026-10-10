import { useState, useEffect } from 'react';
import { Mail, CheckCircle2, ShieldAlert, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import universityLogo from '../../assets/images/hariwa_logo_1783225791176.jpg';
import AuthTopNav from '../components/AuthTopNav.jsx';

export default function VerifyEmailPage({ onVerified, onNavigate, apiService }) {
  const { t, lang } = useLanguage();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // Extract token and email from URL parameters
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token') || params.get('verifyToken') || '';
    const emailParam = params.get('email') || '';

    setToken(tokenParam);
    setEmail(emailParam);

    if (tokenParam && emailParam) {
      handleAutoVerify(tokenParam, emailParam);
    } else {
      setStatus('error');
      setMessage(
        lang === 'fa'
          ? 'لینک تایید ایمیل ناقص یا نامعتبر است. لطفاً از لینک کامل ارسالی به ایمیل خود استفاده نمایید.'
          : 'Verification link is missing required authentication parameters.'
      );
    }
  }, []);

  const handleAutoVerify = async (tok, em) => {
    setStatus('verifying');
    setMessage(lang === 'fa' ? 'در حال تایید ایمیل و فعال‌سازی حساب کاربری...' : 'Verifying your email and activating account...');

    try {
      const data = await apiService.auth.verifyLink(tok, em);
      setStatus('success');
      setMessage(data.message || (lang === 'fa' ? 'ایمیل شما با موفقیت تایید شد!' : 'Email successfully verified!'));

      // If token and user returned, authenticate and redirect automatically after 2 seconds
      if (data.token && data.user) {
        setTimeout(() => {
          onVerified(data.token, data.user);
        }, 1500);
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'The verification link has expired or is invalid.');
    }
  };

  const handleResend = async () => {
    if (!email || resending) return;
    setResending(true);
    setResendSuccess(false);

    try {
      const data = await apiService.auth.resendOTP({ email });
      setResendSuccess(true);
      setMessage(data.message || (lang === 'fa' ? 'کد تایید جدید ارسال شد.' : 'A new verification code has been sent.'));
    } catch (err) {
      setMessage(err.message || 'Failed to resend verification.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start px-4 py-2 sm:py-4 select-none">
      <div className="max-w-md w-full mx-auto flex flex-col gap-2.5 animate-fade-in">
        <AuthTopNav onNavigate={onNavigate} />

        <div className="glass-panel shadow-xl rounded-2xl p-5 space-y-4 relative overflow-hidden text-slate-800 dark:text-slate-100">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-blue-600"></div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto shadow-xs bg-white">
              <img 
                src={universityLogo} 
                alt="Hariwa University Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {lang === 'fa' ? 'تایید ایمیل کاربری' : 'Email Account Verification'}
            </h2>
            {email && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>{email}</span>
              </div>
            )}
          </div>

          {/* Status content */}
          {status === 'verifying' && (
            <div className="text-center py-6 space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {message}
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-4 space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {lang === 'fa' ? 'ایمیل شما با موفقیت تایید شد!' : 'Email Verified Successfully!'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {lang === 'fa'
                    ? 'حساب شما فعال گردید. در حال انتقال به داشبورد اختصاصی...'
                    : 'Your account is now activated. Directing you to the dashboard...'}
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 py-2 animate-fade-in">
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 p-3 rounded-xl text-rose-700 dark:text-rose-300 flex items-start gap-2 text-xs font-semibold leading-relaxed">
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{message}</span>
              </div>

              {resendSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 p-2.5 rounded-xl text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'fa' ? 'کد تایید جدید ارسال گردید!' : 'A new verification link and code has been sent!'}</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {email && (
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                    <span>{lang === 'fa' ? 'ارسال مجدد ایمیل تایید' : 'Resend Verification Email'}</span>
                  </button>
                )}

                <button
                  onClick={() => onNavigate('/login')}
                  className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{lang === 'fa' ? 'رفتن به صفحه ورود' : 'Go to Login'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
