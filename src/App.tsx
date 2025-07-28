
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicOnlyRoute, PrivateRoute } from "./components/routes/RouteGroups";
import NotFound from "./pages/NotFound";
import "./App.css";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Import route components
import UserRoutes from "./components/routes/UserRoutes";
import AdminRoutes from "./components/routes/AdminRoutes";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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

            {/* Protected Routes under MainLayout */}
            <Route path="/" element={<PrivateRoute />}>
              {/* User routes */}
              <Route path="/*" element={<UserRoutes />} />

              {/* Admin Routes */}
              <Route path="admin/*" element={<AdminRoutes />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
