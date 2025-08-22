import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Star, 
  Clock,
  Phone,
  Globe,
  Heart,
  Filter,
  Store,
  ArrowLeft,
  ShoppingCart
} from "lucide-react";
import { Link } from "react-router-dom";

import MobileLayout from "@/components/MobileLayout";
import { storeAPI } from "@/services/api";
import ThemeToggle from "@/components/ThemeToggle";

// Helper to get a mock image per category
const getMockImage = (category: string) => {
  const images: Record<string, string> = {
    "Food & Dining": "/mock-images/food.jpg",
    "Technology": "/mock-images/technology.jpg",
    "Home & Garden": "/mock-images/homegarden.jpg",
    "Health & Wellness": "/mock-images/health&wellness.jpg",
    "Retail & Shopping": "/mock-images/retail.jpg",
    "Professional Services": "/mock-images/professional.jpg",
    "Automotive": "/mock-images/automotive.jpg",
    "Beauty & Personal Care": "/mock-images/beauty.jpg",
    "default": "https://via.placeholder.com/300x200?text=No+Image"
  };
  return images[category] || images["default"];
};

const Businesses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // Fetch businesses from backend API
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await storeAPI.getAllStores(page, 10);
        // Transform data to match expected format
        const transformedBusinesses = data.stores.map((store: any) => ({
          id: store._id,
          name: store.name,
          category: store.category,
          rating: 4.5, // Default rating since it's not in the model
          reviews: 0, // Default reviews since it's not in the model
          address: store.location,
          phone: "N/A", // Not in the model
          website: "N/A", // Not in the model
          hours: "N/A", // Not in the model
          image: store.images && store.images.length > 0
            ? store.images[0]
            : getMockImage(store.category),
          description: store.description || "No description available"
        }));
        setBusinesses(transformedBusinesses);
        setTotalPages(data.pagination.totalPages);
        setHasNextPage(data.pagination.hasNextPage);
        setHasPrevPage(data.pagination.hasPrevPage);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch businesses");
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [page]);

  const categories = [
    "All",
    "Food & Dining",
    "Technology",
    "Home & Garden",
    "Health & Wellness",
    "Shopping",
    "Retail & Shopping",
    "Professional Services",
    "Automotive",
    "Beauty & Personal Care"
  ];

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <MobileLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading businesses...</p>
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
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Explore Local Businesses</h1>
          <p className="text-muted-foreground mb-6">Discover amazing businesses in your neighborhood</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search businesses, services, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => {
                  if (category === "All") {
                    setSearchTerm("");
                  } else {
                    setSearchTerm(category);
                  }
                }}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      <Link to={`/business/${business.id}`}>{business.name}</Link>
                    </CardTitle>
                    <CardDescription>{business.category}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="my-4">
                  <img
                    src={business.image}
                    alt={business.name + ' image'}
                    className="w-full h-40 object-cover rounded-lg border"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = getMockImage(business.category);
                    }}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(business.rating) ? 'text-accent fill-accent' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{business.rating}</span>
                  <span className="text-sm text-muted-foreground">({business.reviews} reviews)</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{business.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    {business.address}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {business.hours}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="mr-2 h-4 w-4" />
                    {business.phone}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Globe className="mr-2 h-4 w-4" />
                    {business.website}
                  </div>
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <Link to={`/business/${business.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <Button
            onClick={() => setPage(page - 1)}
            disabled={!hasPrevPage}
            variant="outline"
          >
            Previous
          </Button>
          
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          
          <Button
            onClick={() => setPage(page + 1)}
            disabled={!hasNextPage}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Businesses;
