import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, BarChart2, Camera, Sparkles, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/dashboard" }, // First left item
    { id: "stats", icon: BarChart2, label: "Stats", path: "/analytics" }, // Second left item
    { id: "food", icon: Sparkles, label: "Food", path: "/healthsuggestion" }, // First right item
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" } // Second right item
  ];

  return (
    <Card className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-md border-t flex items-center justify-between px-6 py-3 rounded-t-3xl">
      {/* Left Navigation Items */}
      <div className="flex items-center gap-6">
        {navItems.slice(0, 2).map((item) => (
          <Link to={item.path} key={item.id} className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-1 text-gray-500",
                activeTab === item.id && "text-blue-600"
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={24} />
            </Button>
          </Link>
        ))}
      </div>

      {/* Elevated Center Camera Button */}
      <Link to="/foodscan">
        <Button
          onClick={() => setActiveTab("camera")}
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-600 hover:bg-blue-700 shadow-lg rounded-full flex items-center justify-center border-4 border-white"
        >
          <Camera size={28} className="text-white" />
        </Button>
      </Link>

      {/* Right Navigation Items */}
      <div className="flex items-center gap-6">
        {navItems.slice(2).map((item) => (
          <Link to={item.path} key={item.id} className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-1 text-gray-500",
                activeTab === item.id && "text-blue-600"
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={24} />
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default BottomNav;
