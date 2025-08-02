
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { Layout } from "@/components/Layout";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";

import AuthPage from "./pages/AuthPage";
import InitialSignupPage from "./pages/InitialSignupPage";
import MagicLinkPage from "./pages/MagicLinkPage";
import SetPasswordPage from "./pages/SetPasswordPage";
import Dashboard from "./components/dashboard/Dashboard";
import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import ProgressPage from "./pages/ProgressPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AddProgressPage from "./pages/AddProgressPage";
import NotFound from "./pages/NotFound";
import HomePage from "./components/home/HomePage";
import DefaultPage from "./components/default/DefaultPage";
import GoalsPage from "./pages/GoalsPage";
import HabitsPage from "./pages/HabitsPage";
import HabitCirclePage from "./pages/HabitCirclePage";
import BodyTypeSelector from "./components/BodyTypeSelector";
import MotivationPage from "./pages/MotivationPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Index from "./pages/Index";
import AdminAuthPage from "./pages/admin/AdminAuthPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateAdminPage from "./pages/CreateAdminPage";

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
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
              <Route path="/" element={<AuthPage />} />
              <Route path="/create-admin" element={<CreateAdminPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/magic-link" element={<MagicLinkPage />} />
              <Route path="/set-password" element={<SetPasswordPage />} />
              <Route path="/initial-signup" element={<InitialSignupPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/onboarding" element={<OnboardingWizard />} />
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
              <Route
                path="/goals"
                element={
                  <AuthenticatedRoute>
                    <GoalsPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/habits"
                element={
                  <AuthenticatedRoute>
                    <HabitsPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/habit-circle"
                element={
                  <AuthenticatedRoute>
                    <HabitCirclePage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/body-type"
                element={
                  <AuthenticatedRoute>
                    <BodyTypeSelector />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/motivation"
                element={
                  <AuthenticatedRoute>
                    <MotivationPage />
                  </AuthenticatedRoute>
                }
              />
              
              {/* Admin Routes */}
              <Route path="/admin/auth" element={<AdminAuthPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
