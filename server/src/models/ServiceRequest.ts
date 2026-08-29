import mongoose, { Schema, Document } from 'mongoose';
import { ServiceRequestStatus, ServiceRequestPriority } from '../types';

export interface IServiceRequest extends Document {
  customerId: mongoose.Types.ObjectId;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  status: ServiceRequestStatus;
  // AI/ML placeholder fields — to be populated by the AI/ML service
  category: string;
  priority: ServiceRequestPriority | '';
  aiConfidence: number;
  recommendedTechnicianId: mongoose.Types.ObjectId;
  summary: string;
}

const serviceRequestSchema = new Schema<IServiceRequest>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer ID is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    status: {
      type: String,
      enum: Object.values(ServiceRequestStatus),
      default: ServiceRequestStatus.PENDING,
    },
    // AI/ML fields — left empty for the AI/ML developer to populate
    category: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: [...Object.values(ServiceRequestPriority), ''],
      default: '',
    } as any,
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    recommendedTechnicianId: {
      type: Schema.Types.ObjectId,
      ref: 'Technician',
    },
    summary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IServiceRequest>(
  'ServiceRequest',
  serviceRequestSchema
);
