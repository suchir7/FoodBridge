import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "@/components/site/Layout";
import Impact from "@/pages/Impact";
import { AuthProvider } from "@/state/auth";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import DonorWizard from "@/pages/donate/Wizard";
import RequestForm from "@/pages/request/RequestForm";
import DonationListings from "@/pages/donations/Listings";
import About from "@/pages/about/About";
import Contact from "@/pages/contact/Contact";
import AdminDashboard from "@/pages/dashboards/Admin";
import DonorDashboard from "@/pages/dashboards/Donor";
import RecipientDashboard from "@/pages/dashboards/Recipient";
import AnalystDashboard from "@/pages/dashboards/Analyst";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/donations" element={<DonationListings />} />
              <Route path="/donate" element={<DonorWizard />} />
              <Route path="/request" element={<RequestForm />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Navigate to="/" />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/donor" element={<DonorDashboard />} />
              <Route path="/dashboard/recipient" element={<RecipientDashboard />} />
              <Route path="/dashboard/analyst" element={<AnalystDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
;;

createRoot(document.getElementById("root")).render(<App />);
