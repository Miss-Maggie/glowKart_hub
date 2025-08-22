import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  MapPin,
  Calendar,
  User
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { orderAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface TrackingUpdate {
  status: string;
  timestamp: string;
  location: string;
  description: string;
}

interface Order {
  _id: string;
  store: {
    _id: string;
    name: string;
  };
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  tracking?: {
    number?: string;
    carrier?: string;
    estimatedDelivery?: string;
    updates: TrackingUpdate[];
  };
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const data = await orderAPI.getUserOrders(token);
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading your orders...</p>
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
              <h1 className="text-2xl font-bold text-primary">Order History</h1>
              <p className="text-muted-foreground">View and track your past orders</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No Orders Yet</CardTitle>
              <CardDescription className="mb-6">
                You haven't placed any orders yet. Start shopping to see your order history here.
              </CardDescription>
              <Button asChild>
                <Link to="/businesses">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
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
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">${order.total.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        From {order.store.name}
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
                      
                      <Separator />
                      
                      {order.tracking && order.tracking.updates.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Tracking Updates</h3>
                          <div className="space-y-3">
                            {order.tracking.updates.map((update, index) => (
                              <div key={index} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                                  {index < order.tracking!.updates.length - 1 && (
                                    <div className="h-full w-0.5 bg-muted flex-1"></div>
                                  )}
                                </div>
                                <div className="pb-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{update.status}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(update.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{update.description}</p>
                                  {update.location && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                      <MapPin className="h-3 w-3" />
                                      {update.location}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2 pt-4">
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

export default OrderHistory;