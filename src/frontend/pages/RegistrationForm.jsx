import { useState, useEffect } from 'react';
import { 
  FileDown, 
  FileText, 
  Landmark, 
  ShieldCheck, 
  Upload, 
  User, 
  Phone, 
  MapPin, 
  Compass, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  Trash2, 
  Image as ImageIcon,
  X,
  GraduationCap,
  Calendar,
  Building2,
  ExternalLink,
  Award
} from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import ValidationTooltip from '../components/ValidationTooltip.jsx';
import { getPortalSettings } from '../models/settingsStore.js';
import { compressImage } from '../utils/imageCompressor.js';

export default function RegistrationForm({ apiService, onNavigate }) {
  const { t, lang } = useLanguage();
  const [portalSettings, setPortalSettings] = useState(() => getPortalSettings());
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phone, setPhone] = useState('');
  const [faculty, setFaculty] = useState('Computer Science');
  const [department, setDepartment] = useState('Software Engineering');
  const [admissionYear, setAdmissionYear] = useState('2026');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState('');
  const [tazkira, setTazkira] = useState('');
  const [certificate, setCertificate] = useState('');

  // Active validation tooltip popup state
  const [activeTooltip, setActiveTooltip] = useState(null); // { field: string, message: string }

  // Success Popup Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const [docErrors, setDocErrors] = useState({
    photo: false,
    tazkira: false,
    certificate: false,
  });

  const [dragOver, setDragOver] = useState({
    photo: false,
    tazkira: false,
    certificate: false,
  });

  const [compressingDoc, setCompressingDoc] = useState({
    photo: false,
    tazkira: false,
    certificate: false,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Faculties options
  const facultyDepartments = {
    'Dentistry': ['Dental Surgery', 'Orthodontics & Prosthodontics'],
    'Computer Science': ['Software Engineering', 'Database & Info Systems'],
    'Law Faculty': ['Public & International Law', 'Private Law & Judiciary'],
    'Pharmacy': ['Pharmaceutics & Medicinal Chemistry', 'Pharmacology & Clinical Pharmacy'],
  };

  const localizedFacultyNames = {
    'Dentistry': lang === 'fa' ? 'طب دندان (ستوماتولوژی)' : lang === 'ps' ? 'د غاښونو طب (ستوماتولوژي)' : 'Dentistry',
    'Computer Science': lang === 'fa' ? 'کمپیوتر ساینس' : lang === 'ps' ? 'کمپیوټر ساینس' : 'Computer Science',
    'Law Faculty': lang === 'fa' ? 'حقوق و علوم سیاسی' : lang === 'ps' ? 'حقوق او سیاسي علوم' : 'Law Faculty',
    'Pharmacy': lang === 'fa' ? 'پوهنځی فارمسی' : lang === 'ps' ? 'د فارمسۍ پوهنځی' : 'Faculty of Pharmacy',
  };

  const localizedDeptNames = {
    'Dental Surgery': lang === 'fa' ? 'دیپارتمنت جراحی دهان و دندان' : lang === 'ps' ? 'د خولې او غاښونو د جراحي څانګه' : 'Dental Surgery',
    'Orthodontics & Prosthodontics': lang === 'fa' ? 'دیپارتمنت ارتودنسی و پروتز دهان' : lang === 'ps' ? 'د ارتوډونسي او پروتز څانګه' : 'Orthodontics & Prosthodontics',
    'Software Engineering': lang === 'fa' ? 'دیپارتمنت مهندسی نرم‌افزار (سافت‌ویر)' : lang === 'ps' ? 'د سافټویر انجینرۍ څانګه' : 'Software Engineering',
    'Database & Info Systems': lang === 'fa' ? 'دیپارتمنت پایگاه داده و سیستم‌های معلوماتی' : lang === 'ps' ? 'د ډیټابیس او معلوماتي سیسټمونو څانګه' : 'Database & Info Systems',
    'Public & International Law': lang === 'fa' ? 'دیپارتمنت حقوق عامه و بین‌الملل' : lang === 'ps' ? 'د عامه او بین المللي حقوقو څانګه' : 'Public & International Law',
    'Private Law & Judiciary': lang === 'fa' ? 'دیپارتمنت حقوق خصوصی و قضا' : lang === 'ps' ? 'د خصوصي حقوقو او قضا څانګه' : 'Private Law & Judiciary',
    'Pharmaceutics & Medicinal Chemistry': lang === 'fa' ? 'دیپارتمنت کیمیای ادویه و فارمسیوتیکس' : lang === 'ps' ? 'د درملو کیمیا او فارمسیوټیکس څانګه' : 'Pharmaceutics & Medicinal Chemistry',
    'Pharmacology & Clinical Pharmacy': lang === 'fa' ? 'دیپارتمنت فارمکولوژی و فارمسی کلینیکی' : lang === 'ps' ? 'د فارمکولوژي او کلینیکي فارمسۍ څانګه' : 'Pharmacology & Clinical Pharmacy',
  };

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
    async function loadExistingApplication() {
      try {
        setFetching(true);
        const app = await apiService.student.getStatus();
        if (app) {
          setFullName(app.fullName || '');
          setFatherName(app.fatherName || '');
          setPhone(app.phone || '');
          setFaculty(app.faculty || 'Computer Science');
          setDepartment(app.department || 'Software Engineering');
          setAdmissionYear(app.admissionYear || '2026');
          setAddress(app.address || '');
          setPhoto(app.photo || '');
          setTazkira(app.tazkira || '');
          setCertificate(app.certificate || '');
        }
      } catch (err) {
        // Safe to ignore if doesn't exist yet
      } finally {
        setFetching(false);
      }
    }
    loadExistingApplication();
  }, [apiService]);

  const handleFacultyChange = (newFaculty) => {
    setFaculty(newFaculty);
    const availableDeps = facultyDepartments[newFaculty] || [];
    setDepartment(availableDeps[0] || '');
  };

  const processFile = async (file, type) => {
    if (!file) return;
    setCompressingDoc((prev) => ({ ...prev, [type]: true }));
    if (error) setError(null);

    try {
      const options = type === 'photo' 
        ? { maxWidth: 600, maxHeight: 600, quality: 0.82 }
        : { maxWidth: 1400, maxHeight: 1400, quality: 0.78 };

      const compressed = await compressImage(file, options);
      if (type === 'photo') setPhoto(compressed);
      else if (type === 'tazkira') setTazkira(compressed);
      else setCertificate(compressed);

      setDocErrors((prev) => ({ ...prev, [type]: false }));
    } catch (err) {
      console.warn('Fallback file reader:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (type === 'photo') setPhoto(base64String);
        else if (type === 'tazkira') setTazkira(base64String);
        else setCertificate(base64String);
        setDocErrors((prev) => ({ ...prev, [type]: false }));
      };
      reader.readAsDataURL(file);
    } finally {
      setCompressingDoc((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    processFile(file, type);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [type]: false }));
    const file = e.dataTransfer.files?.[0];
    processFile(file, type);
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [type]: false }));
  };

  const handleUrlFill = (type, textValue) => {
    if (type === 'photo') setPhoto(textValue);
    else if (type === 'tazkira') setTazkira(textValue);
    else setCertificate(textValue);

    if (textValue && textValue.trim()) {
      setDocErrors((prev) => ({ ...prev, [type]: false }));
      if (error) setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setActiveTooltip(null);

    // Validate text inputs with custom styled popup
    if (!fullName.trim()) {
      setActiveTooltip({
        field: 'fullName',
        message: lang === 'fa' ? 'لطفاً نام و تخلص خود را وارد نمایید.' : lang === 'ps' ? 'مهرباني وکړئ بشپړ نوم دننه کړئ.' : 'Please fill out this field.',
      });
      const el = document.getElementById('field-fullName');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!fatherName.trim()) {
      setActiveTooltip({
        field: 'fatherName',
        message: lang === 'fa' ? 'لطفاً نام پدر را وارد نمایید.' : lang === 'ps' ? 'مهرباني وکړئ د پلار نوم دننه کړئ.' : 'Please fill out this field.',
      });
      const el = document.getElementById('field-fatherName');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!phone.trim()) {
      setActiveTooltip({
        field: 'phone',
        message: lang === 'fa' ? 'لطفاً شماره تماس معتبر را وارد نمایید.' : lang === 'ps' ? 'مهرباني وکړئ د اړیکې شمیره ولیکئ.' : 'Please fill out this field.',
      });
      const el = document.getElementById('field-phone');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!address.trim()) {
      setActiveTooltip({
        field: 'address',
        message: lang === 'fa' ? 'لطفاً آدرس فعلی یا سکونت خود را وارد نمایید.' : lang === 'ps' ? 'مهرباني وکړئ اوسنی ادرس ولیکئ.' : 'Please fill out this field.',
      });
      const el = document.getElementById('field-address');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Check if registration is open by admin
    if (portalSettings && portalSettings.registrationOpen === false) {
      setError(
        lang === 'fa' 
          ? 'پذیرش ثبت‌نام برای متقاضیان جدید در حال حاضر موقتاً توسط مدیریت پورتال بسته شده است.' 
          : lang === 'ps' 
          ? 'د نویو محصلانو لپاره د نوم لیکنې پروسه دا مهال د ادارې لخوا په موقتي توګه بنده ده.' 
          : 'New student admissions are currently paused by the portal administration.'
      );
      return;
    }

    // Validate required documents
    const missingPhoto = !photo || !photo.trim();
    const missingTazkira = portalSettings.requireTazkira !== false && (!tazkira || !tazkira.trim());
    const missingCert = portalSettings.requireDiploma !== false && (!certificate || !certificate.trim());

    setDocErrors({
      photo: missingPhoto,
      tazkira: missingTazkira,
      certificate: missingCert,
    });

    if (missingPhoto || missingTazkira || missingCert) {
      const missingList = [];
      if (missingPhoto) missingList.push(lang === 'fa' ? 'عکس پرسونلی' : lang === 'ps' ? 'شخصي عکس' : 'Passport Photo');
      if (missingTazkira) missingList.push(lang === 'fa' ? 'اسکن تذکره' : lang === 'ps' ? 'د تذکرې سکین' : 'Tazkira Scan');
      if (missingCert) missingList.push(lang === 'fa' ? 'اسکن شهادتنامه مکتب' : lang === 'ps' ? 'د شهادتنامې سکین' : 'Diploma Transcript');

      setError(
        lang === 'fa'
          ? `آپلود مدارک الزامی است! لطفاً مدارک زیر را آپلود نمایید: ${missingList.join('، ')}`
          : lang === 'ps'
          ? `د اسنادو پورته کول اړین دي! مهرباني وکړئ لاندې اسناد پورته کړئ: ${missingList.join('، ')}`
          : `Document upload is required! Please upload: ${missingList.join(', ')}.`
      );
      return;
    }

    setLoading(true);

    try {
      // Ensure all images are compressed before sending to prevent heavy network upload latency
      let optPhoto = photo;
      let optTazkira = tazkira;
      let optCert = certificate;

      if (photo && photo.startsWith('data:image/') && photo.length > 150000) {
        optPhoto = await compressImage(photo, { maxWidth: 600, maxHeight: 600, quality: 0.82 });
      }
      if (tazkira && tazkira.startsWith('data:image/') && tazkira.length > 250000) {
        optTazkira = await compressImage(tazkira, { maxWidth: 1400, maxHeight: 1400, quality: 0.78 });
      }
      if (certificate && certificate.startsWith('data:image/') && certificate.length > 250000) {
        optCert = await compressImage(certificate, { maxWidth: 1400, maxHeight: 1400, quality: 0.78 });
      }

      const res = await apiService.student.submitForm({
        fullName: fullName.trim(),
        fatherName: fatherName.trim(),
        phone: phone.trim(),
        faculty,
        department,
        admissionYear,
        address: address.trim(),
        photo: optPhoto,
        tazkira: optTazkira,
        certificate: optCert,
      });

      const appData = res?.application || {
        fullName: fullName.trim(),
        fatherName: fatherName.trim(),
        phone: phone.trim(),
        faculty,
        department,
        admissionYear,
        studentCardId: `HU-${admissionYear}-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'Pending',
      };

      setSubmittedData(appData);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('uniport_student_status_updated', { detail: appData }));
      }
      setShowSuccessModal(true);
      setSuccess(
        lang === 'fa' 
          ? 'فورم شمولیت و مدارک شما با موفقیت ثبت گردید!' 
          : lang === 'ps'
          ? 'ستاسو د نوم لیکنې فورمه او اسناد په بریالیتوب سره ثبت شول!'
          : 'Your enrollment application and verified documents were submitted successfully!'
      );
    } catch (err) {
      setError(err.message || 'Workflow register transaction failure.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
        <span>{lang === 'fa' ? 'در حال بازیابی مشخصات دوسیه ثبت شده...' : lang === 'ps' ? 'د ثبت شوې دوسیې د معلوماتو د ترلاسه کولو په حال کې...' : 'Loading existing registration form profile...'}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">{t('formTitle')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {t('formSub')}
          </p>
        </div>

        {portalSettings && portalSettings.registrationOpen === false && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 p-4 rounded-xl text-amber-800 dark:text-amber-300 font-semibold text-xs flex items-start gap-2.5 shadow-xs">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="space-y-0.5">
              <span className="font-bold block">
                {lang === 'fa' ? 'پذیرش متقاضیان جدید موقتاً مسدود است:' : lang === 'ps' ? 'د نویو محصلینو نوم لیکنه بنده ده:' : 'Admissions Currently Paused:'}
              </span>
              <span className="font-normal leading-relaxed">
                {lang === 'fa' 
                  ? 'ثبت‌نام سال تحصیلی جاری در حال حاضر توسط مدیریت موقتاً بسته شده است. متقاضیان می‌توانند پس از بازگشایی مجدد نسبت به ثبت دوسیه اقدام فرمایند.' 
                  : lang === 'ps' 
                  ? 'د دې تحصیلي کال لپاره د نوم لیکنې پروسه دا مهال بنده ده. د لا زیاتو معلوماتو لپاره له ادارې سره په اړیکه کې شئ.' 
                  : 'New student admissions are currently closed by the administration. Please check back later.'}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 p-4 rounded-xl text-rose-700 dark:text-rose-300 font-semibold text-xs flex items-start gap-2.5 animate-shake shadow-xs">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div className="space-y-0.5">
              <span className="font-bold block">{lang === 'fa' ? 'خطا در ثبت فورم:' : 'Submission Error:'}</span>
              <span className="font-normal">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 p-4 rounded-xl text-teal-800 dark:text-teal-300 font-semibold text-xs flex items-start gap-2 shadow-xs">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-teal-600 dark:text-teal-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Section 1: Personal Family details */}
          <div className="space-y-4 border-b border-slate-100 dark:border-slate-800/40 pb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none flex items-center gap-1.5 font-sans">
              <User className="w-3.5 h-3.5" /> {lang === 'fa' ? '۱. معلومات هویت شخصی و فامیلی' : lang === 'ps' ? '۱. شخصي او کورنۍ هویت معلومات' : '1. Personal & Family Profile'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('fullName')} *</label>
                <div className="relative">
                  <input
                    id="field-fullName"
                    type="text"
                    required
                    value={fullName}
                    onFocus={() => {
                      if (activeTooltip?.field === 'fullName') setActiveTooltip(null);
                    }}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (activeTooltip?.field === 'fullName') setActiveTooltip(null);
                    }}
                    placeholder="e.g. Salim Noori"
                    className={`w-full px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border ${
                      activeTooltip?.field === 'fullName'
                        ? 'border-amber-500 ring-2 ring-amber-500/20 animate-field-shake'
                        : 'border-slate-200 dark:border-slate-800/80'
                    } rounded-xl text-slate-950 dark:text-zinc-100 text-xs focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors`}
                  />
                  <ValidationTooltip
                    visible={activeTooltip?.field === 'fullName'}
                    message={activeTooltip?.message}
                    onClose={() => setActiveTooltip(null)}
                    lang={lang}
                    placement="bottom"
                  />
                </div>
              </div>

              {/* Father Name */}
              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('fatherName')} *</label>
                <div className="relative">
                  <input
                    id="field-fatherName"
                    type="text"
                    required
                    value={fatherName}
                    onFocus={() => {
                      if (activeTooltip?.field === 'fatherName') setActiveTooltip(null);
                    }}
                    onChange={(e) => {
                      setFatherName(e.target.value);
                      if (activeTooltip?.field === 'fatherName') setActiveTooltip(null);
                    }}
                    placeholder="e.g. Mohammad Noori"
                    className={`w-full px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border ${
                      activeTooltip?.field === 'fatherName'
                        ? 'border-amber-500 ring-2 ring-amber-500/20 animate-field-shake'
                        : 'border-slate-200 dark:border-slate-800/80'
                    } rounded-xl text-slate-950 dark:text-zinc-100 text-xs focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors`}
                  />
                  <ValidationTooltip
                    visible={activeTooltip?.field === 'fatherName'}
                    message={activeTooltip?.message}
                    onClose={() => setActiveTooltip(null)}
                    lang={lang}
                    placement="bottom"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('phone')} *</label>
                <div className="relative">
                  <Phone className={`absolute ${lang === 'fa' || lang === 'ps' ? 'right-3' : 'left-3'} top-3 text-slate-400 dark:text-slate-500 w-3.5 h-3.5 pointer-events-none`} />
                  <input
                    id="field-phone"
                    type="tel"
                    required
                    value={phone}
                    onFocus={() => {
                      if (activeTooltip?.field === 'phone') setActiveTooltip(null);
                    }}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (activeTooltip?.field === 'phone') setActiveTooltip(null);
                    }}
                    placeholder="e.g. +93 78 123 4567"
                    className={`w-full ${lang === 'fa' || lang === 'ps' ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'} py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border ${
                      activeTooltip?.field === 'phone'
                        ? 'border-amber-500 ring-2 ring-amber-500/20 animate-field-shake'
                        : 'border-slate-200 dark:border-slate-800/80'
                    } rounded-xl text-slate-950 dark:text-zinc-100 text-xs focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors`}
                  />
                  <ValidationTooltip
                    visible={activeTooltip?.field === 'phone'}
                    message={activeTooltip?.message}
                    onClose={() => setActiveTooltip(null)}
                    lang={lang}
                    placement="bottom"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('address')} *</label>
                <div className="relative">
                  <MapPin className={`absolute ${lang === 'fa' || lang === 'ps' ? 'right-3' : 'left-3'} top-3 text-slate-400 dark:text-slate-500 w-3.5 h-3.5 pointer-events-none`} />
                  <input
                    id="field-address"
                    type="text"
                    required
                    value={address}
                    onFocus={() => {
                      if (activeTooltip?.field === 'address') setActiveTooltip(null);
                    }}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (activeTooltip?.field === 'address') setActiveTooltip(null);
                    }}
                    placeholder="e.g. Karte Seh, District 6, Kabul"
                    className={`w-full ${lang === 'fa' || lang === 'ps' ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'} py-2.5 bg-slate-50/50 dark:bg-slate-900/60 border ${
                      activeTooltip?.field === 'address'
                        ? 'border-amber-500 ring-2 ring-amber-500/20 animate-field-shake'
                        : 'border-slate-200 dark:border-slate-800/80'
                    } rounded-xl text-slate-950 dark:text-zinc-100 text-xs focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors`}
                  />
                  <ValidationTooltip
                    visible={activeTooltip?.field === 'address'}
                    message={activeTooltip?.message}
                    onClose={() => setActiveTooltip(null)}
                    lang={lang}
                    placement="bottom"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Faculty streams list */}
          <div className="space-y-4 border-b border-slate-100 dark:border-slate-800/40 pb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none flex items-center gap-1.5 font-sans">
              <Compass className="w-3.5 h-3.5" /> {lang === 'fa' ? '۲. تعیین رشته و دانشکده مورد نظر' : lang === 'ps' ? '۲. د غوښتل شوې پوهنځي او څانګې ټاکل' : '2. Desired Stream Allocation'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('faculty')} *</label>
                <select
                  value={faculty}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-950 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-colors"
                >
                  {Object.keys(facultyDepartments).map((fac) => (
                    <option key={fac} value={fac} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {localizedFacultyNames[fac] || fac}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('department')} *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-950 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-colors"
                >
                  {(facultyDepartments[faculty] || []).map((dep) => (
                    <option key={dep} value={dep} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {localizedDeptNames[dep] || dep}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('admissionYear')} *</label>
                <select
                  value={admissionYear}
                  onChange={(e) => setAdmissionYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-950 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-colors"
                >
                  <option value="2025" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang === 'fa' ? '۱۴۰۴ (بهاری / خزانی)' : lang === 'ps' ? '۱۴۰۴ (بهارنی / منی تحصیلي دوره)' : '2025 (Spring / Fall)'}</option>
                  <option value="2026" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang === 'fa' ? '۱۴۰۵ (ورودی جدید)' : lang === 'ps' ? '۱۴۰۵ (نوی راغلی سمستر)' : '2026 (Incoming Batch)'}</option>
                  <option value="2027" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang === 'fa' ? '۱۴۰۶ (تاخیری مکتوب)' : lang === 'ps' ? '۱۴۰۶ (وروسته شوی مکتوب)' : '2027 (Deferred Batch)'}</option>
                  <option value="2028" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang === 'fa' ? '۱۴۰۷ (سال تحصیلی ۱۴۰۷)' : lang === 'ps' ? '۱۴۰۷ (تحصیلي کال ۱۴۰۷)' : '2028 (Academic Year 2028)'}</option>
                  <option value="2029" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang === 'fa' ? '۱۴۰۸ (سال تحصیلی ۱۴۰۸)' : lang === 'ps' ? '۱۴۰۸ (تحصیلي کال ۱۴۰۸)' : '2029 (Academic Year 2029)'}</option>
                  <option value="2030" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang === 'fa' ? '۱۴۰۹ (سال تحصیلی ۱۴۰۹)' : lang === 'ps' ? '۱۴۰۹ (تحصیلي کال ۱۴۰۹)' : '2030 (Academic Year 2030)'}</option>
                  <option value="2031" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang === 'fa' ? '۱۴۱۰ (سال تحصیلی ۱۴۱۰)' : lang === 'ps' ? '۱۴۱۰ (تحصیلي کال ۱۴۱۰)' : '2031 (Academic Year 2031)'}</option>
                  <option value="2032" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang === 'fa' ? '۱۴۱۱ (سال تحصیلی ۱۴۱۱)' : lang === 'ps' ? '۱۴۱۱ (تحصیلي کال ۱۴۱۱)' : '2032 (Academic Year 2032)'}</option>
                  <option value="2033" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang === 'fa' ? '۱۴۱۲ (سال تحصیلی ۱۴۱۲)' : lang === 'ps' ? '۱۴۱۲ (تحصیلي کال ۱۴۱۲)' : '2033 (Academic Year 2033)'}</option>
                  <option value="2034" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang === 'fa' ? '۱۴۱۳ (سال تحصیلی ۱۴۱۳)' : lang === 'ps' ? '۱۴۱۳ (تحصیلي کال ۱۴۱۳)' : '2034 (Academic Year 2034)'}</option>
                  <option value="2035" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang === 'fa' ? '۱۴۱۴ (سال تحصیلی ۱۴۱۴)' : lang === 'ps' ? '۱۴۱۴ (تحصیلي کال ۱۴۱۴)' : '2035 (Academic Year 2035)'}</option>
                  <option value="2036" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang === 'fa' ? '۱۴۱۵ (سال تحصیلی ۱۴۱۵)' : lang === 'ps' ? '۱۴۱۵ (تحصیلي کال ۱۴۱۵)' : '2036 (Academic Year 2036)'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Document Upload blocks - STRICTLY REQUIRED */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none flex items-center gap-1.5 font-sans">
                <Landmark className="w-3.5 h-3.5" /> {lang === 'fa' ? '۳. مدارک و اسناد تایید هویت (الزامی)' : lang === 'ps' ? '۳. د هویت د تایید اسناد (اړین)' : '3. VERIFICATION DOCUMENTS (REQUIRED)'}
              </h3>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                {lang === 'fa' ? '* آپلود تمامی ۳ مدرک جهت تایید شمولیت الزامی است' : lang === 'ps' ? '* د ټولو ۳ اسنادو پورته کول اړین دي' : '* All 3 document image uploads are mandatory'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. Photo Upload Card */}
              <div 
                className={`glass-panel rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3.5 border-2 transition-all ${
                  docErrors.photo 
                    ? 'border-rose-400 dark:border-rose-500 bg-rose-50/30 dark:bg-rose-950/20' 
                    : photo 
                    ? 'border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10'
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <span>{t('photoLabel')}</span>
                      <span className="text-rose-500">*</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400/80 leading-normal mt-0.5">
                      {lang === 'fa' 
                        ? 'عکس پرسونلی با زمینه سفید و وضوح کاملاً واضح.' 
                        : lang === 'ps'
                        ? 'د سپین شالید سره شخصي عکس چې په بشپړ ډول روښانه وي.'
                        : 'Plain light background photo for student registry badges.'}
                    </p>
                  </div>
                  {compressingDoc.photo ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      {lang === 'fa' ? 'بهینه‌سازی...' : lang === 'ps' ? 'چمتو کول...' : 'Optimizing...'}
                    </span>
                  ) : photo ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      {lang === 'fa' ? 'آپلود شد' : 'Uploaded'}
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                      {lang === 'fa' ? 'الزامی' : 'Required'}
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {photo ? (
                    <div className="relative group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden h-28 bg-slate-900/10 dark:bg-slate-900/60 flex items-center justify-center">
                      <img
                        src={photo.startsWith('data:') || photo.startsWith('http') ? photo : 'https://placehold.co/120'}
                        alt="Photo Preview"
                        className="h-28 w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPhoto('')}
                          className="bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-rose-500 shadow"
                        >
                          <Trash2 className="w-3 h-3" />
                          {lang === 'fa' ? 'حذف و تغییر' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onDragOver={(e) => handleDragOver(e, 'photo')}
                      onDragLeave={(e) => handleDragLeave(e, 'photo')}
                      onDrop={(e) => handleDrop(e, 'photo')}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all relative cursor-pointer group ${
                        dragOver.photo
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 scale-[1.02]'
                          : docErrors.photo
                          ? 'border-rose-400 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                          : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/15'
                      }`}
                    >
                      <Upload className={`w-5 h-5 mx-auto mb-1.5 transition-colors ${docErrors.photo ? 'text-rose-500' : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
                      <span className={`text-[11px] font-bold block transition-colors ${docErrors.photo ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                        {lang === 'fa' ? 'آپلود فایل عکس' : lang === 'ps' ? 'د عکس اسناد پورته کول' : 'Upload Photo'}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-0.5">
                        {lang === 'fa' ? 'انتخاب فایل یا کشیدن تصویر به اینجا' : 'Click to select or drag & drop'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'photo')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}

                  {docErrors.photo && (
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold px-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {lang === 'fa' ? 'آپلود عکس پرسونلی الزامی است' : 'Passport photo upload is required'}
                    </p>
                  )}

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase select-none">
                      {lang === 'fa' ? 'یا درج آدرس مستقیم تصویر:' : 'Or Paste Image URL Link:'}
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. https://... or image link"
                      value={photo.startsWith('data:') ? 'Base64 Photo Buffer' : photo}
                      onChange={(e) => handleUrlFill('photo', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] text-slate-700 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-slate-600 font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Tazkira Upload Card */}
              <div 
                className={`glass-panel rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3.5 border-2 transition-all ${
                  docErrors.tazkira 
                    ? 'border-rose-400 dark:border-rose-500 bg-rose-50/30 dark:bg-rose-950/20' 
                    : tazkira 
                    ? 'border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10'
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <span>{t('tazkiraLabel')}</span>
                      <span className="text-rose-500">*</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400/80 leading-normal mt-0.5">
                      {lang === 'fa' 
                        ? 'اسکن باکیفیت هر دو طرف تذکره الکترونیکی یا کاغذی.' 
                        : lang === 'ps'
                        ? 'د کاغذي یا برېښنایي تذکرې د دواړو خواوو روښانه سکین.'
                        : 'Scanned image of Tazkira identification document.'}
                    </p>
                  </div>
                  {compressingDoc.tazkira ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      {lang === 'fa' ? 'بهینه‌سازی...' : lang === 'ps' ? 'چمتو کول...' : 'Optimizing...'}
                    </span>
                  ) : tazkira ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      {lang === 'fa' ? 'آپلود شد' : 'Uploaded'}
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                      {lang === 'fa' ? 'الزامی' : 'Required'}
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {tazkira ? (
                    <div className="relative group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden h-28 bg-slate-900/10 dark:bg-slate-900/60 flex items-center justify-center">
                      {tazkira.startsWith('data:image') || tazkira.startsWith('http') ? (
                        <img
                          src={tazkira}
                          alt="Tazkira Preview"
                          className="h-28 w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center p-3 text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold bg-indigo-50 dark:bg-indigo-950/30 w-full h-full flex flex-col items-center justify-center gap-1">
                          <FileText className="w-6 h-6 text-indigo-500" />
                          <span className="truncate max-w-[200px]">{tazkira}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setTazkira('')}
                          className="bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-rose-500 shadow"
                        >
                          <Trash2 className="w-3 h-3" />
                          {lang === 'fa' ? 'حذف و تغییر' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onDragOver={(e) => handleDragOver(e, 'tazkira')}
                      onDragLeave={(e) => handleDragLeave(e, 'tazkira')}
                      onDrop={(e) => handleDrop(e, 'tazkira')}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all relative cursor-pointer group ${
                        dragOver.tazkira
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 scale-[1.02]'
                          : docErrors.tazkira
                          ? 'border-rose-400 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                          : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/15'
                      }`}
                    >
                      <Upload className={`w-5 h-5 mx-auto mb-1.5 transition-colors ${docErrors.tazkira ? 'text-rose-500' : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
                      <span className={`text-[11px] font-bold block transition-colors ${docErrors.tazkira ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                        {lang === 'fa' ? 'آپلود اسکن تذکره' : lang === 'ps' ? 'د تذکرې سکین پورته کړئ' : 'Upload Tazkira'}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-0.5">
                        {lang === 'fa' ? 'انتخاب فایل یا کشیدن تصویر به اینجا' : 'Click to select or drag & drop'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'tazkira')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}

                  {docErrors.tazkira && (
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold px-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {lang === 'fa' ? 'آپلود اسکن تذکره الزامی است' : 'Tazkira scan upload is required'}
                    </p>
                  )}

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase select-none">
                      {lang === 'fa' ? 'یا درج شماره جلد یا آدرس اسکن:' : 'Or Paste Scan Link / Details:'}
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Scan URL or Page No 89, Volume IV"
                      value={tazkira.startsWith('data:') ? 'Base64 Tazkira Buffer' : tazkira}
                      onChange={(e) => handleUrlFill('tazkira', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] text-slate-700 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-slate-600 font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Diploma Upload Card */}
              <div 
                className={`glass-panel rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3.5 border-2 transition-all sm:col-span-2 lg:col-span-1 ${
                  docErrors.certificate 
                    ? 'border-rose-400 dark:border-rose-500 bg-rose-50/30 dark:bg-rose-950/20' 
                    : certificate 
                    ? 'border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10'
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <span>{t('certLabel')}</span>
                      <span className="text-rose-500">*</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400/80 leading-normal mt-0.5">
                      {lang === 'fa' 
                        ? 'اسکن رسمی شهادتنامه یا نمرات سه ساله مکتب.' 
                        : lang === 'ps'
                        ? 'د ښوونځي د شهادتنامې یا د ۳ کلن نمرو رسمي کتنې پاڼه.'
                        : '12th-grade official graduation statement transcript.'}
                    </p>
                  </div>
                  {compressingDoc.certificate ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      {lang === 'fa' ? 'بهینه‌سازی...' : lang === 'ps' ? 'چمتو کول...' : 'Optimizing...'}
                    </span>
                  ) : certificate ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      {lang === 'fa' ? 'آپلود شد' : 'Uploaded'}
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                      {lang === 'fa' ? 'الزامی' : 'Required'}
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {certificate ? (
                    <div className="relative group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden h-28 bg-slate-900/10 dark:bg-slate-900/60 flex items-center justify-center">
                      {certificate.startsWith('data:image') || certificate.startsWith('http') ? (
                        <img
                          src={certificate}
                          alt="Diploma Preview"
                          className="h-28 w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center p-3 text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold bg-indigo-50 dark:bg-indigo-950/30 w-full h-full flex flex-col items-center justify-center gap-1">
                          <FileText className="w-6 h-6 text-indigo-500" />
                          <span className="truncate max-w-[200px]">{certificate}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCertificate('')}
                          className="bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-rose-500 shadow"
                        >
                          <Trash2 className="w-3 h-3" />
                          {lang === 'fa' ? 'حذف و تغییر' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onDragOver={(e) => handleDragOver(e, 'certificate')}
                      onDragLeave={(e) => handleDragLeave(e, 'certificate')}
                      onDrop={(e) => handleDrop(e, 'certificate')}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all relative cursor-pointer group ${
                        dragOver.certificate
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 scale-[1.02]'
                          : docErrors.certificate
                          ? 'border-rose-400 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                          : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/15'
                      }`}
                    >
                      <Upload className={`w-5 h-5 mx-auto mb-1.5 transition-colors ${docErrors.certificate ? 'text-rose-500' : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
                      <span className={`text-[11px] font-bold block transition-colors ${docErrors.certificate ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                        {lang === 'fa' ? 'آپلود شهادتنامه مکتب' : lang === 'ps' ? 'د ښوونځي د شهادتنامې اسناد' : 'Upload Diploma'}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-0.5">
                        {lang === 'fa' ? 'انتخاب فایل یا کشیدن تصویر به اینجا' : 'Click to select or drag & drop'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'certificate')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}

                  {docErrors.certificate && (
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold px-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {lang === 'fa' ? 'آپلود شهادتنامه مکتب الزامی است' : 'Diploma transcript upload is required'}
                    </p>
                  )}

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase select-none">
                      {lang === 'fa' ? 'یا درج شماره مکتوب یا آدرس اسکن:' : 'Or Paste Transcript Link / Details:'}
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Scan URL or Roll No #298319"
                      value={certificate.startsWith('data:') ? 'Base64 Diploma Buffer' : certificate}
                      onChange={(e) => handleUrlFill('certificate', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] text-slate-700 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-slate-600 font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/40">
            <button
              type="button"
              onClick={() => onNavigate('/student/dashboard')}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer transition-colors"
            >
              {lang === 'fa' ? 'لغو و خروج' : lang === 'ps' ? 'لغوه او بیرته تګ' : 'Cancel & Return'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white px-6 py-2.5 text-xs font-bold rounded-xl leading-none transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 hover:shadow-lg hover:shadow-indigo-600/15"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              {loading ? (lang === 'fa' ? 'در حال ارسال سریع اسناد...' : lang === 'ps' ? 'د معلوماتو چټک استول...' : 'Submitting details...') : t('submitForm')}
            </button>
          </div>
        </form>
      </div>

      {/* Success Popup Modal */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setShowSuccessModal(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Icon */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4.5 end-4.5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Success Icon & Headings */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {lang === 'fa' 
                  ? 'فورم با موفقیت ثبت و ارسال شد!' 
                  : lang === 'ps'
                  ? 'فورمه په بریالیتوب سره واستول شوه!'
                  : 'Application Submitted Successfully!'}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                {lang === 'fa'
                  ? 'اطلاعات و اسناد شمولیت شما در سیستم دانشگاه هریوا ثبت گردید و برای بررسی هیئت پذیرش ارسال شد.'
                  : lang === 'ps'
                  ? 'ستاسو د شمولیت اسناد په بریالیتوب سره ثبت شول او د ارزونې کمېټې ته واستول شول.'
                  : 'Your application credentials and required documents have been registered and queued for admissions review.'}
              </p>
            </div>

            {/* Application Summary Box */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'نام داوطلب:' : lang === 'ps' ? 'د محصل نوم:' : 'Applicant Name:'}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                  {submittedData?.fullName || fullName}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'دانشکده و رشته:' : lang === 'ps' ? 'پوهنځی او څانګه:' : 'Faculty & Dept:'}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                  {submittedData?.faculty || faculty} — {submittedData?.department || department}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'سال تحصیلی:' : lang === 'ps' ? 'تحصیلي کال:' : 'Academic Year:'}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                  {submittedData?.admissionYear || admissionYear}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {lang === 'fa' ? 'وضعیت پرونده:' : lang === 'ps' ? 'د دوسیې حالت:' : 'Admission Status:'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {lang === 'fa' ? 'در انتظار بررسی' : lang === 'ps' ? 'د ارزونې په صف کې' : 'In Review'}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigate('/student/status');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>{lang === 'fa' ? 'مشاهده کارت محصلی' : lang === 'ps' ? 'د هویت کارت' : 'View Student ID'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigate('/student/dashboard');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'fa' ? 'ورود به داشبورد' : lang === 'ps' ? 'ډشبورډ ته تګ' : 'Go to Dashboard'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
