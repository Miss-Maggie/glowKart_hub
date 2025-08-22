import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart,
  Store
} from "lucide-react";
import { Link } from "react-router-dom";
import { productAPI } from "@/services/api";
import MobileLayout from "@/components/MobileLayout";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAllProducts();
        setProducts(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const getImageUrl = (imagePath: string) => {
    // If it's already a full URL, return as is
    if (imagePath && (imagePath.startsWith('http') || imagePath.startsWith('/'))) {
      return imagePath;
    }
    // If it's just a filename, prefix with /uploads/
    if (imagePath) {
      return `/uploads/${imagePath}`;
    }
    // Return empty string if no image path
    return "";
  };

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
        business: product.store?.name || "Local Business",
        price: product.price,
        quantity: 1,
        image: product.image ? getImageUrl(product.image) : getMockImage(product.category || "default")
      };
      cartItems.push(newItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Show success message
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-destructive text-2xl mb-4">Error</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">All Products</h1>
          <p className="text-muted-foreground">Discover amazing products from local businesses</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-2xl mb-4">No products available</div>
            <p className="text-muted-foreground mb-4">Check back later for new products from local businesses</p>
            <Button asChild>
              <Link to="/businesses">Explore Businesses</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product._id} className="hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-4">
                  <img
                    src={product.image ? getImageUrl(product.image) : getMockImage(product.category || "default")}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      // If the image fails to load, use CDN placeholder
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-bold text-primary text-lg">${product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description || "No description available"}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Store className="mr-1 h-4 w-4" />
                    <span>{product.store?.name || "Local Business"}</span>
                  </div>
                  <Button className="w-full" onClick={() => addToCart(product)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Products;