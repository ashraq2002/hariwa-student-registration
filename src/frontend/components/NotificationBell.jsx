import { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  CheckCheck, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Trash2,
  ExternalLink,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../controllers/LanguageContext.jsx';
import { api } from '../models/api.js';

export default function NotificationBell({ user, onNavigate }) {
  const { lang, t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    const token = localStorage.getItem('uniport_token');
    if (!token) return;
    try {
      const data = await api.notifications.getAll();
      if (data && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setUnreadCount(typeof data.unreadCount === 'number' ? data.unreadCount : 0);
      }
    } catch (err) {
      // Quietly continue without disruptive console errors
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Active polling every 4 seconds for real-time notification updates
    const interval = setInterval(() => {
      fetchNotifications();
    }, 4000);

    return () => clearInterval(interval);
  }, [user]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await api.notifications.markRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }

    setIsOpen(false);

    // Quick navigation routing
    if (user.role === 'admin') {
      onNavigate('/admin/students');
    } else {
      if (notif.type === 'approval' || notif.type === 'rejection' || notif.type === 'correction') {
        onNavigate('/student/status');
      } else {
        onNavigate('/student/dashboard');
      }
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.notifications.deleteNotif(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return lang === 'fa' ? 'همین حالا' : lang === 'ps' ? 'همدا اوس' : 'Just now';
    if (diff < 3600) {
      const mins = Math.floor(diff / 60);
      return lang === 'fa' ? `${mins} دقیقه قبل` : lang === 'ps' ? `${mins} دقیقې وړاندې` : `${mins}m ago`;
    }
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return lang === 'fa' ? `${hours} ساعت قبل` : lang === 'ps' ? `${hours} ساعته وړاندې` : `${hours}h ago`;
    }
    return new Date(dateStr).toLocaleDateString();
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'registration':
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'approval':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'rejection':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'correction':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'application':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer shadow-sm flex items-center justify-center shrink-0"
        title={lang === 'fa' ? 'اعلان‌ها' : lang === 'ps' ? 'خبرتیاوې' : 'Notifications'}
        type="button"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] px-1 items-center justify-center rounded-full bg-rose-600 text-[9px] font-black text-white shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full mt-2.5 w-80 sm:w-96 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden z-[9999] ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto"
          >
            {/* Header */}
            <div className="p-3.5 px-4 bg-zinc-50/80 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-xs font-bold text-black dark:text-white">
                  {lang === 'fa' ? 'اعلان‌های فعال' : lang === 'ps' ? 'فعالې خبرتیاوې' : 'Notifications'}
                </h4>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold">
                    {unreadCount} {lang === 'fa' ? 'جدید' : lang === 'ps' ? 'نوي' : 'new'}
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" />
                  {lang === 'fa' ? 'علامت‌گذاری همه' : lang === 'ps' ? 'ټول لوستل شوي' : 'Mark all read'}
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900 p-1">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3 rounded-xl transition-all cursor-pointer flex gap-3 relative group ${
                      !notif.isRead
                        ? 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    {/* Unread dot */}
                    {!notif.isRead && (
                      <span className="absolute top-3.5 ltr:right-3 rtl:left-3 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}

                    <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm shrink-0 self-start">
                      {getNotifIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-xs font-bold text-black dark:text-white leading-tight truncate">
                          {notif.title}
                        </h5>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 font-mono">
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleDelete(e, notif.id)}
                            className="p-1 text-zinc-400 hover:text-rose-500 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-zinc-400 dark:text-zinc-500 text-xs">
                  {lang === 'fa' ? 'هیچ اعلانی یافت نشد.' : lang === 'ps' ? 'هیڅ خبرتیا ونه موندل شوه.' : 'No notifications yet.'}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 text-center bg-zinc-50/60 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                {user.role === 'admin'
                  ? (lang === 'fa' ? 'سیستم اعلان‌های فعال ثبت‌نام محصلین' : lang === 'ps' ? 'د محصلینو د نوم لیکنې فعاله خبرتیاوې' : 'Active Student Signup Stream')
                  : (lang === 'fa' ? 'سیستم اعلان‌های رسمی کارت محصلی' : lang === 'ps' ? 'د محصلۍ کارت رسمي خبرتیاوې' : 'Official Student Card Status Stream')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
