import React, { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import AuthWrapper from "@/components/auth/auth-wrapper";
import Home from "@/pages/home";
import Tracking from "@/pages/tracking";
import History from "@/pages/history";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isGuestActive, setIsGuestActive] = useState(false);
  
  // Check for guest mode from URL params (for backward compatibility)
  const urlParams = new URLSearchParams(window.location.search);
  const urlGuestMode = urlParams.get('guest') === 'true';

  // Initialize guest mode from URL if present (useEffect for side effects)
  useEffect(() => {
    if (urlGuestMode) {
      setIsGuestActive(true);
    }
  }, [urlGuestMode]);

  const handleGuestActivation = () => {
    setIsGuestActive(true);
  };

  const handleGuestExit = () => {
    setIsGuestActive(false);
  };

  // Listen for guest exit events
  useEffect(() => {
    const handleGuestExitEvent = () => {
      setIsGuestActive(false);
    };

    window.addEventListener('exitGuestMode', handleGuestExitEvent);
    return () => window.removeEventListener('exitGuestMode', handleGuestExitEvent);
  }, []);

  // If guest is active, render guest view instantly
  if (isGuestActive || urlGuestMode) {
    return (
      <Switch>
        <Route path="/" component={() => <Home user={{ role: 'guest' } as any} onGuestExit={handleGuestExit} />} />
        <Route path="/tracking" component={Tracking} />
        <Route path="/history" component={History} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Only show loading for authenticated users
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-white to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-neutral">Loading...</p>
        </div>
      </div>
    );
  }

  // Require authentication for non-guest users
  if (!isAuthenticated) {
    return <AuthWrapper onGuestActivated={handleGuestActivation} />;
  }

  return (
    <Switch>
      <Route path="/" component={() => <Home user={user} />} />
      <Route path="/tracking" component={Tracking} />
      <Route path="/history" component={History} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-light">
          <div className="max-w-sm mx-auto bg-white min-h-screen relative">
            <Toaster />
            <Router />
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
