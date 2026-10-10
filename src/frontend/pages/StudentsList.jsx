import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Trash2,
  RefreshCw,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import StatusBadge from '../components/StatusBadge.jsx';
import StudentCard from '../components/StudentCard.jsx';
import { useLanguage } from '../controllers/LanguageContext.jsx';

export default function StudentsList({ onNavigate, apiService, initialStatus, currentRoute }) {
  const { t, lang } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus || 'All');
  const [facultyFilter, setFacultyFilter] = useState('All');

  // Interactive Modal & Toast States
  const [actionModal, setActionModal] = useState(null); // { type: 'approve'|'reject'|'delete'|'correction', app: object }
  const [modalNote, setModalNote] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', title: string, message: string }

  // Synchronize status & faculty filters if route or initialStatus prop changes from sidebar/dashboard navigation
  useEffect(() => {
    if (initialStatus) {
      setStatusFilter(initialStatus);
    }
    if (currentRoute) {
      const queryPart = currentRoute.includes('?') ? currentRoute.split('?')[1] : '';
      const params = new URLSearchParams(queryPart);
      const urlStatus = params.get('status');
      const urlFaculty = params.get('faculty');

      if (urlStatus) {
        setStatusFilter(urlStatus);
      } else if (!initialStatus) {
        setStatusFilter('All');
      }

      if (urlFaculty) {
        setFacultyFilter(urlFaculty);
      }
    }
  }, [initialStatus, currentRoute]);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.admin.getApplications();
      setApplications(data || []);
    } catch (err) {
      setError(err.message || 'Failed to populate student registry list.');
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleOpenModal = useCallback((app, actionType) => {
    setActionModal({ type: actionType, app });
    setModalNote(
      actionType === 'approve'
        ? (lang === 'fa' ? 'تمام اسناد و مدارک محصل تایید و شمولیت ایشان قطعی گردید.' : lang === 'ps' ? 'ټول اسناد تایید شول او شمولیت قطعي شو.' : 'All requirements satisfied. Enrollment officially approved.')
        : actionType === 'reject'
        ? (lang === 'fa' ? 'مدارک ارائه شده شرایط پذیرش دانشگاه را برآورده نمی‌کند.' : lang === 'ps' ? 'وړاندې شوي اسناد د داخلې شرایط نه پوره کوي.' : 'Application credentials do not meet enrollment standards.')
        : actionType === 'correction'
        ? (lang === 'fa' ? 'لطفاً اسکن تذکره و شهادتنامه خود را مجدداً به صورت واضح آپلود نمایید.' : lang === 'ps' ? 'مهرباني وکړئ د تذکرې او شهادتنامې واضح کاپي بېرته اپلوډ کړئ.' : 'Please re-upload legible Tazkira and Certificate scans.')
        : ''
    );
  }, [lang]);

  const handleConfirmAction = useCallback(async () => {
    if (!actionModal || !actionModal.app) return;
    const { type, app } = actionModal;

    setSubmittingAction(true);
    try {
      if (type === 'delete') {
        await apiService.admin.deleteApplication(app.id);
        setToast({
          type: 'success',
          title: lang === 'fa' ? 'حذف دوسیه محصل' : lang === 'ps' ? 'د محصل دوسیه حذف شوه' : 'Student Record Deleted',
          message: lang === 'fa' ? `دوسیه شمولیت ${app.fullName} با موفقیت حذف شد.` : `Enrollment record for ${app.fullName} was permanently deleted.`,
        });
      } else {
        const targetStatus =
          type === 'approve'
            ? 'Approved'
            : type === 'reject'
            ? 'Rejected'
            : 'Need Correction';

        await apiService.admin.updateStatus(app.id, {
          status: targetStatus,
          adminNote: modalNote.trim() || `Status set to ${targetStatus}`,
        });

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('uniport_student_status_updated', { detail: { id: app.id, status: targetStatus } }));
        }

        setToast({
          type: 'success',
          title:
            targetStatus === 'Approved'
              ? (lang === 'fa' ? 'پذیرش تایید گردید' : lang === 'ps' ? 'شمولیت تایید شو' : 'Enrollment Approved')
              : targetStatus === 'Rejected'
              ? (lang === 'fa' ? 'درخواست رد شد' : lang === 'ps' ? 'غوښتنه رد شوه' : 'Application Rejected')
              : (lang === 'fa' ? 'ارسال جهت اصلاح اسناد' : lang === 'ps' ? 'د اسنادو سمون غوښتنه' : 'Correction Required'),
          message:
            lang === 'fa'
              ? `وضعیت ${app.fullName} به [${targetStatus}] تغییر یافت.`
              : `Status for ${app.fullName} updated to [${targetStatus}].`,
        });
      }

      setActionModal(null);
      setModalNote('');
      await loadStudents();
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      setToast({
        type: 'error',
        title: lang === 'fa' ? 'خطا در انجام عملیات' : 'Operation Failed',
        message: err.message || 'Error executing administrative database sync.',
      });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setSubmittingAction(false);
    }
  }, [actionModal, apiService, modalNote, lang, loadStudents]);

  // 4 Official University Faculties with complete localization and keyword matching
  const OFFICIAL_FACULTIES = useMemo(
    () => [
      {
        id: 'Dentistry',
        name: lang === 'fa' ? 'طب دندان (ستوماتولوژی)' : lang === 'ps' ? 'د غاښونو طب (ستوماتولوژي)' : 'Dentistry',
        matchKeywords: ['dentist', 'stomatolog', 'دندان', 'ستوماتولوژی', 'طب دندان'],
      },
      {
        id: 'Computer Science',
        name: lang === 'fa' ? 'کمپیوتر ساینس' : lang === 'ps' ? 'کمپیوټر ساینس' : 'Computer Science',
        matchKeywords: ['computer', 'information technology', 'software', 'کمپیوتر', 'کامپیوتر', 'سافت', 'معلوماتی'],
      },
      {
        id: 'Law Faculty',
        name: lang === 'fa' ? 'حقوق و علوم سیاسی' : lang === 'ps' ? 'حقوق او سیاسي علوم' : 'Law Faculty',
        matchKeywords: ['law', 'حقوق', 'قضا', 'سیاسی'],
      },
      {
        id: 'Pharmacy',
        name: lang === 'fa' ? 'پوهنځی فارمسی' : lang === 'ps' ? 'د فارمسۍ پوهنځی' : 'Faculty of Pharmacy',
        matchKeywords: ['pharmacy', 'pharmac', 'دارو', 'فارمسی', 'فارمس'],
      },
    ],
    [lang]
  );

  const formatFaculty = useCallback(
    (rawFaculty) => {
      if (!rawFaculty) return '';
      const lower = rawFaculty.toLowerCase().trim();
      const matched = OFFICIAL_FACULTIES.find(
        (f) => f.id.toLowerCase() === lower || f.matchKeywords.some((k) => lower.includes(k))
      );
      return matched ? matched.name : rawFaculty;
    },
    [OFFICIAL_FACULTIES]
  );

  // Counts for each of the 4 official faculties + total
  const facultyCounts = useMemo(() => {
    const countsMap = { All: applications.length };
    OFFICIAL_FACULTIES.forEach((of) => {
      countsMap[of.id] = applications.filter((app) => {
        const fac = (app.faculty || '').toLowerCase().trim();
        return fac === of.id.toLowerCase() || of.matchKeywords.some((k) => fac.includes(k));
      }).length;
    });
    return countsMap;
  }, [OFFICIAL_FACULTIES, applications]);

  // Combined faculty filter list: guarantees all 4 faculties are present
  const facultyOptions = useMemo(() => {
    const list = OFFICIAL_FACULTIES.map((f) => ({
      id: f.id,
      name: f.name,
      count: facultyCounts[f.id] || 0,
      label:
        lang === 'fa'
          ? `دانشکده: ${f.name} (${facultyCounts[f.id] || 0})`
          : lang === 'ps'
          ? `پوهنځی: ${f.name} (${facultyCounts[f.id] || 0})`
          : `Faculty: ${f.name} (${facultyCounts[f.id] || 0})`,
    }));

    // If there are legacy/custom faculties in DB not covered by the 4, add them
    const appFaculties = new Set(applications.map((a) => a.faculty).filter(Boolean));
    appFaculties.forEach((fac) => {
      const isHandled = OFFICIAL_FACULTIES.some(
        (of) => of.id.toLowerCase() === fac.toLowerCase() || of.matchKeywords.some((k) => fac.toLowerCase().includes(k))
      );
      if (!isHandled && !list.some((item) => item.id === fac)) {
        const count = applications.filter((a) => a.faculty === fac).length;
        list.push({
          id: fac,
          name: fac,
          count,
          label:
            lang === 'fa'
              ? `دانشکده: ${fac} (${count})`
              : lang === 'ps'
              ? `پوهنځی: ${fac} (${count})`
              : `Faculty: ${fac} (${count})`,
        });
      }
    });

    return list;
  }, [OFFICIAL_FACULTIES, facultyCounts, applications, lang]);

  const counts = useMemo(() => {
    const result = {
      All: applications.length,
      Approved: 0,
      Pending: 0,
      'Need Correction': 0,
      Rejected: 0,
    };
    for (const a of applications) {
      if (result[a.status] !== undefined) {
        result[a.status]++;
      }
    }
    return result;
  }, [applications]);

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return applications.filter((app) => {
      const cardId = app.studentCardId || `HU-${app.admissionYear || '2026'}-${app.id.substring(0, 5).toUpperCase()}`;
      const matchesSearch =
        !q ||
        (app.fullName && app.fullName.toLowerCase().includes(q)) ||
        (app.phone && app.phone.includes(q)) ||
        (app.department && app.department.toLowerCase().includes(q)) ||
        cardId.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

      let matchesFaculty = true;
      if (facultyFilter !== 'All') {
        const appFac = (app.faculty || '').toLowerCase().trim();
        const targetFac = facultyFilter.toLowerCase().trim();
        if (appFac === targetFac) {
          matchesFaculty = true;
        } else {
          const selectedObj = OFFICIAL_FACULTIES.find((f) => f.id === facultyFilter);
          if (selectedObj) {
            matchesFaculty = selectedObj.matchKeywords.some((k) => appFac.includes(k));
          } else {
            matchesFaculty = appFac.includes(targetFac);
          }
        }
      }

      return matchesSearch && matchesStatus && matchesFaculty;
    });
  }, [applications, searchQuery, statusFilter, facultyFilter, OFFICIAL_FACULTIES]);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
        <span>{lang === 'fa' ? 'در حال دریافت اطلاعات دیتابیس...' : lang === 'ps' ? 'له ډیټابیس څخه د معلوماتو ترلاسه کولو په حال کې...' : 'Loading registered student files from DB...'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 pointer-events-none"
          >
            <div
              className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-xl pointer-events-auto ${
                toast.type === 'error'
                  ? 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-900/30'
                  : 'bg-slate-900/95 border-emerald-500/40 text-emerald-100 shadow-emerald-900/30'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${toast.type === 'error' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {toast.type === 'error' ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <h4 className="text-xs font-bold">{toast.title}</h4>
                <p className="text-[11px] opacity-90 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6 text-slate-800 dark:text-slate-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{t('registryHead')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">{t('registrySub')}</p>
          </div>
          <button
            onClick={loadStudents}
            className="px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer flex items-center gap-1.5 font-bold transition-all whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t('reloadSet')}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-rose-700 dark:text-rose-300 font-semibold text-xs transition-colors">
            {error}
          </div>
        )}

        {/* Status Filter Tab Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'All'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>{t('filterAllStatus')}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              statusFilter === 'All' ? 'bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {counts.All}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'Approved'
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{t('filterApproved')}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              statusFilter === 'Approved' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
            }`}>
              {counts.Approved}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'Pending'
                ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/30'
                : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200/60 dark:border-amber-800/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>{t('filterPending')}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              statusFilter === 'Pending' ? 'bg-amber-600 text-white' : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
            }`}>
              {counts.Pending}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Need Correction')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'Need Correction'
                ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/30'
                : 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200/60 dark:border-blue-800/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>{t('filterCorrection')}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              statusFilter === 'Need Correction' ? 'bg-blue-700 text-white' : 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'
            }`}>
              {counts['Need Correction']}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Rejected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'Rejected'
                ? 'bg-rose-600 text-white shadow-xs shadow-rose-600/30'
                : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200/60 dark:border-rose-800/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>{t('filterRejected')}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              statusFilter === 'Rejected' ? 'bg-rose-700 text-white' : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
            }`}>
              {counts.Rejected}
            </span>
          </button>
        </div>

        {/* Filters and search box panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pb-2">
          {/* Fuzzy Search */}
          <div className="md:col-span-5 relative">
            <Search className={`absolute ${lang === 'fa' || lang === 'ps' ? 'right-3' : 'left-3'} top-3 text-slate-400 w-4 h-4`} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${lang === 'fa' || lang === 'ps' ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1.5 focus:ring-indigo-500 transition-all`}
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:ring-1.5 focus:ring-indigo-500 cursor-pointer transition-colors duration-200"
            >
              <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{t('filterAllStatus')}</option>
              <option value="Pending" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{t('filterPending')}</option>
              <option value="Approved" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{t('filterApproved')}</option>
              <option value="Need Correction" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{t('filterCorrection')}</option>
              <option value="Rejected" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{t('filterRejected')}</option>
            </select>
          </div>

          {/* Faculty Filter */}
          <div className="md:col-span-4">
            <select
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:ring-1.5 focus:ring-indigo-500 cursor-pointer transition-colors duration-200 font-medium"
            >
              <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {t('filterAllFaculties')} ({applications.length})
              </option>
              {facultyOptions.map((fac) => (
                <option key={fac.id} value={fac.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {fac.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile & Tablet Card View (Single Card Per Row for optimal readability) */}
        <div className="block lg:hidden space-y-3.5">
          {filteredApps.length > 0 ? (
            <div className="flex flex-col space-y-3.5">
              {filteredApps.map((app) => (
                <div key={app.id} className="w-full animate-fade-in">
                  <StudentCard
                    application={app}
                    onView={(id) => onNavigate(`/admin/students/${id}`)}
                    onStatusUpdate={(student, newStatus) => handleOpenModal(student, newStatus === 'Approved' ? 'approve' : 'reject')}
                    onDelete={(student) => handleOpenModal(student, 'delete')}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 font-medium glass-panel rounded-2xl">
              No student registration files found matching specified filter selection.
            </div>
          )}
        </div>

        {/* Desktop-first Widescreen Table View */}
        <div className="hidden lg:block border border-slate-200/50 dark:border-blue-900/30 rounded-2xl overflow-hidden glass-panel">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-right md:text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-200 dark:border-slate-800/80 select-none text-right md:text-left font-sans">
                  <th className={`py-3 px-4 ${lang === 'fa' || lang === 'ps' ? 'text-right' : 'text-left'}`}>{t('tableHeaderDetails')}</th>
                  <th className={`py-3 px-4 ${lang === 'fa' || lang === 'ps' ? 'text-right' : 'text-left'}`}>{t('tableHeaderFaculty')}</th>
                  <th className={`py-3 px-4 ${lang === 'fa' || lang === 'ps' ? 'text-right' : 'text-left'}`}>{t('tableHeaderStatus')}</th>
                  <th className={`py-3 px-4 ${lang === 'fa' || lang === 'ps' ? 'text-right' : 'text-left'}`}>{t('tableHeaderDate')}</th>
                  <th className={`py-3 px-4 ${lang === 'fa' || lang === 'ps' ? 'text-left' : 'text-right'}`}>{t('tableHeaderAction')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300">
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors animate-fade-in">
                      <td className={`py-3.5 px-4 font-semibold text-slate-900 dark:text-white ${lang === 'fa' || lang === 'ps' ? 'text-right' : 'text-left'}`}>
                        <div className="space-y-0.5">
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{app.fullName}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">
                            {lang === 'fa' ? 'ولد: ' : lang === 'ps' ? 'د پلار نوم: ' : 's/o '} {app.fatherName} | <span dir="ltr" className="inline-block">{app.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className={`py-3.5 px-4 ${lang === 'fa' || lang === 'ps' ? 'text-right' : 'text-left'}`}>
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{formatFaculty(app.faculty)}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{app.department}</div>
                        </div>
                      </td>
                      <td className={`py-3.5 px-4 ${lang === 'fa' || lang === 'ps' ? 'text-right' : 'text-left'}`}>
                        <StatusBadge status={app.status} />
                      </td>
                      <td className={`py-3.5 px-4 font-mono text-slate-400 dark:text-slate-500 ${lang === 'fa' || lang === 'ps' ? 'text-right' : 'text-left'}`}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className={`flex items-center gap-2 ${lang === 'fa' || lang === 'ps' ? 'justify-start' : 'justify-end'}`}>
                          <button
                            onClick={() => onNavigate(`/admin/students/${app.id}`)}
                            className="p-1.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer text-[11px] font-bold inline-flex items-center gap-1.5 leading-none"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {t('actionReview')}
                          </button>

                          <button
                            onClick={() => handleOpenModal(app, 'approve')}
                            className="p-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all cursor-pointer text-[11px] font-black leading-none inline-block shadow shadow-emerald-500/10 active:scale-95"
                          >
                            {t('actionApprove')}
                          </button>

                          <button
                            onClick={() => handleOpenModal(app, 'reject')}
                            className="p-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all cursor-pointer text-[11px] font-black leading-none inline-block shadow shadow-rose-500/10 active:scale-95"
                          >
                            {t('actionReject')}
                          </button>

                          <button
                            onClick={() => handleOpenModal(app, 'delete')}
                            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                            title={lang === 'fa' ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-medium whitespace-normal">
                      No student registration files found matching specified filter selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Counter footer indicator */}
        <div className={`flex items-center justify-between text-[10px] text-slate-400 font-bold select-none px-1 ${lang === 'fa' || lang === 'ps' ? 'flex-row-reverse' : ''}`}>
          <span>
            {lang === 'fa'
              ? `تعداد کل ثبت‌نام‌ها: ${filteredApps.length} متقاضی`
              : lang === 'ps'
              ? `د ټولو نوم لیکنو شمیر: ${filteredApps.length} تنه`
              : `Active Registry Items: ${filteredApps.length} student files`}
          </span>
          <span>
            {lang === 'fa'
              ? 'دیپارتمنت پذیرش دانشگاه هریوا'
              : lang === 'ps'
              ? 'د هریوا پوهنتون د قبلیدو څانګه'
              : 'Hariwa University Admissions Division'}
          </span>
        </div>
      </div>

      {/* Custom Administrative Action Confirmation Modal */}
      <AnimatePresence>
        {actionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-2xl ${
                    actionModal.type === 'approve'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : actionModal.type === 'reject' || actionModal.type === 'delete'
                      ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  }`}>
                    {actionModal.type === 'approve' ? <CheckCircle2 className="w-5 h-5" /> :
                     actionModal.type === 'delete' ? <Trash2 className="w-5 h-5" /> :
                     <XCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {actionModal.type === 'approve'
                        ? (lang === 'fa' ? 'قبول کردن و تایید شمولیت محصل' : lang === 'ps' ? 'د محصل د شمولیت تایید' : 'Approve Student Admission')
                        : actionModal.type === 'reject'
                        ? (lang === 'fa' ? 'رد کردن اسناد و دوسیه محصل' : lang === 'ps' ? 'د محصل د اسنادو ردول' : 'Reject Student Documents')
                        : actionModal.type === 'delete'
                        ? (lang === 'fa' ? 'حذف دایمی دوسیه محصل' : lang === 'ps' ? 'د محصل د دوسیې دایمي حذف' : 'Permanently Delete File')
                        : (lang === 'fa' ? 'درخواست اصلاح اسناد' : 'Request File Correction')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {actionModal.app.fullName} ({actionModal.app.faculty} - {actionModal.app.department})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActionModal(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {actionModal.type !== 'delete' ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {lang === 'fa' ? 'یادداشت اداری / علت تصمیم:' : lang === 'ps' ? 'اداري یادښت / د پرېکړې دلیل:' : 'Administrative Note / Decision Reason:'}
                  </label>
                  <textarea
                    value={modalNote}
                    onChange={(e) => setModalNote(e.target.value)}
                    rows={3}
                    className="w-full text-xs font-medium p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-1.5 focus:ring-indigo-500 leading-relaxed text-slate-900 dark:text-slate-100"
                    placeholder={lang === 'fa' ? 'توضیحات لازم برای محصل بگذارید...' : 'Enter administrative note...'}
                  />
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 text-xs font-semibold leading-relaxed">
                  {lang === 'fa'
                    ? `آیا اطمینان کامل دارید که می‌خواهید پرونده محصلی (${actionModal.app.fullName}) را به طور کامل از دیتابیس پاک کنید؟ این عملیات غیرقابل بازگشت است.`
                    : `Are you certain you want to permanently remove ${actionModal.app.fullName}'s enrollment record from the system database? This action cannot be undone.`}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  disabled={submittingAction}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  {lang === 'fa' ? 'انصراف' : lang === 'ps' ? 'بندول' : 'Cancel'}
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAction}
                  disabled={submittingAction}
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    actionModal.type === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                      : actionModal.type === 'delete' || actionModal.type === 'reject'
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                      : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                  }`}
                >
                  {submittingAction && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {actionModal.type === 'approve'
                      ? (lang === 'fa' ? 'تایید و ثبت شمولیت' : lang === 'ps' ? 'تایید او ثبتول' : 'Confirm Approval')
                      : actionModal.type === 'delete'
                      ? (lang === 'fa' ? 'حذف دایمی' : lang === 'ps' ? 'دایمي حذف' : 'Confirm Delete')
                      : (lang === 'fa' ? 'ثبت تغییر وضعیت' : 'Apply Decision')}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
