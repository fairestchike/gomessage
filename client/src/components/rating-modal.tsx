import { useState } from "react";
import { Star, Truck, User, MessageCircle } from "./icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  orderDetails: {
    id: number;
    supplierName: string;
    gasSize: string;
    deliveryTime: string;
    totalAmount: number;
  };
}

export default function RatingModal({ isOpen, onClose, onSubmit, orderDetails }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
      onClose();
      setRating(0);
      setComment("");
    }
  };

  const ratingLabels = [
    "", "Poor", "Fair", "Good", "Very Good", "Excellent"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            Rate Your Delivery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Order #{orderDetails.id}</span>
              <Badge variant="secondary">Delivered</Badge>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Supplier: {orderDetails.supplierName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Gas Size: {orderDetails.gasSize}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Delivered in: {orderDetails.deliveryTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">₦{orderDetails.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="text-center">
            <p className="text-sm font-medium mb-4">How was your delivery experience?</p>
            <div className="flex justify-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "text-accent fill-accent"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mb-4">
                {ratingLabels[rating]}
              </p>
            )}
          </div>

          {/* Comment Section */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/200 characters
            </p>
          </div>

          {/* Quick Rating Options */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setRating(5);
                setComment("Excellent service! Very satisfied.");
              }}
              className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              👍 Great Service
            </button>
            <button
              onClick={() => {
                setRating(4);
                setComment("Good delivery, arrived on time.");
              }}
              className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              ⏰ On Time
            </button>
            <button
              onClick={() => {
                setRating(5);
                setComment("Very professional supplier!");
              }}
              className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              👨‍💼 Professional
            </button>
            <button
              onClick={() => {
                setRating(4);
                setComment("Good quality gas cylinder.");
              }}
              className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              ⭐ Quality
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Submit Rating
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}