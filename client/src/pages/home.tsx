import { useState } from "react";
import { Bell, UserCircle, Flame, Clock, LogOut, GasCylinder } from "@/components/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import GasCylinderIcon from "@/components/gas-cylinder-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomerView from "@/components/customer-view";
import SupplierView from "@/components/supplier-view";
import AdminView from "@/components/admin-view";
import BottomNavigation from "@/components/bottom-navigation";
import OrderModal from "@/components/order-modal";
import TrackingModal from "@/components/tracking-modal";
import SafetyTipsModal from "@/components/safety-tips-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import type { AppState } from "@/lib/types";

interface HomeProps {
  user: User;
  onGuestExit?: () => void;
}

export default function Home({ user, onGuestExit }: HomeProps) {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedGasSize, setSelectedGasSize] = useState("");
  const [deliveryType, setDeliveryType] = useState<"new" | "refill">("new");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is in guest mode
  const isGuestMode = user.role === 'guest';

  // Handle notification click
  const handleNotificationClick = () => {
    if (isGuestMode) {
      toast({
        title: "Sign up required",
        description: "Please create an account to view notifications",
        variant: "default"
      });
      return;
    }
    setShowNotifications(!showNotifications);
    toast({
      title: "Notifications",
      description: "You have 2 new notifications about your recent orders",
      variant: "default"
    });
  };

  // Handle profile/contact click
  const handleProfileClick = () => {
    if (isGuestMode) {
      toast({
        title: "Sign up required", 
        description: "Please create an account to access your profile",
        variant: "default"
      });
      return;
    }
    setShowProfile(!showProfile);
    toast({
      title: "Profile",
      description: `Welcome back, ${user.fullName}! Your profile is up to date.`,
      variant: "default"
    });
  };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (isGuestMode) {
        // For guest mode, skip API call and just clear local data instantly
        return Promise.resolve({ message: "Guest session ended" });
      }
      const response = await apiRequest("POST", "/api/auth/logout");
      return response.json();
    },
    onSuccess: () => {
      // Clear cache immediately for faster logout
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.clear();
      
      toast({
        title: isGuestMode ? "Guest session ended" : "Logged out successfully",
        description: isGuestMode ? "Thanks for trying GoMessage!" : "See you next time!",
      });
      
      // For guest mode, use faster redirect method
      if (isGuestMode) {
        // Clear URL params and navigate without reload
        const url = new URL(window.location.href);
        url.searchParams.delete('guest');
        url.searchParams.delete('view');
        window.history.replaceState({}, '', url.toString());
        window.location.reload();
      }
    },
    onError: () => {
      // Even if logout fails, clear the session immediately
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.clear();
      
      if (isGuestMode) {
        const url = new URL(window.location.href);
        url.searchParams.delete('guest');
        url.searchParams.delete('view');
        window.history.replaceState({}, '', url.toString());
        window.location.reload();
      }
    },
  });

  const handleLogout = () => {
    if (isGuestMode) {
      // For guests, logout instantly without any API calls or page reloads
      queryClient.clear();
      localStorage.removeItem('guestSessionId');
      localStorage.removeItem('guestUsageCount');
      
      toast({
        title: "Guest session ended",
        description: "Thanks for trying GoMessage!",
      });
      
      // Use callback to exit guest mode instantly
      if (onGuestExit) {
        onGuestExit();
      }
      return;
    }
    
    // For authenticated users, use mutation
    logoutMutation.mutate();
  };

  const appState: AppState = {
    currentUser: user,
    selectedGasSize,
    deliveryType,
    orderStatus: "idle",
    currentView: isGuestMode ? "customer" : (user.role as "customer" | "supplier" | "admin"),
  };

  return (
    <>
      {/* App Header */}
      <header className="bg-primary text-white p-4 sticky top-0 z-50">
        <div className="grid grid-cols-3 items-center">
          {/* Left spacer - empty to balance the layout */}
          <div></div>
          
          {/* Centered Logo and Title */}
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full">
              <GasCylinder className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col text-center">
              <h1 className="text-2xl font-bold leading-tight">GoMessage</h1>
              <p className="text-sm text-accent font-medium">GetGasNow</p>
            </div>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center justify-end space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-white hover:text-white hover:bg-primary/80"
              onClick={handleNotificationClick}
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 bg-accent text-black h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                2
              </Badge>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-white hover:bg-primary/80"
              onClick={handleProfileClick}
              aria-label="View profile"
            >
              <UserCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* User Role Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="p-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral">Welcome back,</p>
            <p className="font-semibold text-xl capitalize">
              {isGuestMode ? "Guest User" : user.fullName}
            </p>
            <Badge variant="outline" className="text-sm">
              {isGuestMode ? "Guest" : user.role}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      {/* Role-specific tagline */}
      {(user.role === "customer" || isGuestMode) && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 border-b border-gray-100">
          <p className="text-center text-neutral italic text-sm mb-2">
            {isGuestMode ? 
              "Try GoMessage - Your gas delivered to your door in minutes!" : 
              "Your gas don finish? No worry, we de bring am to your house now now!"
            }
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700">15 suppliers online</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-blue-600" />
              <span className="text-blue-700">Avg delivery: 25 mins</span>
            </div>
          </div>
        </div>
      )}

      {user.role === "supplier" && (
        <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-4 border-b border-gray-100">
          <p className="text-center text-neutral font-semibold text-sm mb-2">
            "Earn ₦50,000+ daily delivering gas!"
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700">Active orders available</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-blue-600" />
              <span className="text-blue-700">Fast payouts</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">
        {(user.role === "customer" || isGuestMode) && (
          <CustomerView
            appState={appState}
            onGasSizeChange={setSelectedGasSize}
            onDeliveryTypeChange={setDeliveryType}
            onOrderClick={() => setShowOrderModal(true)}
            onSafetyTipsClick={() => setShowSafetyModal(true)}
          />
        )}
        {user.role === "supplier" && <SupplierView appState={appState} />}
        {user.role === "admin" && <AdminView appState={appState} />}
      </main>

      <BottomNavigation />
      
      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg z-50"
        onClick={() => setShowOrderModal(true)}
      >
        <Flame className="h-6 w-6" />
      </Button>

      {/* Modals */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onConfirm={() => {
          setShowOrderModal(false);
          setShowTrackingModal(true);
        }}
        appState={appState}
      />
      
      <TrackingModal
        isOpen={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
        appState={appState}
      />
      
      <SafetyTipsModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
      />
    </>
  );
}
