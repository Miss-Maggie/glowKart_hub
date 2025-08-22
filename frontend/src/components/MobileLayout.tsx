import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Store,
  Home,
  ShoppingCart,
  User,
  LogIn,
  UserPlus,
  Search,
  Heart,
  Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/businesses", label: "Shop Local", icon: Search },
    { href: "/cart", label: "Cart", icon: ShoppingCart },
    { href: "/dashboard", label: "Dashboard", icon: User },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/contact", label: "Contact", icon: Settings },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Mobile Menu Trigger */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                          <Store className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-primary">GlowKart Hub</span>
                      </div>
                    </div>
                    <nav className="flex-1 p-6">
                      <ul className="space-y-2">
                        {navItems.map((item) => (
                          <li key={item.href}>
                            <Link
                              to={item.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActiveRoute(item.href)
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                              }`}
                            >
                              <item.icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                    <div className="p-6 border-t space-y-2">
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="hero" className="w-full" asChild>
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Get Started
                        </Link>
                      </Button>
                    </div>
                    <div className="p-6 border-t">
                      <ThemeToggle />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-primary">GlowKart Hub</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <nav className="flex items-center space-x-6 mr-8">
                {navItems.slice(0, -1).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActiveRoute(item.href)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
};

export default MobileLayout;