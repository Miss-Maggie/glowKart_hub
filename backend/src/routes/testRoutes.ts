import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { AuthRequest } from '../types/authTypes';

const router = express.Router();

router.get('/protected', protect, (req: AuthRequest, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  res.json({ message: `Hello ${req.user.name}, You are authenticated`, user: req.user });
});

export default router;
