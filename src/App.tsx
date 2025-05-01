
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import "./App.css";

// Import des pages
import PortfolioPage from "./pages/portfolio/PortfolioPage";
import AddAssetPage from "./pages/portfolio/AddAssetPage";
import StatementPage from "./pages/statement/StatementPage";
import SimulatorsPage from "./pages/simulators/SimulatorsPage";
import ProductsPage from "./pages/products/ProductsPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import AppointmentsPage from "./pages/appointments/AppointmentsPage";
import ChatPage from "./pages/chat/ChatPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ContactPage from "./pages/contact/ContactPage";

const queryClient = new QueryClient();

// Simple auth check
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />
          <Route path="/register" element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } />
          
          {/* Protected Routes */}
          <Route element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }>
            <Route path="/" element={<Index />} />
            
            {/* Portfolio routes */}
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/add" element={<AddAssetPage />} />
            
            {/* Statement route */}
            <Route path="/statement" element={<StatementPage />} />
            
            {/* Tools routes */}
            <Route path="/simulators" element={<SimulatorsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            
            {/* Contact routes */}
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
