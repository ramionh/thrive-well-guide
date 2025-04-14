
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { Layout } from "@/components/Layout";

import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./components/dashboard/Dashboard";
import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import ProgressPage from "./pages/ProgressPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AddProgressPage from "./pages/AddProgressPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/add-progress" element={<AddProgressPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
