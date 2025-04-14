
import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Home, Moon, Settings, Sun, User } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show sidebar during onboarding
  if (!user?.onboardingCompleted && location.pathname !== "/dashboard") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="md:hidden flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-thrive-blue">ThriveWell</h1>
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { 
      icon: Home, 
      label: "Dashboard", 
      path: "/dashboard",
      active: location.pathname === "/dashboard"
    },
    { 
      icon: BarChart3, 
      label: "Progress", 
      path: "/progress",
      active: location.pathname === "/progress"
    },
    { 
      icon: User, 
      label: "Profile", 
      path: "/profile",
      active: location.pathname === "/profile"
    },
    { 
      icon: Settings, 
      label: "Settings", 
      path: "/settings",
      active: location.pathname === "/settings"
    }
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-thrive-blue flex items-center justify-center">
            <span className="text-white font-semibold">TW</span>
          </div>
          <h1 className="text-xl font-bold">ThriveWell</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start ${item.active ? 'bg-thrive-blue text-white' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="outline" className="w-full">
          <Sun className="h-4 w-4 mr-2" />
          Light Mode
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
