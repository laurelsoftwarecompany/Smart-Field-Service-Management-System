import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceCategory extends Document {
  name: string;
  description: string;
  isActive: boolean;
}

const serviceCategorySchema = new Schema<IServiceCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
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

export default mongoose.model<IServiceCategory>(
  'ServiceCategory',
  serviceCategorySchema
);
