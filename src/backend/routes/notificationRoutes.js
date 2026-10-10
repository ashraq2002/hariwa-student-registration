import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { authenticateUser, requireVerifiedEmail } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateUser);
router.use(requireVerifiedEmail);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
