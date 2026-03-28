import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LandMateProvider } from '@/context/LandMateContext';
import { AuthProvider } from '@/context/AuthContext';
import WelcomePage from '@/pages/WelcomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ChatPage from '@/pages/ChatPage';
import ProfilePage from '@/pages/ProfilePage';
import ModeSelectorPage from '@/pages/ModeSelectorPage';
import DocumentUploadPage from '@/pages/DocumentUploadPage';
import ProcessSelectorPage from '@/pages/ProcessSelectorPage';
import ProcessingPage from '@/pages/ProcessingPage';
import ResultsPage from '@/pages/ResultsPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LandMateProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

              {/* Chat & Portal Routes */}
              <Route path="/chat" element={<ChatPage tab="chat" />} />
              <Route path="/history" element={<ProtectedRoute><ChatPage tab="history" /></ProtectedRoute>} />
              <Route path="/enquiry" element={<ChatPage tab="chat" />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* Protected Analysis Flow */}
              <Route path="/mode-selector" element={<ModeSelectorPage />} />
              <Route path="/upload" element={<DocumentUploadPage />} />
              <Route path="/process-selector" element={<ProcessSelectorPage />} />
              <Route path="/processing" element={<ProcessingPage />} />
              <Route path="/results" element={<ResultsPage />} />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LandMateProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
