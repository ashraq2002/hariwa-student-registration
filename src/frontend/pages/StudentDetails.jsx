import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Compass,
  FileText,
  MapPin,
  Phone,
  ShieldCheck,
  User as UserIcon,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge.jsx';
import { useLanguage } from '../controllers/LanguageContext.jsx';

export default function StudentDetails({ id, onBack, apiService }) {
  const { t, lang } = useLanguage();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Administrative feedback notes & state toggles
  const [noteText, setNoteText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [toast, setToast] = useState(null);

  const loadDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.admin.getApplicationDetails(id);
      setApplication(data);
      if (data) {
        setNoteText(data.adminNote || '');
      }
    } catch (err) {
      setError(err.message || 'Verification details inaccessible or invalid index key.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id, apiService]);

  const handleStatusChange = async (newStatus) => {
    if (!application) return;
    
    setError(null);
    setActionSuccess(null);
    setActionLoading(true);

    try {
      const data = await apiService.admin.updateStatus(application.id, {
        status: newStatus,
        adminNote: noteText.trim() || `Workflow updated to state: ${newStatus}`,
      });
      setApplication(data.application);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('uniport_student_status_updated', { detail: data.application }));
      }

      // Determine localized title and message for the pop up
      let toastTitle = '';
      let toastMsg = '';
      if (newStatus === 'Approved') {
        if (lang === 'fa') {
          toastTitle = 'تایید پذیرش دانشگاه';
          toastMsg = 'درخواست شمولیت دانشجو با موفقیت تایید و نهایی گردید.';
        } else if (lang === 'ps') {
          toastTitle = 'د پوهنتون د داخلې تایید';
          toastMsg = 'د زده کوونکي د داخلې فورمه په بریالیتوب سره تایید شوه.';
        } else {
          toastTitle = 'ASU Admission Approved';
          toastMsg = 'The student has been successfully approved for university admission.';
        }
      } else if (newStatus === 'Need Correction') {
        if (lang === 'fa') {
          toastTitle = 'درخواست اصلاح اسناد';
          toastMsg = 'فورم ثبت‌نام جهت اصلاح مدارک با موفقیت نشانه‌گذاری شد.';
        } else if (lang === 'ps') {
          toastTitle = 'د اسنادو د سمون غوښتنه';
          toastMsg = 'د ثبت فورمه د اسنادو د سمون لپاره په نښه شوه.';
        } else {
          toastTitle = 'Correction Requested';
          toastMsg = 'The registration form was flagged for correction successfully.';
        }
      } else if (newStatus === 'Rejected') {
        if (lang === 'fa') {
          toastTitle = 'رد درخواست پذیرش';
          toastMsg = 'این فورم شمولیت با موفقیت رد و ابطال گردید.';
        } else if (lang === 'ps') {
          toastTitle = 'د داخلې غوښتنې ردول';
          toastMsg = 'دغه فورمه د ارزونې له مخې رد او باطله شوه.';
        } else {
          toastTitle = 'Admission Rejected';
          toastMsg = 'This application has been declined and rejected.';
        }
      }

      setToast({
        type: newStatus,
        title: toastTitle,
        message: toastMsg,
      });

      setActionSuccess(
        lang === 'fa' 
          ? `وضعیت متقاضی با موفقیت به [${newStatus}] تغییر یافت!` 
          : `Applicant status changed securely to [${newStatus}]!`
      );
      setTimeout(() => setActionSuccess(null), 3000);
      setTimeout(() => setToast(null), 4500);
    } catch (err) {
      setError(err.message || 'Status transaction error.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
        <span>{lang === 'fa' ? 'در حال بازیابی فایل متقاضی...' : lang === 'ps' ? 'د غوښتونکي د دوسیې د ترلاسه کولو په حال کې...' : 'Decrypting registry index details...'}</span>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h4 className="font-bold text-slate-900 text-sm">Enrollment File Unresolved</h4>
        <p className="text-slate-500 text-xs">
          The requested path index parameter matches no record inside ASU admissions database.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow cursor-pointer mx-auto block hover:bg-indigo-700"
        >
          {t('returnRegistry')}
        </button>
      </div>
    );
  }

  const renderDocumentPreview = (docSource, title) => {
    if (!docSource) {
      return (
        <div className="h-56 bg-zinc-50/50 dark:bg-zinc-900/20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center text-[11px] text-zinc-400 dark:text-zinc-500 select-none">
          {lang === 'fa' ? 'هیچ فایلی برای این مدرک آپلود نشده است.' : lang === 'ps' ? 'د دې سند لپاره هیڅ فایل نه دی اپلوډ شوی.' : 'No document file was submitted/uploaded.'}
        </div>
      );
    }

    if (docSource.startsWith('data:image')) {
      return (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 hover:shadow-sm transition-shadow h-56 flex items-center justify-center relative p-2">
          <img src={docSource} alt={title} className="max-h-full max-w-full object-contain" />
          <a
            href={docSource}
            download={`document_${title.replace(/\s+/g, '_').toLowerCase()}.png`}
            className={`absolute bottom-2 ${lang === 'fa' || lang === 'ps' ? 'left-2' : 'right-2'} bg-slate-900 hover:bg-blue-600 text-white font-bold p-1 px-2.5 rounded-lg text-[9px] shadow block transition-colors leading-normal cursor-pointer`}
          >
            {lang === 'fa' ? 'ذخیره مدارک' : lang === 'ps' ? 'د موندنې خوندي کول' : 'Save File'}
          </a>
        </div>
      );
    }

    // Is simple textual URL or description
    return (
      <div className="bg-zinc-50/50 dark:bg-zinc-900/25 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl p-4 h-56 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-1.5">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase select-none block font-sans">
            DOCUMENT METADATA / LINK
          </span>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-mono break-all leading-relaxed whitespace-pre-line bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-800/80 rounded-lg max-h-[110px] overflow-y-auto">
            {docSource}
          </p>
        </div>
        
        {docSource.startsWith('http') && (
          <a
            href={docSource}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1"
          >
            {lang === 'fa' ? 'باز کردن لینک مدرک تحصیلی ↗' : lang === 'ps' ? 'د علمي اسنادو د خلاصېدو لینک ↗' : 'Open External Resource link ↗'}
          </a>
        )}
      </div>
    );
  };

  const initials = application.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'S';

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-bold transition-colors cursor-pointer group"
      >
        <ArrowLeft className={`w-4 h-4 transition-transform ${lang === 'fa' || lang === 'ps' ? 'group-hover:translate-x-1 rotate-180' : 'group-hover:-translate-x-1'}`} />
        {t('returnRegistry')}
      </button>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* 1. Header Card (Profile details) */}
        <div className="xl:col-span-8">
          <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xl select-none">
                {application.photo && application.photo.startsWith('http') ? (
                  <img src={application.photo} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  initials
                )}
              </div>

              <div className={lang === 'fa' || lang === 'ps' ? 'text-right' : 'text-left'}>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">{application.fullName}</h2>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 block mt-0.5 font-semibold">
                  {lang === 'fa' ? `فرزند: ${application.fatherName}` : lang === 'ps' ? `د ${application.fatherName} ولد` : `s/o ${application.fatherName}`}
                </span>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase select-none font-sans">
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold text-xs">ID: {application.studentCardId || `HU-${application.admissionYear || '2026'}-${application.id ? application.id.substring(0, 5).toUpperCase() : 'REG'}`}</span>
                  <span>•</span>
                  <span>Batch: Autumn ASU-26</span>
                  <span>•</span>
                  <span>Admiss. Year: {application.admissionYear}</span>
                </div>
              </div>
            </div>

            <div className={lang === 'fa' || lang === 'ps' ? 'text-right sm:text-left' : 'text-left sm:text-right'}>
              <StatusBadge status={application.status} />
              <span className="text-[10px] block text-zinc-400 dark:text-zinc-500 font-mono mt-1 select-none font-sans">
                Logged: {new Date(application.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Demographic Parameters Table */}
        <div className="xl:col-span-8">
          <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4 h-full">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 select-none pb-2 border-b border-zinc-150 dark:border-zinc-800/80">
              {lang === 'fa' ? 'مشخصات دوسیه تحصیلی متقاضی' : lang === 'ps' ? 'د غوښتونکي د شمولیت دوسیې مشخصات' : 'Student Registration Profile Parameters'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase block select-none">{t('faculty')}</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                  {application.faculty}
                </span>
              </div>

              <div className="p-3.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase block select-none">{t('department')}</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {application.department}
                </span>
              </div>

              <div className="p-3.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase block select-none">{t('phone')}</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                  <span dir="ltr" className="inline-block">{application.phone}</span>
                </span>
              </div>

              <div className="p-3.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase block select-none">{t('address')}</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                  {application.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Action Board (Approve/Reject Sidebar Panel with Corrected Button Colors!) */}
        {/* On desktop, spans 3 rows vertically on the right. On tablet, sits beautifully side-by-side with demographics. On mobile, stacks neatly. */}
        <div className="xl:col-span-4 xl:row-span-3 xl:sticky xl:top-24">
          <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm tracking-tight border-b border-zinc-150 dark:border-zinc-800/80 pb-2.5">
              {lang === 'fa' ? 'میز قضات و ارزیابی سند' : lang === 'ps' ? 'د کوژدې او د اسنادو د ارزونې مېز' : 'Triage Decision Board'}
            </h3>

            {actionSuccess && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/30 p-3 rounded-xl text-emerald-800 dark:text-emerald-400 text-[11px] font-bold">
                {actionSuccess}
              </div>
            )}

            {/* Note Area Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase block select-none">
                {t('evalNotesLabel')}
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={t('evalNotesPlaceholder')}
                className="w-full text-xs font-medium p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:bg-white dark:focus:bg-zinc-950 focus:outline-none focus:ring-1.5 focus:ring-blue-500 min-h-[120px] sm:min-h-[140px] leading-relaxed placeholder-zinc-400 dark:placeholder-zinc-600 text-zinc-900 dark:text-zinc-100 resize-y"
              ></textarea>
            </div>

            {/* Workflow update buttons arranged cleanly */}
            <div className="pt-3 border-t border-zinc-150 dark:border-zinc-800/80 space-y-2.5">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                {lang === 'fa' ? 'ثبت تصمیم نهایی هیئت پذیرش:' : lang === 'ps' ? 'د ارزونې وروستۍ پرېکړه:' : 'Admissions Decision Action:'}
              </span>

              <div className="flex flex-col gap-2 w-full">
                {/* 1. Approve Button */}
                <button
                  type="button"
                  onClick={() => handleStatusChange('Approved')}
                  disabled={actionLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-[13px] cursor-pointer flex items-center justify-center gap-2 shadow-xs shadow-emerald-600/20 transition-all hover:shadow-md hover:shadow-emerald-600/25 active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{t('actionApproveBtn')}</span>
                </button>

                {/* 2. Request Correction Button */}
                <button
                  type="button"
                  onClick={() => handleStatusChange('Need Correction')}
                  disabled={actionLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-[13px] cursor-pointer flex items-center justify-center gap-2 shadow-xs shadow-blue-600/20 transition-all hover:shadow-md hover:shadow-blue-600/25 active:scale-[0.98]"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{t('actionFlagBtn')}</span>
                </button>

                {/* 3. Reject Button */}
                <button
                  type="button"
                  onClick={() => handleStatusChange('Rejected')}
                  disabled={actionLoading}
                  className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-40 text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-[13px] cursor-pointer flex items-center justify-center gap-2 shadow-xs shadow-rose-600/20 transition-all hover:shadow-md hover:shadow-rose-600/25 active:scale-[0.98]"
                >
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{t('actionRejectBtn')}</span>
                </button>
              </div>
            </div>

            {/* Information tips */}
            <div className="p-3 bg-blue-50/40 dark:bg-blue-950/10 border border-blue-200/40 dark:border-blue-900/30 rounded-xl">
              <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold block uppercase tracking-widest select-none mb-0.5">
                {t('guidelineTitle')}
              </span>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal font-medium">
                {t('guidelineDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Document verification modules */}
        <div className="xl:col-span-8">
          <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 select-none border-b border-zinc-150 dark:border-zinc-800/80 pb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> {lang === 'fa' ? 'اسکن‌های آپلود شده متقاضی' : lang === 'ps' ? 'د غوښتونکي اپلوډ شوې تذکره او شهادتنامه' : 'Uploaded Document Verification Slates'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{t('photoLabel')}</h4>
                {renderDocumentPreview(application.photo, 'Student Photograph')}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{t('tazkiraLabel')}</h4>
                {renderDocumentPreview(application.tazkira, 'Tazkira Scan')}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{t('certLabel')}</h4>
                {renderDocumentPreview(application.certificate, 'Transcripts Scan')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Popup Notification Toast */}
      {toast && (
        <div className="fixed inset-x-0 top-6 z-50 flex items-start justify-center p-4 pointer-events-none transition-all duration-300">
          <div className={`bg-white dark:bg-slate-900 border rounded-2xl shadow-2xl p-4 max-w-sm w-full pointer-events-auto flex items-start gap-3.5 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 transition-all duration-300 border-l-4 ${
            toast.type === 'Approved' 
              ? 'border-emerald-500 shadow-emerald-500/10' 
              : toast.type === 'Need Correction' 
              ? 'border-indigo-500 shadow-indigo-500/10' 
              : 'border-rose-500 shadow-rose-500/10'
          } ${lang === 'fa' || lang === 'ps' ? 'text-right flex-row-reverse' : 'text-left'}`}>
            <div className={`p-2 rounded-xl shrink-0 ${
              toast.type === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' :
              toast.type === 'Need Correction' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' :
              'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
            }`}>
              {toast.type === 'Approved' ? <CheckCircle2 className="w-5 h-5" /> :
               toast.type === 'Need Correction' ? <AlertTriangle className="w-5 h-5 animate-bounce" /> :
               <XCircle className="w-5 h-5" />}
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">{toast.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-medium">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}