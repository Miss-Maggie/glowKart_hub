import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Store,
  Users,
  TrendingUp,
  MapPin,
  Star,
  Plus,
  Eye,
  MessageCircle,
  Calendar,
  Clock,
  BarChart
} from "lucide-react";
import { Link } from "react-router-dom";
import businessDashboardImage from "@/assets/business-dashboard.jpg";

interface BusinessDashboardProps {
  userData: {
    name: string;
    email: string;
    type: string;
  };
}

export function BusinessDashboard({ userData }: BusinessDashboardProps) {
  const businessStats = [
    { title: "Total Views", value: "2,847", icon: Eye, change: "+12%" },
    { title: "New Customers", value: "156", icon: Users, change: "+8%" },
    { title: "Reviews", value: "4.8", icon: Star, change: "+0.2" },
    { title: "Revenue", value: "$12,450", icon: TrendingUp, change: "+15%" }
  ];

  const recentActivities = [
    { type: "review", user: "Sarah M.", action: "left a 5-star review", time: "2 hours ago" },
    { type: "inquiry", user: "Mike J.", action: "sent an inquiry", time: "4 hours ago" },
    { type: "view", user: "Anonymous", action: "viewed your business", time: "6 hours ago" },
    { type: "favorite", user: "Lisa K.", action: "added you to favorites", time: "1 day ago" }
  ];

  const upcomingEvents = [
    { title: "Local Business Meetup", date: "Tomorrow 6:00 PM", location: "Community Center" },
    { title: "Holiday Market Setup", date: "Dec 15, 2024", location: "Main Street" },
    { title: "Customer Appreciation Day", date: "Dec 20, 2024", location: "Your Store" }
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "John D.", items: "3 items", total: "$89.99", status: "processing", date: "2 hours ago" },
    { id: "#ORD-002", customer: "Sarah M.", items: "1 item", total: "$299.99", status: "pending", date: "5 hours ago" },
    { id: "#ORD-003", customer: "Mike J.", items: "5 items", total: "$145.50", status: "shipped", date: "1 day ago" }
  ];

  return (
    <>
      {/* Quick Actions Header */}
      <div className="flex justify-end mb-6">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
          <Link to="/create-listing">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {businessStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-accent font-medium">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest interactions with your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Community Events
                </CardTitle>
                <CardDescription>Local events to boost your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">{event.date}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {event.location}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="relative overflow-hidden">
            <img
              src={businessDashboardImage}
              alt="Business Dashboard"
              className="absolute inset-0 w-full h-full object-cover opacity-10"
            />
            <CardHeader className="relative">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to grow your business</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-16 flex-col space-y-2" asChild>
                  <Link to="/businesses">
                    <Store className="h-5 w-5" />
                    <span className="text-sm">Update Business Info</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">Respond to Reviews</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage your customer relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">156</div>
                    <div className="text-sm text-muted-foreground">Total Customers</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-accent">23</div>
                    <div className="text-sm text-muted-foreground">New This Month</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-secondary">89%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{order.id}</p>
                          <Badge variant={order.status === "delivered" ? "default" : order.status === "shipped" ? "secondary" : "outline"}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{order.customer} • {order.items}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="font-medium text-sm">{order.total}</p>
                        <Button variant="ghost" size="sm" className="text-xs mt-1">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/business/orders">View All Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>Manage your products and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">42</div>
                    <div className="text-sm text-muted-foreground">Total Products</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-accent">8</div>
                    <div className="text-sm text-muted-foreground">Low Stock</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-secondary">$89</div>
                    <div className="text-sm text-muted-foreground">Avg. Price</div>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link to="/create-listing">Add New Product</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Business Analytics</CardTitle>
              <CardDescription>Deep insights into your business performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="text-sm font-medium">12.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg. Order Value</span>
                      <span className="text-sm font-medium">$67.80</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Customer Retention</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Growth Trends</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue Growth</span>
                      <span className="text-sm font-medium text-accent">+15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Customer Growth</span>
                      <span className="text-sm font-medium text-accent">+8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">View Growth</span>
                      <span className="text-sm font-medium text-accent">+12%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}