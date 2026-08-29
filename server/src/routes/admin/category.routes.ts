import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../controllers/admin.controller';
import { authorize } from '../../middleware/auth';
import { UserRole } from '../../types';

const router = Router();

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: List service categories
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of service categories
 */
router.get('/', authorize(UserRole.MANAGER, UserRole.ADMIN), getCategories);

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: Create a service category
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/', authorize(UserRole.ADMIN), createCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     summary: Update a service category
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put('/:id', authorize(UserRole.ADMIN), updateCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     summary: Deactivate a service category
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deactivated
 */
router.delete('/:id', authorize(UserRole.ADMIN), deleteCategory);

export default router;
