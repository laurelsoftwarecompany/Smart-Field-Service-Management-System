import { Router } from 'express';
import {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
} from '../controllers/serviceRequest.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /service-requests:
 *   post:
 *     summary: Create a new service request
 *     tags: [Service Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerId, description, address]
 *             properties:
 *               customerId:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zip:
 *                     type: string
 *     responses:
 *       201:
 *         description: Service request created (AI fields left empty for AI/ML service)
 */
router.post(
  '/',
  authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.CUSTOMER),
  createServiceRequest
);

/**
 * @swagger
 * /service-requests:
 *   get:
 *     summary: List service requests with optional filters
 *     tags: [Service Requests]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Classified, Assigned, Closed]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High, Critical]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of service requests
 */
router.get(
  '/',
  authorize(UserRole.MANAGER, UserRole.ADMIN),
  getServiceRequests
);

/**
 * @swagger
 * /service-requests/{id}:
 *   get:
 *     summary: Get service request by ID
 *     tags: [Service Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service request details
 */
router.get(
  '/:id',
  authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.CUSTOMER),
  getServiceRequestById
);

export default router;
