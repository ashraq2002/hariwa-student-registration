import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getPortalSettings } from '../models/settingsStore.js';
import {
  Award,
  BookOpen,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  FileCheck,
  CheckCircle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Shield,
  Hammer,
  Bookmark,
  Building,
  HeartPulse,
  Sparkles,
  Server,
  Activity,
  ArrowUpRight,
  X,
  Send,
  Instagram,
  Globe,
  Facebook,
  Phone,
  MapPin,
  Mail,
  Info,
  Clock,
  Users,
  Briefcase,
  Layers,
  FileText,
  UserCheck,
  Microscope,
  Stethoscope,
  Scale,
  Pill
} from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import universityLogo from '../../assets/images/hariwa_logo_1783225791176.jpg';

export default function Home({ onNavigate, isLoggedIn, userRole }) {
  const { t, lang } = useLanguage();
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedStream, setSelectedStream] = useState('cs');
  const [activeModal, setActiveModal] = useState(null); // 'guideline' | 'privacy' | 'technical' | null
  const [facultyModalKey, setFacultyModalKey] = useState(null); // 'dentist' | 'cs' | 'law' | 'pharmacy' | null
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

  // Mini live terminal entries inside portal logs
  const [logs, setLogs] = useState([
    { id: 1, type: 'success', text: lang === 'fa' ? 'ارتباط با پایگاه داده اصلی با موفقیت برقرار شد' : lang === 'ps' ? 'له ډیټابیس سره پیاوړی پیوستون په بریالیتوب سره رامنځته شو' : 'Database connection pool established successfully.' },
    { id: 2, type: 'info', text: lang === 'fa' ? 'سیستم پذیرش سمستر خزانی ۲۰۲۶ (۱۴۰۵) فعال گردید' : lang === 'ps' ? 'د ۲۰۲۶ (۱۴۰۵) مالي/مني سمستر د شمولیت سیسټم فعال شو' : 'Enrollment ledger synced with State Ministry.' },
    { id: 3, type: 'warning', text: lang === 'fa' ? 'ظرفیت پذیرش پوهنځی طب به ۷۵٪ رسید' : lang === 'ps' ? 'د طب پوهنځي د شمولیت ظرفیت ۷۵٪ ته ورسېد' : 'Faculty of Medicine intake capacity at 75% limit.' }
  ]);

  const getDashboardRoute = () => {
    return userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard';
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const streamData = {
    dentist: {
      key: 'dentist',
      name: lang === 'fa' ? 'طب دندان (ستوماتولوژی)' : lang === 'ps' ? 'د غاښونو طب (ستوماتولوژي)' : 'Dentistry',
      icon: HeartPulse,
      accentColor: 'rose',
      color: 'border-rose-500 bg-rose-500/10 text-rose-400',
      activeColor: 'bg-rose-600 text-white',
      badge: 'DDS',
      duration: lang === 'fa' ? '۵ سال (۱۰ سمستر)' : lang === 'ps' ? '۵ کاله (۱۰ سمسټره)' : '5 Years (10 Sems)',
      degree: lang === 'fa' ? 'دکتری مسلکی ستوماتولوژی (DDS)' : lang === 'ps' ? 'د ستوماتولوژي دکتورا (DDS)' : 'Doctor of Dental Surgery (DDS)',
      totalSeats: portalSettings?.capacities?.dentistry || 60,
      minGrade: '85%+',
      desc: lang === 'fa' ? 'تربیت متخصصین و کادرهای مسلکی صحت و تداوی دهان و دندان با استانداردهای بین‌المللی.' : lang === 'ps' ? 'د خولې او غاښونو د روغتیا او درملنې په برخه کې د مسلکي کادرونو روزنه د نړیوالو معیارونو سره.' : 'Dedicated to advanced oral health, dental surgeries, and modern clinical practice.',
      overview: lang === 'fa' 
        ? 'پوهنځی ستوماتولوژی (طب دندان) دانشگاه هریوا با بهره‌گیری از اساتید مجرب، لابراتوار فانتوم مجهز، کلینیک تدریسی فعال و یونیت‌های پیشرفته دندان‌پزشکی، یکی از معتبرترین مراکز آموزش طبی در حوزه غرب کشور می‌باشد. دانشجویان علاوه بر آموزش‌های نظری، از سمستر‌های آغازین مهارت‌های عملی را در محیط‌های کلینیکی شبیه‌سازی شده فرامی‌گیرند.'
        : lang === 'ps'
        ? 'د هریوا پوهنتون د غاښونو طب پوهنځی د مجربو استادانو، فانتوم لابراتوارونو او فعالو تدریسي کلینیکونو په درلودلو سره محصلینو ته د غاښونو د درملنې، جراحۍ او مسلکي مهارتونو غوره روزنه ورکوي.'
        : 'The Faculty of Dentistry at Hariwa University is a premier medical education center equipped with state-of-the-art dental simulation phantom labs, digital imaging units, and dedicated teaching clinics.',
      deps: [
        { 
          name: lang === 'fa' ? 'جراحی دهان و فک' : lang === 'ps' ? 'د خولې او ژامې جراحي' : 'Oral & Maxillofacial Surgery', 
          seats: 30, 
          req: '85%+',
          desc: lang === 'fa' ? 'آموزش جراحی‌های نسج نرم، کشیدن‌های پیچیده دندان، جراحی ایمپلنت و تروماهای فکی.' : lang === 'ps' ? 'د خولې د نرم نسج جراحي، د غاښونو پیچلي ایستل او امپلانټ روزنه.' : 'Training in oral surgical interventions, complex extractions, and implantology.'
        },
        { 
          name: lang === 'fa' ? 'ارتودنسی و پروتز' : lang === 'ps' ? 'د ارتوډونسي او پروتز څانګه' : 'Orthodontics & Prosthodontics', 
          seats: 25, 
          req: '80%+',
          desc: lang === 'fa' ? 'طراحی و ساخت انواع پروتزهای ثابت و متحرک، اصلاح ناهنجاری‌های فکی و ردیف‌سازی دندان‌ها.' : lang === 'ps' ? 'د ثابت او متحرک پروتزونو جوړول او د غاښونو سمون او ښکلا.' : 'Fixed and removable prosthetics, dental occlusion correction, and restorative aesthetics.'
        }
      ],
      facilities: [
        lang === 'fa' ? 'کلینیک تدریسی تخصصی دندان‌پزشکی هریوا با یونیت‌های مجهز' : lang === 'ps' ? 'د هریوا پوهنتون ځانګړی تدریسي کلینیک' : 'Dedicated Hariwa Clinical Dental Training Hospital',
        lang === 'fa' ? 'لابراتوار فانتوم دندان‌پزشکی با ۳۰ استیشن شبیه‌ساز بالینی' : lang === 'ps' ? 'د غاښونو مجهز فانتوم لابراتوار د کلینیکي شبیه سازۍ لپاره' : 'Phantom Head Simulation Laboratory with 30 operative stations',
        lang === 'fa' ? 'بخش رادیولوژی دیجیتال فک و صورت (OPG & Cephalometry)' : lang === 'ps' ? 'د فک او غاښونو د ډیجیټل رادیولوژۍ او ایکسرې څانګه' : 'Digital Dental Radiography & Panoramic Imaging Suite',
        lang === 'fa' ? 'لابراتوار مواد دندانی، کست‌ریزی و پروتزهای متحرک' : lang === 'ps' ? 'د غاښونو د موادو او پروتز جوړونې لابراتوار' : 'Dental Biomaterials & Prosthetics Fabrication Facility'
      ],
      careers: [
        lang === 'fa' ? 'تاسیس مطب و کلینیک خصوصی دندان‌پزشکی' : lang === 'ps' ? 'د شخصي غاښونو کتنځي او کلینیک جوړول' : 'Private Dental Practice & Clinic Ownership',
        lang === 'fa' ? 'فعالیت در شفاخانه‌های دولتی و خصوصی کشور' : lang === 'ps' ? 'په دولتي او خصوصي روغتونونو کې د ډاکټر په توګه کار' : 'Hospital Dental Departments & Health Centers',
        lang === 'fa' ? 'متخصص جراحی دهان، پروتز و زیبایی دندان' : lang === 'ps' ? 'د جراحۍ، پروتز او ښکلا د غاښونو متخصص' : 'Cosmetic Dentistry, Implantology & Prosthetics Specialist',
        lang === 'fa' ? 'استاد و محقق در دانشگاه‌ها و موسسات تحصیلات عالی' : lang === 'ps' ? 'په پوهنتونونو کې د استاد او څیړونکي په توګه دنده' : 'Academic & Clinical Faculty Researcher'
      ]
    },
    cs: {
      key: 'cs',
      name: lang === 'fa' ? 'کمپیوتر ساینس' : lang === 'ps' ? 'کمپیوټر ساینس' : 'Computer Science',
      icon: Cpu,
      accentColor: 'blue',
      color: 'border-blue-500 bg-blue-500/10 text-blue-400',
      activeColor: 'bg-blue-600 text-white',
      badge: 'BCS',
      duration: lang === 'fa' ? '۴ سال (۸ سمستر)' : lang === 'ps' ? '۴ کاله (۸ سمسټره)' : '4 Years (8 Sems)',
      degree: lang === 'fa' ? 'لیسانس در کمپیوتر ساینس (BCS)' : lang === 'ps' ? 'د کمپیوټر ساینس لیسانس (BCS)' : 'Bachelor of Science in Computer Science (BCS)',
      totalSeats: portalSettings?.capacities?.cs || 95,
      minGrade: '75%+',
      desc: lang === 'fa' ? 'پیشرو در آموزش برنامه‌نویسی مدرن، پایگاه داده، هوش مصنوعی و مهندسی نرم‌افزار.' : lang === 'ps' ? 'د پروګرام لیکنې، ډیټابیس، مصنوعي ځیرکتیا او د سافټویر انجینرۍ په برخه کې مخکښ کادري پوهنځی.' : 'Leading education in software engineering, database architectures, cloud computing, and AI.',
      overview: lang === 'fa'
        ? 'دانشکده کمپیوتر ساینس دانشگاه هریوا با هدف پاسخگویی به نیازهای روبه‌رشد بازار فناوری و صنعت دیجیتال تاسیس گردیده است. کریکولم درسی این دانشکده منطبق با استانداردهای بین‌المللی ACM و IEEE تدوین یافته و محصلین را به مهارت‌های عملی در برنامه‌نویسی فول‌استک، طراحی سیستم‌های ابری، پایگاه‌های داده مقیاس‌پذیر و امنیت شبکه مجهز می‌سازد.'
        : lang === 'ps'
        ? 'د کمپیوټر ساینس پوهنځی د پروګرامینګ، ډیټابیسونو، مصنوعي ځیرکتیا او سافټویر ډیزاین په برخه کې محصلین روزي ترڅو د هیواد او سیمې ټیکنالوژیکي اړتیاوې پوره کړي.'
        : 'The Faculty of Computer Science prepares future software engineers, full-stack developers, and database architects through hands-on coding labs, enterprise cloud systems, and industry-aligned curricula.',
      deps: [
        { 
          name: lang === 'fa' ? 'مهندسی نرم‌افزار' : lang === 'ps' ? 'د سافټویر انجینرۍ' : 'Software Engineering', 
          seats: 50, 
          req: '80%+',
          desc: lang === 'fa' ? 'توسعه اپلیکیشن‌های وب و موبایل، معماری میکروسرویس، متدولوژی‌های اجایل (Agile) و تست نرم‌افزار.' : lang === 'ps' ? 'د موبایل او ویب پروګرامونو جوړول، د سافټویر معماري او ازموینه.' : 'Modern web/mobile architectures, microservices, cloud deployments, and agile engineering.'
        },
        { 
          name: lang === 'fa' ? 'پایگاه داده و سیستم‌های معلوماتی' : lang === 'ps' ? 'ډیټابیس او معلوماتي سیسټمونه' : 'Database & Info Systems', 
          seats: 45, 
          req: '75%+',
          desc: lang === 'fa' ? 'طراحی دیتابیس‌های رابطه‌ای و NoSQL، مدیریت داده‌های کلان (Big Data)، تحلیل سیستم‌ها و هوش تجاری.' : lang === 'ps' ? 'د لویو ډیټابیسونو مدیریت، د معلوماتو تحلیل او معلوماتي سیسټمونه.' : 'Relational & NoSQL database management, cloud analytics, and business intelligence.'
        }
      ],
      facilities: [
        lang === 'fa' ? 'سه لابراتوار کامپیوتر مجهز به سیستم‌های قدرتمند و اینترنت پرسرعت فیبر نوری' : lang === 'ps' ? 'د چټک انټرنیټ او پیاوړو کمپیوټرونو سره سمبال درې لابراتوارونه' : '3 High-Performance Computer Labs with Gigabit fiber connectivity',
        lang === 'fa' ? 'لابراتوار اختصاصی شبکه و سرور مجهز به روترها و سوئیچ‌های سیسکو (Cisco)' : lang === 'ps' ? 'د سیسکو د وسایلو سره سمبال د شبکې او سرور لابراتوار' : 'Dedicated Cisco Networking and Server Infrastructure Lab',
        lang === 'fa' ? 'مرکز نوآوری و استارت‌آپ‌های نرم‌افزاری دانشگاه هریوا' : lang === 'ps' ? 'د سافټویر د نوښت او سټارټ اپ مرکز' : 'Hariwa Software Innovation & Incubator Center',
        lang === 'fa' ? 'کتابخانه دیجیتال با دسترسی به منابع علمی بین‌المللی IEEE و Springer' : lang === 'ps' ? 'ډیجیټل کتابتون له نړیوالو سرچینو سره' : 'Digital Library with direct access to IEEE and ACM computing archives'
      ],
      careers: [
        lang === 'fa' ? 'مهندس توسعه نرم‌افزار فول‌استک (Full-Stack Developer)' : lang === 'ps' ? 'د سافټویر او پروګرام جوړونې انجینر' : 'Full-Stack Software Engineer & Web Developer',
        lang === 'fa' ? 'مدیر پایگاه داده و زیرساخت ابری (Database & Cloud Admin)' : lang === 'ps' ? 'د ډیټابیس او کلاوډ ډیزاین مدیر' : 'Database Administrator & Cloud Infrastructure Specialist',
        lang === 'fa' ? 'مهندس امنیت شبکه و تست نفوذ (Cybersecurity Specialist)' : lang === 'ps' ? 'د شبکې او سایبري خوندیتوب مسلکي کارپوه' : 'Cybersecurity Analyst & Network Administrator',
        lang === 'fa' ? 'توسعه‌دهنده برنامه‌های موبایل (Android / iOS Developer)' : lang === 'ps' ? 'د موبایل اپلیکیشنونو جوړونکي' : 'Mobile Application Developer (iOS/Android)'
      ]
    },
    law: {
      key: 'law',
      name: lang === 'fa' ? 'حقوق و علوم سیاسی' : lang === 'ps' ? 'حقوق او سیاسي علوم' : 'Law Faculty',
      icon: ShieldCheck,
      accentColor: 'emerald',
      color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
      activeColor: 'bg-emerald-600 text-white',
      badge: 'LL.B',
      duration: lang === 'fa' ? '۴ سال (۸ سمستر)' : lang === 'ps' ? '۴ کاله (۸ سمسټره)' : '4 Years (8 Sems)',
      degree: lang === 'fa' ? 'لیسانس حقوق و علوم سیاسی (LL.B)' : lang === 'ps' ? 'د حقوقو لیسانس (LL.B)' : 'Bachelor of Laws (LL.B)',
      totalSeats: portalSettings?.capacities?.law || 80,
      minGrade: '75%+',
      desc: lang === 'fa' ? 'تربیت متخصصین حقوقی، قضایی، وکالت مدافع، دیپلماسی و علوم سیاسی.' : lang === 'ps' ? 'د قانون، قضايي چارو او سیاسي علومو په برخو کې د مسلکي کادرونو روزنه.' : 'Developing legal consultants, judicial advocates, and diplomatic foreign affairs leaders.',
      overview: lang === 'fa'
        ? 'دانشکده حقوق و علوم سیاسی دانشگاه هریوا با سابقه درخشان آموزشی، کانون تربیت قضات، سارنوالان، وکلا و دیپلمات‌های کشور است. این دانشکده با ایجاد کلینیک حقوقی رایگان و سالن شبیه‌سازی محاکم (Moot Court)، شرایط تجربه عملی محاکمات قضایی و دفاعیات حقوقی را برای محصلین مهیا ساخته است.'
        : lang === 'ps'
        ? 'د حقوقو پوهنځی د هیواد په قضايي، عدلي او سیاسي برخه کې د با استعداده کادرونو د روزنې مرکز دی چې د تمثیلي محکمې له لارې محصلین په عملي ډول روزي.'
        : 'The Faculty of Law and Political Science provides in-depth legal education, moot court litigation simulations, and public policy analysis to prepare ethical attorneys, corporate counsel, and diplomatic representatives.',
      deps: [
        { 
          name: lang === 'fa' ? 'حقوق عامه و بین‌الملل' : lang === 'ps' ? 'عامه او بین المللي حقوق' : 'Public & International Law', 
          seats: 40, 
          req: '75%+',
          desc: lang === 'fa' ? 'حقوق اساسی، حقوق اداری، معاهدات بین‌المللی، دیپلماسی و سازمان‌های جهانی.' : lang === 'ps' ? 'عامه حقوق، اساسي قانون، نړیوال تړونونه او د ډیپلوماسۍ تګلارې.' : 'Constitutional law, administrative governance, international treaties, and foreign policy.'
        },
        { 
          name: lang === 'fa' ? 'حقوق خصوصی و قضا' : lang === 'ps' ? 'خصوصي حقوق او قضا' : 'Private Law & Judiciary', 
          seats: 40, 
          req: '75%+',
          desc: lang === 'fa' ? 'حقوق مدنی، حقوق تجارت، حقوق جزایی، آیین دادرسی مدنی و کیفری، و فن وکالت.' : lang === 'ps' ? 'مدني حقوق، د سوداګرۍ قوانین، جزايي حقوق او په محکمه کې د دفاع چارې.' : 'Civil and commercial codes, penal litigation, judicial procedures, and defense advocacy.'
        }
      ],
      facilities: [
        lang === 'fa' ? 'سالن شبیه‌سازی محکمه قضایی (Moot Court) جهت تمرین دادرسی و دادخواهی عملی' : lang === 'ps' ? 'د تمثیلي محکمې تالار د عملي قضايي تمرینونو لپاره' : 'State-of-the-Art Moot Court Litigation Chamber',
        lang === 'fa' ? 'کلینیک حقوقی دانشگاه هریوا جهت ارائه مشاوره به اقشار نیازمند' : lang === 'ps' ? 'د هریوا حقوقي کلینیک د وړیا مشورو لپاره' : 'Hariwa Legal Aid & Public Defense Practicum Clinic',
        lang === 'fa' ? 'کتابخانه تخصصی فقه و حقوق با هزاران جلد کتب مرجع و مجلات قضایی' : lang === 'ps' ? 'د حقوقو او فقهې ځانګړی کتابتون له معتبرو اثارو سره' : 'Law & Jurisprudence Library with legal codes and supreme court rulings',
        lang === 'fa' ? 'اتاق سمینارهای دیپلماسی و مذاکرات بین‌المللی' : lang === 'ps' ? 'د نړیوالو مذاکراتو او دیپلوماسۍ د سمینارونو خونه' : 'Diplomatic Negotiations and Policy Workshop Center'
      ],
      careers: [
        lang === 'fa' ? 'وکیل مدافع رسمی و مشاور حقوقی شرکت‌ها و بانک‌ها' : lang === 'ps' ? 'رسمي مدافع وکیل او د شرکتونو حقوقي سلاکار' : 'Certified Defense Attorney & Corporate Legal Counsel',
        lang === 'fa' ? 'فعالیت در سیستم عدلی و قضایی (قضاوت و سارنوالی)' : lang === 'ps' ? 'په قضايي او عدلي ادارو کې دنده' : 'Judicial Officer, Magistrate & Public Prosecutor',
        lang === 'fa' ? 'دیپلمات و کارشناس روابط بین‌الملل در وزارت امور خارجه' : lang === 'ps' ? 'د بهرنیو چارو وزارت کې ډیپلوماټ او کارپوه' : 'Foreign Service Diplomat & International Relations Analyst',
        lang === 'fa' ? 'کارشناس حقوق اداری، قراردادها و مناقصات تجاری' : lang === 'ps' ? 'د تړونونو او سوداګریزو چارو حقوقي متخصص' : 'Contract Negotiator & Compliance Director'
      ]
    },
    pharmacy: {
      key: 'pharmacy',
      name: lang === 'fa' ? 'پوهنځی فارمسی' : lang === 'ps' ? 'د فارمسۍ پوهنځی' : 'Faculty of Pharmacy',
      icon: Pill,
      accentColor: 'emerald',
      color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
      activeColor: 'bg-emerald-600 text-white',
      badge: 'B.Pharm',
      duration: lang === 'fa' ? '۵ سال (۱۰ سمستر)' : lang === 'ps' ? '۵ کاله (۱۰ سمسټره)' : '5 Years (10 Sems)',
      degree: lang === 'fa' ? 'لیسانس در فارمسی (B.Pharm)' : lang === 'ps' ? 'په فارمسۍ کې لیسانس (B.Pharm)' : 'Bachelor of Pharmacy (B.Pharm)',
      totalSeats: portalSettings?.capacities?.pharmacy || 80,
      minGrade: '75%+',
      desc: lang === 'fa' ? 'تربیت متخصصین داروسازی، فرمولاسیون دارویی، آنالیز کیفی ادویه و خدمات فارمسی کلینیکی.' : lang === 'ps' ? 'د درمل جوړونې، درملو د تحلیل او کلینیکي فارمسۍ په برخه کې د مسلکي کادرونو روزنه.' : 'Dedicated to advanced pharmaceutical sciences, drug formulation, quality control, and clinical pharmacy.',
      overview: lang === 'fa'
        ? 'پوهنځی فارمسی دانشگاه هریوا با بهره‌گیری از لابراتوارهای تخصصی کیمیای ادویه، فارماکولوژی، آنالیز دستگاهی و داروخانه مدل آموزشی، یکی از قطب‌های پیشگام آموزش علوم دارویی در حوزه غرب کشور است. این دانشکده با تاکید بر استانداردهای بین‌المللی فارماکوپه و آموزش‌های عملی، فارغ‌التحصیلان را برای حضور موثر در صنعت داروسازی، کلینیک‌ها و مراکز تحقیقاتی آماده می‌سازد.'
        : lang === 'ps'
        ? 'د هریوا پوهنتون د فارمسۍ پوهنځی د درملو د کیمیا، فارماکولوژۍ او درمل جوړونې په مجهزو لابراتوارونو سره محصلین د درملو د جوړښت، کیفیت او کنټرول په برخه کې په مسلکي توګه روزي.'
        : 'The Faculty of Pharmacy at Hariwa University is dedicated to cutting-edge education in pharmaceutics, pharmacology, medicinal chemistry, and clinical care, equipped with advanced research laboratories and simulated model pharmacies.',
      deps: [
        { 
          name: lang === 'fa' ? 'کیمیای ادویه و فارمسیوتیکس' : lang === 'ps' ? 'د درملو کیمیا او فارمسیوټیکس' : 'Pharmaceutics & Chemistry', 
          seats: 35, 
          req: '75%+',
          desc: lang === 'fa' ? 'فرمولاسیون اشکال دارویی، طراحی و سنتز مولکول‌های دارویی، نانوفناوری دارویی و کنترل کیفیت ادویه.' : lang === 'ps' ? 'د درملو جوړښت او فارمولاسیون، کیمیاوي تحلیل او د کیفیت کنټرول.' : 'Dosage form design, chemical synthesis of active compounds, nanomedicine, and pharmaceutical formulation.'
        },
        { 
          name: lang === 'fa' ? 'فارمکولوژی و فارمسی کلینیکی' : lang === 'ps' ? 'د فارمکولوژي او کلینیکي فارمسي' : 'Pharmacology & Clinical', 
          seats: 30, 
          req: '75%+',
          desc: lang === 'fa' ? 'بررسی اثرات و میکانیزم داروها، تداخلات دارویی، سم‌شناسی و مراقبت‌های دارویی بیماران در شفاخانه‌ها.' : lang === 'ps' ? 'د درملو اغیزې او متقابل عملونه، زهرپوهنه او په روغتونونو کې کلینیکي پاملرنه.' : 'Drug mechanisms, clinical pharmacokinetics, toxicology, and inpatient pharmaceutical care.'
        }
      ],
      facilities: [
        lang === 'fa' ? 'لابراتوار تخصصی فارمسیوتیکس و ساخت اشکال دارویی' : lang === 'ps' ? 'د درمل جوړونې او فارمسیوټیکس ځانګړی لابراتوار' : 'Advanced Pharmaceutics & Compounding Laboratory',
        lang === 'fa' ? 'داروخانه مدل آموزشی و مشاوره دارویی دانشگاه هریوا' : lang === 'ps' ? 'د هریوا پوهنتون د زده کړې او مشورې نمونه درملتون' : 'Hariwa University Model Teaching Pharmacy',
        lang === 'fa' ? 'لابراتوار تجزیه دستگاهی و کنترل کیفی ادویه (HPLC & Spectrophotometry)' : lang === 'ps' ? 'د درملو د کیفي کنټرول او شننې لابراتوار' : 'Instrumental Quality Control & Drug Analysis Lab (HPLC & Spectrophotometry)',
        lang === 'fa' ? 'باغ گیاهان دارویی و فارماکوگنوزی جهت مطالعات فیتوشیمیایی' : lang === 'ps' ? 'د درملي بوټو څیړنیز بڼ او فارماکوګنوزي مرکز' : 'Medicinal Plants Herbarium & Pharmacognosy Research Unit'
      ],
      careers: [
        lang === 'fa' ? 'دکتر داروساز و مسئول فنی داروخانه‌ها و شفاخانه‌ها' : lang === 'ps' ? 'مسلکي درمل جوړونکی او په روغتونونو او درملتونونو کې تخنیکي مسوول' : 'Licensed Clinical Pharmacist & Hospital Pharmacy Director',
        lang === 'fa' ? 'مدیر کنترل کیفیت و تحقیق و توسعه (R&D) در کارخانجات داروسازی' : lang === 'ps' ? 'د درمل جوړولو په فابریکو کې د کیفیت کنټرول او څیړنې مدیر' : 'Pharmaceutical Industrial Quality Control & R&D Scientist',
        lang === 'fa' ? 'کارشناس رسمی ارزیابی و ثبت ادویه در وزارت صحت عامه' : lang === 'ps' ? 'د عامې روغتیا په وزارت کې د درملو د ارزونې او ثبت رسمي کارپوه' : 'Regulatory Affairs Specialist & Drug Safety Officer (MoPH)',
        lang === 'fa' ? 'پژوهشگر و استاد در مراکز تحقیقات دارویی و دانشگاه‌ها' : lang === 'ps' ? 'په تحصیلي او څیړنیزو مرکزونو کې علمي استاد او محقق' : 'Pharmaceutical Sciences Academic Researcher & Professor'
      ]
    }
  };

  const SelectedIcon = streamData[selectedStream]?.icon || Cpu;

  // Stagger Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  // Fade up animation used across sections
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <>
      <div className="relative w-full max-w-full flex flex-col overflow-x-hidden">
        
        {/* 1. HERO SECTION: OPEN & FLOATING ON PARTICLES  */}
        <section className="relative w-full max-w-5xl mx-auto h-screen sm:pt-14 md:pt-16 pb-12 sm:pb-30 px-4 sm:px-6 flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full flex flex-col items-center justify-center gap-5 sm:gap-6"
          >
            {/* Status pill badge with green dot matching screenshot */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100/90 dark:bg-zinc-800/80 border border-slate-200/70 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-200 text-xs font-semibold rounded-full select-none shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>{lang === 'fa' ? 'پذیرش سمستر جدید ۱۴۰۵ جریان دارد' : lang === 'ps' ? 'د ۱۴۰۵ نوي سمستر نوم لیکنه روانه ده' : 'New Semester 2026 Batch Active'}</span>
            </div>

            {/* Main Title */}
            <h1
                 className="
                 text-3xl
                 sm:text-4xl
                 md:text-5xl
                 lg:text-[52px]
                 xl:text-[56px]
                 font-extrabold
                 tracking-[-0.02em]
                 leading-[1.15]
                 text-slate-950
                 dark:text-white
                 max-w-5xl
                 mx-auto
                 text-balance
                               "
                  >
              {lang === 'fa' ? (
                                   <>
      تحصیلات عالی خود را در{' '}
      <span className="text-blue-600 dark:text-blue-500">
        دانشگاه هریوا
      </span>
      <br />
      آغاز کنید.
    </>
  ) : lang === 'ps' ? (
    <>
      خپلې لوړې زده کړې په{' '}
      <span className="text-blue-600 dark:text-blue-500">
        هریوا پوهنتون
      </span>
      <br />
      کې پیل کړئ.
    </>
  ) : (
    <>
      Start Your Higher Education at{' '}
      <span className="text-blue-600 dark:text-blue-500">
        Hariwa University
      </span>{' '}
      Today.
    </>
  )}
</h1>
            
            {/* Subtitle matching Screenshot */}
            <p className="text-slate-600 dark:text-zinc-300 text-xs sm:text-sm md:text-base font-normal leading-relaxed max-w-2xl mx-auto px-4">
              {lang === 'fa'
                ? 'پروفایل آکادمیک خود را تایید کنید، مدارک لازم را آپلود نموده و وضعیت قبولی خود را فوراً در معتبرترین مرکز ثبت دیجیتالی افغانستان پیگیری کنید.'
                : lang === 'ps'
                ? 'خپل اکاډمیک پروفایل تایید کړئ، اړین اسناد اپلوډ کړئ او په افغانستان کې د ترټولو باوري ډیجیټل نوم لیکنې مرکز کې سمدستي خپل د قبلیدو حالت تعقیب کړئ.'
                : "Verify your academic profile, upload certified credentials, and track your admission status instantaneously through Afghanistan's premier digital registrar."}
            </p>
              
            {/* Action Buttons Row matching Screenshot */}
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md mx-auto">
              {isLoggedIn ? (
                <button
                  onClick={() => onNavigate(getDashboardRoute())}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-7 sm:px-9 py-3 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer transition-all active:scale-98"
                >
                  <span>{lang === 'fa' ? 'ورود به پورتال مدیریت و بررسی' : lang === 'ps' ? 'د مدیریت او بیاکتنې پورتال ته ننوتل' : 'Enter Portal Controls'}</span>
                  <ArrowLeft className="w-4 h-4 shrink-0 rtl:rotate-0 ltr:rotate-180" />
                </button>
              ) : (
                <>
                  {/* In RTL: First button is on the Right: Blue button "ثبت نام جدید" with left arrow */}
                  <button
                    onClick={() => onNavigate('/register')}
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 cursor-pointer transition-all active:scale-98 whitespace-nowrap min-h-[44px]"
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0 rtl:rotate-0 ltr:rotate-180" />
                    <span>{lang === 'fa' ? 'ثبت نام جدید' : lang === 'ps' ? 'نوی نوم لیکنه' : 'Register Now'}</span>
                  </button>

                  {/* In RTL: Second button is on the Left: Soft light button "ورود به سیستم" */}
                  <button
                    onClick={() => onNavigate('/login')}
                    className="bg-slate-100/90 hover:bg-slate-200/80 dark:bg-zinc-800/90 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-100 px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-xs hover:shadow-sm active:scale-98 whitespace-nowrap min-h-[44px]"
                  >
                    <span>{lang === 'fa' ? 'ورود به سیستم' : lang === 'ps' ? 'سیسټم ته ننوتل' : 'Log In'}</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </section>

        {/* White Rounded Top Card starting right beneath hero as shown in screenshot */}
        <div className="w-full bg-white dark:bg-zinc-950 rounded-t-[36px] sm:rounded-t-[48px] border-t border-slate-200/60 dark:border-zinc-800/80 shadow-xs px-3 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Rest of Page Sections with consistent vertical spacing */}
          <div className="flex flex-col space-y-12 sm:space-y-16 md:space-y-20 max-w-7xl mx-auto w-full">
          {/* 2. DYNAMIC SCROLL ANIMATED FEATURES SECTION */}
          <motion.section 
            id="enrollment-workflow"
            className="bg-white dark:bg-zinc-900/60 text-black dark:text-white rounded-3xl p-6 sm:p-10 md:p-12 space-y-12 shadow-md transition-colors duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {lang === 'fa' ? 'روند شفاف پذیرش محصلین' : lang === 'ps' ? 'د محصلانو د قبلیدو روښانه بهیر' : 'Student Enrollment Workflow'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight leading-tight">
            {t('whyChooseUs')}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-semibold max-w-xl mx-auto">
            {lang === 'fa' 
              ? 'مراحل ثبت نام تحصیلی را با شفافیت کامل مدیریت کنید.' 
              : lang === 'ps'
              ? 'د نوم لیکنې پړاوونه په بشپړ روڼتیا سره اداره کړئ.'
              : 'Enabling absolute transparency at each checkpoint of admission.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 pt-4 relative max-w-4xl mx-auto">
          
          <div 
            className="group relative p-6 sm:p-8 bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6 transition-all duration-300 hover:bg-zinc-100/40 dark:hover:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <div className="flex md:flex-col items-center justify-between w-full md:w-auto shrink-0 gap-4 md:border-r md:border-zinc-200 md:dark:border-zinc-800 md:pr-6 rtl:md:border-r-0 rtl:md:border-l rtl:md:border-zinc-200 rtl:md:dark:border-zinc-800 rtl:md:pr-0 rtl:md:pl-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-sm font-mono font-bold text-zinc-400 dark:text-zinc-600">01</span>
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-extrabold text-[#111827] dark:text-[#f3f4f6] text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {lang === 'fa' ? '۱. ارسال مشخصات و بارگذاری پیوست‌ها' : lang === 'ps' ? '۱. د مشخصاتو لیږل او د ضمیمو پورته کول' : '1. Digital Application Form'}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
                {lang === 'fa' 
                  ? 'مشخصات اولیه را وارد کنید و سپس اسکن شهادتنامه، تذکره و عکس خود را با کشیدن و رها کردن ساده آپلود نمایید.' 
                  : lang === 'ps'
                  ? 'لومړني مشخصات دننه کړئ او بیا خپل د شهادتنامې، تذکرې او عکس سکین د ساده ښکته کولو په واسطه پورته کړئ.'
                  : 'Input essential academic parameters, choose faculty major, and easily drag-and-drop secure verification scans.'}
              </p>
            </div>
          </div>

          <div 
            className="group relative p-6 sm:p-8 bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6 transition-all duration-300 hover:bg-zinc-100/40 dark:hover:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <div className="flex md:flex-col items-center justify-between w-full md:w-auto shrink-0 gap-4 md:border-r md:border-zinc-200 md:dark:border-zinc-800 md:pr-6 rtl:md:border-r-0 rtl:md:border-l rtl:md:border-zinc-200 rtl:md:dark:border-zinc-800 rtl:md:pr-0 rtl:md:pl-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-sm font-mono font-bold text-zinc-400 dark:text-zinc-600">02</span>
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-extrabold text-[#111827] dark:text-[#f3f4f6] text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {lang === 'fa' ? '۲. ارزیابی توسط تیم اداری' : lang === 'ps' ? '۲. د اداري ټیم لخوا ارزونه' : '2. Administrative Audits'}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
                {lang === 'fa' 
                  ? 'کارمندان بخش پذیرش دانشگاه مدارک شما را با اصول دانشگاه مطابقت داده و فوراً آن را ثبت سیستم می‌کنند.' 
                  : lang === 'ps'
                  ? 'د پوهنتون د پذیرش څانګې کارمندان به ستاسو اسناد د پوهنتون له اصولو سره سم کړي او سمدستي به یې په سیسټم کې ثبت کړي.'
                  : 'Registrar personnel will verify school graduation history and match scan parameters safely with clear feedback notes.'}
              </p>
            </div>
          </div>

          <div 
            className="group relative p-6 sm:p-8 bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6 transition-all duration-300 hover:bg-zinc-100/40 dark:hover:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <div className="flex md:flex-col items-center justify-between w-full md:w-auto shrink-0 gap-4 md:border-r md:border-zinc-200 md:dark:border-zinc-800 md:pr-6 rtl:md:border-r-0 rtl:md:border-l rtl:md:border-zinc-200 rtl:md:dark:border-zinc-800 rtl:md:pr-0 rtl:md:pl-6">
              <div className="w-12 h-12 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/40 dark:border-emerald-900/20 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-mono font-bold text-zinc-400 dark:text-zinc-600">03</span>
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-extrabold text-[#111827] dark:text-[#f3f4f6] text-sm sm:text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {lang === 'fa' ? '۳. دریافت سند پذیرش' : lang === 'ps' ? '۳. د قبلیدو سند ترلاسه کول' : '3. Printable Scholar Slips'}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
                {lang === 'fa' 
                  ? 'پس از پذیرش نهایی، کارت موقت محصل و بارکد فعال می‌گردد تا آن را چاپ و تحویل بخش ثبت‌نام دانشگاه بدهید.' 
                  : lang === 'ps'
                  ? 'له وروستي قبلیدو وروسته، د محصل موقتي کارت او بارکوډ فعال کیږي ترڅو د هغې په چاپولو سره د پوهنتون ثبت کونکي ته تسلیم شي.'
                  : 'Upon approval, download and print your official Hariwa University verification barcode card and head to the campus registry.'}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. SCROLL ANIMATED FACULTIES DEPARTMENT EXPLORER */}
      <motion.section 
        className="bg-white dark:bg-zinc-900/60 text-black dark:text-white rounded-3xl p-6 sm:p-10 md:p-12 space-y-8 relative overflow-hidden shadow-md transition-colors duration-300"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10 w-full">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[10px] font-extrabold tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full uppercase select-none inline-block font-sans">
              {lang === 'fa' ? 'رشته‌های تحصیلی کادر علمی' : lang === 'ps' ? 'د علمي غړو تحصیلي څانګې' : 'FACULTIES & COLLEGES'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight leading-tight">
              {lang === 'fa' ? 'دانشکده‌های فعال پورتال هریوا' : lang === 'ps' ? 'د هریوا پورتال فعال پوهنځي' : 'Hariwa Academic Departments'}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
              {lang === 'fa' 
                ? 'کلیک بر روی هر دانشکده مشخصات رشته‌ها، ظرفیت جذب صندلی محصلین و حد اقل نمره شهادتنامه را نشان می‌دهد.' 
                : lang === 'ps'
                ? 'په هر پوهنځي کلیک کول د څانګو روښانتیا، د محصلینو څوکۍ او د شهادتنامې لږترلږه نمرې ښیي.'
                : 'Select academic streams to dynamically preview active departments, available registry seats, and admission grade expectations.'}
            </p>

            {/* Dynamic tabs buttons organized one per row */}
            <div className="flex flex-col gap-3 pt-2 w-full">
              {Object.keys(streamData).map((key) => {
                const stream = streamData[key];
                const isSelected = selectedStream === key;
                const IconComponent = stream.icon;
                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedStream(key)}
                    className={`group p-3.5 sm:p-4 w-full rounded-2xl border font-sans text-xs sm:text-sm font-bold cursor-pointer flex items-center justify-between gap-2.5 transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-zinc-50/90 dark:bg-zinc-950/30 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40'
                      }`}>
                        <IconComponent className="w-4 h-4 shrink-0" />
                      </div>
                      <span className="truncate">{stream.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStream(key);
                          setFacultyModalKey(key);
                        }}
                        className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-white/20 text-white hover:bg-white/30' 
                            : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 group-hover:text-blue-600 dark:group-hover:text-blue-300'
                        }`}
                      >
                        {lang === 'fa' ? 'مشاهده جزئیات' : lang === 'ps' ? 'تفصیلات' : 'View Info'}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform ${lang === 'fa' || lang === 'ps' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'} ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200'}`} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedStream}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-5 shadow-sm border border-zinc-200/90 dark:border-zinc-800 z-10 w-full"
              >
                {/* Faculty Card Header: Row 1 = Title & Action Button, Row 2 = Logo/Icon & Badge */}
                <div className="space-y-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-3.5">
                  {/* Row 1: Faculty Title & Details Button */}
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-black text-black dark:text-white text-lg sm:text-xl tracking-tight">
                      {streamData[selectedStream].name}
                    </h3>

                    <button
                      type="button"
                      onClick={() => setFacultyModalKey(selectedStream)}
                      className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/80 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-xs"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span className="whitespace-nowrap">{lang === 'fa' ? 'معلومات کامل' : lang === 'ps' ? 'بشپړ معلومات' : 'Full Details'}</span>
                    </button>
                  </div>

                  {/* Row 2: Faculty Logo and Degree Badge */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center shrink-0 shadow-xs">
                      <SelectedIcon className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60">
                      {streamData[selectedStream].badge}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      {streamData[selectedStream].degree}
                    </span>
                  </div>
                </div>

                {/* Faculty Fast Academic Metrics Strip - Clean Numbers */}
                <div className="grid grid-cols-3 gap-2 p-2 sm:p-2.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-950/50 border border-zinc-200/60 dark:border-zinc-800/60 text-center">
                  <div className="flex items-center justify-center gap-1.5 min-w-0">
                    <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">
                      {streamData[selectedStream].duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 min-w-0 border-x border-zinc-200/70 dark:border-zinc-800">
                    <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 truncate font-mono">
                      {streamData[selectedStream].totalSeats}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 min-w-0">
                    <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 truncate font-mono">
                      {streamData[selectedStream].minGrade}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed font-medium">
                  {streamData[selectedStream].desc}
                </p>

                {/* Departments ("deps") Section */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                        {lang === 'fa' ? 'دیپارتمنت‌های فعال' : lang === 'ps' ? 'فعالې څانګې' : 'Active Departments'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                      {streamData[selectedStream].deps.length} {lang === 'fa' ? 'دیپارتمنت' : lang === 'ps' ? 'څانګې' : 'Departments'}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {streamData[selectedStream].deps.map((dep, index) => (
                      <div 
                        key={index} 
                        className="bg-zinc-50/70 dark:bg-zinc-950/40 p-3.5 rounded-xl space-y-2.5 shadow-xs border border-zinc-200/80 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700/60 transition-colors overflow-hidden"
                      >
                        <h4 className="font-extrabold text-black dark:text-white text-xs sm:text-sm leading-snug break-words">
                          {dep.name}
                        </h4>
                        
                        {dep.desc && (
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 break-words">
                            {dep.desc}
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-zinc-400 font-medium">{lang === 'fa' ? 'حداقل' : lang === 'ps' ? 'لږترلږه' : 'Min'}:</span>
                            <span className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400">
                              {dep.req}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-zinc-400 font-medium">{lang === 'fa' ? 'ظرفیت' : lang === 'ps' ? 'څوکۍ' : 'Seats'}:</span>
                            <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400">
                              {dep.seats}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setFacultyModalKey(selectedStream)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'مشاهده بروشور و معلومات کامل این دانشکده' : lang === 'ps' ? 'د پوهنځي د معلوماتو مډال خلاص کړئ' : 'Open Faculty Information Modal'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate(isLoggedIn ? getDashboardRoute() : '/student/register')}
                    className="w-full sm:w-auto px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>{lang === 'fa' ? 'ثبت‌نام آنلاین' : lang === 'ps' ? 'آنلاین نوم لیکنه' : 'Register Now'}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${lang === 'fa' || lang === 'ps' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* 4. SCROLL ANIMATED FAQ SECTION WITH BEAUTIFUL TRANSITIONS */}
      <motion.section 
        className="bg-white dark:bg-zinc-900/60 text-black dark:text-white rounded-3xl p-6 sm:p-10 md:p-12 space-y-10 shadow-md transition-colors duration-300"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/35 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-none">
            <HelpCircle className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight leading-tight">
            {t('faqTitle')}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-semibold">
            {lang === 'fa' 
              ? 'سوالات متداول متقاضیان شمولیت در دانشگاه هریوا.' 
              : lang === 'ps'
              ? 'په هریوا پوهنتون کې د غوښتونکو پرله پسې پوښتنې.'
              : 'Understand system limits and guidelines regarding application processes.'}
          </p>
        </div>

        <div className="max-w-2xl mx-auto divide-y divide-zinc-200/80 dark:divide-zinc-800/60 font-sans">
          {t('faqs').map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={index} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left font-bold text-[#1f2937] dark:text-[#f3f4f6] hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer py-1 text-xs sm:text-sm"
                >
                  <span className={lang === 'fa' || lang === 'ps' ? 'text-right block w-full leading-relaxed' : 'text-left block'}>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-zinc-400 font-bold" />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className={`text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed mt-2.5 bg-zinc-50/50 dark:bg-zinc-950/10 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/50 ${lang === 'fa' || lang === 'ps' ? 'text-right' : 'text-left'}`}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* 5. BRAND NEW PREMIUM CALLOUT ACTION BOX */}
      <motion.section 
        className="relative overflow-hidden bg-transparent text-black dark:text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 transition-colors duration-300"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Building className="w-11 h-11 text-blue-600 dark:text-blue-400 mx-auto bg-blue-50 dark:bg-blue-950/20 p-2 border border-blue-100 dark:border-blue-900/40 rounded-2xl" />
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight max-w-xl mx-auto leading-tight text-black dark:text-white">{t('readyToApply')}</h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto font-semibold">
          {t('createAccountNow')}
        </p>
        {!isLoggedIn && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-lg shadow-none cursor-pointer transition-colors inline-block mx-auto uppercase tracking-wider"
            >
              {t('register')}
            </button>
          </div>
        )}
      </motion.section>

      {/* 6. BEAUTIFULLY STYLED FOOTER - ALL IN ONE ROW */}
      <footer className="bg-white dark:bg-zinc-900/60 text-zinc-500 py-5 px-6 rounded-3xl font-semibold text-[11px] sm:text-xs shadow-sm shadow-zinc-100/30 dark:shadow-none space-y-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 font-sans">
          
          {/* 1. Logo and Slogan */}
          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 bg-white border border-zinc-200 dark:border-zinc-800">
                <img src={universityLogo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <span className="text-zinc-800 dark:text-zinc-200 font-bold text-[10.5px] sm:text-xs uppercase tracking-wider">
                {lang === 'fa' ? 'پورتال رسمی پوهنتون هریوا' : lang === 'ps' ? 'د هریوا پوهنتون رسمي پورتال' : 'Hariwa University Official Portal'}
              </span>
            </div>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700 font-normal select-none">•</span>
            <p className="text-[10px] sm:text-[11px] text-zinc-400 font-bold">
              {lang === 'fa' ? 'تعهد امروز، تخصص فردا' : lang === 'ps' ? 'تعهد نن، تخصص سبا' : 'Commitment Today, Specialization Tomorrow'}
            </p>
          </div>

          {/* 2. Social Media Links Row */}
          <div className="flex items-center gap-2 shrink-0">
            <a 
              href="https://t.me/Hariwa_edu" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Telegram Channel (@Hariwa_edu)"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 text-zinc-500 hover:text-blue-500 hover:scale-105 transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            </a>
            <a 
              href="https://instagram.com/hariwa_university" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Instagram (@hariwa_university)"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-pink-400 dark:hover:border-pink-500 text-zinc-500 hover:text-pink-500 hover:scale-105 transition-all shadow-xs"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            </a>
            <a 
              href="https://facebook.com/HariwaHigherEducationInstit" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Facebook (HariwaHigherEducationInstit)"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 text-zinc-500 hover:text-blue-600 hover:scale-105 transition-all shadow-xs"
            >
              <Facebook className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500 shrink-0" />
            </a>
            <a 
              href="https://www.hariwa.edu.af/" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Official Website (www.hariwa.edu.af)"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-400 dark:hover:border-emerald-500 text-zinc-500 hover:text-emerald-500 hover:scale-105 transition-all shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            </a>
          </div>

          {/* 3. Nav Links */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-x-3.5 gap-y-1">
            <span 
              onClick={() => setActiveModal('guideline')}
              className="hover:text-black dark:hover:text-white cursor-pointer hover:underline text-blue-600 dark:text-blue-400 font-bold"
            >
              {lang === 'fa' ? 'رهنمود ثبت نام' : lang === 'ps' ? 'د نوم لیکنې الرښود' : 'Admissions Guideline'}
            </span>
            <span className="text-zinc-200 dark:text-zinc-800 font-normal select-none">•</span>
            <span 
              onClick={() => setActiveModal('privacy')}
              className="hover:text-black dark:hover:text-white cursor-pointer hover:underline text-blue-600 dark:text-blue-400 font-bold"
            >
              {lang === 'fa' ? 'محرمیت اسناد' : lang === 'ps' ? 'د اسنادو پټتیا او محرمیت' : 'Privacy Safeguards'}
            </span>
            <span className="text-zinc-200 dark:text-zinc-800 font-normal select-none">•</span>
            <span 
              onClick={() => setActiveModal('technical')}
              className="hover:text-black dark:hover:text-white cursor-pointer hover:underline text-blue-600 dark:text-blue-400 font-bold"
            >
              {lang === 'fa' ? 'پشتیبانی تخنیکی' : lang === 'ps' ? 'تخنیکي ملاتړ او پورتال' : 'Portal Helpdesk'}
            </span>
          </div>

        </div>

        {/* Copyright notice at the very end of footer */}
        <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-3 text-center text-zinc-400 dark:text-zinc-500 font-medium text-[10px] sm:text-[11px] tracking-wide max-w-7xl mx-auto font-sans select-all" dir="ltr">
          © 2026 Hariwa University — Admissions and Registry Council. All rights reserved.
        </div>
      </footer>
      </div>
      </div>

      {/* FOOTER HELPER MODALS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-6 sm:p-8 max-w-lg w-full relative shadow-xl z-10"
              style={{ direction: lang === 'fa' || lang === 'ps' ? 'rtl' : 'ltr' }}
            >
              {/* Close Button element */}
              <button
                onClick={() => setActiveModal(null)}
                className={`absolute top-4 ${lang === 'fa' || lang === 'ps' ? 'left-4' : 'right-4'} p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-blue-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Heading Header */}
              <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-blue-900/20 pb-4 mb-4 mt-1">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                  {activeModal === 'guideline' && <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  {activeModal === 'privacy' && <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                  {activeModal === 'technical' && <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-black dark:text-white leading-none">
                    {activeModal === 'guideline' && (lang === 'fa' ? 'راهنمای ثبت نام و پذیرش تحصیلی' : lang === 'ps' ? 'د نوم لیکنې او منلو لارښود' : 'Admissions & Registration Guide')}
                    {activeModal === 'privacy' && (lang === 'fa' ? 'بیانیه محرمیت و حفاظت اسناد' : lang === 'ps' ? 'د اسنادو د خوندیتوب او پټتیا اصول' : 'Academic Privacy & Document Safeguards')}
                    {activeModal === 'technical' && (lang === 'fa' ? 'پشتیبانی فنی و مرکز سیستم پورتال' : lang === 'ps' ? 'تخنیکي ملاتړ او پورتال لارښود' : 'Portal Helpdesk & System Support')}
                  </h3>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold block mt-1.5 uppercase tracking-wide">
                    {activeModal === 'guideline' && 'HARIWA UNIVERSITY GENERAL GUIDELINE'}
                    {activeModal === 'privacy' && 'REGULATORY COMPLIANCE PROTOCOLS'}
                    {activeModal === 'technical' && 'SYSTEM HELP & ESCALATION CHANNELS'}
                  </p>
                </div>
              </div>

              {/* Sub-text Context */}
              <p className="text-zinc-600 dark:text-zinc-300 text-xs font-semibold leading-relaxed mb-4">
                {activeModal === 'guideline' && (lang === 'fa' ? 'راهنمای گام‌به‌گام برای تکمیل دوسبه و ارسال پارامترهای تایید اسناد به ریاست تدریسی:' : lang === 'ps' ? 'پوهنتون ته د اسنادو لیږلو او د پذیرش ارزونې مرحلو بشپړ الرښود:' : 'Follow this systematic procedure to successfully upload your credentials for evaluation:')}
                {activeModal === 'privacy' && (lang === 'fa' ? 'کمیته ثبت نام مکلف به حفاظت کامل از اسکان هویت و دوسیه‌های تحصیلی دانشجویان است:' : lang === 'ps' ? 'د دیتابیس مرکز د محصلانو د تذکرو او برقي اسنادو خوندي ساتلو ته په بشپړ ډول ژمن دی:' : 'We operate robust protocols to ensure absolute compliance with national database privacy standardizations:')}
                {activeModal === 'technical' && (lang === 'fa' ? 'در صورت مواجهه با لودینگ نامحدود، خطای آپلود اسناد یا نقص فنی در فرم با ما در تماس شوید:' : lang === 'ps' ? 'که چیرې د فایل په اپلوډ کې له ستونزو یا تخنیکي کارندویه خنډ سره مخامخ یاست دلته په تماس کې شئ:' : 'In case of portal upload limits, session timeouts, or local registry exceptions, contact our tech support:')}
              </p>

              {/* Guide / Safeguard Steps List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {activeModal === 'guideline' && (lang === 'fa' ? [
                  '۱. ابتدا در پورتال یک حساب کاربری جدید به اسم خود ایجاد کنید.',
                  '۲. از بخش منوی ناوبری به پورتال دانشجویی (داشبورد) بروید.',
                  '۳. فرم مشخصات شامل نام، نام پدر، آدرس و شماره تماس خود را خانه پری کنید.',
                  '۴. دانشکده و دیپارتمنت مورد نظر خود را انتخاب نمایید.',
                  '۵. عکس رسمی، فایل اسکن تذکره و شهادتنامه مکتب خود را آپلود کنید.',
                  '۶. دوسیه را ارسال کرده و وضعیت ارزیابی را در جدول وضعیت شمولیت دنبال کنید.'
                ] : lang === 'ps' ? [
                  '۱. لومړی د "اکونټ جوړول" مینو کې خپل کارن حساب خلاص کړئ.',
                  '۲. د پورتال مینو څخه خپل محصل پورتال ته لاړ شئ.',
                  '۳. خپل مشخصات لکه نوم، د پلار نوم، ادرس او دقیق تلفن شمیره په فارم کې ولیکئ.',
                  '۴. خپل د پام وړ پوهنځی او ډیپارټمنټ وټاکئ.',
                  '۵. خپل عکس، تذکره او د دولسم ټولګي اسکن شوې شهادتنامه په سمه او روښانه ټوګه اپلوډ کړئ.',
                  '۶. فارم په نهایی ډول ثبت کړئ او بيا یې په پورتال کې پایلې وڅارئ.'
                ] : [
                  '1. Initialize your secure student login credentials on the portal.',
                  '2. Navigate into your dedicated Student Dashboard.',
                  '3. Complete all required fields on the Student Registration Form accurately.',
                  '4. Match your desired Curriculum Segment stream faculty allocations.',
                  '5. Upload high-quality graphical scans of your profile photo, Tazkira ID, and High School Diploma Transcript.',
                  '6. Submit your packet and track real-time evaluate notes inside the Registry status board.'
                ]).map((step, idx) => (
                  <div key={idx} className="p-3 bg-zinc-50 dark:bg-blue-950/10 border border-zinc-200/50 dark:border-blue-900/10 rounded-xl text-xs text-zinc-700 dark:text-zinc-200 font-semibold leading-relaxed flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                    <span>{step.substring(2)}</span>
                  </div>
                ))}

                {activeModal === 'privacy' && (lang === 'fa' ? [
                  'امنیتی پیشرفته: تمام فایل‌های آپلود شده (عکس، تذکره، شهادتنامه) به طور کامل رمزگذاری شده و در سرورهای محلی و امن آرشیو می‌گردند.',
                  'دسترسی طبقه بندی شده: صرفاً اعضای رسمی کمیته ارزیابی اسناد و ریاست تدریسی اجازه بازبینی این اسناد را دارند.',
                  'قانون منع افشا: هیچ بخشی از داده‌های هویتی یا اطلاعات تماس شما در اختیار سازمان‌های ثالث یا تبلیغاتی قرار نخواهد گرفت.',
                  'یکپارچگی رسمی: اسناد شما بعد از تایید نهایی به صورت خودکار به آرشیو دیجیتال وزارت تحصیلات عالی الحاق خواهد گشت.'
                ] : lang === 'ps' ? [
                  'پرمختللي خوندیتوب: ټول اپلوډ شوي حساس تعلیمي اسناد لکه تذکرې او د نمرو جدول د معتبرو کوډونو له لارې خوندي کیږي.',
                  'تړل شوی لاسرسی: یوازې د پوهنتون ریاست، تدریسي مدیریت او د ارزونې رسمي همکاران ددې اسنادو ارزونې حق لري.',
                  'د مالتړ پالیسي: ستاسو شخصي تماسونه او فایلونه د پوهنتون د داخلی حوزې بهر هیچا ته نه برابریږي.',
                  'نظامي سمون: د منلو وروسته اسناد په مستقیم ډول د لوړو زده کړو وزارت رسمي ډیجیټل سیستم ته پورته کېږي.'
                ] : [
                  'Military Grade: Uploaded graphics (e.g. Identity scanned papers or Diplomas) are preserved inside dedicated, air-gapped cryptographic vaults.',
                  'Restricted Clearance: System lookup is strictly limited to authenticated members of the administrative board and department heads.',
                  'Strict Non-Disclosure: No contact parameters, digital files, or metadata logs are sold or transferred to 3rd-party entities.',
                  'Government Sync: On getting authorized, records are programmatically synced with the Ministry of Higher Education archives.'
                ]).map((policy, idx) => {
                  const parts = policy.split(': ');
                  const title = parts.length > 1 ? parts[0] : '';
                  const body = parts.length > 1 ? parts[1] : policy;
                  return (
                    <div key={idx} className="p-3 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-xl text-xs text-zinc-700 dark:text-zinc-200 font-semibold leading-relaxed">
                      {title && <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">{title}</span>}
                      <span>{body}</span>
                    </div>
                  );
                })}

                {activeModal === 'technical' && (
                  <div className="space-y-4">
                    {/* Slogan Banner with University Logo */}
                    <div className="p-3.5 bg-gradient-to-r from-blue-50/50 via-indigo-50/20 to-transparent dark:from-blue-950/20 dark:via-zinc-950/10 dark:to-transparent border-l-4 border-indigo-500 rounded-r-xl flex items-center gap-3">
                      <div className="w-8.5 h-8.5 rounded-full overflow-hidden shrink-0 bg-white border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <img src={universityLogo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="text-left font-sans">
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100">تعهد امروز، تخصص فردا</p>
                        <p className="text-[9.5px] text-zinc-400 font-semibold uppercase tracking-wider leading-none mt-0.5">Commitment Today, Specialization Tomorrow</p>
                      </div>
                    </div>

                    {/* Contact Details Grid */}
                    <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3.5 text-xs text-zinc-700 dark:text-zinc-200 font-semibold font-sans text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2.5 gap-1.5">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Building className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>{lang === 'fa' ? 'آمریت دفتر ریاست:' : lang === 'ps' ? 'د ریاست دفتر امریت:' : 'Office of President:'}</span>
                        </div>
                        <a 
                          href={`tel:${portalSettings.presidentPhone || '0794654000'}`}
                          className="font-mono text-zinc-800 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 select-all text-sm font-bold transition-colors cursor-pointer" 
                          dir="ltr"
                        >
                          {portalSettings.presidentPhone || '0794654000'}
                        </a>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2.5 gap-1.5">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Phone className="w-4 h-4 text-green-500 shrink-0" />
                          <span>{lang === 'fa' ? 'پذیرش و معلومات:' : lang === 'ps' ? 'پذیرش او معلومات:' : 'Admissions & Info:'}</span>
                        </div>
                        <a 
                          href={`tel:${portalSettings.phone || '0799600344'}`}
                          className="font-mono text-zinc-800 dark:text-zinc-100 hover:text-green-600 dark:hover:text-green-400 select-all text-sm font-bold transition-colors cursor-pointer"
                          dir="ltr"
                        >
                          {portalSettings.phone || '0799600344'}
                        </a>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2.5 gap-1.5">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>{lang === 'fa' ? 'ایمیل آدرس رسمی:' : lang === 'ps' ? 'رسمي برېښنالیک پته:' : 'Official E-Mail:'}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs font-bold" dir="ltr">
                          <a 
                            href={`mailto:${portalSettings.email || 'admissions@hariwa.edu.af'}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {portalSettings.email || 'admissions@hariwa.edu.af'}
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                          <span>{lang === 'fa' ? 'آدرس دانشگاه:' : lang === 'ps' ? 'د پوهنتون پته:' : 'University Address:'}</span>
                        </div>
                        <span className="text-[11.5px] text-zinc-600 dark:text-zinc-400 font-bold pl-6 leading-relaxed">
                          {lang === 'fa' 
                            ? (portalSettings.addressFa || 'هرات، پنج راه آب‌بخش بادمرغان، جاده شرقی، فردوسی ۱۵')
                            : lang === 'ps' 
                            ? (portalSettings.addressPs || portalSettings.addressFa || 'هرات، پنج راه آب‌بخش بادمرغان، جاده شرقي، فردوسي ۱۵') 
                            : (portalSettings.addressEn || 'Herat, Panj Rah Abbakhsh Badmorghan, East Road, Ferdowsi 15')}
                        </span>
                      </div>
                    </div>

                    {/* Social Channels Block (ONLY icons as requested) */}
                    <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3 text-center">
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        {lang === 'fa' ? 'شبکه‌های اجتماعی و وب‌سایت رسمی:' : lang === 'ps' ? 'رسمي شبکې او ویب پاڼه:' : 'OFFICIAL SOCIAL CHANNELS & PORTAL:'}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
                        <a 
                          href="https://t.me/Hariwa_edu" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Telegram Channel (@Hariwa_edu)"
                          className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 text-zinc-600 hover:text-blue-500 hover:scale-105 transition-all shadow-sm"
                        >
                          <Send className="w-5 h-5 text-blue-500 shrink-0" />
                        </a>

                        <a 
                          href="https://t.me/HariwaUniversity" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Telegram Group (@HariwaUniversity)"
                          className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-indigo-500 text-zinc-600 hover:text-indigo-500 hover:scale-105 transition-all shadow-sm"
                        >
                          <Send className="w-5 h-5 text-indigo-500 shrink-0" />
                        </a>

                        <a 
                          href="https://instagram.com/hariwa_university" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Instagram (@hariwa_university)"
                          className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-pink-400 dark:hover:border-pink-500 text-zinc-600 hover:text-pink-500 hover:scale-105 transition-all shadow-sm"
                        >
                          <Instagram className="w-5 h-5 text-pink-500 shrink-0" />
                        </a>

                        <a 
                          href="https://facebook.com/HariwaHigherEducationInstit" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Facebook (HariwaHigherEducationInstit)"
                          className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-500 text-zinc-600 hover:text-blue-600 hover:scale-105 transition-all shadow-sm"
                        >
                          <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0" />
                        </a>

                        <a 
                          href="https://www.hariwa.edu.af/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Official Website (www.hariwa.edu.af)"
                          className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 text-zinc-600 hover:text-emerald-500 hover:scale-105 transition-all shadow-sm"
                        >
                          <Globe className="w-5 h-5 text-emerald-500 shrink-0" />
                        </a>
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-50 dark:bg-blue-950/10 border border-zinc-200/50 dark:border-blue-900/10 rounded-xl text-[11px] text-zinc-400 font-medium text-center">
                      {lang === 'fa' ? 'توجه: خطوط تیلفونی روزهای جمعه و تعطیلات رسمی پاسخگو نیستند.' : lang === 'ps' ? 'یادونه: د جمعې په ورځو او رسمي رخصتیو کې تلیفونونه بند وي.' : 'Schedules are open Sat - Thu from 8:00 AM to 4:00 PM.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Close CTA footer */}
              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-blue-900/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 border border-zinc-250 dark:border-blue-900/20 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer transition-all"
                >
                  {lang === 'fa' ? 'فهمیدم و بستن' : lang === 'ps' ? 'بندول' : 'Acknowledge & Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 6. COMPREHENSIVE FACULTY INFORMATION MODAL */}
        {facultyModalKey && streamData[facultyModalKey] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFacultyModalKey(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            />

            {/* Modal Card */}
            {(() => {
              const faculty = streamData[facultyModalKey];
              const FacIcon = faculty.icon;
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto"
                >
                  {/* Top Bar / Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm">
                        <FacIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 px-2.5 py-0.5 rounded-md font-sans">
                            {lang === 'fa' ? 'دانشکده رسمی دانشگاه هریوا' : lang === 'ps' ? 'د هریوا پوهنتون رسمي پوهنځی' : 'Hariwa University Faculty'}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 px-2 py-0.5 rounded-md">
                            {lang === 'fa' ? 'تایید وزارت تحصیلات عالی' : lang === 'ps' ? 'د لوړو زده کړو وزارت تایید' : 'MoHE Accredited'}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
                          {faculty.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                            {faculty.degree}
                          </span>
                          <span className="font-mono text-[10px] sm:text-[11px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/60">
                            {faculty.badge}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => setFacultyModalKey(null)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 4 Key Pillars Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-[11px] font-bold">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                        <span>{lang === 'fa' ? 'مقطع تحصیلی' : lang === 'ps' ? 'تحصیلي کچه' : 'Degree Level'}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-white leading-snug truncate">
                        {faculty.degree}
                      </p>
                    </div>

                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-[11px] font-bold">
                        <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                        <span>{lang === 'fa' ? 'مدت دوره' : lang === 'ps' ? 'د دورې موده' : 'Duration'}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-white leading-snug font-mono">
                        {faculty.duration}
                      </p>
                    </div>

                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-[11px] font-bold">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                        <span>{lang === 'fa' ? 'ظرفیت پذیرش' : lang === 'ps' ? 'د جذب ظرفیت' : 'Quota Seats'}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 leading-snug font-mono">
                        {faculty.totalSeats} <span className="font-sans text-xs font-semibold text-zinc-600 dark:text-zinc-400">{lang === 'fa' ? 'صندلی' : lang === 'ps' ? 'څوکۍ' : 'Seats'}</span>
                      </p>
                    </div>

                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-[11px] font-bold">
                        <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                        <span>{lang === 'fa' ? 'شرط نمرات' : lang === 'ps' ? 'د نمرو شرط' : 'Min. GPA'}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 leading-snug font-mono">
                        {faculty.minGrade}
                      </p>
                    </div>
                  </div>

                  {/* Section: Overview */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-sans">
                      <Info className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                      <span>{lang === 'fa' ? 'معرفی و دیدگاه کلی دانشکده' : lang === 'ps' ? 'د پوهنځي عمومي پيژندنه او لیدلوری' : 'FACULTY OVERVIEW & MISSION'}</span>
                    </h4>
                    <div className="p-4 bg-blue-50/40 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/50 rounded-2xl">
                      <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-semibold leading-relaxed">
                        {faculty.overview}
                      </p>
                    </div>
                  </div>

                  {/* Section: Departments */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-sans">
                      <Layers className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                      <span>{lang === 'fa' ? 'دیپارتمنت‌های فعال و مضامین تخصصی' : lang === 'ps' ? 'فعالې څانګې او تخصصي مضامین' : 'ACADEMIC DEPARTMENTS & CURRICULUM'}</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {faculty.deps.map((dep, idx) => (
                        <div key={idx} className="p-4 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 rounded-2xl space-y-2.5 overflow-hidden">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-white leading-tight break-words">
                              {dep.name}
                            </h5>
                            <span className="text-[11px] font-black font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-2 py-0.5 rounded-md shrink-0">
                              {dep.seats} <span className="font-sans text-[10px] font-normal">{lang === 'fa' ? 'صندلی' : lang === 'ps' ? 'څوکۍ' : 'Seats'}</span>
                            </span>
                          </div>
                          {dep.desc && (
                            <p className="text-[11.5px] text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed break-words">
                              {dep.desc}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold pt-1.5 border-t border-zinc-200 dark:border-zinc-700/70">
                            <span className="text-zinc-400 font-medium text-[10px]">{lang === 'fa' ? 'حداقل نمره:' : lang === 'ps' ? 'لږترلږه نمرې:' : 'Min Req:'}</span>
                            <span className="font-mono font-black">{dep.req}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section: Facilities */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-sans">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>{lang === 'fa' ? 'لابراتوارها و امکانات عملی' : lang === 'ps' ? 'عملي لابراتوارونه او اسانتیاوې' : 'PRACTICAL LABORATORIES & FACILITIES'}</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {faculty.facilities.map((facility, idx) => (
                        <div key={idx} className="p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/70 rounded-xl flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-zinc-800 dark:text-zinc-200 font-semibold leading-relaxed">
                            {facility}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section: Career Opportunities */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-sans">
                      <Briefcase className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                      <span>{lang === 'fa' ? 'فرصت‌های شغلی و بازار کار فارغ‌التحصیلان' : lang === 'ps' ? 'د فراغت وروسته کاري فرصتونه' : 'CAREER PROSPECTS & INDUSTRY OUTCOMES'}</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {faculty.careers.map((career, idx) => (
                        <div key={idx} className="p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/70 rounded-xl flex items-start gap-2.5">
                          <ArrowRight className={`w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5 ${lang === 'fa' || lang === 'ps' ? 'rotate-180' : ''}`} />
                          <span className="text-xs text-zinc-800 dark:text-zinc-200 font-semibold leading-relaxed">
                            {career}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modal Action Footer */}
                  <div className={`pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 ${lang === 'fa' || lang === 'ps' ? 'sm:flex-row-reverse' : ''}`}>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setFacultyModalKey(null);
                          onNavigate(isLoggedIn ? getDashboardRoute() : '/student/register');
                        }}
                        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>{lang === 'fa' ? 'ثبت‌نام آنلاین در این دانشکده' : lang === 'ps' ? 'په دې پوهنځي کې آنلاین نوم لیکنه' : 'Apply For This Faculty'}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFacultyModalKey(null)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      {lang === 'fa' ? 'بستن' : lang === 'ps' ? 'بندول' : 'Close'}
                    </button>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
