import React from 'react';
import { Eye, User, Phone, BookOpen, Calendar, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { useLanguage } from '../controllers/LanguageContext.jsx';

export default function StudentCard({ application, onView, onStatusUpdate, onDelete }) {
  const { lang } = useLanguage();

  if (!application) return null;

  const showApprove = onStatusUpdate && application.status !== 'Approved';
  const showReject = onStatusUpdate && application.status !== 'Rejected';

  const formatFaculty = (rawFaculty) => {
    if (!rawFaculty) return '';
    const lower = rawFaculty.toLowerCase().trim();
    if (lower.includes('dentist') || lower.includes('stomatolog') || lower.includes('دندان')) {
      return lang === 'fa' ? 'طب دندان (ستوماتولوژی)' : lang === 'ps' ? 'د غاښونو طب' : 'Dentistry';
    }
    if (lower.includes('computer') || lower.includes('software') || lower.includes('information') || lower.includes('کمپیوتر') || lower.includes('کامپیوتر')) {
      return lang === 'fa' ? 'کمپیوتر ساینس' : lang === 'ps' ? 'کمپیوټر ساینس' : 'Computer Science';
    }
    if (lower.includes('law') || lower.includes('حقوق') || lower.includes('قضا')) {
      return lang === 'fa' ? 'حقوق و علوم سیاسی' : lang === 'ps' ? 'حقوق او سیاسي علوم' : 'Law Faculty';
    }
    if (lower.includes('pharmac') || lower.includes('فارمسی') || lower.includes('دارو')) {
      return lang === 'fa' ? 'پوهنځی فارمسی' : lang === 'ps' ? 'د فارمسۍ پوهنځی' : 'Faculty of Pharmacy';
    }
    return rawFaculty;
  };

  return (
    <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all relative flex flex-col gap-3 text-start w-full">
      {/* 1. Header Row 1: Name Letter Avatar on start, Status Badge on end */}
      <div className="flex items-center justify-between gap-3 w-full">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0 text-base shadow-xs">
          {application.fullName ? application.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
        </div>
        <div className="shrink-0">
          <StatusBadge status={application.status} />
        </div>
      </div>

      {/* 2. Header Row 2: Full Name & Father Name */}
      <div className="min-w-0">
        <h4 className="text-base font-bold text-zinc-900 dark:text-white leading-snug break-words">
          {application.fullName}
        </h4>
        {application.fatherName && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
            {lang === 'fa' ? 'ولد: ' : lang === 'ps' ? 'د پلار نوم: ' : 's/o '}
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{application.fatherName}</span>
          </p>
        )}
      </div>

      {/* 3. Metadata Grid: Faculty & Dept, Phone, Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 py-2.5 px-3 bg-zinc-50/80 dark:bg-zinc-950/60 rounded-xl border border-zinc-100 dark:border-zinc-800/60 text-xs">
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 min-w-0">
          <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <div className="min-w-0 truncate">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{formatFaculty(application.faculty)}</span>
            <span className="text-zinc-400 dark:text-zinc-600 mx-1.5">•</span>
            <span className="text-zinc-500 dark:text-zinc-400">{application.department}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
          <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200" dir="ltr">
            {application.phone}
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 sm:col-span-2 md:col-span-1">
          <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="font-mono text-xs">
            {new Date(application.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* 4. Actions Bar: All buttons arranged in ONE single row */}
      <div className="flex items-center gap-2 w-full pt-1.5 border-t border-zinc-100 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={() => onView(application.id)}
          className="flex-1 py-2 px-2.5 sm:px-3 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/90 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200/60 dark:border-blue-800/50 rounded-xl cursor-pointer transition-all active:scale-[0.98] whitespace-nowrap min-w-0"
        >
          <Eye className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{lang === 'fa' ? 'بررسی جزئیات' : lang === 'ps' ? 'تفصیلات لیدل' : 'View Details'}</span>
        </button>

        {showApprove && (
          <button
            type="button"
            onClick={() => onStatusUpdate(application, 'Approved')}
            className="flex-1 py-2 px-2.5 sm:px-3 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer transition-all shadow-xs shadow-emerald-600/20 active:scale-[0.98] whitespace-nowrap min-w-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lang === 'fa' ? 'قبول کردن' : lang === 'ps' ? 'تاییدول' : 'Approve'}</span>
          </button>
        )}

        {showReject && (
          <button
            type="button"
            onClick={() => onStatusUpdate(application, 'Rejected')}
            className="flex-1 py-2 px-2.5 sm:px-3 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer transition-all shadow-xs shadow-rose-600/20 active:scale-[0.98] whitespace-nowrap min-w-0"
          >
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lang === 'fa' ? 'رد اسناد' : lang === 'ps' ? 'ردول' : 'Reject'}</span>
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(application)}
            className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer transition-all shrink-0 active:scale-95"
            title={lang === 'fa' ? 'حذف' : lang === 'ps' ? 'حذف' : 'Delete'}
            aria-label={lang === 'fa' ? 'حذف' : 'Delete'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

