import express from 'express';
import {
  getAllUsers,
  getAllStores,
  getAllProducts,
  getAllOrders,
  getDashboardStats,
  getAllProductReviews,
  getAllStoreReviews,
  deleteProductReview,
  deleteStoreReview
} from '../controllers/adminController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected and require admin access
router.use(protect);
router.use(admin);

// Dashboard stats
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);

// Store/business management
router.get('/stores', getAllStores);

// Product management
router.get('/products', getAllProducts);

// Order management
router.get('/orders', getAllOrders);

// Review management
router.get('/reviews/products', getAllProductReviews);
router.get('/reviews/stores', getAllStoreReviews);
router.delete('/reviews/products/:productId/:reviewId', deleteProductReview);
router.delete('/reviews/stores/:storeId/:reviewId', deleteStoreReview);

export default router;