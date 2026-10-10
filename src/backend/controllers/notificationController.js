import { db } from '../models/db.js';

export const getNotifications = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Filter notifications relevant to user (supporting both schema styles: recipientUserId/userId, recipientRole, etc.)
  const userNotifs = (db.notifications || []).filter((n) => {
    const targetUserId = n.recipientUserId || n.userId;
    const targetRole = n.recipientRole;

    if (user.role === 'admin') {
      return (
        targetRole === 'admin' ||
        targetUserId === user.id ||
        !targetUserId ||
        n.type === 'registration' ||
        n.type === 'application' ||
        n.type === 'INFO' ||
        n.type === 'SUCCESS'
      );
    }
    return (
      targetUserId === user.id ||
      (targetRole === 'student' && targetUserId === user.id)
    );
  });

  const normalizedNotifs = userNotifs.map((n) => ({
    ...n,
    id: n.id || `notif_${Date.now()}_${Math.random()}`,
    title: n.title || 'Notification',
    message: n.message || '',
    type: n.type || 'info',
    recipientUserId: n.recipientUserId || n.userId || '',
    isRead: n.isRead !== undefined ? Boolean(n.isRead) : Boolean(n.read),
    createdAt: n.createdAt || new Date().toISOString(),
  }));

  const sortedNotifs = [...normalizedNotifs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const unreadCount = sortedNotifs.filter((n) => !n.isRead).length;

  res.json({
    notifications: sortedNotifs,
    unreadCount,
  });
};

export const markAsRead = (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const notif = (db.notifications || []).find((n) => n.id === id);
  if (!notif) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  const targetUserId = notif.recipientUserId || notif.userId;
  const targetRole = notif.recipientRole;

  // Non-admins can only mark their own notifications
  if (user.role !== 'admin') {
    if (targetRole === 'admin' || !targetUserId || targetUserId !== user.id) {
      return res.status(403).json({ error: 'Access Denied: You cannot modify another user\'s notification.' });
    }
  }

  notif.isRead = true;
  notif.read = true;
  db.save();

  res.json({ success: true });
};

export const markAllAsRead = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  (db.notifications || []).forEach((n) => {
    const targetUserId = n.recipientUserId || n.userId;
    const targetRole = n.recipientRole;

    if (user.role === 'admin') {
      if (
        targetRole === 'admin' ||
        targetUserId === user.id ||
        !targetUserId ||
        n.type === 'registration' ||
        n.type === 'application'
      ) {
        n.isRead = true;
        n.read = true;
      }
    } else if (targetUserId === user.id) {
      n.isRead = true;
      n.read = true;
    }
  });

  db.save();
  res.json({ success: true });
};

export const deleteNotification = (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const notif = (db.notifications || []).find((n) => n.id === id);
  if (!notif) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  const targetUserId = notif.recipientUserId || notif.userId;
  const targetRole = notif.recipientRole;

  // Non-admins can only delete their own notifications
  if (user.role !== 'admin') {
    if (targetRole === 'admin' || !targetUserId || targetUserId !== user.id) {
      return res.status(403).json({ error: 'Access Denied: You cannot delete another user\'s notification.' });
    }
  }

  db.notifications = (db.notifications || []).filter((n) => n.id !== id);
  db.save();

  res.json({ success: true });
};

