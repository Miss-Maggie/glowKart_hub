import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Throw a clear, actionable error instead of allowing jsonwebtoken to
    // throw a less friendly message later.
    throw new Error('JWT_SECRET is not set. Please set process.env.JWT_SECRET');
  }
  if (!userId) {
    throw new Error('generateToken called without userId');
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d',
  });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString()),
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString()),
  });
};
