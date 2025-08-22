import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Search,
  Filter,
  Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { orderAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  tracking?: {
    number?: string;
    carrier?: string;
    estimatedDelivery?: string;
  };
}

const BusinessOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { token } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        // This would need to be updated to fetch orders for the business
        // For now, we'll use the user orders endpoint as a placeholder
        const data = await orderAPI.getUserOrders(token);
        setOrders(data);
        setFilteredOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  useEffect(() => {
    let result = orders;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(order => 
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "processing":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "shipped":
        return "secondary";
      case "processing":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (!token) return;
    
    try {
      // Update order status via API
      await orderAPI.updateOrderStatus(orderId, newStatus, null, token);
      
      // Update local state
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      setFilteredOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Add notification
      addNotification({
        type: 'order',
        title: 'Order Status Updated',
        message: `Order #${orderId.substring(0, 8)} status updated to ${newStatus}`,
        orderId: orderId
      });
    } catch (err: any) {
      setError(err.message || "Failed to update order status");
    }
  };

  const handleAddTracking = async (orderId: string) => {
    if (!token) return;
    
    try {
      // Add tracking information via API
      const trackingData = {
        trackingNumber: "TRK123456789",
        carrier: "FedEx",
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      await orderAPI.addTrackingInfo(orderId, trackingData, token);
      
      // Update local state
      setOrders(prev => prev.map(order =>
        order._id === orderId ? {
          ...order,
          tracking: {
            number: trackingData.trackingNumber,
            carrier: trackingData.carrier,
            estimatedDelivery: trackingData.estimatedDelivery
          }
        } : order
      ));
      setFilteredOrders(prev => prev.map(order =>
        order._id === orderId ? {
          ...order,
          tracking: {
            number: trackingData.trackingNumber,
            carrier: trackingData.carrier,
            estimatedDelivery: trackingData.estimatedDelivery
          }
        } : order
      ));
      
      // Add notification
      addNotification({
        type: 'order',
        title: 'Tracking Information Added',
        message: `Tracking information added for order #${orderId.substring(0, 8)}`,
        orderId: orderId
      });
    } catch (err: any) {
      setError(err.message || "Failed to add tracking information");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading orders...</p>
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
              <h1 className="text-2xl font-bold text-primary">Order Management</h1>
              <p className="text-muted-foreground">Manage and track customer orders</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="search">Search Orders</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by customer or order ID..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Filter by Status</Label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    id="status"
                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Export Data</Label>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Orders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders ({filteredOrders.length})</h2>
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(filteredOrders.length, 10)} of {filteredOrders.length} orders
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No Orders Found</CardTitle>
              <CardDescription className="mb-6">
                {searchTerm || statusFilter !== "all" 
                  ? "No orders match your current filters. Try adjusting your search or filter criteria."
                  : "You don't have any orders yet. When customers place orders, they'll appear here."}
              </CardDescription>
              {searchTerm || statusFilter !== "all" ? (
                <Button onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}>
                  Clear Filters
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/businesses">View Your Products</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.slice(0, 10).map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Order #{order._id.substring(0, 8)}
                        <Badge variant={getStatusVariant(order.status) as any}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Customer: {order.user.name} ({order.user.email})
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">${order.total.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Items</h3>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <div>
                                <span className="font-medium">{item.product.name}</span>
                                <span className="text-muted-foreground"> × {item.quantity}</span>
                              </div>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {order.tracking && (
                        <div>
                          <h3 className="font-medium mb-2">Tracking Information</h3>
                          <div className="grid gap-2 md:grid-cols-3">
                            <div>
                              <div className="text-sm text-muted-foreground">Carrier</div>
                              <div className="font-medium">{order.tracking.carrier}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Tracking Number</div>
                              <div className="font-medium">{order.tracking.number}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Estimated Delivery</div>
                              <div className="font-medium">
                                {order.tracking.estimatedDelivery 
                                  ? new Date(order.tracking.estimatedDelivery).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 pt-4">
                        {order.status === "pending" && (
                          <Button onClick={() => handleStatusUpdate(order._id, "processing")}>
                            Mark as Processing
                          </Button>
                        )}
                        {order.status === "processing" && (
                          <Button onClick={() => handleAddTracking(order._id)}>
                            Add Tracking Info
                          </Button>
                        )}
                        {order.status === "processing" && (
                          <Button onClick={() => handleStatusUpdate(order._id, "shipped")}>
                            Mark as Shipped
                          </Button>
                        )}
                        {order.status === "shipped" && (
                          <Button onClick={() => handleStatusUpdate(order._id, "delivered")}>
                            Mark as Delivered
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/orders/${order._id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessOrders;