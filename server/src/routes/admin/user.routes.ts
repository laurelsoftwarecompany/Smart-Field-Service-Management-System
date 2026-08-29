import { Router } from 'express';
import { getUsers, updateUser, deleteUser } from '../../controllers/admin.controller';
import { authorize } from '../../middleware/auth';
import { UserRole } from '../../types';

const router = Router();

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [customer, manager, technician, admin]
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
 *         description: List of users
 */
router.get('/', authorize(UserRole.ADMIN), getUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Update a user (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:id', authorize(UserRole.ADMIN), updateUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Deactivate a user (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.delete('/:id', authorize(UserRole.ADMIN), deleteUser);

export default router;
