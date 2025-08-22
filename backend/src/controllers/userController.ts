import { Request, Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../types/authTypes';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const users = await User.find().select('-password'); // exclude passwords
    res.json(users);
  } catch (error: any) {
    console.error('❌ Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    // req.user is set in the protect middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      address: req.user.address,
      profilePicture: req.user.profilePicture,
    });
  } catch (error: any) {
    console.error('❌ Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    // req.user is set in the protect middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    const { name, email, phone, address, profilePicture } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error: any) {
    console.error('❌ Error updating user profile:', error.message);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};
