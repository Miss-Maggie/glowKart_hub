import { Button } from "@/components/ui/button";
import {
  Home,
  Store,
  ShoppingBag,
  Heart,
  User,
  Search,
  Bell
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import NotificationBell from "./NotificationBell";

export function QuickNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Store, label: "Businesses", path: "/businesses" },
    { icon: ShoppingBag, label: "Cart", path: "/cart" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: User, label: "Dashboard", path: "/dashboard" }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md border rounded-full px-4 py-2 shadow-lg">
      <div className="flex items-center space-x-2">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full w-10 h-10 p-0 transition-all duration-200",
              currentPath === item.path
                ? "bg-primary text-primary-foreground shadow-md scale-110"
                : "hover:bg-muted"
            )}
            asChild
          >
            <Link to={item.path} className="flex items-center justify-center">
              <item.icon className="h-4 w-4" />
              <span className="sr-only">{item.label}</span>
            </Link>
          </Button>
        ))}
        <NotificationBell />
      </div>
    </div>
  );
}