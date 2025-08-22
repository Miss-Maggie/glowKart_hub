import { Request } from 'express';
import { IUser } from './userTypes';

export interface AuthRequest extends Request {
  user?: IUser;
}
