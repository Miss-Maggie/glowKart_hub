import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Document, Types } from 'mongoose';
import { ObjectId } from 'mongoose';

export interface IUser extends mongoose.Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'shopper' | 'vendor' | 'admin';
  phone?: string;
  address?: string;
  profilePicture?: string;
  isAdmin?: boolean; // virtual
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['shopper', 'vendor', 'admin'],
      default: 'shopper',
    },
    phone: { type: String },
    address: { type: String },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

// Password hash middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for isAdmin
userSchema.virtual('isAdmin').get(function () {
  return this.role === 'admin';
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });


export const User = mongoose.model<IUser>('User', userSchema);
