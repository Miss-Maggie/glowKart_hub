import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();

  // For mobile: use sidebar layout
  if (isMobile) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <header className="h-12 flex items-center border-b bg-white/50 backdrop-blur-sm px-4">
              <SidebarTrigger />
            </header>
            
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // For desktop: render children directly (Dashboard has its own layout)
  return <div className="w-full">{children}</div>;
}