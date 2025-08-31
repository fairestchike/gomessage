import { useState } from "react";
import { Phone, MapPin, Clock, Star, Navigation, CheckCircle } from "./icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { AppState } from "@/lib/types";

interface SupplierViewProps {
  appState: AppState;
}

export default function SupplierView({ appState }: SupplierViewProps) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [incomingOrders] = useState([
    {
      id: 1,
      gasSize: "6kg",
      deliveryType: "new",
      total: 5300,
      distance: 2.5,
      address: "123 Main Street, Victoria Island",
      customerName: "John Doe",
      status: "pending",
    },
    {
      id: 2,
      gasSize: "12.5kg",
      deliveryType: "refill",
      total: 8800,
      distance: 1.8,
      address: "456 Oak Avenue, Lekki",
      customerName: "Jane Smith",
      status: "pending",
    },
  ]);

  const [activeDelivery] = useState({
    id: 3,
    customerName: "John Doe",
    gasSize: "6kg",
    deliveryType: "new",
    address: "123 Main Street, Victoria Island",
    phone: "+2341234567890",
    estimatedTime: 15,
    status: "in_transit",
  });

  const supplierStats = {
    totalDeliveries: 24,
    totalEarnings: 12500,
    rating: 4.8,
  };

  const handleAcceptOrder = (orderId: number) => {
    console.log("Accepting order:", orderId);
    // Implement order acceptance logic
  };

  const handleRejectOrder = (orderId: number) => {
    console.log("Rejecting order:", orderId);
    // Implement order rejection logic
  };

  const handleMarkDelivered = () => {
    console.log("Marking as delivered");
    // Implement delivery completion logic
  };

  const handleCallCustomer = () => {
    console.log("Calling customer");
    // Implement call functionality
  };

  const handleNavigate = () => {
    console.log("Opening navigation");
    // Implement navigation functionality
  };

  return (
    <div>
      {/* Supplier Stats */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{supplierStats.totalDeliveries}</p>
            <p className="text-sm text-neutral">Deliveries</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary">₦{supplierStats.totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-neutral">Earnings</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{supplierStats.rating}</p>
            <p className="text-sm text-neutral">Rating</p>
          </div>
        </div>
      </div>

      {/* Supplier Status Toggle */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Supplier Status</p>
            <p className="text-sm text-neutral">Toggle availability</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isAvailable ? 'text-secondary' : 'text-neutral'}`}>
              {isAvailable ? 'Available' : 'Offline'}
            </span>
            <Switch 
              checked={isAvailable} 
              onCheckedChange={setIsAvailable}
            />
          </div>
        </div>
      </div>

      {/* Incoming Orders */}
      {isAvailable && (
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-4">Incoming Orders</h3>
          <div className="space-y-4">
            {incomingOrders.map((order) => (
              <Card key={order.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">
                        {order.gasSize} Gas {order.deliveryType === "new" ? "+ New Bottle" : "(Refill)"}
                      </p>
                      <p className="text-sm text-neutral">
                        ₦{order.total.toLocaleString()} • {order.distance}km away
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      New
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <p className="text-sm">{order.address}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
                      onClick={() => handleRejectOrder(order.id)}
                    >
                      Reject
                    </Button>
                    <Button
                      className="flex-1 bg-secondary hover:bg-secondary/90"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      Accept
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Delivery */}
      {activeDelivery && (
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-4">Active Delivery</h3>
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium">{activeDelivery.customerName}</p>
                  <p className="text-sm text-neutral">
                    {activeDelivery.gasSize} Gas {activeDelivery.deliveryType === "new" ? "+ New Bottle" : "(Refill)"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCallCustomer}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="text-sm">{activeDelivery.address}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <p className="text-sm">Estimated: {activeDelivery.estimatedTime} minutes</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleNavigate}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate
                </Button>
                <Button
                  className="flex-1 bg-secondary hover:bg-secondary/90"
                  onClick={handleMarkDelivered}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Delivered
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Earnings Summary */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-4">Today's Summary</h3>
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral">Completed Deliveries</p>
                <p className="text-xl font-bold text-primary">8</p>
              </div>
              <div>
                <p className="text-sm text-neutral">Earnings Today</p>
                <p className="text-xl font-bold text-secondary">₦3,200</p>
              </div>
              <div>
                <p className="text-sm text-neutral">Average Rating</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-accent fill-current" />
                  <span className="text-lg font-bold text-accent">4.8</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral">Online Time</p>
                <p className="text-xl font-bold text-neutral">6h 30m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
