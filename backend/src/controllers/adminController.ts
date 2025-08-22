import { Request, Response } from 'express';
import { User } from '../models/User';
import { Store } from '../models/Store';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { AuthRequest } from '../types/authTypes';

// @desc    Get all users (shoppers and vendors)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error: any) {
    console.error('❌ Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Get all stores/businesses
// @route   GET /api/admin/stores
// @access  Private/Admin
export const getAllStores = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const stores = await Store.find().populate('owner', 'name email');
    res.json(stores);
  } catch (error: any) {
    console.error('❌ Error fetching stores:', error.message);
    res.status(500).json({ message: 'Error fetching stores' });
  }
};

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const products = await Product.find().populate('store', 'name');
    res.json(products);
  } catch (error: any) {
    console.error('❌ Error fetching products:', error.message);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price');
    res.json(orders);
  } catch (error: any) {
    console.error('❌ Error fetching orders:', error.message);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const userCount = await User.countDocuments();
    const storeCount = await Store.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
    const recentOrders = await Order.find()
      .populate('user', 'name')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        users: userCount,
        stores: storeCount,
        products: productCount,
        orders: orderCount
      },
      recentUsers,
      recentOrders
    });
  } catch (error: any) {
    console.error('❌ Error fetching dashboard stats:', error.message);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

// @desc    Get all product reviews
// @route   GET /api/admin/reviews/products
// @access  Private/Admin
export const getAllProductReviews = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const products = await Product.find({}, 'name reviews').populate('reviews.user', 'name email');
    const allReviews = products.flatMap(product =>
      product.reviews.map((review: any) => ({
        ...review.toObject(),
        product: product.name,
        productId: product._id
      }))
    );
    res.json(allReviews);
  } catch (error: any) {
    console.error('❌ Error fetching product reviews:', error.message);
    res.status(500).json({ message: 'Error fetching product reviews' });
  }
};

// @desc    Get all store reviews
// @route   GET /api/admin/reviews/stores
// @access  Private/Admin
export const getAllStoreReviews = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const stores = await Store.find({}, 'name reviews').populate('reviews.user', 'name email');
    const allReviews = stores.flatMap(store =>
      store.reviews.map((review: any) => ({
        ...review.toObject(),
        store: store.name,
        storeId: store._id
      }))
    );
    res.json(allReviews);
  } catch (error: any) {
    console.error('❌ Error fetching store reviews:', error.message);
    res.status(500).json({ message: 'Error fetching store reviews' });
  }
};

// @desc    Delete a product review
// @route   DELETE /api/admin/reviews/products/:productId/:reviewId
// @access  Private/Admin
export const deleteProductReview = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const reviewIndex = product.reviews.findIndex(
      (r: any) => r._id.toString() === reviewId
    );
    
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Remove the review
    product.reviews.splice(reviewIndex, 1);
    
    // Update numReviews and rating
    product.numReviews = product.reviews.length;
    if (product.reviews.length > 0) {
      product.rating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;
    } else {
      product.rating = 0;
    }
    
    await product.save();
    res.json({ message: 'Review deleted' });
  } catch (error: any) {
    console.error('❌ Error deleting review:', error.message);
    res.status(500).json({ message: 'Error deleting review' });
  }
};

// @desc    Delete a store review
// @route   DELETE /api/admin/reviews/stores/:storeId/:reviewId
// @access  Private/Admin
export const deleteStoreReview = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const { storeId, reviewId } = req.params;
    const store = await Store.findById(storeId);
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    const reviewIndex = store.reviews.findIndex(
      (r: any) => r._id.toString() === reviewId
    );
    
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Remove the review
    store.reviews.splice(reviewIndex, 1);
    
    // Update numReviews and rating
    store.numReviews = store.reviews.length;
    if (store.reviews.length > 0) {
      store.rating = store.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / store.reviews.length;
    } else {
      store.rating = 0;
    }
    
    await store.save();
    res.json({ message: 'Review deleted' });
  } catch (error: any) {
    console.error('❌ Error deleting review:', error.message);
    res.status(500).json({ message: 'Error deleting review' });
  }
};