import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart, Settings, User, Target, ListChecks, Battery, Star } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const publicRoutes = ['/', '/auth'];
  if (!user || publicRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }
  
  if (!user?.onboardingCompleted && location.pathname !== "/dashboard") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 pr-4 pt-4 pb-4 pl-1 md:pr-6 md:pt-6 md:pb-6 md:pl-2 overflow-auto">
          <div className="md:hidden flex justify-between items-center mb-4">
            <img 
              src="/lovable-uploads/1c8df1c3-d192-44d0-ab53-ea9fe40a017c.png" 
              alt="Gen X Shred" 
              className="h-12 w-auto"
            />
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
      icon: BarChart3,
      label: "Dashboard", 
      path: "/dashboard",
      active: location.pathname === "/dashboard"
    },
    { 
      icon: Target,
      label: "Goals", 
      path: "/goals",
      active: location.pathname === "/goals"
    },
    { 
      icon: ListChecks,
      label: "Habits", 
      path: "/habits",
      active: location.pathname === "/habits"
    },
    { 
      icon: Star,
      label: "Motivation", 
      path: "/motivation",
      active: location.pathname === "/motivation"
    },
    { 
      icon: LineChart,
      label: "Progress", 
      path: "/progress",
      active: location.pathname === "/progress"
    },
    { 
      icon: Battery, // Using Battery icon for Body Type
      label: "Body Type", 
      path: "/body-type",
      active: location.pathname === "/body-type"
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
          <img 
            src="/lovable-uploads/1c8df1c3-d192-44d0-ab53-ea9fe40a017c.png" 
            alt="Gen X Shred" 
            className="h-16 w-auto"
          />
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
        {/* Light Mode button removed */}
      </SidebarFooter>
    </Sidebar>
  );
};

export default Layout;
