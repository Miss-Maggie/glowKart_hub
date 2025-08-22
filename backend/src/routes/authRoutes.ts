import express from 'express';
import { register, login } from '../controllers/authController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/admin-only', protect, admin, (req, res) => {
  res.json({ message: 'You are an admin' });
});

export default router;
