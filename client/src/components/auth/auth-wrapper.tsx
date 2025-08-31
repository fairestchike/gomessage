import { useState, useEffect } from "react";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import GuestLanding from "./guest-landing";

interface AuthWrapperProps {
  onGuestActivated?: () => void;
}

export default function AuthWrapper({ onGuestActivated }: AuthWrapperProps = {}) {
  const [mode, setMode] = useState<"login" | "register" | "guest">("login");

  // Listen for guest mode activation
  useEffect(() => {
    const handleGuestActivation = () => {
      if (onGuestActivated) {
        onGuestActivated();
      }
    };

    window.addEventListener('activateGuestMode', handleGuestActivation);
    return () => window.removeEventListener('activateGuestMode', handleGuestActivation);
  }, [onGuestActivated]);

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  const switchToGuest = () => {
    setMode("guest");
  };

  const switchToAuth = () => {
    setMode("login");
  };

  if (mode === "guest") {
    return <GuestLanding onSwitchToAuth={switchToAuth} />;
  }

  if (mode === "login") {
    return <LoginForm onToggleMode={toggleMode} onBrowseAsGuest={switchToGuest} />;
  }

  return <RegisterForm onToggleMode={toggleMode} onBrowseAsGuest={switchToGuest} />;
}