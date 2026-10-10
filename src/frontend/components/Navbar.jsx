import { useState, useRef, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { 
  LogOut, 
  School, 
  ShieldCheck, 
  Globe, 
  Sun, 
  Moon, 
  ChevronDown, 
  Check, 
  Menu, 
  X, 
  LayoutDashboard, 
  FileText, 
  ShieldAlert, 
  Users,
  Home,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import { useTheme } from '../controllers/ThemeContext.jsx';
import universityLogo from '../../assets/images/hariwa_logo_1783225791176.jpg';
import NotificationBell from './NotificationBell.jsx';
import { getPortalSettings } from '../models/settingsStore.js';

function Navbar({ user, onLogout, onNavigate, currentRoute }) {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileLangDropdownOpen, setMobileLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalSettings, setPortalSettings] = useState(() => getPortalSettings());
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const langDropdownRef = useRef(null);
  const mobileLangDropdownRef = useRef(null);

  useEffect(() => {
    const handleSettingsUpdate = (e) => {
      if (e?.detail) {
        setPortalSettings(e.detail);
      } else {
        setPortalSettings(getPortalSettings());
      }
    };
    window.addEventListener('uniport_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('uniport_settings_updated', handleSettingsUpdate);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
      if (mobileLangDropdownRef.current && !mobileLangDropdownRef.current.contains(event.target)) {
        setMobileLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when escape key pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setMobileLangDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isRtl = lang === 'fa' || lang === 'ps';

  return (
    <nav className="bg-white/90 dark:bg-zinc-950/85 backdrop-blur-md text-slate-900 dark:text-white sticky top-0 px-4 sm:px-8 lg:px-12 py-3 border-b border-slate-200/60 dark:border-zinc-800/60 transition-colors duration-200 z-50 w-full max-w-full overflow-x-clip">
      <style>{`
        @keyframes slideInLtr {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInRtl {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Dynamic Announcement Banner configured by Admin */}
      {portalSettings?.showAnnouncementBanner !== false && !bannerDismissed && (
        <div className="mb-2 -mx-4 sm:-mx-8 lg:-mx-12 -mt-3 bg-blue-600 text-white text-[11px] sm:text-xs py-2 px-4 sm:px-6 flex items-center justify-between shadow-xs transition-all border-b border-blue-500/40">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-1 text-center font-medium truncate px-2">
            <span className="truncate">
              {lang === 'fa' 
                ? (portalSettings.announcementTextFa || 'ثبت‌نام سال تحصیلی ۲۰۲۶ آغاز شد. متقاضیان محترم می‌توانند فرم شمولیت را تکمیل نمایند.')
                : lang === 'ps' 
                ? (portalSettings.announcementTextPs || portalSettings.announcementTextFa || 'د ۲۰۲۶ تحصیلي کال لپاره نوم لیکنه پیل شوه. محصلین کولی شي خپل اسناد ثبت کړي.') 
                : (portalSettings.announcementTextEn || 'Admissions open for academic year 2026. Prospective students may complete registration.')}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          </div>
          <button 
            type="button"
            onClick={() => setBannerDismissed(true)} 
            className="p-1 hover:bg-white/20 rounded-md text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tablet & Desktop Navbar View (visible from sm: 640px and up) */}
      <div className="hidden sm:flex w-full items-center justify-between gap-4">
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 cursor-pointer select-none group min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-slate-200/80 dark:border-zinc-800 shadow-sm shrink-0 group-hover:scale-105 transition-all duration-200 bg-white">
            <img 
              src={universityLogo} 
              alt="Hariwa University Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold tracking-tight text-sm sm:text-base block truncate text-slate-900 dark:text-white leading-tight">
              {lang === 'fa' 
                ? (portalSettings.universityNameFa || t('univName'))
                : lang === 'ps'
                ? (portalSettings.universityNamePs || t('univName'))
                : (portalSettings.universityNameEn || t('univName'))}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Theme Indicator Switcher (Sliding Pill with Color Theory) */}
          <button
            onClick={toggleTheme}
            className="relative w-12 h-6 sm:w-13 sm:h-7 rounded-full bg-slate-100 dark:bg-zinc-900 p-0.5 flex items-center justify-between cursor-pointer border border-slate-200/90 dark:border-zinc-800 transition-colors duration-300 shadow-inner group shrink-0"
            dir="ltr"
            aria-label="Toggle visual theme orientation"
            type="button"
          >
            {/* Sliding bullet */}
            <span
              className={`absolute w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-white dark:bg-blue-600 shadow-sm transform transition-all duration-300 ease-out flex items-center justify-center ${
                theme === 'dark' 
                  ? 'translate-x-[22px] sm:translate-x-[24px]' 
                  : 'translate-x-0'
              }`}
            >
              {theme === 'dark' ? (
                <Moon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              ) : (
                <Sun className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 animate-[spin_8s_linear_infinite]" />
              )}
            </span>
            {/* Underlay icons for visual guidance */}
            <Sun className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500/80 transition-opacity duration-300 ${theme === 'light' ? 'opacity-0' : 'opacity-100'} ml-1 sm:ml-1.5`} />
            <Moon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'} mr-1 sm:mr-1.5`} />
          </button>

          {/* Premium Pill Language Selector */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs shrink-0"
              dir="ltr"
              type="button"
            >
              <ChevronDown className={`w-3 h-3 text-slate-400 dark:text-zinc-500 transition-transform duration-200 shrink-0 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              <span className="text-[11px] font-black uppercase text-slate-700 dark:text-zinc-200 min-w-5 text-center">
                {lang === 'fa' ? 'FA' : lang === 'ps' ? 'PS' : 'EN'}
              </span>
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            </button>

            {langDropdownOpen && (
              <div 
                className="absolute mt-2 w-36 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50 transition-all ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto"
              >
                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setLang('fa');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-[11px] font-bold rounded-lg cursor-pointer transition-colors ${
                      lang === 'fa'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    <span className="font-sans">دری / فارسی (FA)</span>
                    {lang === 'fa' && <Check className="w-3.5 h-3.5 text-blue-500" />}
                  </button>
                  <button
                    onClick={() => {
                      setLang('ps');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-[11px] font-bold rounded-lg cursor-pointer transition-colors ${
                      lang === 'ps'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    <span className="font-sans">پښتو (PS)</span>
                    {lang === 'ps' && <Check className="w-3.5 h-3.5 text-blue-500" />}
                  </button>
                  <button
                    onClick={() => {
                      setLang('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-[11px] font-bold rounded-lg cursor-pointer transition-colors ${
                      lang === 'en'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    <span>English (EN)</span>
                    {lang === 'en' && <Check className="w-3.5 h-3.5 text-blue-500" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <NotificationBell user={user} onNavigate={onNavigate} />

              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-bold text-black dark:text-white leading-tight">{user.name}</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center justify-end gap-1 font-semibold capitalize font-sans leading-none mt-0.5">
                  {user.role === 'admin' && <ShieldCheck className="w-3 h-3 text-blue-500 dark:text-blue-400" />}
                  {user.role === 'admin' ? t('adminSide') : t('studentSide')}
                </span>
              </div>

              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold text-xs sm:text-sm shrink-0 select-none">
                {user.name.split(' ').slice(0, 1).map(n => n[0]).join('').toUpperCase()}
              </div>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 bg-zinc-50 dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-rose-955/20 rounded-lg transition-all border border-zinc-200 dark:border-zinc-800 cursor-pointer font-bold shrink-0"
                title={t('logOut')}
              >
                <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline leading-none">{t('logOut')}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => onNavigate('/login')}
                className={`px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  currentRoute === '/login'
                    ? 'text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-zinc-900'
                    : 'text-slate-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-white'
                }`}
              >
                {t('logIn')}
              </button>
              <button
                onClick={() => onNavigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-xl leading-none transition-all duration-200 shadow-xs hover:shadow active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {t('register')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Compact Header View (visible below sm: 640px) */}
      <div className="flex sm:hidden flex-col w-full">
        <div className="flex items-center justify-between gap-2 w-full">
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 cursor-pointer select-none min-w-0"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm shrink-0 bg-white">
              <img 
                src={universityLogo} 
                alt="Hariwa University Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold tracking-tight text-xs sm:text-sm block truncate text-black dark:text-white leading-tight">
                {lang === 'fa'
                  ? (portalSettings.universityNameFa || 'دانشگاه هریوا')
                  : lang === 'ps'
                  ? (portalSettings.universityNamePs || 'د هریوا پوهنتون')
                  : (portalSettings.universityNameEn || 'Hariwa University')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {user && <NotificationBell user={user} onNavigate={onNavigate} />}

            {/* Single mobile navigation menu trigger toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs active:scale-95"
              type="button"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Menu className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Full-Height Side Drawer (height alongside mobile screen, width half of screen) */}
        {/* CHANGED: rendered via portal to document.body so the nav's backdrop-blur-md
            doesn't become the containing block for the fixed backdrop/drawer */}
        {mobileMenuOpen && createPortal(
          <>
            {/* Backdrop Overlay */}
            <div
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileLangDropdownOpen(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] transition-opacity animate-[fadeIn_0.2s_ease-out]"
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div
              className={`fixed top-0 bottom-0 ${
                isRtl ? 'right-0' : 'left-0'
              } w-1/2 min-w-[220px] max-w-[85vw] h-screen h-[100dvh] bg-white dark:bg-zinc-950 text-black dark:text-white z-[101] shadow-2xl border-l border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                isRtl ? 'animate-[slideInRtl_0.25s_ease-out]' : 'animate-[slideInLtr_0.25s_ease-out]'
              }`}
            >
              {/* Drawer Top Bar */}
              <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2 bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-sm">
                <div
                  onClick={() => {
                    onNavigate('/');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer min-w-0"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0 bg-white">
                    <img 
                      src={universityLogo} 
                      alt="Hariwa University Logo" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="font-bold text-[11px] truncate text-zinc-900 dark:text-zinc-100">
                    {lang === 'fa'
                      ? (portalSettings.universityNameFa || 'دانشگاه هریوا')
                      : lang === 'ps'
                      ? (portalSettings.universityNamePs || 'د هریوا پوهنتون')
                      : (portalSettings.universityNameEn || 'Hariwa Univ')}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMobileLangDropdownOpen(false);
                  }}
                  className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
                {/* Preferences Row: Compact World Icon Language Dropdown & Theme Toggle */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block px-0.5">
                    {lang === 'fa' ? 'تنظیمات' : lang === 'ps' ? 'تنظیمات' : 'Preferences'}
                  </span>

                  <div className="grid grid-cols-2 gap-1.5">
                    {/* World Icon Language Dropdown */}
                    <div className="relative" ref={mobileLangDropdownRef}>
                      <button
                        onClick={() => setMobileLangDropdownOpen(!mobileLangDropdownOpen)}
                        className="w-full flex items-center justify-between px-2 py-1.5 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer shadow-xs"
                        type="button"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="text-[10px] font-black uppercase truncate">
                            {lang === 'en' ? 'EN' : lang === 'fa' ? 'دری' : 'پښتو'}
                          </span>
                        </div>
                        <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform duration-200 shrink-0 ${mobileLangDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Popover */}
                      {mobileLangDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50 animate-[slideDown_0.15s_ease-out]">
                          <div className="p-1 space-y-0.5">
                            <button
                              onClick={() => {
                                setLang('en');
                                setMobileLangDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition-colors ${
                                lang === 'en'
                                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                              }`}
                            >
                              <span>English</span>
                              {lang === 'en' && <Check className="w-3 h-3 text-blue-500" />}
                            </button>
                            <button
                              onClick={() => {
                                setLang('fa');
                                setMobileLangDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition-colors ${
                                lang === 'fa'
                                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                              }`}
                            >
                              <span>دری</span>
                              {lang === 'fa' && <Check className="w-3 h-3 text-blue-500" />}
                            </button>
                            <button
                              onClick={() => {
                                setLang('ps');
                                setMobileLangDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition-colors ${
                                lang === 'ps'
                                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                              }`}
                            >
                              <span>پښتو</span>
                              {lang === 'ps' && <Check className="w-3 h-3 text-blue-500" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Theme Toggle Pill */}
                    <div className="flex items-center justify-between px-2 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
                      <button
                        onClick={toggleTheme}
                        className="relative w-full flex items-center justify-between cursor-pointer"
                        dir="ltr"
                        title="Toggle theme mode"
                        type="button"
                      >
                        <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 truncate">
                          {theme === 'dark' ? 'Dark' : 'Light'}
                        </span>
                        <div className="relative w-8 h-4.5 rounded-full bg-zinc-200 dark:bg-zinc-800 p-0.5 flex items-center shrink-0">
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-white dark:bg-blue-600 shadow-sm transform transition-all duration-300 ease-out flex items-center justify-center ${
                              theme === 'dark' ? 'translate-x-3.5' : 'translate-x-0'
                            }`}
                          >
                            {theme === 'dark' ? (
                              <Moon className="w-2 h-2 text-white" />
                            ) : (
                              <Sun className="w-2 h-2 text-amber-500" />
                            )}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Portal Navigation Links */}
                <div className="space-y-1 pt-1 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-[9px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase select-none px-0.5">
                    {lang === 'fa' ? 'ناوبری' : lang === 'ps' ? 'ناوبري' : 'Navigation'}
                  </p>
                  
                  <button
                    onClick={() => {
                      onNavigate('/');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer text-start ${
                      currentRoute === '/'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <Home className={`w-3.5 h-3.5 shrink-0 ${currentRoute === '/' ? 'text-white' : 'text-blue-500'}`} />
                    <span className="truncate">{t('menuHome')}</span>
                  </button>

                  {user && (user.role === 'student'
                    ? [
                        { label: t('menuDashboard'), route: '/student/dashboard', icon: LayoutDashboard },
                        { label: t('menuForm'), route: '/student/register-form', icon: FileText },
                        { label: t('menuStatus'), route: '/student/status', icon: ShieldAlert }
                      ]
                    : [
                        { label: t('menuDashboard'), route: '/admin/dashboard', icon: LayoutDashboard },
                        { label: t('menuRegistry'), route: '/admin/students', icon: Users }
                      ]
                  ).map((item) => {
                    const isActive = currentRoute === item.route;
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.route}
                        onClick={() => {
                          onNavigate(item.route);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer text-start ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        }`}
                      >
                        <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom Bar: Profile / Auth Actions */}
              <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-sm">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-[10px] shrink-0">
                        {user.name.split(' ').slice(0, 1).map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-black dark:text-white truncate leading-tight">{user.name}</p>
                        <span className="text-[8px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide block leading-none mt-0.5">
                          {user.role === 'admin' ? t('adminSide') : t('studentSide')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>{t('logOut')}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        onNavigate('/login');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-1.5 px-2 text-[11px] font-bold text-zinc-700 dark:text-zinc-200 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all cursor-pointer shadow-xs text-center"
                    >
                      {t('logIn')}
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('/register');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-1.5 px-2 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shadow-xs text-center"
                    >
                      {t('register')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
      </div>
    </nav>
  );
}

export default memo(Navbar);