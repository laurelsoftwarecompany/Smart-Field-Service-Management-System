import mongoose, { Schema, Document } from 'mongoose';
import { JobStatus } from '../types';

export interface IServiceNote {
  diagnosis: string;
  workPerformed: string;
  partsUsed: string[];
  additionalNotes: string;
  followUp: string;
  createdAt: Date;
}

export interface IJob extends Document {
  serviceRequestId: mongoose.Types.ObjectId;
  technicianId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  status: JobStatus;
  notes: IServiceNote[];
  images: string[];
  assignedAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}

const serviceNoteSchema = new Schema<IServiceNote>(
  {
    diagnosis: { type: String, default: '' },
    workPerformed: { type: String, default: '' },
    partsUsed: { type: [String], default: [] },
    additionalNotes: { type: String, default: '' },
    followUp: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const jobSchema = new Schema<IJob>(
  {
    serviceRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceRequest',
      required: [true, 'Service Request ID is required'],
    },
    technicianId: {
      type: Schema.Types.ObjectId,
      ref: 'Technician',
      required: [true, 'Technician ID is required'],
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer ID is required'],
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.ASSIGNED,
    },
    notes: {
      type: [serviceNoteSchema],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IJob>('Job', jobSchema);
