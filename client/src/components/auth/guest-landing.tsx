import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock, Shield, Star, Users, AlertCircle } from "../icons";
import GasCylinderIcon from "@/components/gas-cylinder-icon";

interface GuestLandingProps {
  onSwitchToAuth: () => void;
}

// Generate a unique guest session ID
function generateGuestSessionId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default function GuestLanding({ onSwitchToAuth }: GuestLandingProps) {
  const [guestSessionId, setGuestSessionId] = useState<string>("");
  const [usageCount, setUsageCount] = useState(0);

  // Initialize guest session
  useEffect(() => {
    let sessionId = localStorage.getItem("guestSessionId");
    let usage = parseInt(localStorage.getItem("guestUsageCount") || "0");
    
    if (!sessionId) {
      sessionId = generateGuestSessionId();
      localStorage.setItem("guestSessionId", sessionId);
    }
    
    setGuestSessionId(sessionId);
    setUsageCount(usage);
  }, []);

  const maxGuestUsage = 5;
  const remainingUsage = maxGuestUsage - usageCount;

  const incrementUsage = () => {
    const newUsage = usageCount + 1;
    setUsageCount(newUsage);
    localStorage.setItem("guestUsageCount", newUsage.toString());
  };

  const handleOrderClick = () => {
    if (usageCount >= maxGuestUsage) {
      alert("You've reached the 5-order guest limit. Please sign up to continue using GoMessage!");
      return;
    }
    // Create a custom event to signal guest mode activation
    const event = new CustomEvent('activateGuestMode', { 
      detail: { action: 'order' } 
    });
    window.dispatchEvent(event);
  };

  const handleBrowseApp = () => {
    if (usageCount >= maxGuestUsage) {
      alert("You've reached the 5-order guest limit. Please sign up to continue using GoMessage!");
      return;
    }
    // Create a custom event to signal guest mode activation
    const event = new CustomEvent('activateGuestMode', { 
      detail: { action: 'browse' } 
    });
    window.dispatchEvent(event);
  };

  // Function to be called when order is completed (delivered)
  const handleOrderCompleted = () => {
    incrementUsage();
    const newRemaining = remainingUsage - 1;
    if (newRemaining > 0) {
      alert(`Order completed! You have ${newRemaining} orders remaining.`);
    } else {
      alert("Order completed! You've used all 5 guest orders. Sign up to continue using GoMessage!");
    }
  };

  // Landing page for guests
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-white to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 flex items-center justify-center bg-primary/10 rounded-xl mr-3">
              <GasCylinderIcon size="xl" className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">GoMessage</h1>
              <p className="text-base text-accent font-medium">GetGasNow</p>
            </div>
          </div>
          <CardTitle className="text-xl">Try GoMessage</CardTitle>
          <div className="mt-4 p-3 bg-accent/10 rounded-lg border-l-4 border-accent">
            <p className="text-sm font-medium text-accent">Your gas delivered to your door in minutes!</p>
          </div>
        </CardHeader>
        
        <CardContent>
          {usageCount >= maxGuestUsage ? (
            // Usage limit reached
            <div className="text-center space-y-4">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-800 font-medium">Limit Reached</span>
                </div>
                <p className="text-red-800 text-sm">
                  You've reached the 5-order guest limit. Sign up to continue enjoying GoMessage!
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Sign up to unlock:</h3>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Unlimited orders</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>Real-time order tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-green-600" />
                    <span>Loyalty points & rewards</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
              
              <Button onClick={onSwitchToAuth} className="w-full" size="lg">
                Sign Up Now
              </Button>
            </div>
          ) : (
            // Guest browsing available
            <div className="space-y-4">
              <div className="text-center">
                <Badge variant="outline" className="mb-4">
                  Guest Mode: {remainingUsage} tries remaining
                </Badge>
                <p className="text-sm text-neutral mb-4">
                  Experience GoMessage without signing up. You can order gas up to 5 times.
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleOrderClick} 
                  className="w-full"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Order Gas Now
                </Button>
                
                <Button 
                  onClick={handleBrowseApp} 
                  variant="outline" 
                  className="w-full"
                >
                  Browse App Features
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-neutral">
                  Ready to join?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-primary"
                    onClick={onSwitchToAuth}
                  >
                    Sign up for full access
                  </Button>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  );
}