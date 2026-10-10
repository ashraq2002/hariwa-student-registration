import { 
  Home, 
  FileText, 
  Users, 
  ShieldAlert, 
  BarChart2, 
  HelpCircle, 
  Settings,
  LogOut, 
  ChevronDown, 
  GraduationCap,
  Sparkles,
  Award,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileCheck,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Building,
  Globe,
  Send,
  ExternalLink,
  Instagram,
  Facebook
} from 'lucide-react';
import { useState, useEffect, memo } from 'react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import { api } from '../models/api';
import { getPortalSettings } from '../models/settingsStore.js';
import universityLogo from '../../assets/images/hariwa_logo_1783225791176.jpg';
import AdminSettingsModal from './AdminSettingsModal.jsx';

function Sidebar({ user, currentRoute, onNavigate, onLogout, apiService }) {
  const { t, lang } = useLanguage();
  const [activityOpen, setActivityOpen] = useState(true);
  const [studentApp, setStudentApp] = useState(null);
  const [loadingApp, setLoadingApp] = useState(false);
  const [guidanceModalOpen, setGuidanceModalOpen] = useState(false);
  const [adminSettingsModalOpen, setAdminSettingsModalOpen] = useState(false);
  const [activeGuidanceTab, setActiveGuidanceTab] = useState('steps');
  const [portalSettings, setPortalSettings] = useState(() => getPortalSettings());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setPortalSettings(getPortalSettings());
    };
    window.addEventListener('uniport_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);
    return () => {
      window.removeEventListener('uniport_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  if (!user) return null;

  const isStudent = user.role === 'student';

  // Fetch the student's personal registration application to determine their exact result state
  useEffect(() => {
    if (!isStudent) return;

    let isMounted = true;
    const client = apiService || api;

    const fetchStatus = async () => {
      try {
        setLoadingApp(true);
        const data = await client.student.getStatus();
        if (isMounted) {
          setStudentApp(data);
        }
      } catch (err) {
        if (isMounted) {
          setStudentApp(null);
        }
      } finally {
        if (isMounted) {
          setLoadingApp(false);
        }
      }
    };

    fetchStatus();

    // Re-fetch when student application or status changes globally
    const handleStatusUpdate = (e) => {
      if (e?.detail) {
        setStudentApp(e.detail);
      } else {
        fetchStatus();
      }
    };

    window.addEventListener('uniport_student_status_updated', handleStatusUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('uniport_student_status_updated', handleStatusUpdate);
    };
  }, [isStudent, user?.id, currentRoute, apiService]);

  return (
    <aside 
      aria-label="Sidebar Navigation"
      className="w-full md:w-56 lg:w-60 shrink-0 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-4 flex flex-col justify-between select-none shadow-2xs self-start"
    >
      <div className="space-y-5">
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate(isStudent ? '/student/dashboard' : '/admin/dashboard')} 
          className="flex items-center gap-2.5 px-1.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <img 
              src={universityLogo} 
              alt="Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900 dark:text-white uppercase block leading-tight truncate">
              {lang === 'fa' 
                ? (portalSettings.universityNameFa || 'دانشگاه هریوا')
                : lang === 'ps'
                ? (portalSettings.universityNamePs || 'د هریوا پوهنتون')
                : (
                  <>
                    HARIWA<span className="text-blue-600 dark:text-blue-400">.EDU</span>
                  </>
                )}
            </span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-wider block">
              {isStudent 
                ? (lang === 'fa' ? 'پورتال محصلان' : lang === 'ps' ? 'د محصلانو پورتال' : 'STUDENT DESK') 
                : (lang === 'fa' ? 'پورتال مدیریت' : lang === 'ps' ? 'د مدیریت پورتال' : 'ADMIN PORTAL')}
            </span>
          </div>
        </div>

        {/* Section: MAIN MENU */}
        <div className="space-y-1">
          <div className="px-2 py-0.5 text-[9px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            {lang === 'fa' ? 'منوی اصلی' : lang === 'ps' ? 'اصلي مینو' : 'MAIN MENU'}
          </div>

          <button
            type="button"
            onClick={() => onNavigate(isStudent ? '/student/dashboard' : '/admin/dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentRoute === '/student/dashboard' || currentRoute === '/admin/dashboard'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-3.5 h-3.5 shrink-0" />
              <span>{t('menuDashboard')}</span>
            </div>
          </button>

          {isStudent ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate('/student/register-form')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentRoute === '/student/register-form'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('menuForm')}</span>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-teal-500 text-white leading-none">
                  New
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/student/status')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentRoute === '/student/status'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('menuStatus')}</span>
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('/admin/students?status=All')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentRoute === '/admin/students' || currentRoute === '/admin/students?status=All'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('menuRegistry')}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/admin/dashboard')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <BarChart2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'fa' ? 'آمار تحلیلی' : lang === 'ps' ? 'تحلیلي احصائیې' : 'Analytics'}</span>
                </div>
              </button>
            </>
          )}
        </div>

        {/* Section: ADMISSIONS / ACTIVITY MANAGEMENT */}
        <div className="space-y-1">
          <div className="px-2 py-0.5 text-[9px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            {lang === 'fa' ? 'مدیریت و جریان دوسیه‌ها' : lang === 'ps' ? 'د دوسیو مدیریت' : 'ADMISSION MANAGEMENT'}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setActivityOpen(!activityOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                <span>{lang === 'fa' ? 'جریان پذیرش' : lang === 'ps' ? 'د شمولیت جریان' : 'Admission Streams'}</span>
              </div>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${activityOpen ? 'rotate-180' : ''}`} />
            </button>

            {activityOpen && (
              <div className="mt-1 ps-3 pe-1 space-y-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {isStudent ? (
                  // For students: ONLY display the single state that matches their verified result
                  loadingApp && !studentApp ? (
                    <div className="py-2 px-2.5 rounded-xl flex items-center justify-between animate-pulse bg-slate-100 dark:bg-slate-800/40">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0"></span>
                        <span className="w-20 h-2.5 bg-slate-200 dark:bg-slate-700 rounded"></span>
                      </div>
                    </div>
                  ) : studentApp?.status === 'Approved' ? (
                    <div 
                      onClick={() => onNavigate('/student/status')} 
                      className={`py-2 px-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        currentRoute === '/student/status'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/70 dark:border-emerald-800/50 shadow-xs'
                          : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>{lang === 'fa' ? 'پذیرفته شده' : lang === 'ps' ? 'منل شوي' : 'Approved Enrolled'}</span>
                      </div>
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded">Active</span>
                    </div>
                  ) : studentApp?.status === 'Pending' ? (
                    <div 
                      onClick={() => onNavigate('/student/status')} 
                      className={`py-2 px-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        currentRoute === '/student/status'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold border border-amber-200/70 dark:border-amber-800/50 shadow-xs'
                          : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                        <span>{lang === 'fa' ? 'در انتظار بررسی' : lang === 'ps' ? 'ارزونې په حال کې' : 'Pending Review'}</span>
                      </div>
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded">Active</span>
                    </div>
                  ) : studentApp?.status === 'Need Correction' ? (
                    <div 
                      onClick={() => onNavigate('/student/status')} 
                      className={`py-2 px-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        currentRoute === '/student/status'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-800/50 shadow-xs'
                          : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                        <span>{lang === 'fa' ? 'اصلاحات اسناد' : lang === 'ps' ? 'د اسنادو سمون' : 'Document Fixes'}</span>
                      </div>
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">Active</span>
                    </div>
                  ) : studentApp?.status === 'Rejected' ? (
                    <div 
                      onClick={() => onNavigate('/student/status')} 
                      className={`py-2 px-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        currentRoute === '/student/status'
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold border border-rose-200/70 dark:border-rose-800/50 shadow-xs'
                          : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                        <span>{lang === 'fa' ? 'رد شده / لغو' : lang === 'ps' ? 'رد شوي' : 'Rejected'}</span>
                      </div>
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded">Active</span>
                    </div>
                  ) : (
                    <div 
                      onClick={() => onNavigate('/student/register-form')} 
                      className={`py-2 px-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        currentRoute === '/student/register-form'
                          ? 'bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 shadow-xs'
                          : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
                        <span>{lang === 'fa' ? 'در انتظار ثبت‌نام' : lang === 'ps' ? 'د شمولیت په تمه' : 'Awaiting Submission'}</span>
                      </div>
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">New</span>
                    </div>
                  )
                ) : (
                  // For administrators: Full registry workflow filters
                  <>
                    {/* Approved Students */}
                    <div 
                      onClick={() => onNavigate('/admin/students?status=Approved')} 
                      className={`py-2 px-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        currentRoute === '/admin/students?status=Approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/70 dark:border-emerald-800/50 shadow-xs'
                          : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>{lang === 'fa' ? 'پذیرفته شده' : lang === 'ps' ? 'منل شوي' : 'Approved Enrolled'}</span>
                      </div>
                      {currentRoute === '/admin/students?status=Approved' && (
                        <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded">Active</span>
                      )}
                    </div>

                    {/* Pending Review */}
                    <div 
                      onClick={() => onNavigate('/admin/students?status=Pending')} 
                      className={`py-2 px-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        currentRoute === '/admin/students?status=Pending'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold border border-amber-200/70 dark:border-amber-800/50 shadow-xs'
                          : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                        <span>{lang === 'fa' ? 'در انتظار بررسی' : lang === 'ps' ? 'ارزونې په حال کې' : 'Pending Review'}</span>
                      </div>
                      {currentRoute === '/admin/students?status=Pending' && (
                        <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded">Active</span>
                      )}
                    </div>

                    {/* Need Correction */}
                    <div 
                      onClick={() => onNavigate('/admin/students?status=Need Correction')} 
                      className={`py-2 px-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        currentRoute === '/admin/students?status=Need Correction'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/70 dark:border-blue-800/50 shadow-xs'
                          : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                        <span>{lang === 'fa' ? 'اصلاحات اسناد' : lang === 'ps' ? 'د اسنادو سمون' : 'Document Fixes'}</span>
                      </div>
                      {currentRoute === '/admin/students?status=Need Correction' && (
                        <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">Active</span>
                      )}
                    </div>

                    {/* Rejected */}
                    <div 
                      onClick={() => onNavigate('/admin/students?status=Rejected')} 
                      className={`py-2 px-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        currentRoute === '/admin/students?status=Rejected'
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold border border-rose-200/70 dark:border-rose-800/50 shadow-xs'
                          : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                        <span>{lang === 'fa' ? 'رد شده / لغو' : lang === 'ps' ? 'رد شوي' : 'Rejected'}</span>
                      </div>
                      {currentRoute === '/admin/students?status=Rejected' && (
                        <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded">Active</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer Section: Guidance for Student, Settings for Admin */}
      <div className="space-y-1 pt-4 mt-6 border-t border-slate-200/80 dark:border-slate-800/80">
        {isStudent ? (
          <button
            type="button"
            onClick={() => setGuidanceModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer group"
            title={lang === 'fa' ? 'راهنمای پورتال' : lang === 'ps' ? 'د پورتال لارښود' : 'Guidance'}
          >
            <HelpCircle className="w-3.5 h-3.5 shrink-0 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            <span>{lang === 'fa' ? 'راهنما' : lang === 'ps' ? 'لارښود' : 'Guidance'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setAdminSettingsModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer group"
            title={lang === 'fa' ? 'تنظیمات وب‌سایت' : lang === 'ps' ? 'د ویبپاڼې تنظیمات' : 'Web Page Settings'}
          >
            <Settings className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:rotate-45 transition-transform" />
            <span>{lang === 'fa' ? 'تنظیمات وب‌سایت' : lang === 'ps' ? 'د ویبپاڼې تنظیمات' : 'Web Page Settings'}</span>
          </button>
        )}

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>{t('logout')}</span>
          </button>
        )}
      </div>

      {/* Comprehensive Guidance Modal */}
      {guidanceModalOpen && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setGuidanceModalOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            dir={lang === 'fa' || lang === 'ps' ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>
                      {lang === 'fa' ? 'راهنمای پورتال و مراحل ثبت‌نام' : lang === 'ps' ? 'د پورتال او شمولیت لارښود' : 'Portal & Admissions Guidance'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'fa' ? 'پوهنتون هریوا - سیستم مدیریت پذیرش و محصلان' : lang === 'ps' ? 'هریوا پوهنتون - د محصلانو د نوم لیکنې او ارزونې پورتال' : 'Hariwa University Admissions & Student Desk'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGuidanceModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 sm:px-5 bg-white dark:bg-slate-900 overflow-x-auto gap-2">
              <button
                type="button"
                onClick={() => setActiveGuidanceTab('steps')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                  activeGuidanceTab === 'steps'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                {lang === 'fa' ? 'مراحل ثبت‌نام' : lang === 'ps' ? 'د نوم لیکنې پړاوونه' : 'Registration Steps'}
              </button>

              <button
                type="button"
                onClick={() => setActiveGuidanceTab('statuses')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                  activeGuidanceTab === 'statuses'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                {lang === 'fa' ? 'وضعیت‌های دوسیه' : lang === 'ps' ? 'د دوسیې حالتونه' : 'Application Statuses'}
              </button>

              <button
                type="button"
                onClick={() => setActiveGuidanceTab('card')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                  activeGuidanceTab === 'card'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                {lang === 'fa' ? 'کارت هویت تحصیلی' : lang === 'ps' ? 'د محصل کارت' : 'Student ID Card'}
              </button>

              <button
                type="button"
                onClick={() => setActiveGuidanceTab('support')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                  activeGuidanceTab === 'support'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                {lang === 'fa' ? 'پشتیبانی و تماس' : lang === 'ps' ? 'اړیکه او ملاتړ' : 'Support & Contact'}
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {activeGuidanceTab === 'steps' && (
                <div className="space-y-3">
                  <p className="text-slate-700 dark:text-slate-200 font-semibold mb-2">
                    {lang === 'fa' 
                      ? 'برای تکمیل موفقیت‌آمیز ثبت نام، مراحل چهارگانه زیر را طی نمایید:'
                      : lang === 'ps'
                      ? 'د نوم لیکنې په بریا سره سرته رسولو لپاره لاندې څلور مرحلې تعقیب کړئ:'
                      : 'Follow these 4 simple steps to complete your admission application:'}
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-black flex items-center justify-center shrink-0 text-xs">۱</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">
                        {lang === 'fa' ? 'تکمیل مشخصات فردی و تحصیلی' : lang === 'ps' ? 'شخصي او تعلیمي معلومات' : 'Personal & Educational Details'}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {lang === 'fa' 
                          ? 'نام، نام پدر، تخلص، شماره تذکره، آدرس فعلی و شماره تماس معتبر خود را در بخش فرم شمولیت وارد فرمایید.'
                          : lang === 'ps'
                          ? 'خپل نوم، د پلار نوم، تخلص، تذکره شمیره، ادرس او روښانه اړیکې شمیره په فارم کې ولیکئ.'
                          : 'Fill in your full name, father name, national ID (Tazkira), home address, and reachable phone number.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-black flex items-center justify-center shrink-0 text-xs">۲</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">
                        {lang === 'fa' ? 'انتخاب دانشکده و دیپارتمنت' : lang === 'ps' ? 'د پوهنځي او څانګې ټاکل' : 'Faculty & Department Selection'}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {lang === 'fa' 
                          ? 'رشته مورد نظر خود را از میان دانشکده‌های موجود (کامپیوتر ساینس، حقوق، فارمسی، طب دندان) انتخاب نمایید.'
                          : lang === 'ps'
                          ? 'خپل د خوښې پوهنځی او تعلیمي څانګه د شته پوهنځیو (کمپیوټر ساینس، حقوق، فارمسي، د غاښونو طب) له ډلې غوره کړئ.'
                          : 'Select your preferred degree program and department based on your academic eligibility.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-black flex items-center justify-center shrink-0 text-xs">۳</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">
                        {lang === 'fa' ? 'بارگذاری اسناد و مدارک الزامی' : lang === 'ps' ? 'د اړینو اسنادو اپلوډ' : 'Document Upload'}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {lang === 'fa' 
                          ? 'عکس پرسنلی با پس‌زمینه سفید، اسکن واضح تذکره تابعیت و شهادتنامه یا جدول نمرات صنف ۱۲ مکتب را آپلود کنید.'
                          : lang === 'ps'
                          ? 'خپل نوی رسمي عکس، روښانه تذکره او د دولسم ټولګي شهادتنامه یا د نمرو جدول په سمه توګه اپلوډ کړئ.'
                          : 'Upload clear scans of your passport-style photo, National ID (Tazkira), and high school diploma/transcript.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-black flex items-center justify-center shrink-0 text-xs">۴</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">
                        {lang === 'fa' ? 'ارسال نهایی و رهگیری' : lang === 'ps' ? 'نهایی لیږل او څارنه' : 'Submission & Status Tracking'}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {lang === 'fa' 
                          ? 'دکمه "ثبت نهایی و ارسال دوسیه" را فشار دهید. پس از ارسال، پیشرفت بررسی مدارک را از بخش "وضعیت بررسی" مشاهده نمایید.'
                          : lang === 'ps'
                          ? 'د فارم د سپارلو تڼۍ کیکاږئ او وروسته د خپلو اسنادو ارزونه د "ارزونې وضعیت" له مینو تعقیب کړئ.'
                          : 'Click Submit. Your dossier will enter review by the admissions committee and can be tracked in real-time.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeGuidanceTab === 'statuses' && (
                <div className="space-y-3">
                  <p className="text-slate-700 dark:text-slate-200 font-semibold mb-1">
                    {lang === 'fa' 
                      ? 'مفاهیم وضعیت‌های مختلف دوسیه شمولیت در پورتال هریوا:'
                      : lang === 'ps'
                      ? 'په پورتال کې د دوسیې د بیلابیلو حالتونو مانا او توضیحات:'
                      : 'Understanding application evaluation statuses:'}
                  </p>

                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">
                        {lang === 'fa' ? 'پذیرفته شده (Approved)' : lang === 'ps' ? 'منل شوی (Approved)' : 'Approved'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                      {lang === 'fa' 
                        ? 'تمام اسناد و شرایط شما توسط هیئت پذیرش تایید گردیده و شناسه دانشجویی رسمی صادر شده است. کارت هویت دانشجویی فعال و قابل چاپ می‌باشد.'
                        : lang === 'ps'
                        ? 'ستاسو ټول اسناد په بریالیتوب سره تایید شوي او د محصل کارت مو چمتو او د چاپ وړ دی.'
                        : 'Your documents have met all requirements. Official registration code is issued and your Student ID Card is ready for download/print.'}
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="font-bold text-amber-800 dark:text-amber-300">
                        {lang === 'fa' ? 'در انتظار بررسی (Pending Review)' : lang === 'ps' ? 'ارزونې په حال کې (Pending)' : 'Pending Review'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                      {lang === 'fa' 
                        ? 'دوسیه شما با موفقیت ثبت شده و در نوبت صحت‌سنجی توسط مدیریت پذیرش قرار دارد. بررسی معمولاً ۲۴ الی ۴۸ ساعت زمان می‌برد.'
                        : lang === 'ps'
                        ? 'ستاسو دوسیه په سیستم کې ثبت شوې او د تدریسي مدیریت د ارزونې په نوبت کې ده.'
                        : 'Your dossier has been submitted and is in queue for evaluation by university admission officers.'}
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/40 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      <span className="font-bold text-blue-800 dark:text-blue-300">
                        {lang === 'fa' ? 'اصلاحات اسناد (Need Correction)' : lang === 'ps' ? 'د اسنادو سمون (Need Correction)' : 'Need Correction'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                      {lang === 'fa' 
                        ? 'یک یا چند سند دارای نقص، عدم وضوح یا مغایرت است. لطفاً یادداشت رسمی ارزیاب را در پورتال مطالعه نموده و سند اصلاح شده را آپلود فرمایید.'
                        : lang === 'ps'
                        ? 'ستاسو په ځینو اسنادو کې نیمګړتیا شته. د ارزیاب یادښت ولولئ او سم شوی سند بیا اپلوډ کړئ.'
                        : 'One or more uploaded credentials require correction or clearer scan. Review reviewer notes and re-upload the requested file.'}
                    </p>
                  </div>

                  <div className="p-3 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/40 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span className="font-bold text-rose-800 dark:text-rose-300">
                        {lang === 'fa' ? 'رد شده (Rejected)' : lang === 'ps' ? 'رد شوی (Rejected)' : 'Rejected'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                      {lang === 'fa' 
                        ? 'دوسیه به دلیل عدم انطباق با مقررات پذیرش یا تکمیل ظرفیت تایید نگردیده است. جهت کسب اطلاعات بیشتر با مدیریت تماس بگیرید.'
                        : lang === 'ps'
                        ? 'دوسیه د معیارونو د نه پوره کولو له امله ونه منل شوه. د لا زیاتو معلوماتو لپاره له تدریسي مدیریت سره اړیکه ونیسئ.'
                        : 'Application did not meet admissions criteria or department reached full capacity. Contact admissions office for guidance.'}
                    </p>
                  </div>
                </div>
              )}

              {activeGuidanceTab === 'card' && (
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                      <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h4>{lang === 'fa' ? 'کارت هویت دانشجویی دیجیتال' : lang === 'ps' ? 'د محصل رسمي هویت کارت' : 'Official Student ID Card'}</h4>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {lang === 'fa'
                        ? 'کارت هویت دانشجویی برای کلیه متقاضیانی که دوسیه آن‌ها به وضعیت "پذیرفته شده" درآمده به صورت خودکار صادر می‌شود. این کارت حاوی بارکد اختصاصی، شماره دانشجویی، نام و نام پدر، دانشکده و سال تحصیلی می‌باشد.'
                        : lang === 'ps'
                        ? 'د محصل هویت کارت د هغو کسانو لپاره په اتومات ډول صادریږي چې نوم لیکنه یې منل شوې وي. کارت ځانګړی بارکوډ، د شمولیت شمیره او پوهنځی لري.'
                        : 'Student ID Cards are automatically generated once admissions officers approve your application. Cards feature verifiable barcodes and student details.'}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 pt-1">
                      <li>{lang === 'fa' ? 'امکان چاپ مسقیم روی کاغذ استاندارد یا PVC' : lang === 'ps' ? 'په مستقیم ډول چاپ یا ډانلوډ وړتیا' : 'Direct one-click print or PDF save'}</li>
                      <li>{lang === 'fa' ? 'دارای کیوآر کد (QR Code) جهت تصدیق اصالت در دروازه و کتابخانه' : lang === 'ps' ? 'د اعتبار سنجولو لپاره QR کوډ لري' : 'Official verification QR code'}</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeGuidanceTab === 'support' && (
                <div className="space-y-3.5">
                  <p className="text-slate-700 dark:text-slate-200 font-semibold mb-1">
                    {lang === 'fa' ? 'راه‌های ارتباط با کمیته پذیرش و پشتیبانی فنی:' : lang === 'ps' ? 'د پذیرش او تخنیکي ملاتړ د اړیکو لارې:' : 'Contact Admissions & Technical Support:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Admissions Phone */}
                    <a 
                      href={`tel:${portalSettings.phone || '0799600344'}`}
                      className="p-3 bg-slate-50 hover:bg-emerald-50/60 dark:bg-slate-800/40 dark:hover:bg-emerald-950/20 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800/50 flex items-center gap-3 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-slate-400 font-bold flex items-center justify-between">
                          <span>{lang === 'fa' ? 'پذیرش و معلومات' : lang === 'ps' ? 'پذیرش او معلومات' : 'Admissions & Info'}</span>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">تماس مستقیم</span>
                        </div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm tracking-wide" dir="ltr">
                          {portalSettings.phone || '0799600344'}
                        </div>
                      </div>
                    </a>

                    {/* Office of President Phone */}
                    <a 
                      href={`tel:${portalSettings.presidentPhone || '0794654000'}`}
                      className="p-3 bg-slate-50 hover:bg-indigo-50/60 dark:bg-slate-800/40 dark:hover:bg-indigo-950/20 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800/50 flex items-center gap-3 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Building className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-slate-400 font-bold flex items-center justify-between">
                          <span>{lang === 'fa' ? 'آمریت دفتر ریاست' : lang === 'ps' ? 'د ریاست دفتر امریت' : 'Office of President'}</span>
                          <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-medium">تماس</span>
                        </div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm tracking-wide" dir="ltr">
                          {portalSettings.presidentPhone || '0794654000'}
                        </div>
                      </div>
                    </a>

                    {/* Official Admissions Email */}
                    <a 
                      href={`mailto:${portalSettings.email || 'admissions@hariwa.edu.af'}`}
                      className="p-3 bg-slate-50 hover:bg-blue-50/60 dark:bg-slate-800/40 dark:hover:bg-blue-950/20 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800/50 flex items-center gap-3 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-slate-400 font-bold">{lang === 'fa' ? 'ایمیل رسمی پذیرش' : lang === 'ps' ? 'رسمي برېښنالیک' : 'Admissions Email'}</div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs truncate" dir="ltr">
                          {portalSettings.email || 'admissions@hariwa.edu.af'}
                        </div>
                      </div>
                    </a>

                    {/* Official General Email */}
                    <a 
                      href={`mailto:${portalSettings.emailSecondary || 'info@hariwa.edu.af'}`}
                      className="p-3 bg-slate-50 hover:bg-sky-50/60 dark:bg-slate-800/40 dark:hover:bg-sky-950/20 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800/50 flex items-center gap-3 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-slate-400 font-bold">{lang === 'fa' ? 'ایمیل عمومی و وب‌سایت' : lang === 'ps' ? 'عمومي برېښنالیک' : 'General Inquiries'}</div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs truncate" dir="ltr">
                          {portalSettings.emailSecondary || 'info@hariwa.edu.af'}
                        </div>
                      </div>
                    </a>

                    {/* Physical Address */}
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-3 sm:col-span-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-slate-400 font-bold mb-0.5">{lang === 'fa' ? 'نشانی حضوری دانشگاه' : lang === 'ps' ? 'د پوهنتون فزیکي پته' : 'Campus Physical Address'}</div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed text-xs">
                          {lang === 'fa' 
                            ? (portalSettings.addressFa || 'هرات، پنج راه آب‌بخش بادمرغان، جاده شرقی، فردوسی ۱۵') 
                            : lang === 'ps' 
                            ? (portalSettings.addressPs || 'هرات، پنج راه آب‌بخش بادمرغان، جاده شرقي، فردوسي ۱۵') 
                            : (portalSettings.addressEn || 'Herat, Panj Rah Abbakhsh Badmorghan, East Road, Ferdowsi 15')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social & Portal Logo Badges Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 sm:p-3 bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 rounded-xl">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {lang === 'fa' ? 'ساعات کاری: شنبه تا پنج‌شنبه ۸:۰۰ الی ۱۶:۰۰' : lang === 'ps' ? 'کاري ساعتونه: شنبه تر پنجشنبه ۸:۰۰ تر ۱۶:۰۰' : 'Working hours: Sat - Thu 8:00 AM - 4:00 PM'}
                      </span>
                    </div>

                    {/* Logo Links (Icon / Logo badges without raw text) */}
                    <div className="flex items-center gap-2">
                      {/* Telegram Channel Logo Button */}
                      <a 
                        href="https://t.me/Hariwa_edu" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="کانال رسمی تلگرام (@Hariwa_edu)"
                        aria-label="Telegram Channel (@Hariwa_edu)"
                        className="w-8 h-8 rounded-full bg-sky-100/80 hover:bg-[#229ED9] text-[#229ED9] hover:text-white dark:bg-sky-950/40 dark:text-[#229ED9] dark:hover:text-white border border-[#229ED9]/30 hover:border-[#229ED9] flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs active:scale-95 group cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>

                      {/* Telegram Group Logo Button */}
                      <a 
                        href="https://t.me/HariwaUniversity" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="گروه تلگرام محصلان (@HariwaUniversity)"
                        aria-label="Telegram Community Group"
                        className="w-8 h-8 rounded-full bg-indigo-100/80 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:text-white border border-indigo-500/30 hover:border-indigo-600 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs active:scale-95 group cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 shrink-0" />
                      </a>

                      {/* Official Website Logo Button */}
                      <a 
                        href={portalSettings.website || 'https://www.hariwa.edu.af/'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="وب‌سایت رسمی دانشگاه هریوا (www.hariwa.edu.af)"
                        aria-label="Official Website"
                        className="w-8 h-8 rounded-full bg-emerald-100/80 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:text-white border border-emerald-500/30 hover:border-emerald-600 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs active:scale-95 group cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                      </a>

                      {/* Instagram Logo Button */}
                      <a 
                        href="https://instagram.com/hariwa_university" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="انستاگرام دانشگاه هریوا (@hariwa_university)"
                        aria-label="Instagram"
                        className="w-8 h-8 rounded-full bg-pink-100/80 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-pink-600 hover:text-white dark:bg-pink-950/40 dark:text-pink-400 dark:hover:text-white border border-pink-500/30 hover:border-transparent flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs active:scale-95 group cursor-pointer"
                      >
                        <Instagram className="w-3.5 h-3.5 shrink-0" />
                      </a>

                      {/* Facebook Logo Button */}
                      <a 
                        href="https://facebook.com/HariwaHigherEducationInstit" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="صفحه فیسبوک دانشگاه هریوا"
                        aria-label="Facebook"
                        className="w-8 h-8 rounded-full bg-blue-100/80 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-950/40 dark:text-blue-400 dark:hover:text-white border border-blue-500/30 hover:border-blue-600 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs active:scale-95 group cursor-pointer"
                      >
                        <Facebook className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {isStudent && (
                  <button
                    type="button"
                    onClick={() => {
                      setGuidanceModalOpen(false);
                      onNavigate('/student/register-form');
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    {lang === 'fa' ? 'فرم ثبت‌نام' : lang === 'ps' ? 'د شمولیت فارم' : 'Registration Form'}
                  </button>
                )}
                {isStudent && (
                  <button
                    type="button"
                    onClick={() => {
                      setGuidanceModalOpen(false);
                      onNavigate('/student/status');
                    }}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    {lang === 'fa' ? 'وضعیت دوسیه' : lang === 'ps' ? 'د دوسیې حالت' : 'Application Status'}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setGuidanceModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {lang === 'fa' ? 'بستن' : lang === 'ps' ? 'تړل' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Web Page Settings Modal */}
      {!isStudent && (
        <AdminSettingsModal 
          isOpen={adminSettingsModalOpen} 
          onClose={() => setAdminSettingsModalOpen(false)} 
        />
      )}
    </aside>
  );
}

export default memo(Sidebar);
