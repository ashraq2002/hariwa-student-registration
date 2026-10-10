import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  GraduationCap,
  Layers,
  ChevronRight,
  FileCheck,
  Bell
} from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import { getPortalSettings } from '../models/settingsStore.js';

export default function StudentDashboard({ user, onNavigate, apiService }) {
  const { t, lang } = useLanguage();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portalSettings, setPortalSettings] = useState(() => getPortalSettings());

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
    async function loadData() {
      try {
        setLoading(true);
        const app = await apiService.student.getStatus();
        setApplication(app);
      } catch (err) {
        setError(err.message || 'Error occurred loading student enrollment stats');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [apiService]);

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-400 font-medium flex flex-col items-center justify-center gap-2.5">
        <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] font-semibold tracking-wide">
          {lang === 'fa' ? 'در حال همگام‌سازی مشخصات کاربری شما...' : lang === 'ps' ? 'ستاسو د معلوماتو همغږي کول...' : 'Synchronizing student profile data...'}
        </span>
      </div>
    );
  }

  const isApproved = application?.status === 'Approved';
  const isPending = application?.status === 'Pending';
  const isRejected = application?.status === 'Rejected';
  const isNeedCorrection = application?.status === 'Need Correction';

  return (
    <div className="space-y-4 pb-6 w-full">
      {/* Return to Home Navigation Link */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white transition-colors rtl:rotate-180" />
          <span>
            {lang === 'fa' ? 'بازگشت به صفحه اصلی' : lang === 'ps' ? 'اصلي پاڼې ته ستنېدل' : 'Return to Home'}
          </span>
        </button>
      </div>

      {/* Top Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {lang === 'fa' ? `سلام، ${user?.name || 'دانشجو'}` : lang === 'ps' ? `سلام، ${user?.name || 'محصل'}` : `Welcome, ${user?.name || 'Student'}`}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {t('studentTriageDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {application ? (
            <button
              type="button"
              onClick={() => onNavigate('/student/status')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{lang === 'fa' ? 'مشاهده کارت هویت' : lang === 'ps' ? 'د هویت کارت لیدل' : 'View ID Card'}</span>
              <ChevronRight className="w-3 h-3 ltr:inline rtl:rotate-180" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('/student/register-form')}
              className="px-3 py-1.5 rounded-xl bg-[#008775] text-white text-xs font-bold shadow-xs hover:bg-[#007464] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{t('goToForm')}</span>
              <ChevronRight className="w-3 h-3 ltr:inline rtl:rotate-180" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Pastel Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Application Status */}
        <div 
          onClick={() => onNavigate(application ? '/student/status' : '/student/register-form')}
          className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col justify-between cursor-pointer hover:scale-[1.01] transition-all group select-none ${
            isApproved 
              ? 'bg-[#EFF9F2] dark:bg-[#13241A] border-[#D9F2E2] dark:border-[#224030]' 
              : isNeedCorrection || isRejected
              ? 'bg-[#FFF5ED] dark:bg-[#201815] border-[#FFE4D4] dark:border-[#38261F]'
              : 'bg-[#EEF5FF] dark:bg-[#141E33] border-[#DCE8FF] dark:border-[#23355A]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold ${
              isApproved ? 'text-[#1E7344] dark:text-[#78E2A4]' : isNeedCorrection || isRejected ? 'text-[#8C4A27] dark:text-[#E89E78]' : 'text-[#1E5DC8] dark:text-[#97C5FD]'
            }`}>
              {lang === 'fa' ? 'وضعیت دوسیه' : lang === 'ps' ? 'د دوسیې حالت' : 'Admission Status'}
            </span>
            <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-2xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {application ? application.status : (lang === 'fa' ? 'ثبت نشده' : lang === 'ps' ? 'نه دی ثبت شوی' : 'Not Submitted')}
            </h3>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {isApproved ? 'Admitted to Hariwa Univ.' : isPending ? 'Under Review' : 'Action Required'}
            </p>
          </div>
        </div>

        {/* Card 2: Faculty / Stream (Lavender Pastel) */}
        <div 
          onClick={() => onNavigate('/student/register-form')}
          className="bg-[#F7F2FF] dark:bg-[#1F1433] border border-[#ECE2FF] dark:border-[#3A2560] p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between cursor-pointer hover:scale-[1.01] transition-all group select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#7033D1] dark:text-[#C7B6FD]">
              {lang === 'fa' ? 'دانشکده و دیپارتمنت' : lang === 'ps' ? 'پوهنځی او څانګه' : 'Assigned Faculty'}
            </span>
            <div className="w-6 h-6 rounded-full bg-white dark:bg-[#2C1D49] border border-[#DFCEFF] dark:border-[#4B307C] flex items-center justify-center text-[#7033D1] dark:text-[#C7B6FD] shadow-2xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
              {application?.faculty || 'Computer Science'}
            </h3>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {application?.department || 'Software Engineering'}
            </p>
          </div>
        </div>

        {/* Card 3: Student ID Number (Mint Pastel) */}
        <div 
          onClick={() => onNavigate('/student/status')}
          className="bg-[#EFF9F2] dark:bg-[#13241A] border border-[#D9F2E2] dark:border-[#224030] p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between cursor-pointer hover:scale-[1.01] transition-all group select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#1E7344] dark:text-[#78E2A4]">
              {lang === 'fa' ? 'شناسه کارت محصلی' : lang === 'ps' ? 'د محصلۍ کارت ګڼه' : 'Student ID / Card'}
            </span>
            <div className="w-6 h-6 rounded-full bg-white dark:bg-[#1E382A] border border-[#CEEED9] dark:border-[#2E5943] flex items-center justify-center text-[#1E7344] dark:text-[#78E2A4] shadow-2xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight truncate">
              {application?.studentCardId || 'HU-2026-PENDING'}
            </h3>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {isApproved ? 'Official & Active' : 'Provisional'}
            </p>
          </div>
        </div>

        {/* Card 4: Academic Year (Warm Peach Pastel) */}
        <div 
          className="bg-[#FFF5ED] dark:bg-[#201815] border border-[#FFE4D4] dark:border-[#38261F] p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8C4A27] dark:text-[#E89E78]">
              {lang === 'fa' ? 'سال تحصیلی و سمستر' : lang === 'ps' ? 'تحصیلي کال' : 'Academic Batch'}
            </span>
            <div className="w-6 h-6 rounded-full bg-white dark:bg-[#2F211C] border border-[#FFDFC9] dark:border-[#4B332A] flex items-center justify-center text-[#8C4A27] dark:text-[#E89E78] shadow-2xs">
              <GraduationCap className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {application?.admissionYear || '1405 / 2026'}
            </h3>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Semester 1 (Freshman)
            </p>
          </div>
        </div>
      </div>

      {/* Main Split: Application Detail Slate (Left) + System Announcements (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
        {/* Left Column: Official Status & Actions */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {lang === 'fa' ? 'جزئیات دوسیه شمولیت' : lang === 'ps' ? 'د شمولیت دوسیې جزیات' : 'Enrollment Application'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'fa' ? 'بررسی آخرین وضعیت و یادداشت هیئت پذیرش دانشگاه' : lang === 'ps' ? 'د ارزونې هیئت یادداښت' : 'Official remarks and verification records'}
              </p>
            </div>
            {application && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isApproved 
                  ? 'bg-[#EBF9F1] text-[#1E7344] dark:bg-[#162B20] dark:text-[#7AE4A7]' 
                  : isPending
                  ? 'bg-[#FFF9EB] text-[#B27B13] dark:bg-[#2B2312] dark:text-[#FDD37B]'
                  : 'bg-[#FEECEB] text-[#D32F2F] dark:bg-[#2F1515] dark:text-[#F87171]'
              }`}>
                {application.status}
              </span>
            )}
          </div>

          {/* Review Note Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <span>{t('officialNotes')}</span>
              <span className="font-mono">{application ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "{application?.adminNote || (lang === 'fa' ? 'اسناد شما در سیستم ثبت شده و در نوبت بررسی قرار دارد.' : lang === 'ps' ? 'ستاسو اسناد په سیستم کې ثبت شوي او د کتنې په کتار کې دي.' : 'Your application credentials have been filed and are in triage.')}"
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('/student/register-form')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{application ? (lang === 'fa' ? 'ویرایش و اصلاح فورم' : lang === 'ps' ? 'د فورم سمون' : 'Edit Application') : t('goToForm')}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/student/status')}
              disabled={!application}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <Award className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{lang === 'fa' ? 'مشاهده کارت محصلی' : lang === 'ps' ? 'د هویت کارت' : 'Student ID Card'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: System Announcements & Guides */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'اطلاعیه‌های پوهنتون' : lang === 'ps' ? 'د پوهنتون خبرتیاوې' : 'University Notices'}
            </h3>
            <Bell className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-900 dark:text-white">
                  {lang === 'fa' ? 'کتالوگ علمی ۲۰۲۶' : lang === 'ps' ? 'د ۲۰۲۶ علمي کتالوګ' : 'Academic Calendar 2026'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  {lang === 'fa' ? 'کتابچه رهنمای معرفی مضامین سمستر اول و کورس‌های تکمیلی هم اکنون در دسترس است.' : lang === 'ps' ? 'د لومړي سمستر د مضامینو لارښود کتابګوټی همدا اوس شتون لري.' : 'First semester syllabus and freshman guides are now published.'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-900 dark:text-white">
                  {lang === 'fa' ? 'مهلت تکمیل مدارک' : lang === 'ps' ? 'د اسنادو وروستی چانس' : 'Registration Deadline'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  {lang === 'fa' 
                    ? (portalSettings.deadlineNoticeFa || 'مهلت نهایی ارزیابی و تصدیق اسناد کانکور تا ۱۵ جون ۲۰۲۶ می‌باشد.') 
                    : lang === 'ps' 
                    ? (portalSettings.deadlineNoticePs || portalSettings.deadlineNoticeFa) 
                    : (portalSettings.deadlineNoticeEn || 'Credential validation for fall intake closes on June 15, 2026.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
