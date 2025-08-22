import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductsByStore,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
  updateProductReview,
  deleteProductReview
} from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createProduct);
router.get('/', getAllProducts);
router.get('/store/:storeId', getProductsByStore);
router.get('/:id', getProductById);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

// Review routes
router.post('/:id/reviews', protect, addProductReview);
router.put('/:id/reviews', protect, updateProductReview);
router.delete('/:id/reviews', protect, deleteProductReview);

export default router;
