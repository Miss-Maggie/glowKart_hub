import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Store, 
  Star,
  Heart,
  ShoppingBag,
  CreditCard,
  Package,
  Gift,
  User,
  Settings,
  Truck,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import shopperDashboardImage from "@/assets/shopper-dashboard.jpg";

interface ShopperDashboardProps {
  userData: {
    name: string;
    email: string;
    type: string;
  };
}

export function ShopperDashboard({ userData }: ShopperDashboardProps) {
  const shopperStats = [
    { title: "Total Orders", value: "24", icon: ShoppingBag, change: "+3 this month" },
    { title: "Total Spent", value: "$1,248", icon: CreditCard, change: "+$245 this month" },
    { title: "Favorites", value: "18", icon: Heart, change: "+5 new favorites" },
    { title: "Rewards Points", value: "1,240", icon: Gift, change: "+120 points" }
  ];

  const recentOrders = [
    { id: "#ORD-001", business: "Fresh Delights", items: "2 items", total: "$45.99", status: "delivered", date: "2 days ago" },
    { id: "#ORD-002", business: "Tech Store", items: "1 item", total: "$299.99", status: "shipped", date: "5 days ago" },
    { id: "#ORD-003", business: "Book Haven", items: "3 items", total: "$67.50", status: "delivered", date: "1 week ago" },
    { id: "#ORD-004", business: "Fashion Hub", items: "2 items", total: "$89.99", status: "processing", date: "3 days ago" }
  ];

  const recommendedBusinesses = [
    { name: "Artisan Coffee", category: "Café", rating: "4.9", distance: "0.3 mi", image: "/mock-images/placeholder.jpg" },
    { name: "Green Grocers", category: "Grocery", rating: "4.7", distance: "0.5 mi", image: "/mock-images/placeholder.jpg" },
    { name: "Tech Repair Pro", category: "Electronics", rating: "4.8", distance: "0.8 mi", image: "/mock-images/placeholder.jpg" }
  ];

  return (
    <>
      {/* Quick Actions Header */}
      <div className="flex justify-end mb-6">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
          <Link to="/businesses">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Shops
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {shopperStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-accent font-medium">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Your latest purchases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.slice(0, 3).map((order, index) => (
                  <div key={index} className="flex items-center justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{order.business}</p>
                      <p className="text-xs text-muted-foreground">{order.items} • {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{order.total}</p>
                      <Badge 
                        variant={order.status === "delivered" ? "default" : order.status === "shipped" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {order.status === "delivered" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {order.status === "shipped" && <Truck className="mr-1 h-3 w-3" />}
                        {order.status === "processing" && <AlertCircle className="mr-1 h-3 w-3" />}
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/orders">View All Orders</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Businesses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Recommended for You
                </CardTitle>
                <CardDescription>Based on your preferences and location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedBusinesses.map((business, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Store className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{business.name}</p>
                      <p className="text-xs text-muted-foreground">{business.category} • {business.distance}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-xs">{business.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/businesses">Explore More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="relative overflow-hidden">
            <img
              src={shopperDashboardImage}
              alt="Shopper Dashboard"
              className="absolute inset-0 w-full h-full object-cover opacity-10"
            />
            <CardHeader className="relative">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Things you can do right now</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid gap-4 md:grid-cols-4">
                <Button variant="outline" className="h-16 flex-col space-y-2" asChild>
                  <Link to="/businesses">
                    <ShoppingBag className="h-5 w-5" />
                    <span className="text-sm">Browse Shops</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2" asChild>
                  <Link to="/cart">
                    <Package className="h-5 w-5" />
                    <span className="text-sm">View Cart</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2" asChild>
                  <Link to="/favorites">
                    <Heart className="h-5 w-5" />
                    <span className="text-sm">My Favorites</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <Gift className="h-5 w-5" />
                  <span className="text-sm">Rewards</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>All your past purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{order.id}</p>
                        <Badge 
                          variant={order.status === "delivered" ? "default" : order.status === "shipped" ? "secondary" : "outline"}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.business} • {order.items}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium">{order.total}</p>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>My Favorites</CardTitle>
              <CardDescription>Businesses and products you love</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendedBusinesses.map((business, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{business.name}</h4>
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{business.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-xs">{business.rating}</span>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/businesses">Visit</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Personal Information</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Name: {userData.name}</p>
                      <p>Email: {userData.email}</p>
                      <p>Phone: +254 700 123 456</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Preferences</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Language: English</p>
                      <p>Currency: KES</p>
                      <p>Notifications: Enabled</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button>
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}