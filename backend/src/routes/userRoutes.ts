import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getAllUsers, getCurrentUser, updateProfile } from '../controllers/userController';

const router = express.Router();

router.get('/', protect, getAllUsers);
router.get('/profile', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);

export default router;
