import mongoose, { Schema, Document } from 'mongoose';
import { TechnicianAvailability } from '../types';

export interface ITechnician extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  availability: TechnicianAvailability;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  rating: number;
  jobsCompleted: number;
  isActive: boolean;
}

const technicianSchema = new Schema<ITechnician>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Technician name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    specializations: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      enum: Object.values(TechnicianAvailability),
      default: TechnicianAvailability.AVAILABLE,
    },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    jobsCompleted: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITechnician>('Technician', technicianSchema);
