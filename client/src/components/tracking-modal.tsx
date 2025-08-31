import { useState } from "react";
import { X, MapPin, Clock, Phone, MessageSquare } from "./icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AppState } from "@/lib/types";

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
}

export default function TrackingModal({ isOpen, onClose, appState }: TrackingModalProps) {
  const [orderStatus] = useState("in_transit");

  const trackingSteps = [
    {
      status: "confirmed",
      title: "Order Confirmed",
      time: "12:30 PM",
      completed: true,
    },
    {
      status: "assigned",
      title: "Supplier Assigned",
      subtitle: "Mike Johnson",
      time: "12:35 PM",
      completed: true,
    },
    {
      status: "in_transit",
      title: "On the way",
      subtitle: "ETA: 15 minutes",
      time: "12:45 PM",
      completed: false,
      active: true,
    },
    {
      status: "delivered",
      title: "Delivered",
      time: "",
      completed: false,
    },
  ];

  const driverInfo = {
    name: "Mike Johnson",
    rating: 4.8,
    phone: "+2341234567890",
    vehicle: "Honda Bike - ABC 123",
  };

  const handleCallDriver = () => {
    console.log("Calling driver...");
    // Implement call functionality
  };

  const handleChatDriver = () => {
    console.log("Opening chat...");
    // Implement chat functionality
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Tracking</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Mock Map */}
          <Card>
            <CardContent className="p-0">
              <div className="bg-light h-32 flex items-center justify-center text-neutral rounded-t-lg">
                <MapPin className="h-8 w-8" />
                <span className="ml-2 text-sm">Live tracking map</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Order #12345</h3>
                  <p className="text-sm text-neutral">
                    {appState.selectedGasSize} Gas {appState.deliveryType === "new" ? "+ New Bottle" : "(Refill)"}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  {orderStatus === "in_transit" ? "On the way" : orderStatus}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{appState.currentUser?.address || "Delivery address"}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>ETA: 15 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Progress */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Tracking Progress</h3>
              <div className="space-y-4">
                {trackingSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      step.completed 
                        ? "bg-secondary" 
                        : step.active 
                          ? "bg-accent animate-pulse" 
                          : "bg-gray-300"
                    }`} />
                    <div className="flex-1">
                      <p className={`font-medium ${step.active ? "text-accent" : ""}`}>
                        {step.title}
                      </p>
                      {step.subtitle && (
                        <p className="text-sm text-neutral">{step.subtitle}</p>
                      )}
                      {step.time && (
                        <p className="text-xs text-neutral">{step.time}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Supplier Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Supplier Information</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">{driverInfo.name}</p>
                  <p className="text-sm text-neutral">⭐ {driverInfo.rating} Rating</p>
                  <p className="text-xs text-neutral">{driverInfo.vehicle}</p>
                </div>
                <Badge variant="outline" className="bg-secondary/10 text-secondary">
                  On delivery
                </Badge>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCallDriver}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Supplier
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleChatDriver}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-sm text-red-700 font-medium">Emergency Contact</p>
              <p className="text-sm text-red-600">
                If you need immediate assistance, call: 
                <span className="font-medium ml-1">0800-GASNOW</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
