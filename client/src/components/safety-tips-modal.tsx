import { Shield, AlertTriangle, CheckCircle, X } from "./icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SafetyTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SafetyTipsModal({ isOpen, onClose }: SafetyTipsModalProps) {
  const safetyTips = [
    {
      category: "Before Use",
      icon: CheckCircle,
      color: "text-secondary",
      tips: [
        "Always check for leaks before connecting the gas cylinder",
        "Inspect the cylinder for any dents, rust, or damage",
        "Ensure the regulator is properly connected and secure",
        "Check the expiry date on the cylinder",
      ],
    },
    {
      category: "During Use",
      icon: AlertTriangle,
      color: "text-accent",
      tips: [
        "Never leave cooking gas unattended while in use",
        "Keep the area around the gas cylinder well-ventilated",
        "Turn off the gas at the cylinder when not in use",
        "Keep flammable materials away from the cooking area",
      ],
    },
    {
      category: "Storage",
      icon: Shield,
      color: "text-primary",
      tips: [
        "Store cylinders in an upright position only",
        "Keep cylinders in a cool, dry, and well-ventilated area",
        "Store away from heat sources and direct sunlight",
        "Never store cylinders in enclosed spaces like basements",
      ],
    },
  ];

  const emergencySteps = [
    "If you smell gas, do not light matches or use electrical switches",
    "Turn off the gas supply immediately",
    "Open all windows and doors for ventilation",
    "Call emergency services if the leak persists",
    "Contact GasNow support for immediate assistance",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-accent" />
            <span>Gas Safety Guidelines</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Safety Tips by Category */}
          {safetyTips.map((category, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <category.icon className={`h-5 w-5 ${category.color}`} />
                  <h3 className="font-semibold">{category.category}</h3>
                </div>
                <ul className="space-y-2">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start space-x-2 text-sm">
                      <span className="text-neutral mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}

          {/* Emergency Procedures */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-red-700">Emergency Procedures</h3>
              </div>
              <p className="text-sm text-red-600 mb-3">
                In case of gas leak or emergency:
              </p>
              <ol className="space-y-2">
                {emergencySteps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-red-700">
                    <Badge variant="outline" className="bg-red-100 text-red-600 border-red-300 text-xs px-2 py-0">
                      {index + 1}
                    </Badge>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-accent">Emergency Contacts</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>GasNow Emergency:</strong> 0800-GASNOW (0800-427-669)</p>
                <p><strong>Fire Service:</strong> 199</p>
                <p><strong>General Emergency:</strong> 112</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              I Understand
            </Button>
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
