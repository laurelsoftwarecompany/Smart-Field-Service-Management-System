import { Router } from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerServiceHistory,
  getCustomerActiveRequests,
} from '../controllers/customer.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.post('/', authorize(UserRole.MANAGER, UserRole.ADMIN), createCustomer);
router.get('/', authorize(UserRole.MANAGER, UserRole.ADMIN), getCustomers);
router.get('/:id', authorize(UserRole.MANAGER, UserRole.ADMIN), getCustomerById);
router.put('/:id', authorize(UserRole.MANAGER, UserRole.ADMIN), updateCustomer);
router.delete('/:id', authorize(UserRole.ADMIN), deleteCustomer);
router.get('/:id/service-history', authorize(UserRole.MANAGER, UserRole.ADMIN), getCustomerServiceHistory);
router.get('/:id/active-requests', authorize(UserRole.MANAGER, UserRole.ADMIN), getCustomerActiveRequests);

export default router;
