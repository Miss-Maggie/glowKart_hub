import { useState } from "react";
import {
  Home,
  Store,
  ShoppingBag,
  Heart,
  User,
  Settings,
  BarChart3,
  MessageCircle,
  Plus,
  LogOut,
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ThemeToggle";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  isLogout?: boolean;
}

const shopperItems: SidebarItem[] = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Browse Shops", url: "/businesses", icon: Store },
  { title: "My Cart", url: "/cart", icon: ShoppingBag },
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

const businessItems: SidebarItem[] = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Listings", url: "/create-listing", icon: Plus },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Messages", url: "/messages", icon: MessageCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

const adminItems: SidebarItem[] = [
  { title: "Home", url: "/", icon: Home },
  { title: "Admin Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Manage Users", url: "/admin/users", icon: Users },
  { title: "Manage Stores", url: "/admin/stores", icon: Store },
  { title: "Manage Products", url: "/admin/products", icon: Package },
  { title: "Manage Orders", url: "/admin/orders", icon: ShoppingCart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, logout } = useAuth(); // Use actual user data and logout from context

  // Determine which items to show based on user type
  let items: SidebarItem[];
  if (user?.type === 'admin') {
    items = [...adminItems];
  } else if (user?.type === 'business') {
    items = [...businessItems];
  } else {
    items = [...shopperItems];
  }

  // Add logout item to the navigation
  items.push({ title: "Logout", url: "#", icon: LogOut, isLogout: true });

  const isActive = (path: string) => currentPath === path;
  const isExpanded = items.some((i) => isActive(i.url));
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-muted/50";

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const collapsed = state === "collapsed";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        {!collapsed && user && (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.type === 'admin' ? 'Administrator' :
                 user.type === 'business' ? 'Business Owner' : 'Shopper'}
              </p>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.isLogout ? (
                    <SidebarMenuButton
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                      className="w-full justify-start"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavCls}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <>
            <ThemeToggle />
          </>
        )}
        {collapsed && (
          <div className="flex flex-col items-center space-y-2">
            <ThemeToggle />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}