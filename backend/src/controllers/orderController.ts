import { Response } from 'express';
import { Order } from '../models/Order';
import { AuthRequest } from '../types/authTypes';

// Create a new order
export const createOrder = async (req: AuthRequest, res: Response) => {
  const { store, items, shippingInfo } = req.body;

  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

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

// Get orders for authenticated user
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const orders = await Order.find({ user: req.user._id })
      .populate('store items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get orders', error: err.message });
  }
};

// Get orders for a store
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

// Get order by id
export const getOrderById = async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;

  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const order = await Order.findById(orderId)
      .populate('store', 'name')
      .populate('items.product');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Allow owners or admins
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch order details', error: err.message });
  }
};

// Update order status (and optionally add a tracking update)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;
  const { status, trackingUpdate } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;

    if (trackingUpdate) {
      if (!order.tracking) {
        order.tracking = {
          number: '',
          carrier: '',
          estimatedDelivery: undefined,
          updates: []
        } as any;
      }

  order.tracking!.updates.push({
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

// Add tracking info (admin/vendor)
export const addTrackingInfo = async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;
  const { trackingNumber, carrier, estimatedDelivery } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== 'admin' && req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Not authorized to update tracking info' });
    }

    if (!order.tracking) {
      order.tracking = {
        number: '',
        carrier: '',
        estimatedDelivery: undefined,
        updates: []
      } as any;
    }

  order.tracking!.number = trackingNumber;
  order.tracking!.carrier = carrier;
  order.tracking!.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : undefined;

    // Add initial tracking update
  order.tracking!.updates.push({
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
