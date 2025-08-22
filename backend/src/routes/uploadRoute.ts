import express from 'express';
import { uploadProductImage } from '../controllers/uploadController';
import { protect } from '../middleware/authMiddleware';
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

router.post('/product-image', protect, upload.single('image'), uploadProductImage);

export default router;