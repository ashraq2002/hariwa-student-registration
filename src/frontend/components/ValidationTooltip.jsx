import React from 'react';
import { AlertTriangle, AlertCircle, X } from 'lucide-react';

/**
 * ValidationTooltip
 * A custom, beautifully styled replacement for the native browser HTML5 validation popup.
 *
 * @param {string} message - Validation error message to display
 * @param {boolean} visible - Whether the popup is currently visible
 * @param {function} onClose - Optional callback to dismiss the popup
 * @param {'top' | 'bottom'} placement - Whether tooltip sits above or below the input
 * @param {string} lang - Current language ('fa', 'ps', 'en') for directional tail placement
 */
export default function ValidationTooltip({
  message,
  visible = true,
  onClose,
  placement = 'bottom',
  lang = 'fa',
}) {
  if (!visible || !message) return null;

  const isRtl = lang === 'fa' || lang === 'ps';

  return (
    <div
      role="alert"
      className={`absolute z-50 animate-popup-in select-none ${
        placement === 'top'
          ? 'bottom-full mb-2.5'
          : 'top-full mt-2'
      } ${
        isRtl ? 'right-2 sm:right-4' : 'left-2 sm:left-4'
      }`}
    >
      {/* Tooltip Caret / Arrow pointer */}
      <div
        className={`absolute w-3 h-3 rotate-45 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-700/90 shadow-xs ${
          placement === 'top'
            ? 'bottom-[-6px] border-b border-r'
            : 'top-[-6px] border-t border-l'
        } ${isRtl ? 'right-4' : 'left-4'}`}
      />

      {/* Popup Body Card */}
      <div
        onClick={onClose}
        className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/90 shadow-xl shadow-slate-900/15 dark:shadow-black/60 text-slate-800 dark:text-slate-100 backdrop-blur-md cursor-pointer hover:border-amber-400 dark:hover:border-amber-500/60 transition-all duration-200 max-w-[280px] sm:max-w-xs"
      >
        {/* Stylized Icon Badge (inspired by user's screenshot, elevated with modern glass-morphic finish) */}
        <div className="w-6 h-6 shrink-0 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shadow-orange-500/30">
          <span className="leading-none text-[13px] font-black">!</span>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-semibold leading-snug tracking-tight text-slate-800 dark:text-slate-100 break-words">
            {message}
          </p>
        </div>

        {/* Dismiss icon */}
        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md transition-colors"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
