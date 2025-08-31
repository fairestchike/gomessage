import { useState } from "react";
import { X, CreditCard, Wallet, Banknote } from "./icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AppState } from "@/lib/types";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appState: AppState;
}

export default function OrderModal({ isOpen, onClose, onConfirm, appState }: OrderModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order placed successfully!",
        description: "Your gas delivery is on the way.",
      });
      onConfirm();
    },
    onError: (error) => {
      toast({
        title: "Order failed",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleConfirmOrder = async () => {
    if (!appState.currentUser) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to place an order.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      const orderData = {
        customerId: appState.currentUser!.id,
        gasTypeId: 2, // Assuming 6kg gas
        deliveryType: appState.deliveryType,
        deliveryAddress: appState.currentUser!.address || "Default address",
        totalAmount: "5300",
        paymentMethod,
        estimatedDeliveryTime: 25,
      };

      createOrderMutation.mutate(orderData);
      setIsProcessing(false);
    }, 2000);
  };

  // Mock order summary based on appState
  const orderSummary = {
    gasSize: "6kg",
    gasPrice: 4500,
    bottlePrice: appState.deliveryType === "new" ? 500 : 0,
    deliveryFee: 300,
    total: 5300,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Order</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Order Details */}
          <Card className="bg-light">
            <CardContent className="p-4">
              <p className="font-medium mb-2">Order Details</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>{orderSummary.gasSize} Gas Cylinder</span>
                  <span>₦{orderSummary.gasPrice.toLocaleString()}</span>
                </div>
                {appState.deliveryType === "new" && (
                  <div className="flex justify-between">
                    <span>New Bottle</span>
                    <span>₦{orderSummary.bottlePrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₦{orderSummary.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₦{orderSummary.total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-neutral">
                  Delivery to: {appState.currentUser?.address || "Default address"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <div className="space-y-3">
            <p className="font-medium">Payment Method</p>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center space-x-2 cursor-pointer">
                  <Banknote className="h-4 w-4 text-secondary" />
                  <span>Cash on Delivery</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>Debit/Credit Card</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center space-x-2 cursor-pointer">
                  <Wallet className="h-4 w-4 text-accent" />
                  <span>Wallet Balance</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Estimated Delivery Time */}
          <Card className="bg-secondary/10 border-secondary/20">
            <CardContent className="p-3">
              <p className="text-sm text-secondary font-medium">
                ⏱️ Estimated delivery time: 15-30 minutes
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={isProcessing || createOrderMutation.isPending}
              className="flex-1"
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
