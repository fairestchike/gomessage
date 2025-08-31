import { useState } from "react";
import { ArrowLeft, User, Phone, MapPin, Settings, HelpCircle, LogOut, Bell } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

  const user = {
    fullName: "John Doe",
    phone: "+2341234567890",
    address: "123 Main Street, Victoria Island, Lagos",
    email: "john.doe@example.com",
    memberSince: "January 2024",
  };

  const menuItems = [
    { icon: User, label: "Edit Profile", onClick: () => {} },
    { icon: MapPin, label: "Manage Addresses", onClick: () => {} },
    { icon: Bell, label: "Notifications", onClick: () => {} },
    { icon: Settings, label: "Settings", onClick: () => {} },
    { icon: HelpCircle, label: "Help & Support", onClick: () => {} },
  ];

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
          <h1 className="text-xl font-bold">Go Message - Profile</h1>
        </div>
      </header>

      <main className="p-4 pb-20">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-white text-xl">
                  {user.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user.fullName}</h2>
                <p className="text-neutral">{user.email}</p>
                <p className="text-sm text-neutral">Member since {user.memberSince}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-neutral">{user.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-neutral">{user.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-neutral">Receive order updates</p>
                </div>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Location Services</p>
                  <p className="text-sm text-neutral">Auto-detect delivery address</p>
                </div>
              </div>
              <Switch 
                checked={locationServices} 
                onCheckedChange={setLocationServices}
              />
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="mb-6">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start p-4 h-auto rounded-none"
                onClick={item.onClick}
              >
                <item.icon className="h-5 w-5 mr-3 text-primary" />
                <span className="flex-1 text-left">{item.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start p-4 h-auto rounded-none text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                // Implement logout logic
                console.log("Logging out...");
              }}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="flex-1 text-left">Logout</span>
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </>
  );
}
