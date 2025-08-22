import express from 'express';
import {
  createOrder,
  getUserOrders,
  getStoreOrders,
  updateOrderStatus,
  getOrderById,
  addTrackingInfo
} from '../controllers/orderController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/store/:storeId', protect, getStoreOrders);
router.get('/:orderId', protect, getOrderById);
router.put('/:orderId/status', protect, authorize('vendor', 'admin'), updateOrderStatus);
router.put('/:orderId/tracking', protect, authorize('vendor', 'admin'), addTrackingInfo);

export default router;
