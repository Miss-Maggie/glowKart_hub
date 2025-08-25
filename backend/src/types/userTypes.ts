import { Types } from 'mongoose';

export interface IUser {
  _id: string | Types.ObjectId;
  name: string;
  email: string;
  role: 'admin' | 'vendor' | 'shopper';
  password?: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  isAdmin?: boolean;
}
