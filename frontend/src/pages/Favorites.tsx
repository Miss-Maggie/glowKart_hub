import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart,
  MapPin, 
  Star, 
  Clock,
  Phone,
  Globe,
  Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";

const Favorites = () => {
  const favorites = [
    {
      id: 1,
      name: "Sarah's Bakery",
      category: "Food & Dining",
      rating: 4.8,
      reviews: 124,
      address: "123 Main St, Downtown",
      phone: "(555) 123-4567",
      website: "sarahsbakery.com",
      hours: "6:00 AM - 8:00 PM",
      image: "/placeholder.svg",
      description: "Fresh artisan breads and pastries made daily with organic ingredients."
    }
  ];

  return (
    <MobileLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Your Favorites</h1>
          <p className="text-muted-foreground">Businesses you've saved for later</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">Start exploring businesses and save your favorites!</p>
            <Button asChild>
              <Link to="/businesses">Explore Businesses</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{business.name}</CardTitle>
                      <CardDescription>{business.category}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
                  </div>
                  
                  <Button size="sm" className="w-full" asChild>
                    <Link to={`/business/${business.id}`}>View Details</Link>
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

export default Favorites;