import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Globe, ChevronDown, Check, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import { useTheme } from '../controllers/ThemeContext.jsx';
import universityLogo from '../../assets/images/hariwa_logo_1783225791176.jpg';

export default function AuthTopNav({ onNavigate }) {
  const { lang, setLang, t, isRtl } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full flex items-center justify-between px-1 py-1 shrink-0 select-none">
      {/* Back to Home Button & Brand */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1.5 px-2.5 sm:px-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/80 cursor-pointer group shadow-xs backdrop-blur-sm"
        >
          <ArrowLeft className={`w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 ${isRtl ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
          <span>{t('backToHome')}</span>
        </button>
      </div>

      {/* Preferences: Theme + Language dropdown */}
      <div className="flex items-center gap-2">
        {/* Theme Indicator Switcher */}
        <button
          onClick={toggleTheme}
          className="relative w-12 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900 p-1 flex items-center justify-between cursor-pointer border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 shadow-inner group shrink-0"
          dir="ltr"
          aria-label="Toggle theme"
          type="button"
        >
          <span
            className={`absolute w-4 h-4 rounded-full bg-white dark:bg-blue-600 shadow-sm transform transition-all duration-300 ease-out flex items-center justify-center ${
              theme === 'dark' ? 'translate-x-[20px]' : 'translate-x-0'
            }`}
          >
            {theme === 'dark' ? (
              <Moon className="w-2.5 h-2.5 text-white" />
            ) : (
              <Sun className="w-2.5 h-2.5 text-amber-500 animate-[spin_8s_linear_infinite]" />
            )}
          </span>
          <Sun className={`w-3 h-3 text-amber-500/80 transition-opacity duration-300 ${theme === 'light' ? 'opacity-0' : 'opacity-100'} ml-1`} />
          <Moon className={`w-3 h-3 text-blue-400 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'} mr-1`} />
        </button>

        {/* Dropdown Language Selector */}
        <div className="relative" ref={langDropdownRef}>
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs shrink-0"
            type="button"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-[10px] font-black uppercase text-zinc-800 dark:text-zinc-200">
              {lang}
            </span>
            <ChevronDown className={`w-3 h-3 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 shrink-0 ${langDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {langDropdownOpen && (
            <div 
              className={`absolute top-full mt-1.5 w-36 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50 transition-all ${
                isRtl ? 'left-0' : 'right-0'
              }`}
            >
              <div className="p-1 space-y-0.5">
                <button
                  onClick={() => {
                    setLang('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer transition-colors ${
                    lang === 'en'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <span>English</span>
                  {lang === 'en' && <Check className="w-3.5 h-3.5 text-blue-500" />}
                </button>
                <button
                  onClick={() => {
                    setLang('fa');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer transition-colors ${
                    lang === 'fa'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <span className="font-sans">دری / فارسی</span>
                  {lang === 'fa' && <Check className="w-3.5 h-3.5 text-blue-500" />}
                </button>
                <button
                  onClick={() => {
                    setLang('ps');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer transition-colors ${
                    lang === 'ps'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <span className="font-sans">پښتو</span>
                  {lang === 'ps' && <Check className="w-3.5 h-3.5 text-blue-500" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
