import { useState } from 'react';
import { Mail, ShieldAlert, KeyRound, User as UserIcon, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import universityLogo from '../../assets/images/hariwa_logo_1783225791176.jpg';
import EmailVerificationModal from '../components/EmailVerificationModal.jsx';
import AuthTopNav from '../components/AuthTopNav.jsx';
import ValidationTooltip from '../components/ValidationTooltip.jsx';
import { api } from '../models/api.js';

export default function Register({ onRegisterSuccess, onNavigate, apiService = api }) {
  const { t, lang } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [error, setError] = useState(null);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Email verification state with persistent recovery across accidental reloads
  const [showVerification, setShowVerification] = useState(() => {
    try {
      return !!sessionStorage.getItem('uniport_pending_verification');
    } catch {
      return false;
    }
  });
  const [registeredEmail, setRegisteredEmail] = useState(() => {
    try {
      const saved = sessionStorage.getItem('uniport_pending_verification');
      if (saved) return JSON.parse(saved).email || '';
    } catch {}
    return '';
  });
  const [verificationPayload, setVerificationPayload] = useState(() => {
    try {
      const saved = sessionStorage.getItem('uniport_pending_verification');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const validateEmailFormat = (emailStr) => {
    if (!emailStr || !emailStr.trim()) return false;
    const regex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;
    return regex.test(emailStr.trim());
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError(null);
      return;
    }
    if (!validateEmailFormat(email)) {
      setEmailError(
        lang === 'fa'
          ? 'فرمت ایمیل نامعتبر است (مثال: student@university.edu)'
          : lang === 'ps'
          ? 'د برېښنالیک بڼه ناسمه ده (لکه: student@university.edu)'
          : 'Invalid email address format (e.g. student@university.edu)'
      );
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setError(null);
    setEmailError(null);
    setIsDuplicateEmail(false);
    setActiveTooltip(null);

    if (!name.trim()) {
      setActiveTooltip({
        field: 'name',
        message: lang === 'fa' ? 'لطفاً نام و تخلص خود را وارد نمایید.' : lang === 'ps' ? 'مهرباني وکړئ خپل بشپړ نوم دننه کړئ.' : 'Please fill out this field.',
      });
      document.getElementById('reg-name')?.focus();
      return;
    }

    if (!email.trim()) {
      setActiveTooltip({
        field: 'email',
        message: lang === 'fa' ? 'لطفاً ایمیل خود را وارد نمایید.' : lang === 'ps' ? 'مهرباني وکړئ خپل برېښنالیک دننه کړئ.' : 'Please fill out this field.',
      });
      document.getElementById('reg-email')?.focus();
      return;
    }

    if (!validateEmailFormat(email)) {
      setActiveTooltip({
        field: 'email',
        message: lang === 'fa' ? 'فرمت ایمیل نامعتبر است (مثال: name@domain.com).' : lang === 'ps' ? 'د برېښنالیک بڼه ناسمه ده (لکه: name@domain.com).' : 'Please enter a valid email address.',
      });
      document.getElementById('reg-email')?.focus();
      return;
    }

    if (!password) {
      setActiveTooltip({
        field: 'password',
        message: lang === 'fa' ? 'لطفاً رمز عبور را وارد نمایید.' : lang === 'ps' ? 'مهرباني وکړئ خپل پټنوم دننه کړئ.' : 'Please fill out this field.',
      });
      document.getElementById('reg-password')?.focus();
      return;
    }

    if (password.length < 6) {
      setActiveTooltip({
        field: 'password',
        message: lang === 'fa' ? 'رمز عبور باید حداقل ۶ کرکتر باشد.' : lang === 'ps' ? 'پټنوم باید لږترلږه ۶ کرکټرونه وي.' : 'Password must be at least 6 characters.',
      });
      document.getElementById('reg-password')?.focus();
      return;
    }

    if (!confirmPassword) {
      setActiveTooltip({
        field: 'confirmPassword',
        message: lang === 'fa' ? 'لطفاً تکرار رمز عبور را وارد کنید.' : lang === 'ps' ? 'مهرباني وکړئ د پټنوم تکرار دننه کړئ.' : 'Please confirm your password.',
      });
      document.getElementById('reg-confirmPassword')?.focus();
      return;
    }

    if (password !== confirmPassword) {
      setActiveTooltip({
        field: 'confirmPassword',
        message: lang === 'fa' ? 'رمزهای عبور با هم همخوانی ندارند.' : lang === 'ps' ? 'پټنومونه سره یو شان نه دي.' : 'Passwords do not match.',
      });
      document.getElementById('reg-confirmPassword')?.focus();
      return;
    }

    setLoading(true);

    try {
      const client = apiService?.auth ? apiService : api;
      const cleanEmail = email.trim().toLowerCase();
      const data = await client.auth.register({
        name: name.trim(),
        email: cleanEmail,
        password,
        role: 'student',
      });

      if (data.requireVerification || !data.token) {
        const verifiedEmail = data.email || cleanEmail;
        const payload = {
          email: verifiedEmail,
          otpCode: data.otpCode || '',
          message: data.message || '',
        };
        try {
          sessionStorage.setItem('uniport_pending_verification', JSON.stringify(payload));
        } catch {}
        setRegisteredEmail(verifiedEmail);
        setVerificationPayload(payload);
        setShowVerification(true);
      } else if (data.token && data.user) {
        try {
          sessionStorage.removeItem('uniport_pending_verification');
        } catch {}
        if (onRegisterSuccess) {
          onRegisterSuccess(data.token, data.user);
        } else if (onNavigate) {
          onNavigate('/student/dashboard');
        }
      }
    } catch (err) {
      if (err.code === 'EMAIL_ALREADY_EXISTS' || (err.message && err.message.toLowerCase().includes('already registered'))) {
        setIsDuplicateEmail(true);
        setError(
          lang === 'fa'
            ? 'این ایمیل قبلاً در سیستم ثبت شده است. لطفاً وارد شوید یا ایمیل دیگری وارد کنید.'
            : lang === 'ps'
            ? 'دا برېښنالیک پخوا په سیسټم کې ثبت شوی. مهرباني وکړئ ننوځئ یا بل برېښنالیک وکاروئ.'
            : 'This email address is already registered. Please sign in with your credentials or use another email.'
        );
      } else {
        setError(
          err.message ||
          (lang === 'fa'
            ? 'ثبت نام انجام نشد. لطفاً اطلاعات را بررسی کنید.'
            : lang === 'ps'
            ? 'نوم لیکنه ونه شوه. مهرباني وکړئ ټول معلومات وڅارئ.'
            : 'Registration failed. Please double check all details.')
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="w-full flex-1 flex flex-col justify-center items-center px-4 py-6 sm:py-10 select-none">
        <div className="max-w-md w-full mx-auto my-auto animate-fade-in">
          <EmailVerificationModal
            email={registeredEmail || verificationPayload?.email || email.trim().toLowerCase()}
            apiService={apiService || api}
            initialOtpCode={verificationPayload?.otpCode || ''}
            initialMessage={verificationPayload?.message || ''}
            onVerified={(token, user) => {
              try {
                sessionStorage.removeItem('uniport_pending_verification');
              } catch {}
              if (onRegisterSuccess) {
                onRegisterSuccess(token, user);
              } else if (onNavigate) {
                onNavigate('/student/dashboard');
              }
            }}
            onCancel={() => {
              try {
                sessionStorage.removeItem('uniport_pending_verification');
              } catch {}
              setShowVerification(false);
              setVerificationPayload(null);
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
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{t('registerTitle')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-snug">
              {t('registerDesc')}
            </p>
          </div>

          {error && (
            <div className="relative z-10 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-2.5 rounded-xl text-rose-700 dark:text-rose-300 flex flex-col gap-1.5 text-xs font-semibold leading-relaxed animate-fade-in">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span>{error}</span>
              </div>
              {isDuplicateEmail && (
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="self-end inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <span>{lang === 'fa' ? 'ورود به حساب کاربری' : lang === 'ps' ? 'حساب ته ننوتل' : 'Go to Log In'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-3.5 relative z-10">
            <div className="space-y-1 relative">
              <label className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase block">
                {t('fullName')}
              </label>
              <div className="relative group">
                <UserIcon className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 w-4 h-4 pointer-events-none transition-colors`} />
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onFocus={() => {
                    if (activeTooltip?.field === 'name') setActiveTooltip(null);
                  }}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (activeTooltip?.field === 'name') setActiveTooltip(null);
                  }}
                  placeholder="e.g. Salim Noori"
                  className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 bg-slate-50/70 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:border-blue-500 dark:focus:ring-4 dark:focus:ring-blue-500/20 rounded-xl text-xs sm:text-sm transition-all font-medium ${
                    activeTooltip?.field === 'name'
                      ? '!border-amber-500 !ring-2 !ring-amber-500/20 animate-field-shake'
                      : ''
                  }`}
                />
                <ValidationTooltip
                  visible={activeTooltip?.field === 'name'}
                  message={activeTooltip?.message}
                  onClose={() => setActiveTooltip(null)}
                  lang={lang}
                  placement="bottom"
                />
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase block">
                {t('email')}
              </label>
              <div className="relative group">
                <Mail className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 w-4 h-4 pointer-events-none transition-colors`} />
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onFocus={() => {
                    if (activeTooltip?.field === 'email') setActiveTooltip(null);
                  }}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (activeTooltip?.field === 'email') setActiveTooltip(null);
                    if (emailError) setEmailError(null);
                    if (error) setError(null);
                  }}
                  onBlur={handleEmailBlur}
                  placeholder="e.g. salim@university.edu"
                  className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 bg-slate-50/70 border text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all font-medium dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 rounded-xl text-xs sm:text-sm ${
                    activeTooltip?.field === 'email'
                      ? '!border-amber-500 !ring-2 !ring-amber-500/20 animate-field-shake'
                      : emailError
                      ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/15 dark:focus:ring-blue-500/20 dark:focus:border-blue-500'
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
              {emailError && !activeTooltip && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold px-1">
                  {emailError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1 relative">
                <label className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase block">
                  {t('password')}
                </label>
                <div className="relative group">
                  <KeyRound className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 w-4 h-4 pointer-events-none transition-colors`} />
                  <input
                    id="reg-password"
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
                    placeholder="Min 6 chars"
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

              <div className="space-y-1 relative">
                <label className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase block">
                  {lang === 'fa' ? 'تکرار رمـز' : lang === 'ps' ? 'د پټنوم تکرار' : 'CONFIRM'}
                </label>
                <div className="relative group">
                  <KeyRound className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 w-4 h-4 pointer-events-none transition-colors`} />
                  <input
                    id="reg-confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onFocus={() => {
                      if (activeTooltip?.field === 'confirmPassword') setActiveTooltip(null);
                    }}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (activeTooltip?.field === 'confirmPassword') setActiveTooltip(null);
                    }}
                    placeholder="Retype password"
                    className={`w-full ${isRtl ? 'pr-9 pl-9' : 'pl-9 pr-9'} py-2.5 bg-slate-50/70 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:border-blue-500 dark:focus:ring-4 dark:focus:ring-blue-500/20 rounded-xl text-xs sm:text-sm transition-all font-medium ${
                      activeTooltip?.field === 'confirmPassword'
                        ? '!border-amber-500 !ring-2 !ring-amber-500/20 animate-field-shake'
                        : ''
                    }`}
                  />
                  <ValidationTooltip
                    visible={activeTooltip?.field === 'confirmPassword'}
                    message={activeTooltip?.message}
                    onClose={() => setActiveTooltip(null)}
                    lang={lang}
                    placement="bottom"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute ${isRtl ? 'left-2.5' : 'right-2.5'} top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer p-0.5 rounded`}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none transition-all duration-200 cursor-pointer block leading-none uppercase tracking-wider"
            >
              {loading ? (lang === 'fa' ? 'در حال ثبت نام...' : lang === 'ps' ? 'د راجستر په حال کې...' : 'Creating Profile...') : t('register')}
            </button>
          </form>

          <div className="text-center relative z-10 pt-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('haveAccount')}{' '}
              <button
                onClick={() => onNavigate('/login')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline cursor-pointer inline bg-transparent p-0"
              >
                {t('logIn')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
