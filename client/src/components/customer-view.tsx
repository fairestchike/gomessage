import { useState } from "react";
import { MapPin, Clock, Star, ChevronDown, Flame, Shield, RotateCcw, HelpCircle, Plus, Minus, ShoppingCart, Gift, Eye, Lock, Navigation, TrendingUp, Activity } from "./icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import WelcomeScreen from "./welcome-screen";
import RatingModal from "./rating-modal";
import SupportHelpCenter from "./support-help-center";
import CylinderTracking from "./cylinder-tracking";
import PriceComparison from "./price-comparison";
import DeliveryTracker from "./delivery-tracker";
import type { AppState, OrderSummary, CartItem } from "@/lib/types";
import type { GasType } from "@shared/schema";

interface CustomerViewProps {
  appState: AppState;
  onGasSizeChange: (size: string) => void;
  onDeliveryTypeChange: (type: "new" | "refill") => void;
  onOrderClick: () => void;
  onSafetyTipsClick: () => void;
}

export default function CustomerView({
  appState,
  onGasSizeChange,
  onDeliveryTypeChange,
  onOrderClick,
  onSafetyTipsClick,
}: CustomerViewProps) {
  const [selectedGasId, setSelectedGasId] = useState<number | null>(null);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<"new" | "refill">("refill");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showCylinderTracking, setShowCylinderTracking] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState(250);
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [showPriceComparison, setShowPriceComparison] = useState(false);
  const [showGuestRestrictionModal, setShowGuestRestrictionModal] = useState(false);
  const [restrictedFeature, setRestrictedFeature] = useState("");

  // Check if user is in guest mode
  const isGuestMode = appState.currentUser?.role === 'guest';

  const { data: gasTypes = [], isLoading } = useQuery<GasType[]>({
    queryKey: ["/api/gas-types"],
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours - gas types rarely change
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    // Use network-first strategy but with very long cache
    networkMode: 'online',
  });

  const selectedGasType = gasTypes.find(gas => gas.id === selectedGasId);

  const calculateOrderSummary = (): OrderSummary => {
    if (cart.length === 0) {
      return {
        items: [],
        subtotal: 0,
        bottlePrice: 0,
        deliveryFee: 300,
        total: 300,
        deliveryType: selectedDeliveryType,
      };
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.gasPrice * item.quantity), 0);
    const bottlePrice = cart
      .filter(item => item.deliveryType === "new")
      .reduce((sum, item) => sum + (500 * item.quantity), 0);
    const deliveryFee = 300;
    const total = subtotal + bottlePrice + deliveryFee;

    return {
      items: cart,
      subtotal,
      bottlePrice,
      deliveryFee,
      total,
      deliveryType: selectedDeliveryType,
    };
  };

  const orderSummary = calculateOrderSummary();

  const addToCart = (gasType: GasType) => {
    const existingItem = cart.find(item => 
      item.gasTypeId === gasType.id && item.deliveryType === selectedDeliveryType
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.gasTypeId === gasType.id && item.deliveryType === selectedDeliveryType
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: CartItem = {
        gasTypeId: gasType.id,
        gasTypeName: gasType.name,
        gasPrice: parseFloat(gasType.price),
        quantity: 1,
        deliveryType: selectedDeliveryType,
      };
      setCart([...cart, newItem]);
    }
    onGasSizeChange(gasType.name);
  };

  const updateQuantity = (gasTypeId: number, deliveryType: "new" | "refill", newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(gasTypeId, deliveryType);
      return;
    }

    setCart(cart.map(item =>
      item.gasTypeId === gasTypeId && item.deliveryType === deliveryType
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (gasTypeId: number, deliveryType: "new" | "refill") => {
    setCart(cart.filter(item => 
      !(item.gasTypeId === gasTypeId && item.deliveryType === deliveryType)
    ));
  };

  const getItemQuantity = (gasTypeId: number, deliveryType: "new" | "refill") => {
    const item = cart.find(item => 
      item.gasTypeId === gasTypeId && item.deliveryType === deliveryType
    );
    return item ? item.quantity : 0;
  };

  const handleDeliveryTypeSelect = (type: "new" | "refill") => {
    setSelectedDeliveryType(type);
    onDeliveryTypeChange(type);
  };

  const handleRestrictedFeature = (featureName: string) => {
    if (isGuestMode) {
      setRestrictedFeature(featureName);
      setShowGuestRestrictionModal(true);
      return false;
    }
    return true;
  };

  const redirectToSignup = () => {
    // Signal guest exit via custom event to avoid page reload
    const event = new CustomEvent('exitGuestMode', { 
      detail: { action: 'signup' } 
    });
    window.dispatchEvent(event);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Location Section */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3 mb-3">
          <MapPin className="text-primary text-lg" />
          <div className="flex-1">
            <p className="text-sm text-neutral">Delivery Address</p>
            <p className="font-medium text-gray-900">
              {appState.currentUser?.address || "Please add delivery address"}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            Change
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-secondary">
            <Clock className="mr-2 h-4 w-4" />
            <span>Estimated delivery: 15-30 minutes</span>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            3 suppliers nearby
          </Badge>
        </div>
      </div>

      {/* Gas Size Selector Dropdown */}
      <div className="bg-white p-4 m-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Select Gas Size</h3>
          <Badge variant="outline" className="text-xs">Best Value</Badge>
        </div>
        <div className="space-y-3">
          <Select value={selectedGasId?.toString() || ""} onValueChange={(value) => setSelectedGasId(parseInt(value))}>
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Choose your gas cylinder size" />
            </SelectTrigger>
            <SelectContent>
              {gasTypes.map((gas) => (
                <SelectItem key={gas.id} value={gas.id.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <Flame className="h-4 w-4 text-primary" />
                      <span className="font-medium">{gas.name}</span>
                    </div>
                    <div className="text-right ml-4">
                      <span className="font-bold text-primary">₦{parseFloat(gas.price).toLocaleString()}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        (₦{Math.round(parseFloat(gas.price) / parseFloat(gas.name.replace('kg', '')))} per kg)
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedGasId && (
            <Button 
              onClick={() => {
                const selectedGas = gasTypes.find(g => g.id === selectedGasId);
                if (selectedGas) {
                  addToCart(selectedGas);
                }
              }}
              className="w-full h-11"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {gasTypes.find(g => g.id === selectedGasId)?.name} to Cart
            </Button>
          )}
        </div>
      </div>



      {/* Live Delivery Tracker - Collapsible */}
      <div className="bg-white p-4 m-4 rounded-lg border border-gray-200">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-0 h-auto"
          onClick={() => setShowLiveTracking(!showLiveTracking)}
        >
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Live Tracking</span>
            {cart.length > 0 && (
              <Badge className="bg-green-100 text-green-700 ml-2">
                Active Order
              </Badge>
            )}
          </div>
          {showLiveTracking ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {showLiveTracking && (
          <div className="mt-4">
            <DeliveryTracker isActive={cart.length > 0} />
          </div>
        )}
      </div>

      {/* Price Comparison - Collapsible */}
      <div className="bg-white p-4 m-4 rounded-lg border border-gray-200">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-0 h-auto"
          onClick={() => {
            if (handleRestrictedFeature("Price Comparison")) {
              setShowPriceComparison(!showPriceComparison);
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Price Comparison</span>
            <Badge variant="outline" className="text-xs">Best Value</Badge>
            {isGuestMode && <Lock className="h-4 w-4 text-gray-400 ml-2" />}
          </div>
          {showPriceComparison ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {showPriceComparison && !isGuestMode && (
          <div className="mt-4">
            <PriceComparison gasTypes={gasTypes} />
          </div>
        )}
      </div>

      {/* Gas Size Selection */}
      <div className="bg-white p-4 border-b border-gray-100">
        <h3 className="font-semibold text-lg mb-4">Select Gas Cylinders</h3>
        <div className="grid grid-cols-2 gap-3">
          {gasTypes.map((gasType) => {
            const quantity = getItemQuantity(gasType.id, selectedDeliveryType);
            return (
              <Card key={gasType.id} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Flame className="h-4 w-4 text-primary" />
                    <span className="font-medium">{gasType.name}</span>
                  </div>
                  <p className="text-lg font-bold text-primary mb-3">₦{parseFloat(gasType.price).toLocaleString()}</p>
                  
                  {quantity > 0 ? (
                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(gasType.id, selectedDeliveryType, quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium text-lg">{quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(gasType.id, selectedDeliveryType, quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => addToCart(gasType)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Delivery Type Selection */}
      <div className="bg-white p-4 border-b border-gray-100">
        <h3 className="font-semibold text-lg mb-4">Delivery Type</h3>
        <div className="space-y-3">
          <Card
            className={`cursor-pointer transition-all ${
              selectedDeliveryType === "refill"
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-primary/50"
            }`}
            onClick={() => handleDeliveryTypeSelect("refill")}
          >
            <CardContent className="p-4 flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedDeliveryType === "refill"
                  ? "border-primary bg-primary"
                  : "border-gray-300"
              }`}>
                {selectedDeliveryType === "refill" && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">Refill</p>
                <p className="text-sm text-neutral">Refill your empty cylinder</p>
              </div>
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                Free
              </Badge>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedDeliveryType === "new"
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-primary/50"
            }`}
            onClick={() => handleDeliveryTypeSelect("new")}
          >
            <CardContent className="p-4 flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedDeliveryType === "new"
                  ? "border-primary bg-primary"
                  : "border-gray-300"
              }`}>
                {selectedDeliveryType === "new" && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">New Bottle + Gas</p>
                <p className="text-sm text-neutral">Get a new cylinder with gas</p>
              </div>
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                +₦500
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shopping Cart */}
      {cart.length > 0 && (
        <div className="bg-white p-4 border-b border-gray-100">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Your Cart ({cart.length} items)
          </h3>
          <div className="space-y-3 mb-4">
            {cart.map((item, index) => (
              <div key={`${item.gasTypeId}-${item.deliveryType}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.gasTypeName} Gas</p>
                  <p className="text-sm text-neutral">
                    {item.deliveryType === "new" ? "New Bottle + Gas" : "Refill"} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">₦{(item.gasPrice * item.quantity).toLocaleString()}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromCart(item.gasTypeId, item.deliveryType)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Summary */}
      {cart.length > 0 && (
        <div className="bg-white p-4 border-b border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span>₦{orderSummary.subtotal.toLocaleString()}</span>
            </div>
            {orderSummary.bottlePrice > 0 && (
              <div className="flex justify-between">
                <span>New Bottles</span>
                <span>₦{orderSummary.bottlePrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₦{orderSummary.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">₦{orderSummary.total.toLocaleString()}</span>
            </div>
          </div>
          
          <Button 
            className="w-full mt-4" 
            onClick={onOrderClick}
            disabled={cart.length === 0}
          >
            Place Order
          </Button>
        </div>
      )}

      {/* Active Orders Section */}
      <div className="bg-white p-4 border-b border-gray-100">
        <h3 className="font-semibold text-lg mb-4">Active Orders</h3>
        <div className="space-y-3">
          <Card className="border border-gray-200">
            <CardContent className="p-3 flex items-center space-x-3">
              <Flame className="text-primary text-lg" />
              <div className="flex-1">
                <p className="font-medium">6kg Gas Cylinder - Refill</p>
                <p className="text-sm text-neutral">Order #12345 • In Progress</p>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 mt-1">
                  At Filling Station
                </Badge>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowCylinderTracking(true)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Track
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Reorder Section */}
      <div className="bg-white p-4 m-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-lg mb-3">Quick Reorder</h3>
        <div className="space-y-3">
          <Card className="border border-gray-200 hover:shadow-sm transition-shadow">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Flame className="text-primary h-5 w-5" />
                <div>
                  <p className="font-medium">6kg Gas - Refill</p>
                  <p className="text-sm text-neutral">Last ordered 5 days ago</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleRestrictedFeature("Quick Reorder")}
              >
                {isGuestMode && <Lock className="h-3 w-3 mr-1" />}
                Reorder
              </Button>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 hover:shadow-sm transition-shadow">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Flame className="text-primary h-5 w-5" />
                <div>
                  <p className="font-medium">12.5kg Gas + New Bottle</p>
                  <p className="text-sm text-neutral">Last ordered 2 weeks ago</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleRestrictedFeature("Quick Reorder")}
              >
                {isGuestMode && <Lock className="h-3 w-3 mr-1" />}
                Reorder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Quick Order Section - Premium Service */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 m-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Gas Emergency?</h3>
            <p className="text-sm opacity-90">Priority delivery in 30 mins</p>
            <p className="text-xs opacity-75 mt-1">⚡ Premium service - Extra ₦500 delivery charge</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            className="bg-white text-red-600 hover:bg-gray-100 font-medium px-4"
            onClick={() => {
              if (handleRestrictedFeature("Gas Emergency")) {
                const gas6kg = gasTypes.find(g => g.name === "6kg");
                if (gas6kg) {
                  addToCart(gas6kg);
                  onOrderClick();
                }
              }
            }}
          >
            {isGuestMode && <Lock className="h-3 w-3 mr-1" />}
            Order Now
          </Button>
        </div>
      </div>

      {/* Loyalty Points & Promos */}
      <div className="bg-white p-4 border-b border-gray-100">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          Rewards & Promos
          {isGuestMode && <Lock className="h-4 w-4 text-gray-400" />}
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`bg-gradient-to-r from-primary/10 to-primary/5 p-3 rounded-lg ${isGuestMode ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Loyalty Points</span>
            </div>
            <p className="text-lg font-bold text-primary">{isGuestMode ? "---" : loyaltyPoints}</p>
            <p className="text-xs text-gray-600">
              {isGuestMode ? "Sign up to earn points" : `= ₦${(loyaltyPoints * 0.1).toFixed(0)} value`}
            </p>
          </div>
          <div className={`bg-gradient-to-r from-secondary/10 to-secondary/5 p-3 rounded-lg ${isGuestMode ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
              <Gift className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Promo Code</span>
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder={isGuestMode ? "Disabled for guests" : "Enter code"}
                disabled={isGuestMode}
                className={`flex-1 px-2 py-1 text-xs border rounded ${isGuestMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              <Button 
                size="sm" 
                className="px-2 py-1 text-xs"
                onClick={() => handleRestrictedFeature("Promo Code")}
                disabled={isGuestMode && !promoCode}
              >
                {isGuestMode && <Lock className="h-3 w-3 mr-1" />}
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="bg-white p-4 border-b border-gray-100">
        <h3 className="font-semibold text-lg mb-4">Help & Support</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 h-auto p-3"
            onClick={() => {
              if (handleRestrictedFeature("Help & Support")) {
                setShowSupport(true);
              }
            }}
          >
            <HelpCircle className="h-4 w-4" />
            {isGuestMode && <Lock className="h-3 w-3 ml-auto" />}
            <div className="text-left">
              <p className="text-sm font-medium">Support</p>
              <p className="text-xs text-gray-600">Get help</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 h-auto p-3"
            onClick={() => {
              if (handleRestrictedFeature("Rate Order")) {
                setShowRating(true);
              }
            }}
          >
            <Star className="h-4 w-4" />
            {isGuestMode && <Lock className="h-3 w-3 ml-auto" />}
            <div className="text-left">
              <p className="text-sm font-medium">Rate Order</p>
              <p className="text-xs text-gray-600">Review service</p>
            </div>
          </Button>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-accent/10 p-4 mx-4 rounded-lg mt-4">
        <div className="flex items-start space-x-3">
          <Shield className="text-accent text-lg mt-1" />
          <div>
            <h4 className="font-semibold text-accent mb-2">Safety Tips</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Always check for leaks before use</li>
              <li>• Store in well-ventilated areas</li>
              <li>• Keep away from heat sources</li>
            </ul>
            <Button 
              variant="link" 
              className="p-0 mt-2 text-accent hover:text-accent/80"
              onClick={onSafetyTipsClick}
            >
              Read more safety tips
            </Button>
          </div>
        </div>
      </div>

      {/* New Customer Welcome */}
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowWelcome(true)}
        >
          View Welcome Guide
        </Button>
      </div>

      {/* Modals */}
      <WelcomeScreen
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        onGetStarted={() => setShowWelcome(false)}
      />
      
      <RatingModal
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        onSubmit={(rating, comment) => {
          console.log("Rating submitted:", { rating, comment });
        }}
        orderDetails={{
          id: 12345,
          supplierName: "John's Gas Supply",
          gasSize: "6kg",
          deliveryTime: "25 minutes",
          totalAmount: 5300,
        }}
      />
      
      <SupportHelpCenter
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
      />

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
                currentStage="at_filling_station"
                customerConfirmed={false}
                supplierConfirmed={true}
                userRole="customer"
                onStageConfirm={(stage, notes) => {
                  console.log("Customer confirmed stage:", stage, notes);
                  // Here you would implement the actual API call to confirm the stage
                  setShowCylinderTracking(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Guest Restriction Modal */}
      <Dialog open={showGuestRestrictionModal} onOpenChange={setShowGuestRestrictionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Premium Feature
            </DialogTitle>
            <DialogDescription>
              Sign up first to enjoy this feature
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                <strong>"{restrictedFeature}"</strong> is only available for registered customers.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Sign up to unlock:</h4>
                <ul className="text-sm space-y-1 text-left">
                  <li>• Unlimited orders & full app access</li>
                  <li>• Price comparison & best deals</li>
                  <li>• Quick reorder & order history</li>
                  <li>• Emergency gas delivery service</li>
                  <li>• Loyalty points & promo codes</li>
                  <li>• 24/7 help & support</li>
                  <li>• Rate suppliers & get reviews</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowGuestRestrictionModal(false)}
              >
                Continue as Guest
              </Button>
              <Button 
                className="flex-1"
                onClick={redirectToSignup}
              >
                Sign Up for Free Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
