import { useState } from "react";
import { CheckCircle, Clock, Truck, Wrench, Package, ArrowRight, Check, AlertCircle } from "./icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface CylinderTrackingProps {
  orderId: number;
  cylinderId: string;
  currentStage: string;
  customerConfirmed: boolean;
  supplierConfirmed: boolean;
  userRole: "customer" | "supplier";
  onStageConfirm: (stage: string, notes?: string) => void;
}

interface TrackingStage {
  id: string;
  title: string;
  customerAction: string;
  supplierAction: string;
  description: string;
  icon: React.ReactNode;
  requiresBothConfirmation: boolean;
}

export default function CylinderTracking({
  orderId,
  cylinderId,
  currentStage,
  customerConfirmed,
  supplierConfirmed,
  userRole,
  onStageConfirm,
}: CylinderTrackingProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedStage, setSelectedStage] = useState("");
  const [confirmationNotes, setConfirmationNotes] = useState("");

  const trackingStages: TrackingStage[] = [
    {
      id: "awaiting_pickup",
      title: "Awaiting Pickup",
      customerAction: "Cylinder ready for pickup",
      supplierAction: "Confirm pickup arrival",
      description: "Empty cylinder is ready to be collected",
      icon: <Package className="h-5 w-5" />,
      requiresBothConfirmation: false,
    },
    {
      id: "pickup_confirmed",
      title: "Pickup Confirmed",
      customerAction: "Confirm cylinder handed over",
      supplierAction: "Confirm cylinder received",
      description: "Both parties confirm the cylinder has been picked up",
      icon: <CheckCircle className="h-5 w-5" />,
      requiresBothConfirmation: true,
    },
    {
      id: "enroute_filling",
      title: "Enroute to Filling Station",
      customerAction: "Cylinder is being transported",
      supplierAction: "Confirm departure to filling station",
      description: "Cylinder is being transported to the filling station",
      icon: <Truck className="h-5 w-5" />,
      requiresBothConfirmation: false,
    },
    {
      id: "at_filling_station",
      title: "At Filling Station",
      customerAction: "Cylinder arrived at station",
      supplierAction: "Confirm arrival at filling station",
      description: "Cylinder has arrived at the filling station",
      icon: <Clock className="h-5 w-5" />,
      requiresBothConfirmation: false,
    },
    {
      id: "refilled",
      title: "Refilling Complete",
      customerAction: "Cylinder has been refilled",
      supplierAction: "Confirm refilling completed",
      description: "Cylinder has been successfully refilled with gas",
      icon: <Wrench className="h-5 w-5" />,
      requiresBothConfirmation: true,
    },
    {
      id: "enroute_return",
      title: "Enroute for Return",
      customerAction: "Cylinder is being returned",
      supplierAction: "Confirm departure from station",
      description: "Refilled cylinder is being transported back",
      icon: <Truck className="h-5 w-5" />,
      requiresBothConfirmation: false,
    },
    {
      id: "delivered",
      title: "Delivered",
      customerAction: "Confirm cylinder received",
      supplierAction: "Confirm cylinder delivered",
      description: "Refilled cylinder has been successfully delivered",
      icon: <CheckCircle className="h-5 w-5" />,
      requiresBothConfirmation: true,
    },
  ];

  const getCurrentStageIndex = () => {
    return trackingStages.findIndex(stage => stage.id === currentStage);
  };

  const getStageStatus = (stageIndex: number) => {
    const currentIndex = getCurrentStageIndex();
    
    if (stageIndex < currentIndex) {
      return "completed";
    } else if (stageIndex === currentIndex) {
      return "current";
    } else {
      return "pending";
    }
  };

  const canUserConfirm = (stage: TrackingStage) => {
    if (stage.id !== currentStage) return false;
    
    if (stage.requiresBothConfirmation) {
      if (userRole === "customer") {
        return !customerConfirmed;
      } else {
        return !supplierConfirmed;
      }
    }
    
    return userRole === "supplier";
  };

  const isStageFullyConfirmed = (stage: TrackingStage) => {
    if (!stage.requiresBothConfirmation) {
      return stage.id !== currentStage;
    }
    
    return customerConfirmed && supplierConfirmed;
  };

  const handleConfirmClick = (stage: TrackingStage) => {
    setSelectedStage(stage.id);
    setShowConfirmDialog(true);
  };

  const handleConfirmStage = () => {
    onStageConfirm(selectedStage, confirmationNotes);
    setShowConfirmDialog(false);
    setConfirmationNotes("");
    setSelectedStage("");
  };

  const getConfirmationStatus = (stage: TrackingStage) => {
    if (stage.id !== currentStage || !stage.requiresBothConfirmation) {
      return null;
    }

    return (
      <div className="flex items-center space-x-4 mt-2 text-sm">
        <div className={`flex items-center space-x-1 ${customerConfirmed ? 'text-green-600' : 'text-gray-400'}`}>
          {customerConfirmed ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          <span>Customer</span>
        </div>
        <div className={`flex items-center space-x-1 ${supplierConfirmed ? 'text-green-600' : 'text-gray-400'}`}>
          {supplierConfirmed ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          <span>Supplier</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Cylinder Tracking</h3>
              <p className="text-sm text-neutral">Cylinder ID: {cylinderId}</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-600">
              Refill Service
            </Badge>
          </div>
          
          <div className="space-y-4">
            {trackingStages.map((stage, index) => {
              const status = getStageStatus(index);
              const isActive = status === "current";
              const isCompleted = status === "completed";
              const canConfirm = canUserConfirm(stage);
              const isFullyConfirmed = isStageFullyConfirmed(stage);

              return (
                <div key={stage.id} className="relative">
                  {index < trackingStages.length - 1 && (
                    <div className={`absolute left-6 top-12 w-0.5 h-8 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                  
                  <div className={`flex items-start space-x-4 p-3 rounded-lg ${
                    isActive ? 'bg-blue-50 border border-blue-200' : 
                    isCompleted ? 'bg-green-50 border border-green-200' : 
                    'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' : 
                      isActive ? 'bg-blue-500 text-white' : 
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted && isFullyConfirmed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : isActive && stage.requiresBothConfirmation && !isFullyConfirmed ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        stage.icon
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-700'}`}>
                        {stage.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                      
                      {isActive && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">
                            {userRole === "customer" ? stage.customerAction : stage.supplierAction}
                          </p>
                          
                          {getConfirmationStatus(stage)}
                          
                          {canConfirm && (
                            <Button
                              size="sm"
                              className="mt-3 bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleConfirmClick(stage)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirm {userRole === "customer" ? "Receipt" : "Completion"}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {isCompleted && isFullyConfirmed && (
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Stage Completion</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to confirm this stage? This action will update the tracking status.
            </p>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Notes (Optional)
              </label>
              <Textarea
                value={confirmationNotes}
                onChange={(e) => setConfirmationNotes(e.target.value)}
                placeholder="Add any additional information..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmStage}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}