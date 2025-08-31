import { useState } from "react";
import { Phone, MapPin, Clock, Star, Navigation, CheckCircle, Shield, FileText, AlertTriangle, Eye, DollarSign, TrendingUp, Filter, Calendar, Route, Bell, MessageCircle, Target } from "./icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import CylinderTracking from "./cylinder-tracking";
import type { AppState } from "@/lib/types";

interface SupplierViewProps {
  appState: AppState;
}

export default function SupplierView({ appState }: SupplierViewProps) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showCylinderTracking, setShowCylinderTracking] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showEarningsDetail, setShowEarningsDetail] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
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
    todayDeliveries: 3,
    totalEarnings: 12500,
    todayEarnings: 2100,
    weeklyEarnings: 8400,
    monthlyEarnings: 34200,
    rating: 4.8,
    kycStatus: "verified", // pending, verified, rejected
    onlineHours: 6.5,
    completionRate: 98.5,
    avgDeliveryTime: 28,
  };

  const todayNotifications = [
    { id: 1, type: "order", message: "3 new orders in your area", time: "2 mins ago", unread: true },
    { id: 2, type: "payment", message: "₦2,100 earned today", time: "1 hour ago", unread: false },
    { id: 3, type: "alert", message: "High demand in Lekki area", time: "3 hours ago", unread: true },
  ];

  const handleAcceptOrder = (orderId: number) => {
    console.log("Accepting order:", orderId);
  };

  const handleRejectOrder = (orderId: number) => {
    console.log("Rejecting order:", orderId);
  };

  const handleMarkDelivered = () => {
    setShowOtpModal(true);
  };

  const handleOtpSubmit = () => {
    console.log("Submitting OTP:", otpCode);
    setShowOtpModal(false);
    setOtpCode("");
  };

  const handleCallCustomer = () => {
    console.log("Calling customer");
  };

  const handleNavigate = () => {
    console.log("Opening navigation");
  };

  const handleKycUpload = () => {
    setShowKycModal(true);
  };

  const handleSupportTicket = () => {
    console.log("Opening support ticket");
  };

  return (
    <div>
      {/* KYC Status Banner */}
      {supplierStats.kycStatus !== "verified" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                {supplierStats.kycStatus === "pending" ? "KYC Verification Pending" : "KYC Verification Required"}
              </p>
              <p className="text-xs text-yellow-600">
                Complete your KYC verification to receive more orders
              </p>
            </div>
            <Button 
              size="sm" 
              className="ml-auto bg-yellow-500 hover:bg-yellow-600"
              onClick={handleKycUpload}
            >
              Upload Documents
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Header with Availability Toggle */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Welcome back, Adebayo!</h2>
            <p className="text-sm text-green-700 font-medium">Earn ₦50,000+ daily delivering gas!</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {todayNotifications.filter(n => n.unread).length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                {todayNotifications.filter(n => n.unread).length}
              </Badge>
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">{isAvailable ? 'Online' : 'Offline'}</span>
            <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
          </div>
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "Accepting Orders" : "Not Available"}
          </Badge>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="bg-white border-b border-gray-100 p-4">
          <h3 className="font-semibold mb-3">Recent Notifications</h3>
          <div className="space-y-2">
            {todayNotifications.map(notification => (
              <div key={notification.id} className={`p-3 rounded-lg border ${notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-neutral">{notification.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Performance Dashboard */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Today's Earnings</p>
                  <p className="text-xl font-bold text-green-800">₦{supplierStats.todayEarnings.toLocaleString()}</p>
                  <p className="text-xs text-green-600">{supplierStats.todayDeliveries} deliveries</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Performance</p>
                  <p className="text-xl font-bold text-blue-800">{supplierStats.rating} ⭐</p>
                  <p className="text-xs text-blue-600">{supplierStats.completionRate}% success rate</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-primary">{supplierStats.totalDeliveries}</p>
            <p className="text-xs text-neutral">Total Orders</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-primary">{supplierStats.onlineHours}h</p>
            <p className="text-xs text-neutral">Online Today</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-primary">{supplierStats.avgDeliveryTime}min</p>
            <p className="text-xs text-neutral">Avg Time</p>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-3"
          onClick={() => setShowEarningsDetail(!showEarningsDetail)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          View Earnings History
        </Button>
      </div>

      {/* Earnings Detail Modal */}
      {showEarningsDetail && (
        <div className="bg-white p-4 border-b border-gray-100">
          <h3 className="font-semibold mb-3">Earnings Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Today:</span>
              <span className="font-medium">₦{supplierStats.todayEarnings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>This Week:</span>
              <span className="font-medium">₦{supplierStats.weeklyEarnings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>This Month:</span>
              <span className="font-medium">₦{supplierStats.monthlyEarnings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-primary">₦{supplierStats.totalEarnings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Smart Order Filters */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Available Orders</h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-neutral" />
            <select 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="all">All Orders</option>
              <option value="nearby">Nearby (5km)</option>
              <option value="high-value">High Value (₦5000+)</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

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
            <p className="font-semibold text-gray-900">Availability Status</p>
            <p className="text-sm text-gray-600">
              {isAvailable ? "You are online and accepting orders" : "You are offline"}
            </p>
          </div>
          <Switch
            checked={isAvailable}
            onCheckedChange={setIsAvailable}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Available Orders Nearby */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Available Orders Nearby</h3>
          {incomingOrders.map((order) => (
            <Card key={order.id} className="mb-3">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.gasSize} • {order.deliveryType}</p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {order.distance}km away
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{order.address}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">₦{order.total.toLocaleString()}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectOrder(order.id)}
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptOrder(order.id)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Delivery */}
        {activeDelivery && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Active Delivery</h3>
            <Card className="border-primary">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{activeDelivery.customerName}</p>
                    <p className="text-sm text-gray-600">{activeDelivery.gasSize} • {activeDelivery.deliveryType}</p>
                  </div>
                  <Badge className="bg-primary">In Transit</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{activeDelivery.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Clock className="h-4 w-4" />
                  <span>ETA: {activeDelivery.estimatedTime} minutes</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCallCustomer}
                    className="flex-1"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Customer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNavigate}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCylinderTracking(true)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Track Cylinder
                  </Button>
                  <Button
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                    onClick={handleMarkDelivered}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Delivered
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Support & Help */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Support & Help</h3>
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={handleSupportTicket}
            >
              <FileText className="h-5 w-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Support Ticket</p>
                <p className="text-sm text-gray-600">Report issues or complaints</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={handleKycUpload}
            >
              <Shield className="h-5 w-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">KYC Verification</p>
                <p className="text-sm text-gray-600">Upload verification documents</p>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Enter Delivery OTP</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ask the customer for the OTP code to complete the delivery
            </p>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              maxLength={6}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowOtpModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleOtpSubmit}
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={otpCode.length !== 6}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Modal */}
      {showKycModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">KYC Verification</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Surname</label>
                <input
                  type="text"
                  placeholder="Enter your surname"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Other Name</label>
                <input
                  type="text"
                  placeholder="Enter other name (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea
                  placeholder="Enter your address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ID Document</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business License <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowKycModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowKycModal(false)}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cylinder Tracking Modal */}
      {showCylinderTracking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Cylinder Tracking</h3>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setShowCylinderTracking(false)}
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-4">
              <CylinderTracking
                orderId={12345}
                cylinderId="CYL-2024-001"
                currentStage="enroute_return"
                customerConfirmed={true}
                supplierConfirmed={false}
                userRole="supplier"
                onStageConfirm={(stage, notes) => {
                  console.log("Supplier confirmed stage:", stage, notes);
                  // Here you would implement the actual API call to confirm the stage
                  setShowCylinderTracking(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}