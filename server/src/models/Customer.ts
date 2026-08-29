import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  notes: string;
  userId?: mongoose.Types.ObjectId;
  isActive: boolean;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
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
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    notes: {
      type: String,
      default: '',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

// Text index for search
customerSchema.index({ name: 'text', email: 'text', phone: 'text' });

export default mongoose.model<ICustomer>('Customer', customerSchema);
