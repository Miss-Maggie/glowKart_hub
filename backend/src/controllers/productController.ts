import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { AuthRequest } from '../types/authTypes';

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      store: req.user?._id, // assuming the store is the user for now
      createdBy: req.user?._id, // optional: tracking who created the product
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error('❌ Error creating product:', error.message);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};


export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('store', 'name location');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('store', 'name location');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// @desc    Get products by store ID
// @route   GET /api/products/store/:storeId
// @access  Public
export const getProductsByStore = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ store: req.params.storeId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin or Vendor
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, category, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Optionally check: if vendor, allow only their products
    if (req.user?.role === 'vendor' && product.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.image = image || product.image;

    const updated = await product.save();
    res.json(updated);
  } catch (error: any) {
    console.error('❌ Error updating product:', error.message);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin or Vendor
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.user?.role === 'vendor' && product.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error: any) {
    console.error('❌ Error deleting product:', error.message);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addProductReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r: any) => r.user.toString() === req.user?._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      user: req.user?._id,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error: any) {
    console.error('❌ Error adding review:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product review
// @route   PUT /api/products/:id/reviews
// @access  Private
export const updateProductReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the review by the user
    const reviewIndex = product.reviews.findIndex(
      (r: any) => r.user.toString() === req.user?._id.toString()
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update the review
    product.reviews[reviewIndex].rating = Number(rating);
    product.reviews[reviewIndex].comment = comment;

    // Recalculate the average rating
    product.rating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.json({ message: 'Review updated' });
  } catch (error: any) {
    console.error('❌ Error updating review:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews
// @access  Private
export const deleteProductReview = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the review by the user
    const reviewIndex = product.reviews.findIndex(
      (r: any) => r.user.toString() === req.user?._id.toString()
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
    res.status(400).json({ message: error.message });
  }
};
