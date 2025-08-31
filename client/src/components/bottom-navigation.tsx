import { Home, MapPin, History, User } from "./icons";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MapPin, label: "Track", path: "/tracking" },
    { icon: History, label: "History", path: "/history" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-sm mx-auto z-40">
      <div className="flex">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={`flex-1 py-3 px-4 flex flex-col items-center space-y-1 rounded-none ${
              location === item.path
                ? "text-primary bg-primary/5"
                : "text-neutral hover:text-primary"
            }`}
            onClick={() => setLocation(item.path)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
