import { useState } from "react";
import { ArrowLeft, MapPin, Clock, Navigation } from "../components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GPSTracker from "@/components/gps-tracker";
import { useLocation } from "wouter";

export default function TrackingPage() {
  const [location, setLocation] = useLocation();
  
  // Mock order data - in real app, this would come from URL params or API
  const mockOrder = {
    id: 123,
    status: "in_transit",
    gasType: "12.5kg",
    supplierName: "Ahmed Gas Supply",
    supplierPhone: "+234 801 234 5678",
    deliveryAddress: "15 Admiralty Way, Lekki Phase 1, Lagos",
    estimatedTime: "25 minutes",
    totalAmount: "8,800"
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="p-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">Track Delivery</h1>
              <p className="text-sm text-gray-500">Order #{mockOrder.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Order Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge 
                variant="default" 
                className="bg-blue-100 text-blue-800"
              >
                {mockOrder.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <div className="text-sm text-gray-500">
                ETA: {mockOrder.estimatedTime}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{mockOrder.deliveryAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">{mockOrder.gasType} Gas Cylinder</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GPS Tracking Component */}
        <GPSTracker 
          orderId={mockOrder.id}
          isSupplier={false}
          supplierName={mockOrder.supplierName}
          deliveryAddress={mockOrder.deliveryAddress}
        />

        {/* Supplier Info */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Supplier Information</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Supplier:</span>
                <span className="text-sm font-medium">{mockOrder.supplierName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phone:</span>
                <a 
                  href={`tel:${mockOrder.supplierPhone}`}
                  className="text-sm font-medium text-blue-600"
                >
                  {mockOrder.supplierPhone}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="text-sm font-medium">₦{mockOrder.totalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Progress */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Delivery Progress</h3>
            <div className="space-y-4">
              {[
                { label: "Order Confirmed", completed: true, time: "10:30 AM" },
                { label: "Supplier Assigned", completed: true, time: "10:32 AM" },
                { label: "Out for Delivery", completed: true, time: "11:15 AM" },
                { label: "Delivered", completed: false, time: "Pending" }
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    step.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {step.completed && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </div>
                    <div className="text-xs text-gray-400">{step.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            className="w-full"
            onClick={() => window.location.href = `tel:${mockOrder.supplierPhone}`}
          >
            Call Supplier
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => setLocation("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}