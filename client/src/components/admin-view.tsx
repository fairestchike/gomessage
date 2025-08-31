import { useState } from "react";
import { Users, Package, DollarSign, Clock, Eye, UserX, Shield, Ban, Star, Gift, Flag, AlertTriangle, TrendingUp, CheckCircle, BarChart3, Settings, Download, Search, Filter, Calendar, MessageSquare, Zap, Activity, Award, Target } from "./icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AppState } from "@/lib/types";

interface AdminViewProps {
  appState: AppState;
}

export default function AdminView({ appState }: AdminViewProps) {
  const [liveOrders] = useState([
    {
      id: 12345,
      customerName: "John Doe",
      gasSize: "6kg",
      supplierName: "Mike Johnson",
      status: "in_transit",
      total: 5300,
      estimatedTime: 15,
    },
    {
      id: 12346,
      customerName: "Jane Smith",
      gasSize: "12.5kg",
      supplierName: "Sarah Wilson",
      status: "pending",
      total: 8800,
      estimatedTime: null,
    },
  ]);

  const [suppliers] = useState([
    {
      id: 1,
      name: "Mike Johnson",
      rating: 4.8,
      totalDeliveries: 24,
      status: "online",
      earnings: 12500,
      kycStatus: "verified",
      suspiciousActivity: 0,
    },
    {
      id: 2,
      name: "Sarah Wilson",
      rating: 4.9,
      totalDeliveries: 32,
      status: "online",
      earnings: 15200,
      kycStatus: "pending",
      suspiciousActivity: 1,
    },
    {
      id: 3,
      name: "David Brown",
      rating: 4.6,
      totalDeliveries: 18,
      status: "offline",
      earnings: 8900,
      kycStatus: "verified",
      suspiciousActivity: 0,
    },
  ]);

  const [suspiciousActivities] = useState([
    {
      id: 1,
      supplierId: 2,
      type: "Multiple Failed Deliveries",
      description: "5 failed deliveries in the last 24 hours",
      severity: "high",
      timestamp: "2024-01-15 10:30 AM",
    },
    {
      id: 2,
      supplierId: 4,
      type: "Unusual Pricing",
      description: "Charging 20% above market rate",
      severity: "medium",
      timestamp: "2024-01-15 09:15 AM",
    },
    {
      id: 3,
      supplierId: 6,
      type: "Offline Transaction Attempts",
      description: "Supplier attempting to conduct business outside the app platform",
      severity: "high",
      timestamp: "2024-01-15 08:45 AM",
    },
  ]);

  const [userFeedback] = useState([
    {
      id: 1,
      orderId: 12345,
      customerName: "John Doe",
      supplierName: "Mike Johnson",
      rating: 5,
      comment: "Excellent service! Very satisfied.",
      timestamp: "2024-01-15 11:00 AM",
    },
    {
      id: 2,
      orderId: 12346,
      customerName: "Jane Smith",
      supplierName: "Sarah Wilson",
      rating: 2,
      comment: "Delivery was very late and gas cylinder was damaged.",
      timestamp: "2024-01-15 10:45 AM",
    },
  ]);

  const [promoCodes] = useState([
    {
      id: 1,
      code: "NEWUSER10",
      discount: 10,
      type: "percentage",
      isActive: true,
      usageCount: 245,
      maxUsage: 1000,
      expiryDate: "2024-02-15",
    },
    {
      id: 2,
      code: "DELIVERY50",
      discount: 50,
      type: "fixed",
      isActive: true,
      usageCount: 89,
      maxUsage: 500,
      expiryDate: "2024-01-31",
    },
  ]);

  const [selectedDateRange, setSelectedDateRange] = useState("today");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const revenueData = [
    { day: "Mon", revenue: 2400, orders: 12 },
    { day: "Tue", revenue: 3200, orders: 18 },
    { day: "Wed", revenue: 2800, orders: 15 },
    { day: "Thu", revenue: 3600, orders: 21 },
    { day: "Fri", revenue: 4200, orders: 24 },
    { day: "Sat", revenue: 3800, orders: 19 },
    { day: "Sun", revenue: 3200, orders: 17 },
  ];

  const topPerformers = [
    { name: "Mike Johnson", orders: 24, earnings: 12500, rating: 4.8 },
    { name: "Sarah Wilson", orders: 32, earnings: 15200, rating: 4.9 },
    { name: "David Brown", orders: 18, earnings: 8900, rating: 4.6 },
  ];

  const dashboardStats = {
    totalOrders: 156,
    activeSuppliers: 42,
    revenue: 450000,
    pendingOrders: 8,
    suspiciousActivities: 3,
    pendingKyc: 12,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_transit":
        return "bg-accent/10 text-accent";
      case "pending":
        return "bg-red-100 text-red-600";
      case "delivered":
        return "bg-secondary/10 text-secondary";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getSupplierStatusColor = (status: string) => {
    return status === "online" ? "bg-secondary/10 text-secondary" : "bg-gray-100 text-gray-600";
  };

  const handleViewSupplier = (supplierId: number) => {
    console.log("Viewing supplier:", supplierId);
    // Implement supplier details view
  };

  const handleSuspendSupplier = (supplierId: number) => {
    console.log("Suspending supplier:", supplierId);
    // Implement supplier suspension
  };

  const handleViewOrder = (orderId: number) => {
    console.log("Viewing order:", orderId);
    // Implement order details view
  };

  return (
    <div>
      {/* Enhanced Admin Dashboard */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Platform Analytics Dashboard</h3>
          <div className="flex items-center space-x-2">
            <select 
              value={selectedDateRange} 
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <Button size="sm" variant="outline" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Real-time Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-700">₦{dashboardStats.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">Total Revenue</p>
                  <p className="text-xs text-neutral">+15.3% vs last period</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-700">{dashboardStats.totalOrders}</p>
                  <p className="text-sm text-blue-600">Total Orders</p>
                  <p className="text-xs text-neutral">23 completed today</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-700">{dashboardStats.activeSuppliers}</p>
                  <p className="text-sm text-purple-600">Active Suppliers</p>
                  <p className="text-xs text-neutral">of {dashboardStats.totalSuppliers || 34} total</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-700">4.6⭐</p>
                  <p className="text-sm text-orange-600">Avg Rating</p>
                  <p className="text-xs text-neutral">98.5% satisfaction</p>
                </div>
                <Star className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Indicators */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className={`${dashboardStats.pendingOrders > 5 ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{dashboardStats.pendingOrders}</p>
                  <p className="text-xs">Pending Orders</p>
                </div>
                <Clock className="h-5 w-5 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className={`${dashboardStats.suspiciousActivities > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{dashboardStats.suspiciousActivities}</p>
                  <p className="text-xs">Alerts</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className={`${dashboardStats.pendingKyc > 8 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{dashboardStats.pendingKyc}</p>
                  <p className="text-xs">KYC Pending</p>
                </div>
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export Data
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Filter className="h-4 w-4 mr-1" />
            Advanced Filters
          </Button>
          <Button size="sm" variant="outline">
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics Report
          </Button>
        </div>
      </div>

      {/* Tabs for different sections */}
      <div className="p-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 text-xs">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Top Performers This Week</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topPerformers.map((performer, index) => (
                    <div key={performer.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={index === 0 ? "bg-gold text-yellow-800" : index === 1 ? "bg-gray-200 text-gray-700" : "bg-orange-100 text-orange-700"}>
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">{performer.name}</p>
                          <p className="text-xs text-neutral">{performer.orders} orders • {performer.rating}⭐</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-green-600">₦{performer.earnings.toLocaleString()}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Recent System Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm">3 new suppliers verified</p>
                      <p className="text-xs text-neutral">15 mins ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm">Peak order volume detected</p>
                      <p className="text-xs text-neutral">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm">2 suspicious activities flagged</p>
                      <p className="text-xs text-neutral">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-sm">Customer satisfaction up 5%</p>
                      <p className="text-xs text-neutral">Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button size="sm" className="flex items-center justify-center">
                    <UserX className="h-4 w-4 mr-2" />
                    Review KYC ({dashboardStats.pendingKyc})
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center justify-center">
                    <Flag className="h-4 w-4 mr-2" />
                    Handle Alerts ({dashboardStats.suspiciousActivities})
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center justify-center">
                    <Gift className="h-4 w-4 mr-2" />
                    Create Promo Code
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Support Tickets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg">Live Orders</h3>
            {liveOrders.map((order) => (
              <Card key={order.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-neutral">{order.customerName} • {order.gasSize} Gas</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace("_", " ")}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span>Supplier: {order.supplierName || "Unassigned"}</span>
                    <span className="font-medium text-primary">₦{order.total.toLocaleString()}</span>
                  </div>
                  
                  {order.estimatedTime && (
                    <div className="flex items-center space-x-2 text-sm text-neutral mb-3">
                      <Clock className="h-4 w-4" />
                      <span>ETA: {order.estimatedTime} minutes</span>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="suppliers" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg">Supplier Management</h3>
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <p className="text-sm text-neutral">
                        ⭐ {supplier.rating} • {supplier.totalDeliveries} deliveries
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={supplier.kycStatus === 'verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}>
                        {supplier.kycStatus}
                      </Badge>
                      <Badge className={supplier.status === 'online' ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-600'}>
                        {supplier.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span>Total Earnings: ₦{supplier.earnings.toLocaleString()}</span>
                    {supplier.suspiciousActivity > 0 && (
                      <span className="text-red-600 text-xs">
                        {supplier.suspiciousActivity} alerts
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewSupplier(supplier.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
                      onClick={() => handleSuspendSupplier(supplier.id)}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Ban
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg">Earnings Tracking</h3>
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Platform Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-primary">₦{dashboardStats.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Commission (15%)</p>
                      <p className="text-2xl font-bold text-secondary">₦{(dashboardStats.revenue * 0.15).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Earning Suppliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suppliers.sort((a, b) => b.earnings - a.earnings).slice(0, 3).map((supplier, index) => (
                      <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{supplier.name}</p>
                            <p className="text-sm text-gray-600">{supplier.totalDeliveries} deliveries</p>
                          </div>
                        </div>
                        <p className="font-bold text-primary">₦{supplier.earnings.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg">Suspicious Activity Alerts</h3>
            {suspiciousActivities.map((activity) => (
              <Card key={activity.id} className="border-l-4 border-red-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-red-600">{activity.type}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <Badge className={activity.severity === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}>
                      {activity.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>Supplier ID: {activity.supplierId}</span>
                    <span>{activity.timestamp}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Investigate
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500 text-red-500">
                      <Flag className="h-4 w-4 mr-2" />
                      Take Action
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg">User Feedback Review</h3>
            {userFeedback.map((feedback) => (
              <Card key={feedback.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Order #{feedback.orderId}</p>
                      <p className="text-sm text-gray-600">{feedback.customerName} → {feedback.supplierName}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{feedback.comment}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{feedback.timestamp}</span>
                    {feedback.rating <= 2 && (
                      <Badge className="bg-red-100 text-red-600">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Needs Attention
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="promos" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg">Promo Code Management</h3>
            <div className="mb-4">
              <Button className="w-full">
                <Gift className="h-4 w-4 mr-2" />
                Create New Promo Code
              </Button>
            </div>
            {promoCodes.map((promo) => (
              <Card key={promo.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{promo.code}</p>
                      <p className="text-sm text-gray-600">
                        {promo.type === 'percentage' ? `${promo.discount}% off` : `₦${promo.discount} off`}
                      </p>
                    </div>
                    <Badge className={promo.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}>
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>Used: {promo.usageCount}/{promo.maxUsage}</span>
                    <span>Expires: {promo.expiryDate}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-red-500 text-red-500">
                      Deactivate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
