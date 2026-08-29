import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { updateUserSchema, serviceCategorySchema } from '../validators';

// ── User Management ──────────────────────────────────────────────────────
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const { role, page = '1', limit = '20' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  const result = await AdminService.getUsers(role as string, pageNum, limitNum);
  res.json(result);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const validation = updateUserSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  const user = await AdminService.updateUser(req.params.id as string, validation.data);
  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }
  res.json({ message: 'User updated.', user });
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const user = await AdminService.deactivateUser(req.params.id as string);
  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }
  res.json({ message: 'User deactivated.' });
};

// ── Service Category Management ──────────────────────────────────────────
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await AdminService.getCategories();
  res.json({ categories });
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const validation = serviceCategorySchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  try {
    const category = await AdminService.createCategory(validation.data);
    res.status(201).json({ message: 'Category created.', category });
  } catch (error: any) {
    res.status(409).json({ message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const validation = serviceCategorySchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  const category = await AdminService.updateCategory(req.params.id as string, validation.data);
  if (!category) {
    res.status(404).json({ message: 'Category not found.' });
    return;
  }
  res.json({ message: 'Category updated.', category });
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const category = await AdminService.deactivateCategory(req.params.id as string);
  if (!category) {
    res.status(404).json({ message: 'Category not found.' });
    return;
  }
  res.json({ message: 'Category deactivated.' });
};

// ── Analytics ─────────────────────────────────────────────────────────────
export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  const stats = await AdminService.getDashboardStats();
  res.json({ stats });
};

export const getSystemAnalytics = async (_req: Request, res: Response): Promise<void> => {
  const analytics = await AdminService.getSystemAnalytics();
  res.json({ analytics });
};

