import express from 'express';
import { createStore } from '../controllers/storeController';
import { protect } from '../middleware/authMiddleware';
import {
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
  addStoreReview,
  updateStoreReview,
  deleteStoreReview,
  getStoreAnalytics
} from '../controllers/storeController';
import multer from 'multer';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/', protect, upload.array('images', 5), createStore);
router.get('/', getAllStores);
router.get('/:id', getStoreById);
router.put('/:id', protect, updateStore);
router.delete('/:id', protect, deleteStore);

// Review routes
router.post('/:id/reviews', protect, addStoreReview);
router.put('/:id/reviews', protect, updateStoreReview);
router.delete('/:id/reviews', protect, deleteStoreReview);

// Analytics routes
router.get('/:id/analytics', protect, getStoreAnalytics);

export default router;
