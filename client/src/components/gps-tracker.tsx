import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Clock, TrendingUp } from "./icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface LocationUpdate {
  id: number;
  orderId: number;
  supplierId: number;
  latitude: string;
  longitude: string;
  accuracy?: string;
  speed?: string;
  bearing?: string;
  timestamp: string;
}

interface GPSTrackerProps {
  orderId: number;
  isSupplier?: boolean;
  supplierName?: string;
  deliveryAddress?: string;
}

export default function GPSTracker({ orderId, isSupplier = false, supplierName = "Supplier", deliveryAddress = "Your location" }: GPSTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationUpdate[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationUpdate | null>(null);
  const [eta, setEta] = useState<number | null>(null);

  // Fetch current location data
  const { data: locationData, refetch: refetchLocation } = useQuery({
    queryKey: [`/api/orders/${orderId}/location`],
    enabled: !isSupplier,
    refetchInterval: 10000, // Refetch every 10 seconds for customers
  });

  // Fetch location history
  const { data: history } = useQuery({
    queryKey: [`/api/orders/${orderId}/location-history`],
    enabled: true,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Initialize WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log("WebSocket connected for GPS tracking");
      // Authenticate and subscribe to order updates
      ws.send(JSON.stringify({
        type: 'authenticate',
        data: {
          userId: 1, // Will be replaced with actual user ID from auth
          role: isSupplier ? 'supplier' : 'customer',
          orderId: orderId
        }
      }));
      
      ws.send(JSON.stringify({
        type: 'subscribe_order',
        data: { orderId: orderId }
      }));
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };
    
    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };
    
    setWebsocket(ws);
    
    return () => {
      ws.close();
    };
  }, [orderId, isSupplier]);

  useEffect(() => {
    if (history && Array.isArray(history)) {
      setLocationHistory(history);
      if (history.length > 0) {
        setCurrentLocation(history[history.length - 1]);
      }
    }
  }, [history]);

  useEffect(() => {
    if (locationData) {
      setCurrentLocation(locationData);
    }
  }, [locationData]);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'location_update':
        setCurrentLocation(message.data.location);
        setLocationHistory(prev => [...prev, message.data.location]);
        if (message.data.eta) {
          setEta(message.data.eta);
        }
        break;
      case 'status_update':
        if (message.data.status === 'location_update' && message.data.location) {
          setCurrentLocation(message.data.location);
        }
        break;
      case 'arrival_notification':
        setEta(message.data.estimatedArrival);
        break;
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationUpdate = {
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
          accuracy: position.coords.accuracy?.toString(),
          speed: position.coords.speed?.toString() || "0",
          bearing: position.coords.heading?.toString() || "0"
        };

        // Send location update to server
        sendLocationUpdate(locationUpdate);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Error getting your location. Please ensure GPS is enabled.");
      },
      options
    );

    setWatchId(id);
    setIsTracking(true);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  };

  const sendLocationUpdate = async (locationData: any) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        throw new Error('Failed to send location update');
      }
    } catch (error) {
      console.error('Error sending location:', error);
    }
  };

  const formatDistance = (lat1: string, lon1: string, lat2?: string, lon2?: string): string => {
    if (!lat2 || !lon2) return "Unknown distance";
    
    const R = 6371; // Earth's radius in km
    const dLat = (parseFloat(lat2) - parseFloat(lat1)) * Math.PI / 180;
    const dLon = (parseFloat(lon2) - parseFloat(lon1)) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(parseFloat(lat1) * Math.PI / 180) * Math.cos(parseFloat(lat2) * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">
                {isSupplier ? "GPS Tracking (Supplier)" : "Track Your Gas Delivery"}
              </h3>
            </div>
            {isSupplier && (
              <Button
                variant={isTracking ? "destructive" : "default"}
                size="sm"
                onClick={isTracking ? stopTracking : startTracking}
              >
                {isTracking ? "Stop Tracking" : "Start Tracking"}
              </Button>
            )}
          </div>

          {currentLocation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Current Location</div>
                  <div className="text-sm font-mono">
                    {parseFloat(currentLocation.latitude).toFixed(6)}, {parseFloat(currentLocation.longitude).toFixed(6)}
                  </div>
                  {currentLocation.speed && (
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      Speed: {parseFloat(currentLocation.speed).toFixed(1)} km/h
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Last Update</div>
                  <div className="text-sm">
                    {new Date(currentLocation.timestamp).toLocaleTimeString()}
                  </div>
                  {eta && (
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4" />
                      ETA: {eta} minutes
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 mb-2">Delivery Route</div>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm font-medium">{supplierName} Location</div>
                      <div className="text-xs text-gray-500">Starting point</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{deliveryAddress}</div>
                      <div className="text-xs text-gray-500">Destination</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!currentLocation && !isSupplier && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Waiting for supplier to start GPS tracking...</p>
              <p className="text-sm">You'll see real-time location updates here once delivery begins.</p>
            </div>
          )}

          {!currentLocation && isSupplier && !isTracking && (
            <div className="text-center py-8 text-gray-500">
              <Navigation className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>GPS tracking not active</p>
              <p className="text-sm">Click "Start Tracking" to share your location with the customer.</p>
            </div>
          )}

          {locationHistory.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Recent Updates</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {locationHistory.slice(-5).reverse().map((update, index) => (
                  <div key={update.id || index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                    <div>
                      Location: {parseFloat(update.latitude).toFixed(4)}, {parseFloat(update.longitude).toFixed(4)}
                    </div>
                    <div className="text-gray-500">
                      {new Date(update.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}