import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Users,
  Clock,
  CheckCircle,
  AlertOctagon,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  Laptop,
  HeartPulse,
  Scale,
  Pill,
  Search,
  Filter,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';

export default function AdminDashboard({ onNavigate, apiService }) {
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingStudents: 0,
    approvedStudents: 0,
    rejectedStudents: 0,
    correctionRequired: 0,
  });
  const [applications, setApplications] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Newest');
  const [timeframe, setTimeframe] = useState('12 Days');
  const [hoveredBar, setHoveredBar] = useState(null);

  // Compute dynamic 12-day trend data from real application records in the database
  const numDays = 12;

  const { trendData, maxVal, mostActiveDayIdx, yAxisTicks } = useMemo(() => {
    const latestTimestamp = applications.reduce((latest, a) => {
      const t = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      return !isNaN(t) && t > latest ? t : latest;
    }, Date.now());

    const refDate = new Date(latestTimestamp);

    const data = Array.from({ length: numDays }, (_, i) => {
      const targetDate = new Date(refDate);
      targetDate.setDate(targetDate.getDate() - (numDays - 1 - i));
      const dateKey = targetDate.toISOString().slice(0, 10);

      const matchingApps = applications.filter((app) => {
        if (!app.createdAt) return false;
        const appDateKey = new Date(app.createdAt).toISOString().slice(0, 10);
        return appDateKey === dateKey;
      });

      const dayIdx = targetDate.getDay();
      const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayNamesFa = ['۱ش', '۲ش', '۳ش', '۴ش', '۵ش', 'جمعه', 'شنبه'];
      const dayNamesPs = ['یک', 'دو', 'درې', 'څلور', 'پینځه', 'جمعه', 'شنب'];

      const shortDay = lang === 'fa' ? dayNamesFa[dayIdx] : lang === 'ps' ? dayNamesPs[dayIdx] : dayNamesEn[dayIdx];
      const fullDate = targetDate.toLocaleDateString(lang === 'fa' ? 'fa-AF' : lang === 'ps' ? 'ps-AF' : 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      return {
        day: shortDay,
        fullDate,
        dateKey,
        value: matchingApps.length,
        apps: matchingApps,
        isLatest: i === numDays - 1,
      };
    });

    const max = Math.max(...data.map((d) => d.value), 1);
    const mostActive = data.reduce((maxIdx, d, idx, arr) => (d.value > arr[maxIdx].value ? idx : maxIdx), numDays - 1);

    const ticks = max <= 5
      ? [5, 4, 3, 2, 1]
      : [
          max,
          Math.max(1, Math.round(max * 0.75)),
          Math.max(1, Math.round(max * 0.5)),
          Math.max(1, Math.round(max * 0.25)),
          1,
        ];

    return {
      trendData: data,
      maxVal: max,
      mostActiveDayIdx: mostActive,
      yAxisTicks: ticks,
    };
  }, [applications, lang, numDays]);

  // Dynamic calculation for Academic Faculties directly from active applications in database
  const facultyStreams = useMemo(() => {
    const countFaculty = (keywords) => {
      return applications.filter((app) => {
        const fac = (app.faculty || '').toLowerCase();
        return keywords.some((k) => fac.includes(k.toLowerCase()));
      }).length;
    };

    return [
      {
        id: 'Dentistry',
        name: lang === 'fa' ? 'طب دندان (ستوماتولوژی)' : lang === 'ps' ? 'د غاښونو طب' : 'Dentistry',
        queryFaculty: 'Dentistry',
        count: `${countFaculty(['Dentistry', 'دندان', 'ستوماتولوژی', 'طب'])} ${lang === 'fa' ? 'متقاضی' : lang === 'ps' ? 'غوښتونکي' : 'Applicants'}`,
        icon: HeartPulse,
        bg: 'bg-rose-50 dark:bg-rose-950/30',
        text: 'text-rose-600 dark:text-rose-400',
      },
      {
        id: 'Computer Science',
        name: lang === 'fa' ? 'کمپیوتر ساینس و فناوری' : lang === 'ps' ? 'کمپیوټر ساینس' : 'Computer Science',
        queryFaculty: 'Computer Science',
        count: `${countFaculty(['Computer Science', 'Information Technology', 'کمپیوتر', 'کامپیوتر', 'سافت'])} ${lang === 'fa' ? 'متقاضی' : lang === 'ps' ? 'غوښتونکي' : 'Applicants'}`,
        icon: Laptop,
        bg: 'bg-indigo-50 dark:bg-indigo-950/30',
        text: 'text-indigo-600 dark:text-indigo-400',
      },
      {
        id: 'Law Faculty',
        name: lang === 'fa' ? 'حقوق و علوم سیاسی' : lang === 'ps' ? 'حقوق او سیاسي علوم' : 'Law & Politics',
        queryFaculty: 'Law Faculty',
        count: `${countFaculty(['Law', 'حقوق', 'قضا'])} ${lang === 'fa' ? 'متقاضی' : lang === 'ps' ? 'غوښتونکي' : 'Applicants'}`,
        icon: Scale,
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        text: 'text-amber-600 dark:text-amber-400',
      },
      {
        id: 'Pharmacy',
        name: lang === 'fa' ? 'پوهنځی فارمسی' : lang === 'ps' ? 'د فارمسۍ پوهنځی' : 'Faculty of Pharmacy',
        queryFaculty: 'Pharmacy',
        count: `${countFaculty(['Pharmacy', 'فارمسی', 'داروسازی', 'دارو', 'فارمس'])} ${lang === 'fa' ? 'متقاضی' : lang === 'ps' ? 'غوښتونکي' : 'Applicants'}`,
        icon: Pill,
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        text: 'text-emerald-600 dark:text-emerald-400',
      },
    ];
  }, [applications, lang]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, appsData] = await Promise.all([
        apiService.admin.getStats(),
        apiService.admin.getApplications(),
      ]);

      setStats(statsData);
      setApplications(appsData);
      
      const sorted = [...appsData].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentApps(sorted.slice(0, 5));
    } catch (err) {
      setError(err.message || 'Administrative handshake failed.');
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter applications for bottom table (Hook must always be called before any early return)
  const filteredApps = useMemo(() => {
    return [...applications].sort((a, b) => {
      if (activeTab === 'Oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [applications, activeTab]);

  const approvalRate = stats.totalStudents > 0 
    ? Math.round((stats.approvedStudents / stats.totalStudents) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-400 font-medium flex flex-col items-center justify-center gap-2.5">
        <RefreshCw className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" />
        <span className="text-[11px] font-semibold tracking-wide">
          {lang === 'fa' ? 'در حال همگام‌سازی داشبورد پذیرش...' : lang === 'ps' ? 'د معلوماتو همغږي کول...' : 'Loading university admission workspace...'}
        </span>
      </div>
    );
  }

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
            {lang === 'fa' ? 'خوش آمدید' : lang === 'ps' ? 'ښه راغلاست' : 'Welcome back'}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {lang === 'fa' ? 'داشبورد جامع مدیریت شمولیت و بررسی اسناد متقاضیان' : lang === 'ps' ? 'د شمولیت او اسنادو مدیریت داشبورډ' : 'Welcome to admission & enrollment dashboard'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-1.5 rounded-xl bg-white dark:bg-[#10182c] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-2xs transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/admin/students')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>{t('menuRegistry')}</span>
            <ChevronRight className="w-3 h-3 ltr:inline rtl:rotate-180" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl text-rose-700 dark:text-rose-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Main Top Grid: 4 Pastel Stat Cards (Left) + Featured Teal Bar Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
        {/* 4 Pastel Metric Cards in a 2x2 Grid */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Warm Peach/Sand Pastel */}
          <div 
            onClick={() => onNavigate('/admin/students?status=All')}
            className="bg-[#FFF5ED] dark:bg-[#201815] border border-[#FFE4D4] dark:border-[#38261F] p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between cursor-pointer hover:shadow-sm hover:scale-[1.01] transition-all group select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8C4A27] dark:text-[#E89E78]">
                {lang === 'fa' ? 'کل متقاضیان' : lang === 'ps' ? 'ټول غوښتونکي' : 'Total Applications'}
              </span>
              <div className="w-6 h-6 rounded-full bg-white dark:bg-[#2F211C] border border-[#FFDFC9] dark:border-[#4B332A] flex items-center justify-center text-[#8C4A27] dark:text-[#E89E78] shadow-2xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {stats.totalStudents}
              </h3>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{stats.totalStudents}</span> {lang === 'fa' ? 'محصل در پایگاه داده' : lang === 'ps' ? 'محصلین په ډیټابیس کې' : 'students in database'}
              </p>
            </div>
          </div>

          {/* Card 2: Mint Green Pastel */}
          <div 
            onClick={() => onNavigate('/admin/students?status=Approved')}
            className="bg-[#EFF9F2] dark:bg-[#13241A] border border-[#D9F2E2] dark:border-[#224030] p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between cursor-pointer hover:shadow-sm hover:scale-[1.01] transition-all group select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#1E7344] dark:text-[#78E2A4]">
                {lang === 'fa' ? 'پذیرفته و صادر شده' : lang === 'ps' ? 'منل شوي او صادر شوي' : 'Approved Enrolled'}
              </span>
              <div className="w-6 h-6 rounded-full bg-white dark:bg-[#1E382A] border border-[#CEEED9] dark:border-[#2E5943] flex items-center justify-center text-[#1E7344] dark:text-[#78E2A4] shadow-2xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {stats.approvedStudents}
              </h3>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{approvalRate}%</span> {lang === 'fa' ? 'نرخ پذیرش قطعی' : lang === 'ps' ? 'د قبلیدو کچه' : 'acceptance rate'}
              </p>
            </div>
          </div>

          {/* Card 3: Ice Blue Pastel */}
          <div 
            onClick={() => onNavigate('/admin/students?status=Pending')}
            className="bg-[#EEF5FF] dark:bg-[#141E33] border border-[#DCE8FF] dark:border-[#23355A] p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between cursor-pointer hover:shadow-sm hover:scale-[1.01] transition-all group select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#1E5DC8] dark:text-[#97C5FD]">
                {lang === 'fa' ? 'در انتظار بررسی' : lang === 'ps' ? 'ارزونې په حال کې' : 'Pending Review'}
              </span>
              <div className="w-6 h-6 rounded-full bg-white dark:bg-[#1C2C4B] border border-[#CCE0FF] dark:border-[#2F4777] flex items-center justify-center text-[#1E5DC8] dark:text-[#97C5FD] shadow-2xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {stats.pendingStudents}
              </h3>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="text-blue-600 dark:text-blue-400 font-bold">{stats.correctionRequired}</span> {lang === 'fa' ? 'نیازمند اصلاح اسناد' : lang === 'ps' ? 'اصلاح ته اړتیا' : 'need correction'}
              </p>
            </div>
          </div>

          {/* Card 4: Soft Lavender Pastel */}
          <div 
            onClick={() => onNavigate('/admin/students?status=Rejected')}
            className="bg-[#F7F2FF] dark:bg-[#1F1433] border border-[#ECE2FF] dark:border-[#3A2560] p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between cursor-pointer hover:shadow-sm hover:scale-[1.01] transition-all group select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#7033D1] dark:text-[#C7B6FD]">
                {lang === 'fa' ? 'نرخ قبولی نهایی' : lang === 'ps' ? 'د قبلیدو کچه' : 'Admission Rate'}
              </span>
              <div className="w-6 h-6 rounded-full bg-white dark:bg-[#2C1D49] border border-[#DFCEFF] dark:border-[#4B307C] flex items-center justify-center text-[#7033D1] dark:text-[#C7B6FD] shadow-2xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {approvalRate}%
              </h3>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="text-rose-600 dark:text-rose-400 font-bold">{stats.rejectedStudents}</span> {lang === 'fa' ? 'درخواست رد شده' : lang === 'ps' ? 'رد شوي غوښتنلیکونه' : 'rejected applications'}
              </p>
            </div>
          </div>
        </div>

        {/* Featured Deep Teal Bar Chart Card (Dynamic Admissions Flow from Database) */}
        <div className="lg:col-span-6 bg-[#008775] text-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs relative overflow-hidden">
          {/* Top Header with summary & Time Pill */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-semibold text-teal-100 uppercase tracking-wider block">
                {lang === 'fa' ? 'جریان پذیرش' : lang === 'ps' ? 'د شمولیت بهیر' : 'Admissions Flow'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {stats.totalStudents}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[9px] font-bold">
                  {approvalRate}% {lang === 'fa' ? 'تایید شده' : lang === 'ps' ? 'تایید شوی' : 'Approved'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-semibold">
              <span>{lang === 'fa' ? '۱۲ روز' : lang === 'ps' ? '۱۲ ورځې' : timeframe}</span>
              <Calendar className="w-3 h-3" />
            </div>
          </div>

          {/* Bar Chart Canvas with Y-axis markers & rounded cream bars */}
          <div className="mt-4 flex items-end gap-2 h-32 sm:h-36 pt-2">
            {/* Dynamic Y Axis labels from database scale */}
            <div className="flex flex-col justify-between h-full text-[8px] font-mono text-teal-200/80 pe-1 pb-3 select-none shrink-0 text-right">
              {yAxisTicks.map((tick, tIdx) => (
                <span key={tIdx}>{tick}</span>
              ))}
            </div>

            {/* Dynamic Bars calculated from database applications */}
            <div className="flex-1 flex items-end justify-between gap-1 sm:gap-1.5 h-full pb-3 border-b border-white/15">
              {trendData.map((item, idx) => {
                const isHighlight = mostActiveDayIdx === idx && item.value > 0;
                const calcHeight = item.value === 0 
                  ? '8%' 
                  : `${Math.min(100, Math.max(18, Math.round((item.value / maxVal) * 85)))}%`;

                return (
                  <div 
                    key={idx}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                    onClick={() => onNavigate('/admin/students')}
                    className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                  >
                    {/* Hover Tooltip showing exact database registration details */}
                    {hoveredBar === idx && (
                      <div className="absolute -top-10 bg-slate-950 text-white text-[9px] font-bold py-1 px-2 rounded-lg shadow-xl whitespace-nowrap z-30 border border-slate-700 pointer-events-none flex flex-col items-center">
                        <span className="text-teal-300 text-[8px]">{item.fullDate}</span>
                        <span>{item.value} {lang === 'fa' ? 'ثبت‌نام' : lang === 'ps' ? 'شمولیت' : 'apps'}</span>
                      </div>
                    )}

                    {/* Bar Pill */}
                    <div
                      style={{ height: calcHeight }}
                      className={`w-full max-w-[16px] rounded-t-md transition-all duration-300 ${
                        isHighlight
                          ? 'bg-[#FFE8A3] border-2 border-white shadow-xs'
                          : item.value > 0
                          ? 'bg-[#FFF3CD] group-hover:bg-white opacity-95'
                          : 'bg-white/20 group-hover:bg-white/40'
                      }`}
                    >
                      {isHighlight && (
                        <div 
                          className="w-full h-full rounded-t-sm opacity-30 bg-repeat"
                          style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, #008775 3px, #008775 6px)'
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day X-Axis Labels */}
          <div className="flex items-center justify-between text-[9px] font-medium text-teal-100 ps-6 pe-1 pt-0.5 select-none">
            {trendData.map((item, idx) => (
              <span key={idx} className="flex-1 text-center truncate" title={item.fullDate}>
                {item.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Section: Quick Faculty Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {lang === 'fa' ? 'دانشکده‌های دانشگاه' : lang === 'ps' ? 'د پوهنتون پوهنځي' : 'Academic Faculties'}
          </h2>
          <button 
            type="button"
            onClick={() => onNavigate('/admin/students')}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {facultyStreams.map((faculty) => {
            const Icon = faculty.icon;
            return (
              <div
                key={faculty.id}
                onClick={() => onNavigate(`/admin/students?faculty=${encodeURIComponent(faculty.queryFaculty)}`)}
                className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xs transition-all cursor-pointer select-none group"
              >
                <div className={`w-8 h-8 rounded-xl ${faculty.bg} ${faculty.text} flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                    {faculty.name}
                  </h4>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 block">
                    {faculty.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Recent Submissions (Left) + Applications Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
        {/* Left Column: Recent Submissions Stream */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'ثبت‌نام‌های اخیر' : lang === 'ps' ? 'وروستي نوم لیکنې' : 'Recent Submissions'}
            </h3>
            <button 
              type="button"
              onClick={() => onNavigate('/admin/students')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentApps.length > 0 ? (
              recentApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onNavigate(`/admin/students/${app.id}`)}
                  className="py-2.5 flex items-center justify-between gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#F6F8FA] dark:bg-[#162138] border border-slate-200/60 dark:border-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-700 dark:text-slate-300 uppercase shrink-0">
                      {app.fullName ? app.fullName.substring(0, 2) : 'ST'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {app.fullName}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {app.faculty} — {app.department}
                      </p>
                    </div>
                  </div>

                  <div className="text-end shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      app.status === 'Approved'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        : app.status === 'Pending'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                    }`}>
                      {app.status === 'Approved' ? 'Verified' : app.status === 'Pending' ? 'In Review' : app.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs font-medium">
                {lang === 'fa' ? 'دوسیه‌ای ثبت نگردیده است.' : lang === 'ps' ? 'هیڅ عریضه نشته.' : 'No application records logged.'}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Applications Table */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {lang === 'fa' ? 'فهرست درخواست‌ها' : lang === 'ps' ? 'د غوښتنلیکونو نوملړ' : 'Applications'}
            </h3>

            {/* Segmented Filter Pills (Newest / Oldest) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-full text-[11px] font-bold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('Newest')}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  activeTab === 'Newest'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Newest
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('Oldest')}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  activeTab === 'Oldest'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Oldest
              </button>
            </div>
          </div>

          {/* Clean Small Text Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="text-[9px] font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80">
                  <th className="pb-2 text-start font-bold uppercase tracking-wider">{lang === 'fa' ? 'نام متقاضی' : lang === 'ps' ? 'نوم' : 'Name'}</th>
                  <th className="pb-2 text-start font-bold uppercase tracking-wider">{lang === 'fa' ? 'وضعیت' : lang === 'ps' ? 'حالت' : 'Status'}</th>
                  <th className="pb-2 text-start font-bold uppercase tracking-wider">{lang === 'fa' ? 'تاریخ' : lang === 'ps' ? 'نېټه' : 'Date'}</th>
                  <th className="pb-2 text-end font-bold uppercase tracking-wider">{lang === 'fa' ? 'کد داوطلب' : lang === 'ps' ? 'شماره' : 'ID / Score'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredApps.slice(0, 5).map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => onNavigate(`/admin/students/${app.id}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-700 dark:text-slate-300">
                          {app.fullName ? app.fullName.charAt(0) : 'U'}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate max-w-[140px]">
                          {app.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        app.status === 'Approved'
                          ? 'bg-[#EBF9F1] text-[#1E7344] dark:bg-[#162B20] dark:text-[#7AE4A7]'
                          : app.status === 'Pending'
                          ? 'bg-[#FFF9EB] text-[#B27B13] dark:bg-[#2B2312] dark:text-[#FDD37B]'
                          : 'bg-[#FEECEB] text-[#D32F2F] dark:bg-[#2F1515] dark:text-[#F87171]'
                      }`}>
                        {app.status === 'Approved' ? 'Completed' : app.status === 'Pending' ? 'In progress' : app.status}
                      </span>
                    </td>

                    <td className="py-2.5 text-slate-400 dark:text-slate-500 font-mono text-[10px]">
                      {new Date(app.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="py-2.5 text-end font-bold text-slate-900 dark:text-white font-mono text-[11px]">
                      {app.studentCardId || `HU-${app.id.toString().slice(-4)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
