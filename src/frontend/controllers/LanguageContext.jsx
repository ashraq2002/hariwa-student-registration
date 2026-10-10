import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    univName: 'Hariwa University',
    portalSub: 'Registration Portal',
    logOut: 'Log Out',
    logIn: 'Log In',
    register: 'Register',
    backToHome: 'Back to Home',
    menuHome: 'Home',
    studentSide: 'Student Portal',
    adminSide: 'Admin Portal',

    // Sidebar
    menuDashboard: 'Dashboard',
    menuForm: 'Enrollment Form',
    menuStatus: 'Status Tracker',
    menuTriage: 'Triage Queue',
    menuRegistry: 'Student Registry',

    // Home Page (Unboring!)
    heroTitle: 'Shape Your Future at Hariwa University',
    heroSub: 'Verify academic profiles, upload credentials, and track your admission status instantly in Afghanistan\'s premier digital registrar.',
    getStarted: 'Get Started',
    whyChooseUs: 'Why Choose Hariwa University?',
    whys: [
      { t: 'Secure Processing', d: 'Fast track review systems mapping transcripts securely with instant personnel feedback.' },
      { t: 'Live Status Alerts', d: 'Interactive milestones charting your submitted parameters from triaged queues to final approvals.' },
      { t: 'Smart Verification', d: 'Digitized credentials validation enabling authenticated certificate slips and print queues.' }
    ],
    readyToApply: 'Ready to join our community?',
    createAccountNow: 'Create an account and start your registration form in minutes.',
    quickStats: 'Live Registry Statistics Counter',
    statsTotalSignups: 'Total Registrations',
    statsPendingReviews: 'Pending Triage',
    statsApprovedStudents: 'Admitted Scholars',
    statsActiveFaculties: 'Faculties Stream',
    recentReviewsFeed: 'Live Registrar Transparency Log',
    admissionStatus: 'Status',
    lastUpdated: 'Updated',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      { q: 'What is the standard processing threshold?', a: 'Hariwa University administrative personnel typically complete full transcript indexing and verification in less than 24 hours.' },
      { q: 'What should I do if my papers need correction?', a: 'Your Student Status panel will display the review notes. Just modify any blurred scan or correction details and re-submit.' }
    ],

    // Login & Register
    welcomeBack: 'Welcome Back, Scholar',
    loginDesc: 'Access your registration desk or secure administrator root.',
    registerTitle: 'Student Registration Account',
    registerDesc: 'Create an account to submit your admission application and verify documents.',
    email: 'Email Address',
    password: 'Password',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    registrationRole: 'Register As',
    studentRole: 'Student Applicant',
    adminRole: 'Portal Registrar / Administrator',
    haveAccount: 'Already have an account? Log In',
    noAccount: 'New to the portal? Create an account',
    emailVerification: 'Email Verification Required',
    enterOtpDesc: 'Please enter the 6-digit verification code dispatched to your email address to activate your account.',
    otpLabel: '6-Digit Verification Code',
    verifyButton: 'Verify Email & Activate',
    resendOtp: 'Resend Verification Code',
    simulatedEmailNotice: 'Simulated Email Transport',
    verifyEmailNow: 'Verify Email Now',

    // Student Dashboard
    studentWelcome: 'Welcome,',
    studentTriageDesc: 'Monitor registry logs, amend faulty details, or print ASU admission credentials.',
    actionRequired: 'Action Required',
    formUncompleted: 'Enrollment form is incomplete. Please submit it.',
    goToForm: 'Go to Form',
    pendingReview: 'Pending Review',
    pendingDesc: 'Documents are safely in queue. Rest assured, registrar personnel will review them shortly.',
    viewStatus: 'View Live Status',
    congrats: 'Congratulations!',
    approvedDesc: 'Your ASU enrollment was approved! Print your official admission slip below.',
    printSlip: 'Print Admission Slip',
    correctionNeeded: 'Correction Needed',
    correctionDesc: 'Evaluator requested corrections. See notes and click modify to resolve.',
    fixForm: 'Modify Details',

    // Registration Form
    formTitle: 'University Enrollment Form',
    formSub: 'Provide official details & high-reso scans. Changes will trigger visual retry.',
    fatherName: 'Father\'s Name',
    phone: 'Phone Number',
    faculty: 'Target Faculty',
    department: 'Major/Department',
    admissionYear: 'Admission Batch Year',
    address: 'Current Living Address',
    photoLabel: 'Passport Photo Specimen',
    tazkiraLabel: 'Tazkira or ID Scan Detail',
    certLabel: 'High School Diploma Transcript',
    dropZoneText: 'Drag and drop image or click to choose file',
    unsupportedFile: 'Text or base64 file preview',
    compSci: 'Computer Science',
    it: 'Information Technology',
    pharmacy: 'Faculty of Pharmacy',
    dentistry: 'Dentistry',
    law: 'Law & Political Science',
    medicine: 'Medicine & Health',
    saving: 'Submitting details...',
    submitForm: 'Submit ASU Enrollment Application',

    // Student Status (Milestones)
    milestoneHeader: 'Academic Milestone Registry',
    registrySubTitle: 'Academic Milestone Registry',
    milestoneSub: 'Verify real-time review queues and access validated certificates.',
    step1: 'Profile Complete',
    step2: 'Document Indexing',
    step3: 'Admissions Review',
    step4: 'Enrollment Confirmed',
    completedLabel: '✓ Completed',
    processingLabel: '● Processing',
    lockedLabel: '○ Locked',
    officialNotes: 'OFFICIAL EVALUATION NOTES:',
    submittedRecord: 'SUBMITTED PARAMETERS RECORD',

    // Admin Dashboard
    adminHead: 'Secure Administrative Root',
    adminSub: 'Verify academic enrollment credentials, assign stream faculties, or audit Tazkira logs.',
    statsTotalSignupsAdmin: 'TOTAL SIGNUPS',
    statsAwaitingTriageAdmin: 'AWAITING TRIAGE',
    statsVerifiedMembersAdmin: 'VERIFIED MEMBERS',
    statsPendingFixesAdmin: 'PENDING FIXES',
    statsRevokedAccessAdmin: 'REVOKED ACCESS',
    recentSignups: 'Recent Registry Signups',
    allRegistry: 'Full Registry →',
    kpiTitle: 'Admissions Efficiency KPI',
    apprRate: 'Overall Approval Rate',
    workload: 'Authorized staff review load',
    averageLat: 'Average triage latency',
    latencyVal: '< 24 Hours',
    goTriageQueue: 'Go to Triage Queue',

    // Students List (Admin)
    registryHead: 'University Enrollment Registry',
    registrySub: 'Manage complete database indexes. Set workflow queues for individual records.',
    reloadSet: 'Reload Dataset',
    searchPlaceholder: 'Search by full name, major department, or phone...',
    filterAllStatus: 'All Verification Statuses',
    filterPending: 'Pending Audit',
    filterApproved: 'Approved Status',
    filterCorrection: 'Needs Correction',
    filterRejected: 'Rejected',
    filterAllFaculties: 'All Faculties',
    tableHeaderDetails: 'Student Details',
    tableHeaderFaculty: 'Faculty Stream',
    tableHeaderStatus: 'Status Class',
    tableHeaderDate: 'Submission Date',
    tableHeaderAction: 'Administrative Actions',
    actionReview: 'Review details',
    actionApprove: 'Approve',
    actionReject: 'Reject',

    // Student Details
    returnRegistry: 'Return to Applicant List Registry',
    evalNotesLabel: 'EVALUATOR RECONCILIATION NOTES',
    evalNotesPlaceholder: 'Describe credentials validity status or list corrections needed if flagging as correctionRequired...',
    actionApproveBtn: 'Approve Admission',
    actionFlagBtn: 'Request Corrections',
    actionRejectBtn: 'Reject Application',
    guidelineTitle: 'Evaluator Guideline',
    guidelineDesc: 'Once student is flagged as Approved, their dashboard displays ASU Admissions validation cards instantly.'
  },
  fa: {
    // Navbar
    univName: 'دانشگاه هریوا',
    portalSub: 'پورتال ثبت نام نهایی',
    logOut: 'خروج از حساب',
    logIn: 'ورود به سیستم',
    register: 'ثبت نام جدید',
    backToHome: 'بازگشت به صفحه اصلی',
    menuHome: 'صفحه اصلی',
    studentSide: 'پورتال دانشجویی',
    adminSide: 'پورتال مدیریت',

    // Sidebar
    menuDashboard: 'داشبورد شما',
    menuForm: 'فورم شمولیت',
    menuStatus: 'وضعیت بررسی',
    menuTriage: 'صف بررسی اسناد',
    menuRegistry: 'لیست کل ثبت‌نام‌ها',

    // Home Page (Unboring!)
    heroTitle: 'آینده خود را در دانشگاه هریوا بسازید',
    heroSub: 'پروفایل آکادمیک خود را تایید کنید، مدارک لازم را آپلود نموده و وضعیت قبولی خود را فوراً در معتبرترین مرکز ثبت دیجیتالی افغانستان پیگیری کنید.',
    getStarted: 'شروع کنید',
    whyChooseUs: 'چرا پورتال دیجیتال هریوا؟',
    whys: [
      { t: 'بررسی سریع اسناد', d: 'سیستم ثبت دقیق و سریع اسناد با امکان بازخورد آنی کارشناسان پذیرش دانشگاه.' },
      { t: 'تعقیب لحظه‌ای وضعیت', d: 'نمایش گرافیکی مراحل بررسی پرونده از صف ارزیابی اولیه تا پذیرش نهایی.' },
      { t: 'تایید هوشمند مدارک', d: 'دیجیتالی‌سازی تذکره همرا با امکان چاپ مستقیم کارت پذیرش محصلین.' }
    ],
    readyToApply: 'برای پیوستن به ما آماده‌اید؟',
    createAccountNow: 'حساب خود را ایجاد کنید و فورم ثبت نام آنلاین را ظرف چند دقیقه تکمیل نمایید.',
    quickStats: 'آمار زنده ثبت‌نام پذیرش',
    statsTotalSignups: 'کل ثبت‌نام‌ها',
    statsPendingReviews: 'در انتظار بررسی',
    statsApprovedStudents: 'دانشجویان پذیرفته شده',
    statsActiveFaculties: 'رشته‌ها و دانشکده‌ها',
    recentReviewsFeed: 'گزارش زنده و شفاف پذیرش دانشگاه',
    admissionStatus: 'وضعیت',
    lastUpdated: 'تاریخ بروزرسانی',
    faqTitle: 'سوالات متداول',
    faqs: [
      { q: 'مدت زمان بررسی پرونده‌ها چقدر است؟', a: 'کارمندان بخش پذیرش دانشگاه هریوا معمولاً اسناد را در کمتر از ۲۴ ساعت بررسی می‌کنند.' },
      { q: 'اگر اسناد من نیاز به اصلاح داشته باشد چه کنم؟', a: 'توضیحات اصلاحی ارزیاب در پنل وضعیت به شما نشان داده می‌شود. فقط کافی است اسناد اصلاح شده را مجدداً آپلود کنید.' }
    ],

    // Login & Register
    welcomeBack: 'خوش آمدید، دانشجوی محترم',
    loginDesc: 'به میز کار پذیرش خود یا روت مدیریتی وارد شوید.',
    registerTitle: 'ایجاد حساب کاربری متقاضی',
    registerDesc: 'جهت ثبت‌نام آنلاین و ارسال اسناد پذیرش دانشگاه، حساب دانشجویی ایجاد کنید.',
    email: 'آدرس ایمیل',
    password: 'رمز عبور',
    fullName: 'نام و تخلص',
    confirmPassword: 'تایید رمز عبور',
    registrationRole: 'نوع کاربری',
    studentRole: 'دانشجوی متقاضی',
    adminRole: 'بخش مدیریت پذیرش',
    haveAccount: 'قبلاً ثبت‌نام کرده‌اید؟ وارد شوید',
    noAccount: 'حساب کاربری ندارید؟ ثبت‌نام کنید',
    emailVerification: 'تایید آدرس ایمیل',
    enterOtpDesc: 'لطفاً کد ۶ رقمی تایید ارسال شده به ایمیل خود را برای فعال‌سازی حساب کاربری وارد نمایید.',
    otpLabel: 'کد ۶ رقمی تایید',
    verifyButton: 'تایید و ورود به سیستم',
    resendOtp: 'ارسال مجدد کد تایید',
    simulatedEmailNotice: 'سیستم ارسال کد ایمیل',
    verifyEmailNow: 'تایید فوری ایمیل',

    // Student Dashboard
    studentWelcome: 'خوش آمدید،',
    studentTriageDesc: 'پرونده‌های تایید شده خود را بررسی کنید، نقایص اسناد را برطرف نموده یا کارت شمولیت را چاپ کنید.',
    actionRequired: 'اقدام لازم است',
    formUncompleted: 'فورم ثبت‌نام شما هنوز تکمیل نشده است. لطفاً آن را ارسال کنید.',
    goToForm: 'تکمیل فورم',
    pendingReview: 'در حال بررسی توسط دانشگاه',
    pendingDesc: 'اسناد شما در صف بررسی است. کارمندان پذیرش بزودی مدارک شما را تایید خواهند کرد.',
    viewStatus: 'مشاهده وضعیت زنده',
    congrats: 'تبریک می‌گوییم!',
    approvedDesc: 'درخواست شمولیت شما به طور رسمی تایید شد! می‌توانید کارت پذیرش خود را چاپ کنید.',
    printSlip: 'چاپ سند پذیرش دانشگاه',
    correctionNeeded: 'نیاز به اصلاحات',
    correctionDesc: 'ارزیاب دانشگاه نقصی در مدارک شما شناسایی کرده است. جهت اصلاح کلیک کنید.',
    fixForm: 'اصلاح و ویرایش فورم',

    // Registration Form
    formTitle: 'فورم شمولیت و ثبت نام دانشگاه',
    formSub: 'مشخصات رسمی خود را همراه با اسناد باکیفیت ارسال کنید. هرگونه تغییر نیاز به ارزیابی مجدد دارد.',
    fatherName: 'نام پدر / ولد',
    phone: 'شماره تماس',
    faculty: 'دانشکده مورد نظر',
    department: 'دیپارتمنت / رشته',
    admissionYear: 'سال تحصیلی پذیرش',
    address: 'آدرس فعلی سکونت',
    photoLabel: 'عکس پرسونلی متقاضی',
    tazkiraLabel: 'اسکن تذکره تابعیت',
    certLabel: 'اسکن شهادتنامه صنف دوازدهم',
    dropZoneText: 'فایل را اینجا رها کنید یا برای آپلود کلیک کنید',
    unsupportedFile: 'پیش‌نمایش تصویر یا متن اسکن',
    compSci: 'کمپیوتر ساینس',
    it: 'تکنالوژی معلوماتی',
    pharmacy: 'پوهنځی فارمسی',
    dentistry: 'طب دندان (ستوماتولوژی)',
    law: 'حقوق و علوم سیاسی',
    medicine: 'طب معالجوی',
    saving: 'در حال ارسال اطلاعات...',
    submitForm: 'ارسال رسمی درخواست پذیرش به سرور',

    // Student Status (Milestones)
    milestoneHeader: 'جدول مراحل پذیرش تحصیلی محصلین',
    registrySubTitle: 'جدول مراحل پذیرش تحصیلی محصلین',
    milestoneSub: 'بررسی لحظه‌یی صفوف ارزیابی دانشگاه و دسترسی به کارت‌های تایید هویت.',
    step1: 'تکمیل پروفایل',
    step2: 'بررسی و ایندکس مدارک',
    step3: 'ارزیابی نهایی کمیته پذیرش',
    step4: 'پذیرش رسمی در دانشگاه',
    completedLabel: '✓ تکمیل شده',
    processingLabel: '● در حال پردازش',
    lockedLabel: '○ قفل شده',
    officialNotes: 'یادداشت‌های رسمی ارزیاب پذیرش:',
    submittedRecord: 'مشخصات ارسالی ثبت شده در پایگاه داده',

    // Admin Dashboard
    adminHead: 'پنل مدیریت رسمی دانشگاه',
    adminSub: 'مدارک متقاضیان را بررسی کنید، دانشکده اختصاص دهید و صحت تذکره‌ها را تایید کنید.',
    statsTotalSignupsAdmin: 'کل کاربران ثبت نامی',
    statsAwaitingTriageAdmin: 'در صف بررسی و ارزیابی',
    statsVerifiedMembersAdmin: 'تایید نهایی شده',
    statsPendingFixesAdmin: 'نیاز به اصلاح مدارک',
    statsRevokedAccessAdmin: 'انصراف و رد پذیرش',
    recentSignups: 'آخرین متقاضیان ثبت‌نام شده',
    allRegistry: 'مشاهده تمام اسناد و فایل‌ها ←',
    kpiTitle: 'شاخص کارایی و سرعت پذیرش',
    apprRate: 'نرخ قبولی کل درخواست‌ها',
    workload: 'کیفیت و فشار کاری بخش ارزیابی',
    averageLat: 'میانگین زمان ارزیابی',
    latencyVal: 'کمتر از ۲۴ ساعت',
    goTriageQueue: 'رفتن به صف ارزیابی اسناد',

    // Students List (Admin)
    registryHead: 'دفتر ثبت پذیرش علمی محصلین',
    registrySub: 'مدیریت کامل اطلاعات و رکوردهای دیتابیس ثبت‌نام. تعیین وضعیت اسناد.',
    reloadSet: 'بارگیری مجدد دیتا',
    searchPlaceholder: 'جستجو بر اساس نام متقاضی، دیپارتمنت یا شماره تلفن...',
    filterAllStatus: 'تمام وضعیت‌ها',
    filterPending: 'در انتظار تایید',
    filterApproved: 'پذیرفته شده',
    filterCorrection: 'نیاز به اصلاحات',
    filterRejected: 'رد شده',
    filterAllFaculties: 'تمام دانشکده‌ها',
    tableHeaderDetails: 'مشخصات متقاضی',
    tableHeaderFaculty: 'رشته و دانشکده تحصیلی',
    tableHeaderStatus: 'کلاس وضعیت',
    tableHeaderDate: 'تاریخ ارسال فورم',
    tableHeaderAction: 'اقدامات اداری پذیرش',
    actionReview: 'بررسی جزئیات',
    actionApprove: 'قبول کردن محصل',
    actionReject: 'رد کردن اسناد',

    // Student Details
    returnRegistry: 'بازگشت به لست کل متقاضیان',
    evalNotesLabel: 'یادداشت بررسی و تایید اسناد',
    evalNotesPlaceholder: 'دلایل قبولی محصل یا مشکلات اسناد را جهت اطلاع‌رسانی به محصل درج کنید...',
    actionApproveBtn: 'تایید و پذیرش نهایی',
    actionFlagBtn: 'ارجاع جهت اصلاح مدارک',
    actionRejectBtn: 'رد و لغو درخواست',
    guidelineTitle: 'رهنمای کارشناس ثبت‌نام',
    guidelineDesc: 'هنگامی که متقاضی را تایید کنید، کارت پذیرش نهایی همراه با بارکد برای محصل در پورتالش فعال می‌گردد.'
  },
  ps: {
    // Navbar
    univName: 'هریوا پوهنتون',
    portalSub: 'د نوم لیکنې پورتال',
    logOut: 'له سیسټم څخه وتل',
    logIn: 'ننوتل',
    register: 'نوی حساب',
    backToHome: 'اصلي پاڼې ته ستنېدل',
    menuHome: 'اصلي پاڼه',
    studentSide: 'د محصلانو پورتال',
    adminSide: 'د ادارې پورتال',

    // Sidebar
    menuDashboard: 'ستاسو ډشبورډ',
    menuForm: 'د شمولیت فورمه',
    menuStatus: 'د ارزونې حالت',
    menuTriage: 'د اسنادو کتار',
    menuRegistry: 'د نوم لیکنو بشپړ لیست',

    // Home Page
    heroTitle: 'په هریوا پوهنتون کې خپل راتلونکی جوړ کړئ',
    heroSub: 'خپل علمي پروفایل تایید کړئ، اړین اسناد اپلوډ کړئ، او په افغانستان کې د اعتبار لرونکي ډیجیټل نوم لیکنې مرکز کې خپل د قبلیدو حالت تعقیب کړئ.',
    getStarted: 'پیلوئ',
    whyChooseUs: 'ولې د هریوا ډیجیټل پورتال؟',
    whys: [
      { t: 'د اسنادو چټکه ارزونه', d: 'د پوهنتون د ارزونکو لخوا د اسنادو چټک او کره ارزونې سیسټم د فوري غبرګون سره.' },
      { t: 'د ارزونې تعقیب شېبه په شېبه', d: 'د لومړني ارزونې کټار څخه تر نهایي قبلیدو پورې ستاسو د قضیې ګرافیکي ننداره.' },
      { t: 'د اسنادو هوښیار تایید', d: 'د پیژندپاڼۍ (تذکرې) ډیجیټل کول د منل شویو محصلینو د قبلیدو کارت مستقیم چاپ سره.' }
    ],
    readyToApply: 'زموږ سره یوځای کیدو ته چمتو یاست؟',
    createAccountNow: 'خپل حساب جوړ کړئ او په څو دقیقو کې د آنلاین نوم لیکنې فورمه ډکه کړئ.',
    quickStats: 'د نوم لیکنې او منلو ژوندۍ احصایه',
    statsTotalSignups: 'ټول راجسټر شوي',
    statsPendingReviews: 'د ارزونې په کتار کې',
    statsApprovedStudents: 'منل شوي محصلین',
    statsActiveFaculties: 'پوهنځي او څانګې',
    recentReviewsFeed: 'د پوهنتون د قبلیدو روښانه او شفاف راپور',
    admissionStatus: 'حالت',
    lastUpdated: 'د تازه کولو نېټه',
    faqTitle: 'پرله پسې پوښتنې',
    faqs: [
      { q: 'د اسنادو د ارزونې موده څومره ده؟', a: 'د هریوا پوهنتون د پذیرش کارمندان معمولاً اسناد په ۲۴ ساعتونو کې ارزوي.' },
      { q: 'که زما اسناد سمون ته اړتیا ولري څه باید وکړم؟', a: 'د ارزونکي لخوا څرګندونې ستاسو د حالت پینل کې ښودل کیږي. یوازې سم شوي اسناد بیرته پورته کړئ.' }
    ],

    // Login & Register
    welcomeBack: 'ښه راغلاست، محترم محصل',
    loginDesc: 'خپل د کار مېز یا مدیریتي برخې ته ننوځئ.',
    registerTitle: 'د محصل د نوي حساب جوړول',
    registerDesc: 'د پوهنتون د شمولیت فورمې ډکولو او اسنادو لیږلو لپاره د محصل په توګه نوم لیکنه وکړئ.',
    email: 'برېښنالیک پته',
    password: 'پټ نوم (پاسورډ)',
    fullName: 'بشپړ نوم او تخلص',
    confirmPassword: 'د پاسورډ تایید',
    registrationRole: 'د کارونکي ډول',
    studentRole: 'غوښتونکی محصل',
    adminRole: 'د پذیرش اداره',
    haveAccount: 'مخکې مو حساب جوړ کړی؟ ننوځئ',
    noAccount: 'حساب نه لرئ؟ نوم لیکنه وکړئ',
    emailVerification: 'د برېښنالیک پته تاییدول',
    enterOtpDesc: 'مهرباني وکړئ د خپل حساب د فعالولو لپاره هغه ۶ عددي کوډ ولیکئ چې ستاسو برېښنالیک ته استول شوی.',
    otpLabel: '۶ عددي تایید کوډ',
    verifyButton: 'تایید او سیسټم ته ننوتل',
    resendOtp: 'د تایید کوډ بیا لیږل',
    simulatedEmailNotice: 'د برېښنالیک د استولو سیسټم',
    verifyEmailNow: 'د برېښنالیک سمدستي تایید',

    // Student Dashboard
    studentWelcome: 'ښه راغلاست،',
    studentTriageDesc: 'خپل تایید شوي اسناد وګورئ، نیمګړتیاوې حل کړئ یا خپل د منلو کارت چاپ کړئ.',
    actionRequired: 'اړین ګام',
    formUncompleted: 'ستاسو د نوم لیکنې فورمه لا هم بشپړه شوې نه ده. هیله ده ویې لیږئ.',
    goToForm: 'د فورمې بشپړول',
    pendingReview: 'پوهنتون لخوا د ارزونې په حال کې',
    pendingDesc: 'ستاسو اسناد په کتار کې دي. د پذیرش کارمندان به ډیر ژر ستاسو اسناد تایید کړي.',
    viewStatus: 'د ژوندي حالت لیدل',
    congrats: 'مبارک شه!',
    approvedDesc: 'پوهنتون کې ستاسو د منلو غوښتنه تایید شوه! تاسو کولی شئ خپل رسمي کارت چاپ کړئ.',
    printSlip: 'د داخلې کارت چاپول',
    correctionNeeded: 'سمون ته اړتیا لري',
    correctionDesc: 'د پوهنتون ارزونکي ستاسو په مدارکو کې نیمګړتیا موندلې. د حل لپاره دلته کلیک وکړئ.',
    fixForm: 'د معلوماتو سمول او کارول',

    // Registration Form
    formTitle: 'د پوهنتون د نوم لیکنې او داخلې فورمه',
    formSub: 'خپل رسمي معلومات د کیفیت لرونکو اسنادو سره واستوئ. هر مکرر بدلون بیا ارزونې ته اړتیا لري.',
    fatherName: 'د پلار نوم / ولد',
    phone: 'ټلیفون شمیره',
    faculty: 'غوښتل شوی پوهنځی',
    department: 'رشته / ډیپارټمنټ',
    admissionYear: 'د داخلې تحصیلي کال',
    address: 'د اوسیدو فعلي پته',
    photoLabel: 'د غوښتونکي پرسونلي عکس',
    tazkiraLabel: 'د تابعیت تذکرې اسکن',
    certLabel: 'د دولسم ټولګي د شهادتنامې اسکن',
    dropZoneText: 'فایل دلته پریږدئ یا د اپلوډ لپاره کلیک وکړئ',
    unsupportedFile: 'د تصویر یا متن مخکتنه',
    compSci: 'کمپیوټر ساینس',
    it: 'معلوماتي ټکنالوژي',
    pharmacy: 'د فارمسۍ پوهنځی',
    dentistry: 'د غاښونو طب (ستوماتولوژي)',
    law: 'حقوق او سیاسي علوم',
    medicine: 'معالجوي طب',
    saving: 'د معلوماتو د خوندي کېدو په حال کې...',
    submitForm: 'سرور ته د داخلې غوښتنلیک رسمي استول',

    // Student Status (Milestones)
    milestoneHeader: 'د محصلانو د قبلیدو پړاوونو مهال ویش',
    registrySubTitle: 'د محصلانو د قبلیدو پړاوونو مهال ویش',
    milestoneSub: 'د پوهنتون د ارزونې کتارونو تعقیبول او تایید شوي کارت ته لاسرسی.',
    step1: 'د پروفایل بشپړول',
    step2: 'د اسنادو کتنه او ایندکس کول',
    step3: 'د قبلیدو نهایي ارزونه',
    step4: 'په رسمي توګه منل کېدل',
    completedLabel: '✓ بشپړ شوی',
    processingLabel: '● په جریان کې',
    lockedLabel: '○ تړل شوی',
    officialNotes: 'د ارزونکي رسمي څرګندونې:',
    submittedRecord: 'استول شوي معلومات چې په ډیټابیس کې ثبت شوي',

    // Admin Dashboard
    adminHead: 'د پوهنتون رسمي مدیریت پینل',
    adminSub: 'د غوښتونکو اسناد وڅارئ، پوهنځی ورکړئ او د تذکرو صحت تایید کړئ.',
    statsTotalSignupsAdmin: 'ټول راجسټر شوي',
    statsAwaitingTriageAdmin: 'د ارزونې په تمه',
    statsVerifiedMembersAdmin: 'نهایي تایید شوي',
    statsPendingFixesAdmin: 'سمون ته اړتیا لرونکي اسناد',
    statsRevokedAccessAdmin: 'رد شوي او منسوخ شوي',
    recentSignups: 'وروستي راجسټر شوي غوښتونکي',
    allRegistry: 'د ټولو اسنادو لیدل ←',
    kpiTitle: 'د کار سرعت او د فعالیت شاخص',
    apprRate: 'د ټولو غوښتنو د قبلیدو فیصدي',
    workload: 'کاري فشار او د کار کیفیت ارزونه',
    averageLat: 'د ارزونې منځنی وخت',
    latencyVal: 'تر ۲۴ ساعتونو لږ',
    goTriageQueue: 'د اسنادو ارزونې کتار ته تلل',

    // Students List (Admin)
    registryHead: 'د محصلانو د داخلې د ثبت کتاب',
    registrySub: 'د ډیتبس د ریکاډونو بشپړ مدیریت او د اسنادو حالت ټاکل.',
    reloadSet: 'د معلوماتو بارګیري',
    searchPlaceholder: 'د غوښتونکي د نوم، ډیپارټمنټ یا تماس شمیرې له مخې لټون...',
    filterAllStatus: 'ټول حالتونه',
    filterPending: 'ارزونې ته چمتو',
    filterApproved: 'منل شوي',
    filterCorrection: 'سمون ته اړتیا لري',
    filterRejected: 'رد شوي',
    filterAllFaculties: 'ټول پوهنځي',
    tableHeaderDetails: 'د غوښتونکي مشخصات',
    tableHeaderFaculty: 'څانګه او پوهنځی',
    tableHeaderStatus: 'د حالت ډول',
    tableHeaderDate: 'د فورم د استولو نېټه',
    tableHeaderAction: 'اداري پریکړې',
    actionReview: 'جزئیات کتل',
    actionApprove: 'محصل منل',
    actionReject: 'اسناد ردول',

    // Student Details
    returnRegistry: 'د غوښتونکو بشپړ لیست ته ستنیدل',
    evalNotesLabel: 'د اسنادو د تصدیق یادښتونه',
    evalNotesPlaceholder: 'د محصل د قبلیدو یا د اسنادو د نیمګړتیا توضیح د یو چا د معلوماتو لپاره دلته ولیکئ...',
    actionApproveBtn: 'تایید او نهایی قبولي',
    actionFlagBtn: 'د اسنادو سمون غوښتنه',
    actionRejectBtn: 'د غوښتنلیک ردول',
    guidelineTitle: 'د ارزونکي الرښود',
    guidelineDesc: 'کله چې محصل تایید شي، د قبلیدو کارت د بارکوډ سره یوځای به د محصل په مخ پاڼه کې ښکاره شي.'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLangInternal] = useState(() => {
    return localStorage.getItem('uniport_lang') || 'en';
  });

  const setLang = (newLang) => {
    localStorage.setItem('uniport_lang', newLang);
    setLangInternal(newLang);
  };

  useEffect(() => {
    // Dynamic RTL handling if needed
    if (lang === 'fa' || lang === 'ps') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = lang;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
