import { useState } from "react";
import { ArrowLeft, Flame, RotateCcw, Star } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";

export default function History() {
  const [, setLocation] = useLocation();

  const recentOrders = [
    {
      id: 1,
      gasSize: "6kg",
      deliveryType: "new",
      status: "delivered",
      date: "2025-01-08",
      time: "2:30 PM",
      total: 5300,
      rating: 4.8,
    },
    {
      id: 2,
      gasSize: "12.5kg",
      deliveryType: "refill",
      status: "delivered",
      date: "2025-01-05",
      time: "11:15 AM",
      total: 8800,
      rating: 4.9,
    },
    {
      id: 3,
      gasSize: "3kg",
      deliveryType: "new",
      status: "cancelled",
      date: "2025-01-03",
      time: "4:45 PM",
      total: 3300,
      rating: null,
    },
  ];

  const favoriteOrders = [
    {
      id: 1,
      gasSize: "6kg",
      deliveryType: "new",
      total: 5300,
      lastOrdered: "3 days ago",
    },
    {
      id: 2,
      gasSize: "12.5kg",
      deliveryType: "refill",
      total: 8800,
      lastOrdered: "1 week ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-secondary/10 text-secondary";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      case "pending":
        return "bg-accent/10 text-accent";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleReorder = (order: any) => {
    // Implement reorder logic here
    console.log("Reordering:", order);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-primary text-white p-4 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:text-white hover:bg-primary/80"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Go Message - History</h1>
        </div>
      </header>

      <main className="p-4 pb-20">
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent Orders</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-4 mt-4">
            {recentOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Flame className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">
                          {order.gasSize} Gas {order.deliveryType === "new" ? "+ New Bottle" : "(Refill)"}
                        </p>
                        <p className="text-sm text-neutral">
                          {order.date} • {order.time}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-primary">₦{order.total.toLocaleString()}</span>
                      {order.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-accent fill-current" />
                          <span className="text-sm">{order.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    {order.status === "delivered" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(order)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reorder
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-4 mt-4">
            {favoriteOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Flame className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">
                          {order.gasSize} Gas {order.deliveryType === "new" ? "+ New Bottle" : "(Refill)"}
                        </p>
                        <p className="text-sm text-neutral">
                          Last ordered {order.lastOrdered}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-primary">₦{order.total.toLocaleString()}</span>
                      <Button
                        size="sm"
                        onClick={() => handleReorder(order)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reorder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </>
  );
}
