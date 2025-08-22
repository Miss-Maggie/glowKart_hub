import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  Heart,
  Share2,
  Store,
  ShoppingCart,
  Calendar,
  MessageCircle,
  Plus,
  Minus,
  User
} from "lucide-react";
import { storeAPI, productAPI } from "@/services/api";
import { storeReviewAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";

const BusinessDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [business, setBusiness] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [userReview, setUserReview] = useState<any>(null);

  const getMockImage = (category: string) => {
    const images: Record<string, string> = {
      "Food & Dining": "/mock-images/food.jpg",
      "Retail & Shopping": "/mock-images/retail.jpg",
      "Professional Services": "/mock-images/professional.jpg",
      "Health & Wellness": "/mock-images/health&wellness.jpg",
      "Technology": "/mock-images/technology.jpg",
      "Home & Garden": "/mock-images/homegarden.jpg",
      "Automotive": "/mock-images/automotive.jpg",
      "Beauty & Personal Care": "/mock-images/beauty.jpg",
      "default": "https://via.placeholder.com/300x200?text=No+Image" // CDN placeholder
    };
    return images[category] || images["default"];
  };

  // Fetch business data from backend API
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        if (!id) {
          setError("Business ID is missing");
          setLoading(false);
          return;
        }
        
        const data = await storeAPI.getStoreById(id);
        
        // Check if data exists
        if (!data) {
          setError("Business not found");
          setLoading(false);
          return;
        }
        
        // Transform data to match expected format
        const transformedBusiness = {
          id: data._id || data.id,
          name: data.name,
          category: data.category,
          rating: data.rating || 0,
          reviews: data.numReviews || 0,
          address: data.location || "Address not available",
          phone: data.phone || "N/A",
          website: data.website || "N/A",
          hours: data.hours || "N/A",
          image: data.images && data.images.length > 0 ? data.images[0] : "/mock-images/placeholder.jpg",
          description: data.description || "No description available",
          longDescription: data.description || "No description available",
          services: data.services || [],
          gallery: data.images && data.images.length > 0 ? data.images : ["/placeholder.svg"],
          customerReviews: data.reviews || []
        };
        setBusiness(transformedBusiness);
        
        // Check if user has already reviewed this business
        if (user && data.reviews) {
          const existingReview = data.reviews.find(
            (review: any) => review.user && review.user._id === user._id
          );
          if (existingReview) {
            setUserReview(existingReview);
            setReviewRating(existingReview.rating);
            setReviewText(existingReview.comment);
          }
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch business details");
        setLoading(false);
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id, user]);

  // Fetch products for this business
  useEffect(() => {
    const fetchProducts = async () => {
      if (!id) return;
      try {
        const data = await productAPI.getProductsByStore(id);
        setProducts(data);
      } catch (err: any) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, [id]);

  const addToCart = (product: any) => {
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    let cartItems = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex((item: any) => item._id === product._id);
    
    if (existingItemIndex > -1) {
      // If product exists, increase quantity
      cartItems[existingItemIndex].quantity += 1;
    } else {
      // If product doesn't exist, add new item
      const newItem = {
        _id: product._id,
        name: product.name,
        business: business?.name || "Local Business",
        price: product.price,
        quantity: 1,
        image: product.image || "/placeholder.svg"
      };
      cartItems.push(newItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Show success message
    alert(`${product.name} added to cart!`);
  };

  const handleReviewSubmit = async () => {
    if (!token || !id) return;
    
    try {
      if (userReview) {
        // Update existing review
        await storeReviewAPI.updateReview(
          id,
          { rating: reviewRating, comment: reviewText },
          token
        );
        
        toast({
          title: "Review updated",
          description: "Your review has been updated successfully.",
        });
      } else {
        // Add new review
        await storeReviewAPI.addReview(
          id,
          { rating: reviewRating, comment: reviewText },
          token
        );
        
        toast({
          title: "Review added",
          description: "Your review has been added successfully.",
        });
      }
      
      // Refresh business data
      const data = await storeAPI.getStoreById(id);
      const transformedBusiness = {
        ...business,
        rating: data.rating || 0,
        reviews: data.numReviews || 0,
        customerReviews: data.reviews || []
      };
      setBusiness(transformedBusiness);
      
      // Update user review
      if (user && data.reviews) {
        const existingReview = data.reviews.find(
          (review: any) => review.user && review.user._id === user._id
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
    if (!token || !id || !userReview) return;
    
    try {
      await storeReviewAPI.deleteReview(id, token);
      
      toast({
        title: "Review deleted",
        description: "Your review has been deleted successfully.",
      });
      
      // Refresh business data
      const data = await storeAPI.getStoreById(id);
      const transformedBusiness = {
        ...business,
        rating: data.rating || 0,
        reviews: data.numReviews || 0,
        customerReviews: data.reviews || []
      };
      setBusiness(transformedBusiness);
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
          <p className="mt-4 text-muted-foreground">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-2xl mb-4">Error</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-2xl mb-4">Business Not Found</div>
          <p className="text-muted-foreground mb-4">The business you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/businesses">Back to Businesses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with navigation */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/businesses" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Businesses
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-primary">GlowKart Hub</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/cart" className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Business Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="lg:w-1/2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-2">{business.name}</h1>
                  <Badge variant="secondary" className="mb-4">{business.category}</Badge>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-1 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(business.rating) ? 'text-accent fill-accent' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium">{business.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({business.reviews} reviews)</span>
              </div>

              <p className="text-muted-foreground mb-6">{business.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-3 h-5 w-5" />
                  {business.address}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-3 h-5 w-5" />
                  {business.hours}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="mr-3 h-5 w-5" />
                  {business.phone}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Globe className="mr-3 h-5 w-5" />
                  {business.website}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" asChild>
                  <Link to={`/contact?business=${business.name}`}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Business
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/contact?business=${business.name}&action=book`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/add-product">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Services & Specialties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {business.services && business.services.length > 0 ? (
                business.services.map((service: string, index: number) => (
                  <Badge key={index} variant="outline">{service}</Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No services listed</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About {business.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{business.longDescription}</p>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>What people are saying about {business.name}</CardDescription>
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
                      placeholder="Share your experience with this business..."
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
              {business.customerReviews && business.customerReviews.length > 0 ? (
                <div className="space-y-6">
                  {business.customerReviews.map((review: any, index: number) => (
                    <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
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
                  No reviews yet. Be the first to review this business!
                </p>
              )}
            </div>
            <Button variant="outline" className="w-full mt-6">
              View All Reviews
            </Button>
          </CardContent>
        </Card>
        
        {/* Products Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-primary">Products</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <img
                      src={product.image || getMockImage(product.category || "default")}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = getMockImage(product.category || "default");
                      }}
                    />
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{product.description || "No description available"}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary text-lg">${product.price.toFixed(2)}</span>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <img
                src={getMockImage(business.category || "default")}
                alt={business.category + ' mock product'}
                className="w-40 h-40 object-cover rounded-lg mb-4 border"
              />
              <h3 className="font-semibold text-lg mb-2">No products available</h3>
              <p className="text-muted-foreground text-center mb-4">This business hasn't added any products yet. Check back soon!</p>
              <Button asChild>
                <Link to="/add-product">Add Product</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
