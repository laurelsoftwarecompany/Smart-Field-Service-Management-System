import { Router } from 'express';
import { getDashboardStats, getSystemAnalytics } from '../../controllers/admin.controller';
import { authorize } from '../../middleware/auth';
import { UserRole } from '../../types';

const router = Router();

/**
 * @swagger
 * /admin/dashboard-stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/dashboard-stats', authorize(UserRole.MANAGER, UserRole.ADMIN), getDashboardStats);

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Get system-wide analytics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: System analytics data
 */
router.get('/analytics', authorize(UserRole.ADMIN), getSystemAnalytics);

export default router;
