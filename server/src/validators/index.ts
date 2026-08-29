import { z } from 'zod';
import { UserRole, TechnicianAvailability, ServiceRequestPriority, JobStatus } from '../types';

// ── Auth ──────────────────────────────────────────────────────────────────
export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.CUSTOMER),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

// ── Customer ──────────────────────────────────────────────────────────────
export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'Zip is required'),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  notes: z.string().optional().default(''),
});

export const customerUpdateSchema = customerSchema.partial();

// ── Technician ────────────────────────────────────────────────────────────
export const technicianSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  specializations: z.array(z.string()).optional().default([]),
  availability: z
    .nativeEnum(TechnicianAvailability)
    .optional()
    .default(TechnicianAvailability.AVAILABLE),
});

export const technicianUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().min(1).optional(),
  specializations: z.array(z.string()).optional(),
  availability: z.nativeEnum(TechnicianAvailability).optional(),
  currentLocation: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

// ── Service Request ───────────────────────────────────────────────────────
export const serviceRequestSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  description: z.string().min(1, 'Description is required'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'Zip is required'),
  }),
});

// ── Job ───────────────────────────────────────────────────────────────────
export const createJobSchema = z.object({
  serviceRequestId: z.string().min(1, 'Service Request ID is required'),
  technicianId: z.string().min(1, 'Technician ID is required'),
});

export const updateJobStatusSchema = z.object({
  status: z.nativeEnum(JobStatus),
});

export const serviceNoteSchema = z.object({
  diagnosis: z.string().optional().default(''),
  workPerformed: z.string().optional().default(''),
  partsUsed: z.array(z.string()).optional().default([]),
  additionalNotes: z.string().optional().default(''),
  followUp: z.string().optional().default(''),
});

// ── Service Category ──────────────────────────────────────────────────────
export const serviceCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional().default(''),
});

// ── User Management (admin) ───────────────────────────────────────────────
export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
});
