import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";

// Pages & Components
import Header from "./components/Header";
import Index from "./pages/Index"; // MonasteryMap page
import Reviews from "./components/Reviews";
import NotFound from "./pages/NotFound";
import Login from "./components/Login";
import Signup from "./components/Signup";

const queryClient = new QueryClient();

// Wrapper to pass location to Header for conditional auth links
const AppWrapper = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // showAuth = true only on Reviews page
  const showAuth = location.pathname === "/reviews";

  return (
    <>
      <Header user={user} setUser={setUser} showAuth={showAuth} />

      <main> {/* Individual pages handle their own padding */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reviews" element={<Reviews user={user} setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
          <AppWrapper />
        </BrowserRouter>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
