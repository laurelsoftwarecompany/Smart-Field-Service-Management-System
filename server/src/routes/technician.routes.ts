import { Router } from 'express';
import {
  createTechnician,
  getTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
} from '../controllers/technician.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /technicians:
 *   post:
 *     summary: Create a new technician (with linked user account)
 *     tags: [Technicians]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               specializations:
 *                 type: array
 *                 items:
 *                   type: string
 *               availability:
 *                 type: string
 *                 enum: [available, busy, off-duty]
 *     responses:
 *       201:
 *         description: Technician created
 */
router.post('/', authorize(UserRole.MANAGER, UserRole.ADMIN), createTechnician);

/**
 * @swagger
 * /technicians:
 *   get:
 *     summary: List technicians with optional filters
 *     tags: [Technicians]
 *     parameters:
 *       - in: query
 *         name: availability
 *         schema:
 *           type: string
 *           enum: [available, busy, off-duty]
 *       - in: query
 *         name: specialization
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
 *         description: List of technicians
 */
router.get('/', authorize(UserRole.MANAGER, UserRole.ADMIN), getTechnicians);

/**
 * @swagger
 * /technicians/{id}:
 *   get:
 *     summary: Get technician by ID
 *     tags: [Technicians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Technician details
 */
router.get('/:id', authorize(UserRole.MANAGER, UserRole.ADMIN), getTechnicianById);

/**
 * @swagger
 * /technicians/{id}:
 *   put:
 *     summary: Update technician
 *     tags: [Technicians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Technician updated
 */
router.put('/:id', authorize(UserRole.MANAGER, UserRole.ADMIN), updateTechnician);

/**
 * @swagger
 * /technicians/{id}:
 *   delete:
 *     summary: Deactivate technician (soft delete)
 *     tags: [Technicians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Technician deactivated
 */
router.delete('/:id', authorize(UserRole.ADMIN), deleteTechnician);

export default router;
