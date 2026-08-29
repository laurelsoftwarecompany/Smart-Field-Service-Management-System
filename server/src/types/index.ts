import { Request } from 'express';

export interface JwtPayload {
  id: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export enum UserRole {
  CUSTOMER = 'customer',
  MANAGER = 'manager',
  TECHNICIAN = 'technician',
  ADMIN = 'admin',
}

export enum TechnicianAvailability {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFF_DUTY = 'off-duty',
}

export enum ServiceRequestStatus {
  PENDING = 'Pending',
  CLASSIFIED = 'Classified',
  ASSIGNED = 'Assigned',
  CLOSED = 'Closed',
}

export enum ServiceRequestPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum JobStatus {
  ASSIGNED = 'Assigned',
  ACCEPTED = 'Accepted',
  ON_THE_WAY = 'On The Way',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  UNABLE_TO_COMPLETE = 'Unable to Complete',
  CUSTOMER_UNAVAILABLE = 'Customer Unavailable',
  REQUIRES_FOLLOW_UP = 'Requires Follow-up',
}
