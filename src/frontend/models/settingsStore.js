export const DEFAULT_PORTAL_SETTINGS = {
  universityNameFa: 'دانشگاه هریوا',
  universityNamePs: 'د هریوا پوهنتون',
  universityNameEn: 'Hariwa University',
  sloganFa: 'تعهد امروز، تخصص فردا',
  sloganPs: 'د نن ژمنه، د سبا تخصص',
  sloganEn: "Today's Commitment, Tomorrow's Expertise",
  academicYear: '2026',
  semester: 'Semester 1 (Freshman)',
  addressFa: 'هرات، پنج راه آب‌بخش بادمرغان، جاده شرقی، فردوسی ۱۵',
  addressPs: 'هرات، پنج راه آب‌بخش بادمرغان، جاده شرقي، فردوسي ۱۵',
  addressEn: 'Herat, Panj Rah Abbakhsh Badmorghan, East Road, Ferdowsi 15',
  phone: '0799600344',
  phoneInternational: '+93 799 600 344',
  presidentPhone: '0794654000',
  presidentPhoneInternational: '+93 794 654 000',
  email: 'admissions@hariwa.edu.af',
  emailSecondary: 'info@hariwa.edu.af',
  website: 'https://www.hariwa.edu.af/',
  telegram: '@Hariwa_edu',
  
  // Registration & Admissions
  registrationOpen: true,
  deadlineNoticeFa: 'مهلت نهایی ارزیابی و تصدیق اسناد کانکور تا ۱۵ جون ۲۰۲۶ می‌باشد.',
  deadlineNoticePs: 'د اسنادو د تصدیق لړۍ د جون په ۱۵مه پای ته رسیږي.',
  deadlineNoticeEn: 'Credential validation for fall intake closes on June 15, 2026.',
  requireTazkira: true,
  requireDiploma: true,
  autoGenerateCard: true,
  
  // Announcement banner
  showAnnouncementBanner: true,
  announcementTextFa: 'ثبت‌نام سال تحصیلی ۲۰۲۶ آغاز شد. متقاضیان محترم می‌توانند فرم شمولیت را تکمیل نمایند.',
  announcementTextPs: 'د ۲۰۲۶ تحصیلي کال لپاره نوم لیکنه پیل شوه. محصلین کولی شي خپل اسناد ثبت کړي.',
  announcementTextEn: 'Admissions open for academic year 2026. Prospective students may complete registration.',

  // Faculty Capacities
  capacities: {
    cs: 120,
    law: 100,
    pharmacy: 80,
    dentistry: 60,
  }
};

export function getPortalSettings() {
  if (typeof window === 'undefined') return { ...DEFAULT_PORTAL_SETTINGS };
  try {
    const saved = localStorage.getItem('uniport_web_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.phone === '+93 799 123 456') {
        parsed.phone = DEFAULT_PORTAL_SETTINGS.phone;
      }
      if (parsed.capacities) {
        if (!parsed.capacities.pharmacy && parsed.capacities.economics) {
          parsed.capacities.pharmacy = parsed.capacities.economics;
        }
        delete parsed.capacities.economics;
      }
      return { ...DEFAULT_PORTAL_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse portal settings', e);
  }
  return { ...DEFAULT_PORTAL_SETTINGS };
}

export function savePortalSettings(newSettings) {
  if (typeof window === 'undefined') return newSettings;
  try {
    const current = getPortalSettings();
    const merged = { ...current, ...newSettings };
    localStorage.setItem('uniport_web_settings', JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('uniport_settings_updated', { detail: merged }));
    return merged;
  } catch (e) {
    console.error('Failed to save portal settings', e);
    return newSettings;
  }
}
