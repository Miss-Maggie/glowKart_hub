import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BusinessDashboard } from "@/components/BusinessDashboard";
import { ShopperDashboard } from "@/components/ShopperDashboard";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [userType, setUserType] = useState('shopper');
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If user is admin, redirect to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  // If user is not authenticated, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  // If user is admin, don't render regular dashboard
  if (isAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  {userType === "business" ? "Business Dashboard" : "My Dashboard"}
                </h1>
                <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setUserType(userType === "business" ? "shopper" : "business")}
                  className="text-sm"
                >
                  Switch to {userType === "business" ? "Shopper" : "Business"} View
                </Button>
                <Button variant="outline" onClick={logout} className="text-sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/" className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {userType === "business" ? (
            <BusinessDashboard userData={user} />
          ) : (
            <ShopperDashboard userData={user} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;