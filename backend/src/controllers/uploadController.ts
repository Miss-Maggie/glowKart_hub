import { Request, Response } from 'express';
import { AuthRequest } from '../types/authTypes';

// Handle single image upload for products
export const uploadProductImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return just the filename, which will be prefixed with /uploads/ on the frontend
    res.json({
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`
    });
  } catch (error: any) {
    console.error('❌ Error uploading image:', error.message);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};