import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, UserRole } from '../types';
import { signupSchema, loginSchema } from '../validators';

const generateToken = (id: string, role: UserRole): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  const { name, email, password, role } = validation.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ message: 'Email already registered.' });
    return;
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken(String(user._id), user.role);

  res.status(201).json({
    message: 'User registered successfully.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: 'Validation error', errors: validation.error.flatten() });
    return;
  }

  const { email, password } = validation.data;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({ message: 'Account is deactivated.' });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const token = generateToken(String(user._id), user.role);

  res.json({
    message: 'Login successful.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
};

export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
};
