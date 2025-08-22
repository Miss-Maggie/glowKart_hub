import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Store } from '../models/Store';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    role: string;
  };
}

export const createOrder = async (req: AuthRequest, res: Response) => {
  const { store, items, shippingInfo } = req.body;

  try {
    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const order = new Order({
      user: req.user._id,
      store,
      items,
      total,
      shippingInfo
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err: any) {
    console.error('Order creation failed:', err.message);
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('store items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get orders' });
  }
};

export const getStoreOrders = async (req: AuthRequest, res: Response) => {
  const storeId = req.params.storeId;

  try {
    const orders = await Order.find({ store: storeId })
      .populate('items.product user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch store orders', error: err.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate('store', 'name')
      .populate('items.product');
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch order details', error: err.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;
  const { status, trackingUpdate } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    
    // Add tracking update if provided
    if (trackingUpdate) {
      if (!order.tracking) {
        order.tracking = { updates: [] };
      }
      order.tracking.updates.push({
        ...trackingUpdate,
        timestamp: new Date()
      });
    }
    
    const updated = await order.save();

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
};

export const addTrackingInfo = async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;
  const { trackingNumber, carrier, estimatedDelivery } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Check if user is authorized to update this order
    if (req.user.role !== 'admin' && req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Not authorized to update tracking info' });
    }

    if (!order.tracking) {
      order.tracking = { updates: [] };
    }

    order.tracking.number = trackingNumber;
    order.tracking.carrier = carrier;
    order.tracking.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : undefined;

    // Add initial tracking update
    order.tracking.updates.push({
      status: 'shipped',
      description: `Order shipped via ${carrier}`,
      location: 'Warehouse',
      timestamp: new Date()
    });

    const updated = await order.save();

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to add tracking info', error: err.message });
  }
};
