import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { BusinessProvider } from "@/context/BusinessContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import MapPage from "./pages/MapPage";
import Admin from "./pages/Admin";
import BusinessOwnerDashboard from "./pages/BusinessOwnerDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
//good
const queryClient = new QueryClient();

const App = () => {
  const [studentMode, setStudentMode] = useState(() => {
    try {
      return localStorage.getItem("locallift-student-mode") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("locallift-student-mode", String(studentMode));
  }, [studentMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BusinessProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navbar
                studentMode={studentMode}
                onStudentModeChange={setStudentMode}
              />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected — any logged-in user */}
                <Route
                  path="/discover"
                  element={
                    <ProtectedRoute>
                      <Discover studentMode={studentMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/map"
                  element={
                    <ProtectedRoute>
                      <MapPage studentMode={studentMode} />
                    </ProtectedRoute>
                  }
                />

                {/* Protected — admin only */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Admin />
                    </ProtectedRoute>
                  }
                />

                {/* Protected — business owner only */}
                <Route
                  path="/my-business"
                  element={
                    <ProtectedRoute requireBusinessOwner>
                      <BusinessOwnerDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </BusinessProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
