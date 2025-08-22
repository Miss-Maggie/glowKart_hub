import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { User } from '../models/User';

const router = express.Router();

// router.get('/protected', protect, (req, res) => {
//   res.json({ message: `Hello ${req.user.name}, you are authenticated.` });
// });

router.get('/protected', protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, You are authenticated`, user: req.user });
});


export default router;
