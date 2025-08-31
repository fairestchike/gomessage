import { useState } from "react";
import { MapPin, Clock, Phone, MessageSquare, User } from "./icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DeliveryTrackerProps {
  isActive?: boolean;
}

export default function DeliveryTracker({ isActive = false }: DeliveryTrackerProps) {
  const [currentStatus, setCurrentStatus] = useState("pickup_confirmed");

  const trackingSteps = [
    { id: "pickup_confirmed", label: "Pickup Confirmed", time: "2:45 PM", completed: true },
    { id: "en_route_station", label: "En Route to Station", time: "2:50 PM", completed: true },
    { id: "at_filling_station", label: "At Filling Station", time: "3:05 PM", completed: true },
    { id: "refill_complete", label: "Refill Complete", time: "3:15 PM", completed: currentStatus !== "pickup_confirmed" },
    { id: "en_route_delivery", label: "En Route to You", time: "Est. 3:25 PM", completed: false },
    { id: "delivered", label: "Delivered", time: "Est. 3:45 PM", completed: false },
  ];



  return isActive ? (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Badge className="bg-green-100 text-green-700">
          Order #12345
        </Badge>
      </div>

      {/* Supplier Info */}
      <Card className="mb-4 border-blue-200 bg-blue-50">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium">Adebayo (Supplier)</p>
              <p className="text-sm text-neutral">Toyota Camry • ABC 123 XY</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Steps */}
      <div className="space-y-3">
        {trackingSteps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full border-2 ${
              step.completed 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300 bg-white'
            }`}>
              {step.completed && (
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
              )}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                {step.label}
              </p>
              <p className="text-sm text-neutral">{step.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ETA */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Estimated Arrival</span>
          </div>
          <span className="font-bold text-blue-900">3:45 PM (12 mins)</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center py-8">
      <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <p className="text-neutral">No active deliveries</p>
      <p className="text-sm text-gray-500">Place an order to track delivery</p>
    </div>
  );
}