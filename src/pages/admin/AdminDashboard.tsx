import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, BarChart3, Shield, LogOut } from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import CoachDashboard from "@/components/admin/CoachDashboard";
import CreateCoachesAction from "@/components/admin/CreateCoachesAction";
import CreateAdminUserAction from "@/components/admin/CreateAdminUserAction";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { role, loading, isAdmin, isCoach } = useUserRole();

  // Redirect non-authenticated users
  useEffect(() => {
    if (!loading && !isAdmin && !isCoach) {
      // Only redirect non-authenticated or client users
      navigate('/admin/auth');
    }
  }, [loading, isAdmin, isCoach, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show access denied for non-admin and non-coach users
  if (!isAdmin && !isCoach) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <Shield className="h-5 w-5 mr-2" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access the admin dashboard. This area is restricted to administrators and coaches only.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Go to Main Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show coach dashboard for coaches
  if (isCoach && !isAdmin) {
    return <CoachDashboard />;
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Management interface</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {role?.toUpperCase()}
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Admin dashboard with tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {isAdmin && <TabsTrigger value="users">User Management</TabsTrigger>}
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* User Management - Admin Only */}
                {isAdmin && (
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        User Management
                      </CardTitle>
                      <CardDescription>
                        Manage user accounts, roles, and permissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" onClick={() => {
                        const tabsTrigger = document.querySelector('[value="users"]') as HTMLElement;
                        tabsTrigger?.click();
                      }}>
                        Manage Users
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Analytics */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Analytics
                    </CardTitle>
                    <CardDescription>
                      View user engagement and platform statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>

                {/* System Settings */}
                {isAdmin && (
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="h-5 w-5 mr-2" />
                        System Settings
                      </CardTitle>
                      <CardDescription>
                        Configure system-wide settings and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" disabled>
                        Coming Soon
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Welcome Message */}
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to the Admin Dashboard</CardTitle>
                  <CardDescription>
                    You're logged in as a {role}. This dashboard provides tools for managing the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Role Permissions:</strong>
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      {isAdmin && (
                        <>
                          <li>• Full system access and configuration</li>
                          <li>• User role management</li>
                          <li>• System analytics and reporting</li>
                        </>
                       )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="users">
                <div className="space-y-6">
                  <CreateCoachesAction />
                  <UserManagement />
                </div>
              </TabsContent>
            )}

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Platform analytics and reporting tools will be available here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="settings">
                <div className="space-y-6">
                  <CreateAdminUserAction />
                  <Card>
                    <CardHeader>
                      <CardTitle>System Settings</CardTitle>
                      <CardDescription>
                        Configure system-wide settings and preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Additional settings coming soon...</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;