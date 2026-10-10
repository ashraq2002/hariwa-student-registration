import { useState, useEffect } from 'react';
import { KeyRound, Mail, ShieldAlert, User as UserIcon, MailCheck, Eye, EyeOff, CheckCircle2, ArrowRight, UserPlus } from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import universityLogo from '../../assets/images/hariwa_logo_1783225791176.jpg';
import EmailVerificationModal from '../components/EmailVerificationModal.jsx';
import ForgotPassword from '../components/ForgotPassword.jsx';
import AuthTopNav from '../components/AuthTopNav.jsx';
import ValidationTooltip from '../components/ValidationTooltip.jsx';

export default function Login({ onLoginSuccess, onNavigate, apiService, initialForgotPassword = false, currentRoute }) {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Parse registered state & email from URL query params
  useEffect(() => {
    try {
      const queryStr = currentRoute?.includes('?')
        ? currentRoute.split('?')[1]
        : window.location.search;
      const params = new URLSearchParams(queryStr);
      const emailParam = params.get('email');
      const registeredParam = params.get('registered');

      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }

      if (registeredParam === '1' || registeredParam === 'true') {
        setSuccessMessage(
          lang === 'fa'
            ? 'حساب کاربری شما با موفقیت ایجاد شد! اکنون ایمیل و رمز عبور خود را وارد نمایید.'
            : lang === 'ps'
            ? 'ستاسو حساب په بریالیتوب سره جوړ شو! مهرباني وکړئ خپل بریښنالیک او پټنوم داخل کړئ.'
            : 'Your account has been created successfully! Please enter your email and password to log in.'
        );
      }
    } catch (err) {
      console.error('Error parsing route params in Login:', err);
    }
  }, [currentRoute, lang]);

  // Forgot password flow visibility state
  const [showForgotPassword, setShowForgotPassword] = useState(initialForgotPassword);

  // Unverified email handling state
  const [unverifiedAccount, setUnverifiedAccount] = useState(null);

  const validateEmailFormat = (emailStr) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(emailStr.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActiveTooltip(null);
    setError(null);

    if (!email.trim()) {
      setActiveTooltip({
        field: 'email',
        message: lang === 'fa' ? 'لطفاً ایمیل خود را وارد کنید.' : lang === 'ps' ? 'مهرباني وکړئ بریښنالیک ولیکئ.' : 'Please fill out this field.',
      });
      document.getElementById('login-email')?.focus();
      return;
    }

    if (!validateEmailFormat(email)) {
      setActiveTooltip({
        field: 'email',
        message: lang === 'fa' ? 'فرمت ایمیل نامعتبر است (مثال: name@domain.com).' : 'Please enter a valid email address.',
      });
      document.getElementById('login-email')?.focus();
      return;
    }

    if (!password) {
      setActiveTooltip({
        field: 'password',
        message: lang === 'fa' ? 'لطفاً رمز عبور را وارد کنید.' : lang === 'ps' ? 'مهرباني وکړئ پټنوم ولیکئ.' : 'Please fill out this field.',
      });
      document.getElementById('login-password')?.focus();
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await apiService.auth.login({ email: email.trim(), password });

      if (data.requireVerification) {
        setUnverifiedAccount({
          email: data.email || email.trim(),
          otpCode: data.otpCode || '',
          message: data.message || '',
        });
        return;
      }

      onLoginSuccess(data.token, data.user);
    } catch (err) {
      if (err.requireVerification) {
        setUnverifiedAccount({
          email: err.email || email,
          otpCode: err.otpCode || '',
          message: err.message || '',
        });
      } else {
        let msg = err.message || 'خطایی در ورود رخ داد. لطفاً دوباره تلاش نمایید.';
        if (err.code === 'USER_NOT_FOUND') {
          msg = lang === 'fa'
            ? 'حساب کاربری با این ایمیل یافت نشد. لطفاً ایمیل را بررسی کرده یا ابتدا حساب کاربری بسازید.'
            : lang === 'ps'
            ? 'په دې برېښنالیک هیڅ حساب ونه موندل شو. مهرباني وکړئ لومړی نوم لیکنه وکړئ.'
            : 'No account found with this email. Please check your email or register.';
        } else if (err.code === 'INVALID_PASSWORD') {
          msg = lang === 'fa'
            ? 'رمز عبور وارد شده اشتباه است. لطفاً دوباره تلاش کنید یا رمز خود را بازیابی نمایید.'
            : lang === 'ps'
            ? 'ورکړل شوی پټنوم ناسم دی. مهرباني وکړئ بیا هڅه وکړئ.'
            : 'Incorrect password. Please try again or reset your password.';
        }
        setError({
          message: msg,
          code: err.code,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (emailStr, passStr) => {
    setEmail(emailStr);
    setPassword(passStr);
    setError(null);
    setActiveTooltip(null);
    setUnverifiedAccount(null);
  };

  if (unverifiedAccount) {
    return (
      <div className="w-full flex-1 flex flex-col justify-center items-center px-4 py-6 sm:py-10 select-none">
        <div className="max-w-md w-full mx-auto my-auto animate-fade-in">
          <EmailVerificationModal
            email={unverifiedAccount.email}
            apiService={apiService}
            initialOtpCode={unverifiedAccount.otpCode || ''}
            initialMessage={unverifiedAccount.message || ''}
            onVerified={(token, user) => onLoginSuccess(token, user)}
            onCancel={() => setUnverifiedAccount(null)}
          />
        </div>
      </div>
    );
  }

  // 3-Step Password Recovery flow
  if (showForgotPassword) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-start px-4 py-2 sm:py-4 select-none">
        <div className="max-w-md w-full mx-auto flex flex-col gap-2.5 animate-fade-in">
          <AuthTopNav onNavigate={onNavigate} />
          <ForgotPassword
            defaultEmail={email}
            apiService={apiService}
            onBackToLogin={(newEmail) => {
              if (newEmail) {
                setEmail(newEmail);
                setSuccessMessage(
                  lang === 'fa'
                    ? 'رمز عبور شما با موفقیت تغییر یافت. لطفاً اکنون وارد سیستم شوید.'
                    : lang === 'ps'
                    ? 'ستاسو پټنوم په بریالیتوب سره بدل شو. مهرباني وکړئ اوس ننوځئ.'
                    : 'Password reset successful. Please sign in with your new credentials.'
                );
              }
              setShowForgotPassword(false);
              setError(null);
            }}
          />
        </div>
      </div>
    );
  }

  const isRtl = lang === 'fa' || lang === 'ps';

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start px-4 py-2 sm:py-4 select-none">
      <div className="max-w-md w-full mx-auto flex flex-col gap-2.5 animate-fade-in">
        <AuthTopNav onNavigate={onNavigate} />

        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="relative overflow-hidden bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 space-y-3.5 sm:space-y-4 shadow-2xl shadow-slate-200/50 dark:shadow-none text-slate-800 dark:text-slate-100 transition-colors"
        >
          {/* Ambient Soft Glow behind top logo */}
          <div className="w-48 h-48 bg-blue-500/15 dark:bg-blue-500/25 rounded-full blur-3xl pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 -z-0"></div>
          
          <div className="text-center space-y-1 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center mx-auto shadow-xs bg-white">
              <img 
                src={universityLogo} 
                alt="Hariwa University Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{t('welcomeBack')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-snug">
              {t('loginDesc')}
            </p>
          </div>

          {successMessage && (
            <div className="relative z-10 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-2.5 rounded-xl text-emerald-800 dark:text-emerald-200 flex items-center gap-2 text-xs font-semibold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="relative z-10 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-3 rounded-xl text-rose-700 dark:text-rose-300 flex flex-col gap-2 text-xs font-semibold leading-relaxed animate-fade-in shadow-xs">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span>{typeof error === 'string' ? error : error.message}</span>
              </div>
              {error?.code === 'USER_NOT_FOUND' && (
                <div className="flex items-center justify-between pt-2 border-t border-rose-200/60 dark:border-rose-800/50">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                    {lang === 'fa' ? 'هنوز ثبت‌نام نکرده‌اید؟' : lang === 'ps' ? 'تر اوسه مو نوم لیکنه نه ده کړې؟' : 'Need an account?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/register?email=${encodeURIComponent(email)}`)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'ایجاد حساب کاربری' : lang === 'ps' ? 'نوی حساب جوړول' : 'Register now'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-3.5 relative z-10">
            <div className="space-y-1 relative">
              <label className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase block">
                {t('email')}
              </label>
              <div className="relative group">
                <Mail className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 w-4 h-4 pointer-events-none transition-colors`} />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onFocus={() => {
                    if (activeTooltip?.field === 'email') setActiveTooltip(null);
                  }}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (activeTooltip?.field === 'email') setActiveTooltip(null);
                    setError(null);
                  }}
                  placeholder="e.g. student@university.edu"
                  className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 bg-slate-50/70 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:border-blue-500 dark:focus:ring-4 dark:focus:ring-blue-500/20 rounded-xl text-xs sm:text-sm transition-all font-medium ${
                    activeTooltip?.field === 'email'
                      ? '!border-amber-500 !ring-2 !ring-amber-500/20 animate-field-shake'
                      : ''
                  }`}
                />
                <ValidationTooltip
                  visible={activeTooltip?.field === 'email'}
                  message={activeTooltip?.message}
                  onClose={() => setActiveTooltip(null)}
                  lang={lang}
                  placement="bottom"
                />
              </div>
            </div>

            <div className="space-y-1 relative">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase block">
                  {t('password')}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setSuccessMessage(null);
                    setShowForgotPassword(true);
                  }}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer inline bg-transparent p-0"
                >
                  {lang === 'fa' ? 'فراموشی رمز عبور؟' : lang === 'ps' ? 'رمز مو هیر شوی؟' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative group">
                <KeyRound className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 w-4 h-4 pointer-events-none transition-colors`} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onFocus={() => {
                    if (activeTooltip?.field === 'password') setActiveTooltip(null);
                  }}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (activeTooltip?.field === 'password') setActiveTooltip(null);
                  }}
                  placeholder="••••••••••••"
                  className={`w-full ${isRtl ? 'pr-9 pl-9' : 'pl-9 pr-9'} py-2.5 bg-slate-50/70 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:border-blue-500 dark:focus:ring-4 dark:focus:ring-blue-500/20 rounded-xl text-xs sm:text-sm transition-all font-medium ${
                    activeTooltip?.field === 'password'
                      ? '!border-amber-500 !ring-2 !ring-amber-500/20 animate-field-shake'
                      : ''
                  }`}
                />
                <ValidationTooltip
                  visible={activeTooltip?.field === 'password'}
                  message={activeTooltip?.message}
                  onClose={() => setActiveTooltip(null)}
                  lang={lang}
                  placement="bottom"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRtl ? 'left-2.5' : 'right-2.5'} top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer p-0.5 rounded`}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none transition-all duration-200 cursor-pointer block leading-none uppercase tracking-wider"
            >
              {loading ? (lang === 'fa' ? 'در حال بررسی...' : lang === 'ps' ? 'د چک کولو په حال کې...' : 'Authenticating...') : t('logIn')}
            </button>
          </form>

          <div className="text-center relative z-10 pt-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'fa' ? 'حساب کاربری جدید ایجاد می‌کنید؟ ' : lang === 'ps' ? 'نوی حساب جوړول غواړئ؟ ' : 'New to the portal? '}
              <button
                 onClick={() => onNavigate('/register')}
                 className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline cursor-pointer inline bg-transparent p-0"
              >
                {t('register')}
              </button>
            </p>
          </div>

          {/* Demo Quick login controls */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 relative z-10">
            <p className="text-[10.5px] tracking-wider text-slate-400 dark:text-slate-500 uppercase font-semibold text-center select-none font-sans">
              DEMO QUICK FILL ACTIONS
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillDemoCredentials('student@university.edu', 'student123')}
                className="py-2.5 px-3 bg-slate-50/70 hover:bg-slate-100/90 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 border border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] group"
              >
                <UserIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white truncate">
                  {lang === 'fa' ? 'متقاضی' : lang === 'ps' ? 'محصل' : 'Student'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials('admin@university.edu', 'admin123')}
                className="py-2.5 px-3 bg-slate-50/70 hover:bg-slate-100/90 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 border border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] group"
              >
                <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white truncate">
                  {lang === 'fa' ? 'اداره' : lang === 'ps' ? 'اداره' : 'Admin'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
