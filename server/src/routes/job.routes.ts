import { Router } from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJobStatus,
  addServiceNote,
  uploadJobImages,
} from '../controllers/job.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticate);

router.post('/', authorize(UserRole.MANAGER, UserRole.ADMIN), createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);

router.patch(
  '/:id/status',
  authorize(UserRole.TECHNICIAN, UserRole.MANAGER, UserRole.ADMIN),
  updateJobStatus
);

router.post(
  '/:id/notes',
  authorize(UserRole.TECHNICIAN, UserRole.MANAGER, UserRole.ADMIN),
  addServiceNote
);

router.post(
  '/:id/images',
  authorize(UserRole.TECHNICIAN, UserRole.MANAGER, UserRole.ADMIN),
  upload.array('images', 10),
  uploadJobImages
);

export default router;
