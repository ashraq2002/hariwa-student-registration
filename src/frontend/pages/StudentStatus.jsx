import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Award,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Printer,
  CheckCircle2,
  XCircle,
  Bell,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import StatusBadge from '../components/StatusBadge.jsx';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import universityLogo from '../../assets/images/hariwa_logo_1783225791176.jpg';

export default function StudentStatus({ apiService, onNavigate }) {
  const { t, lang } = useLanguage();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        setLoading(true);
        const data = await apiService.student.getStatus();
        setApplication(data);
      } catch (err) {
        setError(err.message || 'Failed to sync with admissions database registry.');
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, [apiService]);

  const handlePrint = async () => {
    const cardElement = document.getElementById('approved-enrollment-card');
    if (cardElement) {
      try {
        const canvas = await html2canvas(cardElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
          logging: false,
          onclone: (clonedDoc) => {
            // Fix html2canvas crashing on oklch/oklab color functions by replacing all occurrences in styles
            const styleElements = clonedDoc.getElementsByTagName('style');
            for (let i = 0; i < styleElements.length; i++) {
              const style = styleElements[i];
              if (style.textContent) {
                style.textContent = style.textContent
                  .replace(/oklch\([^)]+\)/g, 'rgb(100, 116, 139)')
                  .replace(/oklab\([^)]+\)/g, 'rgb(100, 116, 139)');
              }
            }

            // Also rewrite external link stylesheets if any to style blocks without oklch
            const linkElements = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
            linkElements.forEach(link => {
              try {
                const url = link.getAttribute('href');
                if (url) {
                  const xhr = new XMLHttpRequest();
                  xhr.open('GET', url, false); // synchronous GET request to ensure it blocks until loaded
                  xhr.send();
                  if (xhr.status === 200) {
                    const cssText = xhr.responseText
                      .replace(/oklch\([^)]+\)/g, 'rgb(100, 116, 139)')
                      .replace(/oklab\([^)]+\)/g, 'rgb(100, 116, 139)');
                    const style = clonedDoc.createElement('style');
                    style.textContent = cssText;
                    clonedDoc.head.appendChild(style);
                    link.remove();
                  }
                }
              } catch (e) {
                console.error('Error rewriting link stylesheet in clone:', e);
              }
            });
          }
        });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `Hariwa_Admission_Slip_${application?.fullName?.replace(/\s+/g, '_') || 'Student'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Error generating card screenshot:', err);
      }
    }
    window.print();
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'Approved':
        return {
          title: lang === 'fa' ? 'تبریک! اسناد شما تایید گردید' : lang === 'ps' ? 'مبارک شه! ستاسو اسناد تایید شول' : 'Congratulations! Admission Approved',
          desc: lang === 'fa' 
            ? 'مدارک و شهرت علمی شما با موفقیت توسط شعبات ثبت اسناد تایید گردید. کارت قبولی شما صادر شد.' 
            : lang === 'ps'
            ? 'ستاسو علمي اسناد او پیژندنه په بریالیتوب سره د داخلې څانګې لخوا تایید شول. ستاسو د قبلیدو کارت صادر شوی دی.'
            : 'Your credentials have been successfully verified by ASU Admissions. Find your enrollment card details below.',
          colorClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-150 dark:border-emerald-900/40',
        };
      case 'Pending':
        return {
          title: lang === 'fa' ? 'فورم تحت بررسی می‌باشد' : lang === 'ps' ? 'فورمه تر ارزونې لاندې ده' : 'Review in Progress',
          desc: lang === 'fa' 
            ? 'کارشناسان مربوطه در حال تطبیق نمرات شهادتنامه و مشخصات تذکره شما هستند. شکیبا باشید.' 
            : lang === 'ps'
            ? 'اړونده کارپوهان ستاسو د شهادتنامې نومرو او تذکرې په څیړلو بوخت دي. هیله ده صبر ولرئ.'
            : 'Registrar personnel are actively assessing transcripts and identification documents. Keep tracking this panel.',
          colorClass: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20 border-amber-150 dark:border-amber-900/40',
        };
      case 'Rejected':
        return {
          title: lang === 'fa' ? 'درخواست پذیرش رد گردید' : lang === 'ps' ? 'د داخلې غوښتنه رد شوه' : 'Application Rejected',
          desc: lang === 'fa' 
            ? 'متأسفانه اسناد ارسالی شما پس از تطبیق با شرایط عمومی پوهنتون رد گردیده است.' 
            : lang === 'ps'
            ? 'له بده مرغه ستاسو استول شوي اسناد د پوهنتون د عمومي شرایطو سره د نه همغږۍ له امله رد شوي دي.'
            : 'Your application was rejected as it did not fulfill threshold enrollment prerequisites.',
          colorClass: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40',
        };
      case 'Need Correction':
        return {
          title: lang === 'fa' ? 'نیاز به اصلاح اسناد' : lang === 'ps' ? 'د اسنادو اصلاح ته اړتیا شته' : 'Correction Action Required',
          desc: lang === 'fa' 
            ? 'برخی از معلومات ارسالی یا تصاویر آپلود شده ناقص یا ناخوانا هستند. لطفاً فوراً اصلاح کنید.' 
            : lang === 'ps'
            ? 'زموږ ارزونکي موندلې چې ځینې معلومات یا اسناد ناسم یا ناڅرګند دي. مهرباني وکړئ ژر تر ژره یې اصلاح کړئ.'
            : 'One or more of your documents or details are blurred, incomplete, or flawed. Apply corrections immediately.',
          colorClass: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40',
        };
      default:
        return {
          title: lang === 'fa' ? 'درخواستی ارسال نشده است' : lang === 'ps' ? 'هیڅ غوښتنه نه ده استول شوې' : 'Unsubmitted Application',
          desc: lang === 'fa' 
            ? 'هنوز هیچ فورم شمولیت علمی با حساب فعلی شما در دیتابیس ثبت نگردیده است.' 
            : lang === 'ps'
            ? 'تر اوسه ستاسو د اوسني حساب لپاره په ډیټابیس کې د داخلې هیڅ فورمه نه ده ثبت شوې.'
            : 'No registry enrollment profile is recorded for your logged credentials.',
          colorClass: 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800',
        };
    }
  };

  const activeStatusMsg = getStatusMessage(application?.status);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
        <span>{lang === 'fa' ? 'در حال هماهنگ‌سازی مراحل ثبت سند شما...' : lang === 'ps' ? 'ستاسو د اسنادو د پړاوونو تعقیب همغږي کېږي...' : 'Syncing academic verification milestones...'}</span>
      </div>
    );
  }

  // Define steps
  const steps = [
    { name: lang === 'fa' ? 'تکمیل فورم' : lang === 'ps' ? 'د فورمې بشپړول' : 'Profile Complete', done: !!application, active: !!application },
    { name: lang === 'fa' ? 'بارگذاری اسناد' : lang === 'ps' ? 'د اسنادو اپلوډ' : 'Document Indexing', done: !!application, active: !!application },
    { name: lang === 'fa' ? 'بررسی بورد پذیرش' : lang === 'ps' ? 'د منلو بورد بیاکتنه' : 'Admissions Review', done: application?.status !== 'Pending' && !!application, active: application?.status === 'Pending' },
    { name: lang === 'fa' ? 'تایید نهایی' : lang === 'ps' ? 'نهایي تایید' : 'Enrollment Confirmed', done: application?.status === 'Approved', active: application?.status === 'Approved' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/40 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">{t('milestoneHeader')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              {t('milestoneSub')}
            </p>
          </div>
          {application && <StatusBadge status={application.status} />}
        </div>

        {/* Milestone flowchart steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((st, i) => (
            <div
              key={st.name}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                st.done
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                  : st.active
                  ? 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-300 dark:border-amber-900/30 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/60 text-slate-400 dark:text-slate-500'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1 select-none font-sans">
                {lang === 'fa' ? `مرحله ۰${i + 1}` : lang === 'ps' ? `پړاو ۰${i + 1}` : `STEP 0${i + 1}`}
              </div>
              <h4 className="text-xs font-bold leading-normal">{st.name}</h4>
              <span className="text-[9px] font-black mt-1 inline-block">
                {st.done 
                  ? (lang === 'fa' ? '✓ موفق' : lang === 'ps' ? '✓ بشپړ شوی' : '✓ Completed') 
                  : st.active 
                  ? (lang === 'fa' ? '● در جریان' : lang === 'ps' ? '● په جریان کې' : '● Processing') 
                  : (lang === 'fa' ? '○ در انتظار' : lang === 'ps' ? '○ بند/تړل شوی' : '○ Locked')}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic callout box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`p-5 rounded-2xl border shadow-md relative overflow-hidden flex items-start gap-3.5 ${activeStatusMsg.colorClass}`}
        >
          <div className="p-2 rounded-xl bg-white/40 dark:bg-black/30 border border-current/20 shrink-0">
            {application?.status === 'Approved' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : application?.status === 'Rejected' ? (
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            ) : application?.status === 'Need Correction' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm tracking-tight">{activeStatusMsg.title}</h3>
              {application?.status === 'Approved' && (
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              )}
            </div>
            <p className="text-xs leading-relaxed">{activeStatusMsg.desc}</p>
          </div>
        </motion.div>

        {/* Admin Notes Section */}
        {application && (
          <div className="p-5 bg-gradient-to-r from-blue-950/70 to-indigo-950/60 dark:from-slate-900/60 dark:to-slate-800/40 text-slate-200 dark:text-slate-300 border border-blue-900/30 dark:border-slate-800 rounded-2xl space-y-3 backdrop-blur-md">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5 sans-bold">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> {lang === 'fa' ? 'یادداشت رسمی کمیته ارزیابی سند:' : lang === 'ps' ? 'د اسنادو د ارزونې رسمي یادښت:' : 'OFFICIAL EVALUATION NOTES:'}
            </h4>
            <p className="text-xs italic leading-relaxed text-slate-350 dark:text-slate-400">
              "{application.adminNote || (lang === 'fa' ? 'در انتظار شروع پروسه انطباق فیزیکی اسناد در مکتب پذیرش.' : lang === 'ps' ? 'د اسنادو د تایید لړۍ د پیل کیدو په تمه.' : 'Awaiting initial physical registry triage queue indexing.')}"
            </p>
          </div>
        )}

        {/* Detailed Application metadata */}
        {application ? (
          <div className="space-y-6">
            {application.status === 'Approved' ? (
              <div className="space-y-4">
                {/* Official Hariwa University Enrollment Slip/Card */}
                <div 
                  id="approved-enrollment-card" 
                  className="relative bg-white dark:bg-zinc-950 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-6 shadow-md overflow-hidden"
                >
                  {/* Elegant Background Watermark Seal */}
                  <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] flex items-center justify-center pointer-events-none select-none">
                    <img src={universityLogo} alt="Watermark" className="w-80 h-80 object-contain" />
                  </div>

                  {/* Card Header with Logo & Title */}
                  <div className="flex flex-row items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4 mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <img src={universityLogo} alt="Hariwa University" className="w-12 h-12 object-contain" />
                      <div>
                        <h3 className="font-sans font-black text-xs sm:text-sm tracking-tight text-slate-900 dark:text-zinc-100">
                          {lang === 'fa' ? 'پوهنتون هریوا' : lang === 'ps' ? 'هریوا پوهنتون' : 'HARIWA UNIVERSITY'}
                        </h3>
                        <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-wider">
                          {lang === 'fa' ? 'ریاست امور محصلان — دفتر پذیرش' : lang === 'ps' ? 'د محصلانو چارو ریاست — د منلو دفتر' : 'OFFICE OF ADMISSIONS — STUDENT AFFAIRS'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-block px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 rounded-md text-[9px] font-black uppercase tracking-widest">
                        {lang === 'fa' ? 'تایید شد' : lang === 'ps' ? 'تایید شوی' : 'APPROVED'}
                      </div>
                      <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono mt-1 font-bold">ID: {application.studentCardId || `HU-${application.admissionYear || '2026'}-${application.id ? application.id.substring(0, 5).toUpperCase() : 'REG'}`}</p>
                    </div>
                  </div>

                  {/* Card Body with Student Photo & Personal Details */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center relative z-10">
                    {/* Student Photo */}
                    <div className="w-24 h-28 bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm shrink-0 flex items-center justify-center self-center sm:self-start">
                      {application.photo ? (
                        <img src={application.photo} alt="Student" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="text-center p-2 text-slate-400">
                          <Award className="w-8 h-8 mx-auto opacity-40 text-indigo-500" />
                          <span className="text-[8px] font-bold block mt-1">NO PHOTO</span>
                        </div>
                      )}
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-2 gap-3.5 flex-1 text-xs font-semibold w-full">
                      <div className="space-y-0.5">
                        <span className="text-[8.5px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                          {lang === 'fa' ? 'نام و تخلص' : lang === 'ps' ? 'نوم او تخلص' : 'FULL NAME'}
                        </span>
                        <span className="font-extrabold text-slate-800 dark:text-zinc-100 text-sm">{application.fullName}</span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[8.5px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                          {lang === 'fa' ? 'نام پدر' : lang === 'ps' ? 'د پلار نوم' : 'FATHER\'S NAME'}
                        </span>
                        <span className="font-extrabold text-slate-800 dark:text-zinc-100 text-sm">{application.fatherName}</span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[8.5px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                          {lang === 'fa' ? 'دانشکده' : lang === 'ps' ? 'پوهنځی' : 'FACULTY'}
                        </span>
                        <span className="font-extrabold text-slate-800 dark:text-zinc-100">{application.faculty}</span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[8.5px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                          {lang === 'fa' ? 'دیپارتمنت / رشته' : lang === 'ps' ? 'څانګه / رشته' : 'DEPARTMENT'}
                        </span>
                        <span className="font-extrabold text-slate-800 dark:text-zinc-100">{application.department}</span>
                      </div>

                      <div className="space-y-0.5 col-span-2">
                        <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-900/60 pt-2.5 mt-1">
                          <div>
                            <span className="text-[8.5px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                              {lang === 'fa' ? 'سال پذیرش' : lang === 'ps' ? 'د منلو کال' : 'ACADEMIC BATCH'}
                            </span>
                            <span className="font-extrabold text-slate-800 dark:text-zinc-100">Year {application.admissionYear}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8.5px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                              {lang === 'fa' ? 'بارکد تصدیق' : lang === 'ps' ? 'د تایید کوډ' : 'VERIFICATION CODE'}
                            </span>
                            <span className="font-mono text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-widest block mt-0.5">
                              *{application.studentCardId || `HARIWA-${application.admissionYear}-${application.id ? application.id.substring(0, 5).toUpperCase() : 'REG'}`}*
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slip Footer with stamp and signature visual */}
                  <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800/60 pt-3.5 mt-4 flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 relative z-10">
                    <p className="font-semibold max-w-[240px] leading-normal text-slate-500 dark:text-slate-400">
                      {lang === 'fa' 
                        ? 'توجه: این کارت الکترونیکی سند رسمی ثبت‌نام موقت شما می‌باشد. لطفاً جهت انجام کارهای اداری، با این کارت به پوهنتون مراجعه نمایید.' 
                        : lang === 'ps' 
                        ? 'یادونه: دا بریښنایی کارت ستاسو د موقتي نوم لیکنې رسمي سند دی. مهرباني وکړئ د اداري کارونو لپاره، له دې کارت سره پوهنتون ته مراجعه وکړئ.' 
                        : 'Note: This digital card serves as official proof of academic registration. Please bring this card with you to the university for administrative processing.'}
                    </p>
                    <div className="text-center space-y-0.5 relative pr-4">
                      {/* Visual representation of a stamp / registrar signature */}
                      <div className="absolute -top-6 right-2 w-16 h-16 border-2 border-emerald-500/30 rounded-full flex items-center justify-center rotate-12 pointer-events-none select-none">
                        <span className="text-[7px] text-emerald-500/50 font-black tracking-widest uppercase">HARIWA REGISTRY</span>
                      </div>
                      <p className="font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Admissions Board</p>
                      <p className="text-[8px] font-mono">Date: {new Date(application.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Screenshot & Next Steps Notice */}
                <div className="glass-panel rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/10 dark:bg-indigo-950/10 space-y-3">
                  <div className="flex items-start gap-3.5">
                    <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-800 dark:text-zinc-100 uppercase tracking-wider">
                        {lang === 'fa' ? 'از کارت خود اسکرین‌شات بگیرید' : lang === 'ps' ? 'د خپل کارت څخه سکرین شاټ واخلئ' : 'Take a Screenshot of Your Card'}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                        {lang === 'fa' 
                          ? 'لطفاً از این صفحه اسکرین‌شات گرفته یا آن را ذخیره کنید و این کارت الکترونیکی را همراه خود داشته باشید. برای طی مراحل بعدی ثبت‌نام در پوهنتون، حضور به همراه این کارت الزامی است.' 
                          : lang === 'ps' 
                          ? 'مهرباني وکړئ د دې پاڼې څخه سکرین شاټ واخلئ یا یې خوندي کړئ او دا بریښنایي کارت له ځان سره وساتئ. په پوهنتون کې د نوم لیکنې د راتلونکي پړاو لپاره د دې کارت له ځان سره راوړل اړین دي.' 
                          : 'Please take a screenshot of this page or save it, and keep this digital enrollment card with you. You must bring this card with you to the university for the next stage of your registration.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none border-b border-slate-100 dark:border-slate-800/40 pb-2">
                  {lang === 'fa' ? 'خلاصه کارت شمولیت ثبت شده' : lang === 'ps' ? 'د شمولیت د ثبت شوي فورم لنډیز' : 'SUBMITTED PARAMETERS RECORD'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                  <div className="space-y-1 bg-zinc-100/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/80 p-3 rounded-xl shadow-sm">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">{t('fullName')}</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-100">{application.fullName}</span>
                  </div>
                  <div className="space-y-1 bg-zinc-100/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/80 p-3 rounded-xl shadow-sm">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">{t('fatherName')}</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-100">{application.fatherName}</span>
                  </div>
                  <div className="space-y-1 bg-zinc-100/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/80 p-3 rounded-xl shadow-sm">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">{lang === 'fa' ? 'رشته انتخابی' : lang === 'ps' ? 'غوښتل شوې رشته' : 'STREAM ALLOCATION'}</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-100">
                      {application.faculty} — {application.department}
                    </span>
                  </div>
                  <div className="space-y-1 bg-zinc-100/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/80 p-3 rounded-xl shadow-sm">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">{lang === 'fa' ? 'سمستر پذیرش' : lang === 'ps' ? 'تحصیلي سمستر' : 'ADMISSION BATCH'}</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-100">Year {application.admissionYear}</span>
                  </div>
                </div>

                {application.status === 'Need Correction' && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-indigo-50/20 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-pulse shrink-0" />
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300">{lang === 'fa' ? 'فوراً جزئیات را اصلاح کنید' : lang === 'ps' ? 'سمدسي معلومات اصلاح کړئ' : 'Resolve Status Immediately'}</h4>
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400/80">
                          {lang === 'fa' ? 'مدارک شهادتنامه یا تذکره را مجدداً با کیفیت خوب بارگذاری کنید.' : lang === 'ps' ? 'د شهادتنامې یا تذکرې اسناد بیا په ښه کیفیت سره اپلوډ کړئ.' : 'Re-verify document scans then submit update vectors.'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('/student/register-form')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer leading-none shadow-md shadow-indigo-600/10 transition-all active:scale-95 whitespace-nowrap"
                    >
                      {lang === 'fa' ? 'اصلاح فورمه پذیرش' : lang === 'ps' ? 'د داخلې فورمې اصلاح کول' : 'Modify Form Details'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800/80 rounded-2xl space-y-4">
            <HelpCircle className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <h4 className="font-semibold text-slate-700 dark:text-zinc-200 text-sm">{lang === 'fa' ? 'هیچ فورمی ثبت نشده است' : lang === 'ps' ? 'هیڅ فورمه نه ده ثبت شوې' : 'No Application Registered'}</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              {lang === 'fa' ? 'قبل از رهگیری مراحل ثبت‌نام، باید فورم شمولیت دانشگاه را خانه پوری کنید.' : lang === 'ps' ? 'مخکې لدې چې د ثبت لړۍ تعقیب کړئ، باید د پوهنتون د داخلې فورمه ډکه کړئ.' : 'Before you can see registration verification steps, you must submit the ASU enrollment parameters form.'}
            </p>
            <button
              onClick={() => onNavigate('/student/register-form')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
            >
              {t('goToForm')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
