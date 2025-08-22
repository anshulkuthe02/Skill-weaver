import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import SupabaseSetupGuide from "@/components/SupabaseSetupGuide";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Templates from "./pages/Templates";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import ManualDesignPageWrapper from "./pages/ManualDesignPageWrapper";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/" element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="builder" element={<Builder />} />
                <Route path="manual-design" element={<ManualDesignPageWrapper />} />
                <Route path="templates" element={<Templates />} />
                <Route path="preview" element={<div className="p-6">Preview Page - Coming Soon</div>} />
                <Route path="portfolio" element={<div className="p-6">Portfolio Management - Coming Soon</div>} />
                <Route path="profile" element={<div className="p-6">Profile Settings - Coming Soon</div>} />
                <Route path="settings" element={<div className="p-6">Settings - Coming Soon</div>} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
