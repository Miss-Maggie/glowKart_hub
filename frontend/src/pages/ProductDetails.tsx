import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  ShoppingCart, 
  User, 
  Calendar,
  Plus,
  Minus
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { productAPI, productReviewAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  store: {
    _id: string;
    name: string;
  };
  rating: number;
  numReviews: number;
  reviews: Review[];
}

const ProductDetails = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const { productId } = useParams();
  const { token, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const data = await productAPI.getProductById(productId);
        setProduct(data);
        
        // Check if user has already reviewed this product
        if (user && data.reviews) {
          const existingReview = data.reviews.find(
            (review: Review) => review.user._id === user._id
          );
          if (existingReview) {
            setUserReview(existingReview);
            setReviewRating(existingReview.rating);
            setReviewText(existingReview.comment);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, user]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex((item: any) => item._id === product._id);
    
    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        ...product,
        quantity: quantity
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleReviewSubmit = async () => {
    if (!token || !productId) return;
    
    try {
      if (userReview) {
        // Update existing review
        await productReviewAPI.updateReview(
          productId, 
          { rating: reviewRating, comment: reviewText }, 
          token
        );
        
        toast({
          title: "Review updated",
          description: "Your review has been updated successfully.",
        });
      } else {
        // Add new review
        await productReviewAPI.addReview(
          productId, 
          { rating: reviewRating, comment: reviewText }, 
          token
        );
        
        toast({
          title: "Review added",
          description: "Your review has been added successfully.",
        });
      }
      
      // Refresh product data
      const data = await productAPI.getProductById(productId);
      setProduct(data);
      
      // Update user review
      if (user && data.reviews) {
        const existingReview = data.reviews.find(
          (review: Review) => review.user._id === user._id
        );
        if (existingReview) {
          setUserReview(existingReview);
        }
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  const handleReviewDelete = async () => {
    if (!token || !productId || !userReview) return;
    
    try {
      await productReviewAPI.deleteReview(productId, token);
      
      toast({
        title: "Review deleted",
        description: "Your review has been deleted successfully.",
      });
      
      // Refresh product data
      const data = await productAPI.getProductById(productId);
      setProduct(data);
      setUserReview(null);
      setReviewRating(0);
      setReviewText("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-destructive">{error}</p>
            <Button className="w-full mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center">Product Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Button className="w-full" asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Product Details</h1>
              <p className="text-muted-foreground">{product.name}</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <img 
              src={product.image || "/mock-images/placeholder.jpg"} 
              alt={product.name} 
              className="w-full max-w-md h-auto rounded-lg border"
            />
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground mt-2">{product.description}</p>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                  />
                ))}
                <span className="ml-2 text-sm font-medium">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">({product.numReviews} reviews)</span>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Category: {product.category}</p>
              <p className="text-sm text-muted-foreground">Sold by: {product.store.name}</p>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Customer Reviews</span>
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">({product.numReviews} reviews)</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {token ? (
                <div className="mb-8">
                  <CardTitle className="text-lg mb-4">
                    {userReview ? "Update Your Review" : "Write a Review"}
                  </CardTitle>
                  <div className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="icon"
                            onClick={() => setReviewRating(star)}
                            className="p-1"
                          >
                            <Star 
                              className={`h-6 w-6 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                            />
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="review">Your Review</Label>
                      <Textarea
                        id="review"
                        placeholder="Share your experience with this product..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleReviewSubmit}>
                        {userReview ? "Update Review" : "Submit Review"}
                      </Button>
                      {userReview && (
                        <Button variant="destructive" onClick={handleReviewDelete}>
                          Delete Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-muted rounded-md">
                  <p className="text-center">
                    Please <Link to="/login" className="text-primary hover:underline">log in</Link> to write a review.
                  </p>
                </div>
              )}
              
              <Separator className="my-6" />
              
              <div>
                <CardTitle className="text-lg mb-4">Recent Reviews</CardTitle>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review._id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{review.user.name}</span>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;