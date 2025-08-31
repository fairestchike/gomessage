import { useState } from "react";
import { Clock, Star, Flame, Shield, Users, Play, Video } from "./icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export default function WelcomeScreen({ isOpen, onClose, onGetStarted }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Flame className="h-16 w-16 text-primary" />,
      title: "Welcome to Go Message",
      subtitle: "GetGasNow - Your Trusted Gas Delivery Partner",
      description: "Get cooking gas delivered to your doorstep in minutes. Fast, reliable, and secure.",
      tagline: "Fast, reliable gas delivery to your doorstep",
    },
    {
      icon: <Shield className="h-16 w-16 text-secondary" />,
      title: "Safe & Secure",
      subtitle: "Verified Suppliers Only",
      description: "All our suppliers are verified and background-checked for your safety and peace of mind.",
      tagline: "We only work with trusted suppliers wey we don verify well well.",
    },
    {
      icon: <Clock className="h-16 w-16 text-accent" />,
      title: "Fast Delivery",
      subtitle: "Quick & Reliable Service",
      description: "Average delivery time of 30 minutes or less. Track your order in real-time.",
      tagline: "We go bring your gas sharp sharp, just relax!",
    },
    {
      icon: <Star className="h-16 w-16 text-primary" />,
      title: "Quality Guaranteed",
      subtitle: "Premium Gas & Service",
      description: "Premium quality gas cylinders with transparent pricing and excellent customer service.",
      tagline: "Our gas na direct from gas plant, e full well well and e cheap!",
    },
    {
      icon: <Video className="h-16 w-16 text-secondary" />,
      title: "Watch & Learn",
      subtitle: "Video Tutorials & Guide",
      description: "Watch helpful videos to learn how to use our app, safety tips, and more.",
      tagline: "See how e dey work, make your life easy!",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col z-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-center space-x-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
            {/* Main cylinder body - realistic proportions */}
            <rect x="8.5" y="4.5" width="7" height="16.5" rx="3.5" ry="1" fill="currentColor" opacity="0.95"/>
            {/* Top cap/valve assembly */}
            <rect x="10" y="1.5" width="4" height="4" rx="1" fill="currentColor"/>
            {/* Valve handle/knob */}
            <circle cx="12" cy="2.5" r="1.2" fill="none" stroke="currentColor" strokeWidth="0.8"/>
            <rect x="11.2" y="0.8" width="1.6" height="1.5" rx="0.8" fill="currentColor"/>
            {/* Bottom stabilizing ring */}
            <ellipse cx="12" cy="21" rx="4.2" ry="1.2" fill="currentColor"/>
            {/* Safety collar around top */}
            <rect x="9.2" y="4" width="5.6" height="1.2" rx="0.6" fill="currentColor" opacity="0.8"/>
            {/* Gas level indicator marks */}
            <rect x="9.5" y="7.5" width="5" height="0.4" rx="0.2" fill="currentColor" opacity="0.5"/>
            <rect x="9.5" y="10.5" width="5" height="0.4" rx="0.2" fill="currentColor" opacity="0.5"/>
            <rect x="9.5" y="13.5" width="5" height="0.4" rx="0.2" fill="currentColor" opacity="0.5"/>
            <rect x="9.5" y="16.5" width="5" height="0.4" rx="0.2" fill="currentColor" opacity="0.5"/>
            {/* Brand/warning label area */}
            <rect x="9.8" y="8.8" width="4.4" height="3" rx="0.3" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.7"/>
            {/* Pressure gauge indicator */}
            <circle cx="10.5" cy="6" r="0.6" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.6"/>
          </svg>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">Go Message</h1>
            <p className="text-sm text-secondary font-medium">GetGasNow</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {slides[currentSlide].icon}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {slides[currentSlide].title}
            </h2>
            
            <p className="text-lg font-medium text-primary mb-4">
              {slides[currentSlide].subtitle}
            </p>
            
            <p className="text-gray-600 mb-6">
              {slides[currentSlide].description}
            </p>
            
            <div className="bg-accent/10 rounded-lg p-4 mb-6">
              <p className="text-sm italic text-gray-700">
                "{slides[currentSlide].tagline}"
              </p>
            </div>

            {/* Video Section for the Video Tutorials slide */}
            {currentSlide === 4 && (
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Card className="border border-secondary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-secondary/10 p-2 rounded">
                          <Play className="h-5 w-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">How to Order Gas</p>
                          <p className="text-xs text-gray-600">For Customers</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          Watch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded">
                          <Play className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Supplier Guide</p>
                          <p className="text-xs text-gray-600">For Gas Suppliers</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          Watch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-accent/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-accent/10 p-2 rounded">
                          <Play className="h-5 w-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Safety Tips</p>
                          <p className="text-xs text-gray-600">Gas Safety Guide</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          Watch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-2 mb-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="outline" 
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                Previous
              </Button>
              
              {currentSlide === slides.length - 1 ? (
                <Button onClick={onGetStarted} className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              ) : (
                <Button onClick={nextSlide} className="bg-primary hover:bg-primary/90">
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-md">
          <div className="text-center">
            <div className="bg-white rounded-full p-3 mb-2 shadow-sm">
              <Users className="h-6 w-6 text-primary mx-auto" />
            </div>
            <p className="text-xs text-gray-600">1000+ Customers</p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full p-3 mb-2 shadow-sm">
              <Shield className="h-6 w-6 text-secondary mx-auto" />
            </div>
            <p className="text-xs text-gray-600">Verified Suppliers</p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full p-3 mb-2 shadow-sm">
              <Clock className="h-6 w-6 text-accent mx-auto" />
            </div>
            <p className="text-xs text-gray-600">Fast Delivery</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Available 24/7 • Lagos, Nigeria • Safe & Secure
          </p>
        </div>
      </footer>
    </div>
  );
}