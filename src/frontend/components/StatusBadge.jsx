import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../controllers/LanguageContext.jsx';

export default function StatusBadge({ status }) {
  const { lang } = useLanguage();

  const statusKey = (status || '').trim();

  let label = statusKey;
  let bgClass = '';
  let textClass = '';
  let borderClass = '';
  let Icon = Clock;

  if (statusKey === 'Approved') {
    bgClass = 'bg-emerald-50 dark:bg-emerald-950/20';
    textClass = 'text-emerald-700 dark:text-emerald-400';
    borderClass = 'border-emerald-100 dark:border-emerald-900/30';
    Icon = CheckCircle2;
    if (lang === 'fa') label = 'پذیرفته شده';
    else if (lang === 'ps') label = 'منل شوی';
    else label = 'Approved';
  } else if (statusKey === 'Pending') {
    bgClass = 'bg-amber-50 dark:bg-amber-950/20';
    textClass = 'text-amber-700 dark:text-amber-400';
    borderClass = 'border-amber-100 dark:border-amber-900/30';
    Icon = Clock;
    if (lang === 'fa') label = 'در انتظار بررسی';
    else if (lang === 'ps') label = 'ارزونې ته چمتو';
    else label = 'Pending';
  } else if (statusKey === 'Need Correction') {
    bgClass = 'bg-blue-50 dark:bg-blue-950/20';
    textClass = 'text-blue-700 dark:text-blue-400';
    borderClass = 'border-blue-200 dark:border-blue-900/35';
    Icon = AlertTriangle;
    if (lang === 'fa') label = 'نیاز به اصلاحات';
    else if (lang === 'ps') label = 'سمون ته اړتیا لري';
    else label = 'Need Correction';
  } else {
    bgClass = 'bg-rose-50 dark:bg-rose-950/20';
    textClass = 'text-rose-700 dark:text-rose-400';
    borderClass = 'border-rose-100 dark:border-rose-900/30';
    Icon = AlertCircle;
    if (lang === 'fa') label = 'مردود / رد شده';
    else if (lang === 'ps') label = 'رد شوی';
    else label = statusKey || 'Rejected';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${bgClass} ${textClass} ${borderClass} transition-colors duration-150`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  );
}
