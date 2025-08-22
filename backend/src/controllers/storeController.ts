import { Request, Response } from 'express';
import { Store } from '../models/Store';

export const createStore = async (req: any, res: Response) => {
  const { name, category, location, description } = req.body;
  const images = req.files;

  try {
    // Process uploaded images
    let imagePaths: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imagePaths = req.files.map((file: any) => `/uploads/${file.filename}`);
    }

    const store = new Store({
      name,
      category,
      location,
      description,
      images: imagePaths,
      owner: req.user._id,
    });

    const saved = await store.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllStores = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const stores = await Store.find()
      .populate('owner', 'name email')
      .skip(skip)
      .limit(limit);
      
    const totalStores = await Store.countDocuments();
    
    res.json({
      stores,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalStores / limit),
        totalStores,
        hasNextPage: page < Math.ceil(totalStores / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStoreById = async (req: Request, res: Response) => {
  try {
    const store = await Store.findById(req.params.id).populate('owner', 'name email');
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStore = async (req: any, res: Response) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // Only owner can update
    if (store.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    store.name = req.body.name || store.name;
    store.category = req.body.category || store.category;
    store.location = req.body.location || store.location;
    store.description = req.body.description || store.description;

    const updated = await store.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteStore = async (req: any, res: Response) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    if (store.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await store.deleteOne();
    res.json({ message: 'Store deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add store review
// @route   POST /api/stores/:id/reviews
// @access  Private
export const addStoreReview = async (req: any, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user has already reviewed this store
    const alreadyReviewed = store.reviews.find(
      (r: any) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Store already reviewed' });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
    };

    store.reviews.push(review);
    store.numReviews = store.reviews.length;
    store.rating = store.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / store.reviews.length;

    await store.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error: any) {
    console.error('❌ Error adding review:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update store review
// @route   PUT /api/stores/:id/reviews
// @access  Private
export const updateStoreReview = async (req: any, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Find the review by the user
    const reviewIndex = store.reviews.findIndex(
      (r: any) => r.user.toString() === req.user._id.toString()
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update the review
    store.reviews[reviewIndex].rating = Number(rating);
    store.reviews[reviewIndex].comment = comment;

    // Recalculate the average rating
    store.rating = store.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / store.reviews.length;

    await store.save();
    res.json({ message: 'Review updated' });
  } catch (error: any) {
    console.error('❌ Error updating review:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete store review
// @route   DELETE /api/stores/:id/reviews
// @access  Private
export const deleteStoreReview = async (req: any, res: Response) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Find the review by the user
    const reviewIndex = store.reviews.findIndex(
      (r: any) => r.user.toString() === req.user._id.toString()
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
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get store analytics including review data
// @route   GET /api/stores/:id/analytics
// @access  Private
export const getStoreAnalytics = async (req: any, res: Response) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // Only owner can access analytics
    if (store.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Calculate review statistics
    const reviewStats = {
      totalReviews: store.numReviews || 0,
      averageRating: store.rating || 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      }
    };

    // Calculate rating distribution
    if (store.reviews && store.reviews.length > 0) {
      store.reviews.forEach((review: any) => {
        const rating = Math.floor(review.rating);
        if (rating >= 1 && rating <= 5) {
          reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]++;
        }
      });
    }

    // Get recent reviews (last 5)
    const recentReviews = store.reviews
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    res.json({
      reviewStats,
      recentReviews
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
