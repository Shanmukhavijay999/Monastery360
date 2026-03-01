import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

// Pages & Components
import Header from "./components/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load auth pages & dashboard
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Reviews = lazy(() => import("./components/Reviews"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const VirtualToursPage = lazy(() => import("./pages/VirtualToursPage"));
const ArchivesPage = lazy(() => import("./pages/ArchivesPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const AudioGuidePage = lazy(() => import("./pages/AudioGuidePage"));
const AIQuizPage = lazy(() => import("./pages/AIQuizPage"));
const AIChatbot = lazy(() => import("./components/AIChatbot"));

const queryClient = new QueryClient();

// Loading fallback for lazy routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Bridge for legacy components that use setUser prop
  const handleSetUser = (userData: any) => {
    // This is a no-op now — auth is managed by AuthProvider
    // Legacy components will be updated to use useAuth directly
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/tours" element={<PageTransition><Suspense fallback={<PageLoader />}><VirtualToursPage /></Suspense></PageTransition>} />
        <Route path="/archives" element={<PageTransition><Suspense fallback={<PageLoader />}><ArchivesPage /></Suspense></PageTransition>} />
        <Route path="/events" element={<PageTransition><Suspense fallback={<PageLoader />}><EventsPage /></Suspense></PageTransition>} />
        <Route path="/audio" element={<PageTransition><Suspense fallback={<PageLoader />}><AudioGuidePage /></Suspense></PageTransition>} />
        <Route path="/quiz" element={<PageTransition><Suspense fallback={<PageLoader />}><AIQuizPage /></Suspense></PageTransition>} />
        <Route
          path="/reviews"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <Reviews user={user} setUser={handleSetUser} />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <Login setUser={handleSetUser} />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <Signup setUser={handleSetUser} />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            </PageTransition>
          }
        />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const AppWrapper = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const showAuth = location.pathname === "/reviews";

  // Bridge for Header — pass auth data
  const handleSetUser = (userData: any) => {
    if (!userData) logout();
  };

  return (
    <>
      <Header user={user} setUser={handleSetUser} showAuth={showAuth} />
      <main>
        <AnimatedRoutes />
      </main>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppWrapper />
            <Suspense fallback={null}>
              <AIChatbot />
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
