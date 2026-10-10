import { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Building2, 
  FileCheck2, 
  Bell, 
  GraduationCap, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import { getPortalSettings, savePortalSettings, DEFAULT_PORTAL_SETTINGS } from '../models/settingsStore.js';

export default function AdminSettingsModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(getPortalSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getPortalSettings());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isRtl = lang === 'fa' || lang === 'ps';

  const handleTextChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  };

  const handleToggleChange = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
    setSavedSuccess(false);
  };

  const handleCapacityChange = (dept, value) => {
    const num = parseInt(value, 10) || 0;
    setSettings((prev) => ({
      ...prev,
      capacities: {
        ...prev.capacities,
        [dept]: num,
      },
    }));
    setSavedSuccess(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    savePortalSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleReset = () => {
    if (window.confirm(
      lang === 'fa' 
        ? 'آیا مطمئن هستید که می‌خواهید تمام تنظیمات به حالت اولیه بازگردند؟' 
        : lang === 'ps' 
        ? 'ایا ډاډه یاست چې غواړئ ټول تنظیمات لومړني حالت ته راستانه کړئ؟' 
        : 'Are you sure you want to reset all website settings to defaults?'
    )) {
      setSettings({ ...DEFAULT_PORTAL_SETTINGS });
      savePortalSettings(DEFAULT_PORTAL_SETTINGS);
      setSavedSuccess(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>
                  {lang === 'fa' ? 'تنظیمات وب‌سایت و سیستم پورتال' : lang === 'ps' ? 'د ویبپاڼې او پورتال تنظیمات' : 'Web Page & Portal Settings'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold uppercase">
                  Admin Desk
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'fa' 
                  ? 'مدیریت مشخصات پوهنتون، مهلت‌های ثبت‌نام، اعلانات و متغیرهای سراسری صفحه' 
                  : lang === 'ps' 
                  ? 'د پوهنتون د معلوماتو، د نوم لیکنې د نېټو او ویبپاڼې اعلانونو اداره' 
                  : 'Manage university details, registration deadlines, announcements, and portal controls'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 sm:px-5 bg-white dark:bg-slate-900 overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'اطلاعات عمومی پوهنتون' : lang === 'ps' ? 'د پوهنتون عمومي معلومات' : 'General & University'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admissions')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'admissions'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'ثبت‌نام و پذیرش' : lang === 'ps' ? 'نوم لیکنې او پذیرش' : 'Admissions & Rules'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('announcements')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'announcements'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'اطلاعیه و بنر سایت' : lang === 'ps' ? 'د ویبپاڼې اعلانونه' : 'Announcement Banner'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('capacities')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'capacities'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'ظرفیت دانشکده‌ها' : lang === 'ps' ? 'د پوهنځیو ظرفیت' : 'Faculty Quotas'}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                {lang === 'fa' 
                  ? 'تنظیمات با موفقیت ذخیره شد و در کل وب‌سایت اعمال گردید.' 
                  : lang === 'ps' 
                  ? 'تنظیمات په بریالیتوب سره ثبت او په ټوله ویبپاڼه کې پلي شول.' 
                  : 'Settings saved successfully and applied across the entire web page.'}
              </span>
            </div>
          )}

          {/* TAB 1: General & University Info */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'fa' ? 'نام دانشگاه (دری/فارسی)' : lang === 'ps' ? 'د پوهنتون نوم (دري)' : 'University Name (Dari)'}
                  </label>
                  <input
                    type="text"
                    value={settings.universityNameFa || ''}
                    onChange={(e) => handleTextChange('universityNameFa', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'fa' ? 'نام دانشگاه (پشتو)' : lang === 'ps' ? 'د پوهنتون نوم (پښتو)' : 'University Name (Pashto)'}
                  </label>
                  <input
                    type="text"
                    value={settings.universityNamePs || ''}
                    onChange={(e) => handleTextChange('universityNamePs', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'fa' ? 'شعار رسمی' : lang === 'ps' ? 'رسمي شعار' : 'Official Slogan'}
                  </label>
                  <input
                    type="text"
                    value={settings.sloganFa || ''}
                    onChange={(e) => handleTextChange('sloganFa', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'fa' ? 'سال تحصیلی و سمستر جاری' : lang === 'ps' ? 'تحصیلي کال او سمستر' : 'Academic Year'}
                  </label>
                  <input
                    type="text"
                    value={settings.academicYear || ''}
                    onChange={(e) => handleTextChange('academicYear', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Physical Campus Address */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{lang === 'fa' ? 'نشانی رسمی و فیزیکی دانشگاه' : lang === 'ps' ? 'د پوهنتون رسمي او فزیکي ادرس' : 'Physical Campus Address'}</span>
                </label>
                <input
                  type="text"
                  value={settings.addressFa || ''}
                  onChange={(e) => handleTextChange('addressFa', e.target.value)}
                  placeholder="هرات، پنج راه آب‌بخش بادمرغان، جاده شرقی، فردوسی ۱۵"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {lang === 'fa' 
                    ? 'این نشانی در راهنمای پورتال، پاورقی سایت و کارت‌های دانشجویی منعکس می‌گردد.' 
                    : lang === 'ps' 
                    ? 'دا ادرس د پورتال په الرښود او د پاڼې په لاندینۍ برخه کې ښکاري.' 
                    : 'This address is reflected across the student guide, footer, and portal contact info.'}
                </span>
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{lang === 'fa' ? 'شماره تماس پذیرش و معلومات' : lang === 'ps' ? 'د اړیکې او معلوماتو شمیره' : 'Admissions Phone'}</span>
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={settings.phone || ''}
                    placeholder="0799600344"
                    onChange={(e) => handleTextChange('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-left"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{lang === 'fa' ? 'شماره تماس دفتر ریاست' : lang === 'ps' ? 'د ریاست دفتر شمیره' : 'President Office Phone'}</span>
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={settings.presidentPhone || ''}
                    placeholder="0794654000"
                    onChange={(e) => handleTextChange('presidentPhone', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-left"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    <span>{lang === 'fa' ? 'ایمیل رسمی پذیرش' : lang === 'ps' ? 'رسمي بریښنالیک' : 'Admissions Email'}</span>
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={settings.email || ''}
                    placeholder="admissions@hariwa.edu.af"
                    onChange={(e) => handleTextChange('email', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-left"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-500" />
                    <span>{lang === 'fa' ? 'ایمیل عمومی و ارتباطات' : lang === 'ps' ? 'عمومي بریښنالیک' : 'General Info Email'}</span>
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={settings.emailSecondary || ''}
                    placeholder="info@hariwa.edu.af"
                    onChange={(e) => handleTextChange('emailSecondary', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-left"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Admissions & Registration Rules */}
          {activeTab === 'admissions' && (
            <div className="space-y-4">
              {/* Registration Open/Closed Switch */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{lang === 'fa' ? 'پذیرش ثبت‌نام دانشجویان جدید' : lang === 'ps' ? 'د نویو محصلانو د نوم لیکنې وضعیت' : 'Student Registration Status'}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                      settings.registrationOpen 
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300' 
                        : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                    }`}>
                      {settings.registrationOpen ? (lang === 'fa' ? 'فعال (Open)' : 'فعال') : (lang === 'fa' ? 'متوقف (Closed)' : 'بند')}
                    </span>
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px]">
                    {lang === 'fa' 
                      ? 'در صورت غیرفعال کردن، ارسال فرم ثبت‌نام جدید در وب‌سایت موقتاً مسدود می‌گردد.' 
                      : lang === 'ps' 
                      ? 'د بندیدو په حالت کې نوي محصلین نشي کولی فارم وسپاري.' 
                      : 'When disabled, new registration submissions on the web page are paused.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleChange('registrationOpen')}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer flex items-center ${
                    settings.registrationOpen ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform" />
                </button>
              </div>

              {/* Deadline notice text */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'fa' ? 'متن اعلان مهلت نهایی پذیرش مدارک' : lang === 'ps' ? 'د اسنادو د وروستۍ نېټې اعلان متن' : 'Deadline Notice Text'}</span>
                </label>
                <textarea
                  rows={2}
                  value={settings.deadlineNoticeFa || ''}
                  onChange={(e) => handleTextChange('deadlineNoticeFa', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {lang === 'fa' ? 'این اعلان در داشبورد دانشجویی و صفحه اصلی وبسایت به نمایش در می‌آید.' : 'Shown in student dashboards and portal calendar notices.'}
                </span>
              </div>

              {/* Document upload requirement toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {lang === 'fa' ? 'الزامی بودن اسکن تذکره' : lang === 'ps' ? 'د تذکرې الزامي والي' : 'Require National ID'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {lang === 'fa' ? 'عدم امکان ثبت بدون تذکره' : 'Mandatory Tazkira upload'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('requireTazkira')}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                      settings.requireTazkira ? 'bg-blue-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {lang === 'fa' ? 'الزامی بودن شهادتنامه مکتب' : lang === 'ps' ? 'د شهادتنامې الزامي والي' : 'Require High School Diploma'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {lang === 'fa' ? 'شهادتنامه یا جدول نمرات صنف ۱۲' : '12th Grade Transcript upload'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('requireDiploma')}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                      settings.requireDiploma ? 'bg-blue-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between sm:col-span-2">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {lang === 'fa' ? 'صدور خودکار کارت هویت دانشجویی پس از تایید' : lang === 'ps' ? 'د تایید وروسته د کارت اتومات صدور' : 'Auto-issue Student ID Card upon Approval'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {lang === 'fa' ? 'فعالسازی فوری بارکد و کارت در کارتابل دانشجو' : 'Immediate printable ID card release'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('autoGenerateCard')}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                      settings.autoGenerateCard ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Announcements & Webpage Top Banner */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{lang === 'fa' ? 'نمایش نوار اطلاعیه در بالای صفحات وب‌سایت' : lang === 'ps' ? 'د ویبپاڼې په سر کې د اعلان ښودل' : 'Show Top Announcement Banner'}</span>
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px]">
                    {lang === 'fa' 
                      ? 'یک بنر برجسته در بالای تمامی صفحات وب‌سایت برای اطلاع‌رسانی به بازدیدکنندگان نمایش داده می‌شود.' 
                      : lang === 'ps' 
                      ? 'د ټولو پاڼو په سر کې یو روښانه او خبرتیا لرونکی بنر راڅرګندیږي.' 
                      : 'Displays a prominent notification banner at the top of the portal header.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleChange('showAnnouncementBanner')}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer flex items-center ${
                    settings.showAnnouncementBanner ? 'bg-blue-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform" />
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'fa' ? 'متن پیام اطلاعیه (دری/فارسی)' : lang === 'ps' ? 'د اعلان متن (دري)' : 'Announcement Text (Dari)'}
                </label>
                <textarea
                  rows={2}
                  value={settings.announcementTextFa || ''}
                  onChange={(e) => handleTextChange('announcementTextFa', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'fa' ? 'متن پیام اطلاعیه (پشتو)' : lang === 'ps' ? 'د اعلان متن (پښتو)' : 'Announcement Text (Pashto)'}
                </label>
                <textarea
                  rows={2}
                  value={settings.announcementTextPs || ''}
                  onChange={(e) => handleTextChange('announcementTextPs', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Faculty Quotas */}
          {activeTab === 'capacities' && (
            <div className="space-y-3">
              <p className="text-slate-600 dark:text-slate-400 font-semibold mb-2">
                {lang === 'fa' 
                  ? 'سقف ظرفیت پذیرش متقاضیان را برای هر دانشکده تعیین نمایید:' 
                  : lang === 'ps' 
                  ? 'د هر پوهنځي لپاره د محصلانو د منلو زیاته اندازه وټاکئ:' 
                  : 'Define maximum intake capacity per faculty program:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <label className="block font-bold text-slate-900 dark:text-white mb-1">
                    {lang === 'fa' ? 'کامپیوتر ساینس و فناوری' : lang === 'ps' ? 'کمپیوټر ساینس' : 'Computer Science'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={settings.capacities?.cs || 0}
                      onChange={(e) => handleCapacityChange('cs', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                    />
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium">{lang === 'fa' ? 'نفر' : 'Seats'}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <label className="block font-bold text-slate-900 dark:text-white mb-1">
                    {lang === 'fa' ? 'حقوق و علوم سیاسی' : lang === 'ps' ? 'حقوق او سیاسي علوم' : 'Law & Political Science'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={settings.capacities?.law || 0}
                      onChange={(e) => handleCapacityChange('law', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                    />
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium">{lang === 'fa' ? 'نفر' : 'Seats'}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <label className="block font-bold text-slate-900 dark:text-white mb-1">
                    {lang === 'fa' ? 'پوهنځی فارمسی' : lang === 'ps' ? 'د فارمسۍ پوهنځی' : 'Faculty of Pharmacy'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={settings.capacities?.pharmacy ?? settings.capacities?.economics ?? 80}
                      onChange={(e) => handleCapacityChange('pharmacy', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                    />
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium">{lang === 'fa' ? 'نفر' : 'Seats'}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <label className="block font-bold text-slate-900 dark:text-white mb-1">
                    {lang === 'fa' ? 'طب دندان (ستوماتولوژی)' : lang === 'ps' ? 'ستوماتولوژي' : 'Stomatology (Dentistry)'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={settings.capacities?.dentistry || 0}
                      onChange={(e) => handleCapacityChange('dentistry', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                    />
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium">{lang === 'fa' ? 'نفر' : 'Seats'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'بازنشانی پیش‌فرض' : lang === 'ps' ? 'اصلي حالت' : 'Reset to Defaults'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {lang === 'fa' ? 'انصراف' : lang === 'ps' ? 'بندول' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'ذخیره تنظیمات وب‌سایت' : lang === 'ps' ? 'تنظیمات خوندي کړئ' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
