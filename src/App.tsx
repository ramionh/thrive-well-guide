import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { Layout } from "@/components/Layout";
import { useUser } from "@/context/UserContext";

import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./components/dashboard/Dashboard";
import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import ProgressPage from "./pages/ProgressPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AddProgressPage from "./pages/AddProgressPage";
import NotFound from "./pages/NotFound";
import LogoutConfirmation from "./components/auth/LogoutConfirmation";

const queryClient = new QueryClient();

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<OnboardingWizard />} />
              <Route path="/logout" element={<LogoutConfirmation />} />
              <Route
                path="/dashboard"
                element={
                  <AuthenticatedRoute>
                    <Dashboard />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <AuthenticatedRoute>
                    <ProgressPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <AuthenticatedRoute>
                    <ProfilePage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <AuthenticatedRoute>
                    <SettingsPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/add-progress"
                element={
                  <AuthenticatedRoute>
                    <AddProgressPage />
                  </AuthenticatedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
