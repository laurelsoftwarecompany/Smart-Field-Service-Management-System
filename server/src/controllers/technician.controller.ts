import { Request, Response } from 'express';
import Technician from '../models/Technician';
import User from '../models/User';
import { UserRole } from '../types';
import { technicianSchema, technicianUpdateSchema } from '../validators';

export const createTechnician = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validation = technicianSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  const { name, email, phone, password, specializations, availability } =
    validation.data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ message: 'Email already registered.' });
    return;
  }

  // Create linked user account with technician role
  const user = await User.create({
    name,
    email,
    password,
    role: UserRole.TECHNICIAN,
  });

  // Create technician profile
  const technician = await Technician.create({
    userId: user._id,
    name,
    email,
    phone,
    specializations,
    availability,
  });

  res.status(201).json({ message: 'Technician created.', technician });
};

export const getTechnicians = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    availability,
    specialization,
    page = '1',
    limit = '20',
  } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter: Record<string, unknown> = { isActive: true };

  if (availability) {
    filter.availability = availability;
  }

  if (specialization) {
    filter.specializations = { $in: [specialization] };
  }

  const [technicians, total] = await Promise.all([
    Technician.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
    Technician.countDocuments(filter),
  ]);

  res.json({
    technicians,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
};

export const getTechnicianById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const technician = await Technician.findById(req.params.id);
  if (!technician) {
    res.status(404).json({ message: 'Technician not found.' });
    return;
  }
  res.json({ technician });
};

export const updateTechnician = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validation = technicianUpdateSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  const technician = await Technician.findByIdAndUpdate(
    req.params.id,
    validation.data,
    { new: true, runValidators: true }
  );

  if (!technician) {
    res.status(404).json({ message: 'Technician not found.' });
    return;
  }

  res.json({ message: 'Technician updated.', technician });
};

export const deleteTechnician = async (
  req: Request,
  res: Response
): Promise<void> => {
  const technician = await Technician.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!technician) {
    res.status(404).json({ message: 'Technician not found.' });
    return;
  }

  // Also deactivate user account
  await User.findByIdAndUpdate(technician.userId, { isActive: false });

  res.json({ message: 'Technician deactivated.' });
};
