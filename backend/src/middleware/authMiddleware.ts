import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../types/userTypes';

// Extend Request type to include user
export interface AuthRequest extends Request {
  user?: HydratedDocument<IUser>;
}

// Middleware to protect private routes
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  console.log('🛡️ protect middleware triggered');
  console.log('Authorization Header:', req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('📦 Extracted Token:', token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };
      console.log('🧬 Decoded Token:', decoded);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });

      req.user = user;
      next();
    } catch (err) {
      console.error('❌ Token verification error:', err);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user is admin
export const admin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: 'Not authorized as admin' });
  }
};

// Middleware to check if user has specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Not authorized, requires one of roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};
