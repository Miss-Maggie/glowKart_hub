import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Trash2, 
  Package, 
  Store, 
  Calendar,
  User
} from "lucide-react";
import { adminReviewAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  date: string;
  product?: string;
  productId?: string;
  store?: string;
  storeId?: string;
}

const AdminReviews = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [storeReviews, setStoreReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const [productData, storeData] = await Promise.all([
          adminReviewAPI.getAllProductReviews(token),
          adminReviewAPI.getAllStoreReviews(token)
        ]);
        
        setProductReviews(productData);
        setStoreReviews(storeData);
        setError("");
      } catch (err: any) {
        setError(err.message || "Failed to fetch reviews");
        toast({
          title: "Error",
          description: err.message || "Failed to fetch reviews",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token, toast]);

  const handleDeleteReview = async (type: "product" | "store", reviewId: string, itemId: string) => {
    if (!token) return;
    
    try {
      if (type === "product") {
        await adminReviewAPI.deleteProductReview(itemId, reviewId, token);
        setProductReviews(productReviews.filter(review => review._id !== reviewId));
        toast({
          title: "Success",
          description: "Product review deleted successfully",
        });
      } else {
        await adminReviewAPI.deleteStoreReview(itemId, reviewId, token);
        setStoreReviews(storeReviews.filter(review => review._id !== reviewId));
        toast({
          title: "Success",
          description: "Store review deleted successfully",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const renderReview = (review: Review, type: "product" | "store") => (
    <div key={review._id} className="border-b pb-6 last:border-0 last:pb-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-medium">{review.user.name}</div>
            <div className="text-sm text-muted-foreground">{review.user.email}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteReview(type, review._id, type === "product" ? review.productId || "" : review.storeId || "")}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <Calendar className="h-4 w-4 mr-1" />
        {new Date(review.date).toLocaleDateString()}
      </div>
      
      {type === "product" && review.product && (
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Package className="h-4 w-4 mr-1" />
          {review.product}
        </div>
      )}
      
      {type === "store" && review.store && (
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Store className="h-4 w-4 mr-1" />
          {review.store}
        </div>
      )}
      
      <p className="text-muted-foreground mt-2">{review.comment}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading reviews...</p>
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Review Management</h1>
              <p className="text-muted-foreground">Manage product and store reviews</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <Button 
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
          >
            <Package className="h-4 w-4 mr-2" />
            Product Reviews ({productReviews.length})
          </Button>
          <Button 
            variant={activeTab === "stores" ? "default" : "outline"}
            onClick={() => setActiveTab("stores")}
          >
            <Store className="h-4 w-4 mr-2" />
            Store Reviews ({storeReviews.length})
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "products" ? "Product Reviews" : "Store Reviews"}
            </CardTitle>
            <CardDescription>
              {activeTab === "products" 
                ? "Manage customer reviews for products" 
                : "Manage customer reviews for stores"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === "products" ? (
              productReviews.length > 0 ? (
                <div className="space-y-6">
                  {productReviews.map(review => renderReview(review, "product"))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Product Reviews</h3>
                  <p className="text-muted-foreground">
                    There are no product reviews to display.
                  </p>
                </div>
              )
            ) : storeReviews.length > 0 ? (
              <div className="space-y-6">
                {storeReviews.map(review => renderReview(review, "store"))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Store Reviews</h3>
                <p className="text-muted-foreground">
                  There are no store reviews to display.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReviews;