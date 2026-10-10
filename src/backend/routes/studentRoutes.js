import { Router } from 'express';
import {
  upsertApplication,
  getMyApplication,
  getAllApplications,
  getApplicationDetails,
  updateApplicationStatus,
  deleteApplication,
  getStats,
} from '../controllers/studentController.js';
import {
  authenticateUser,
  requireAdmin,
  requireStudent,
  requireVerifiedEmail,
} from '../middleware/authMiddleware.js';

const router = Router();

// 1. Authenticate user & ensure email is verified for all student/application endpoints
router.use(authenticateUser);
router.use(requireVerifiedEmail);

// Student endpoints
router.post('/', requireStudent, upsertApplication);
router.get('/my', requireStudent, getMyApplication);

// Admin endpoints
router.get('/', requireAdmin, getAllApplications);
router.get('/stats', requireAdmin, getStats);
router.put('/:id', requireAdmin, updateApplicationStatus);
router.delete('/:id', requireAdmin, deleteApplication);

// Individual application inspection (allowed for Admin or Owner)
router.get('/:id', getApplicationDetails);

export default router;
