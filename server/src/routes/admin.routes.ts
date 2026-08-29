import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import userRoutes from './admin/user.routes';
import categoryRoutes from './admin/category.routes';
import analyticsRoutes from './admin/analytics.routes';

const router = Router();

router.use(authenticate);

router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/', analyticsRoutes); // Mounts /dashboard-stats and /analytics

export default router;
