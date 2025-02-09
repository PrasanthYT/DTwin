import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Watch, Loader2, CheckCircle, Link } from "lucide-react";
import axios from "axios";

const FitbitConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("fitbitToken");
    if (storedToken) {
      setIsConnected(true);
    }
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:4200/auth");
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("❌ Fitbit Connection Error:", error);
      setIsLoading(false);
    }
  };

  const handleFetchAndSaveData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("fitbitToken");
      if (!token) {
        console.error("❌ No Fitbit token found.");
        return;
      }

      // Fetch Fitbit Data
      const response = await axios.get(
        `http://localhost:4200/fitbit-data?token=${token}`
      );

      // Save Fitbit Data to Backend
      await axios.post("http://localhost:4200/api/fitbit/save", response.data, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Fitbit Data Fetched & Saved Successfully");
      setIsConnected(true);
    } catch (error) {
      console.error("❌ Error Fetching/Saving Fitbit Data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg overflow-hidden">
      {/* Background Waves */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <path
            d="M0,100 C50,150 150,50 200,100 C250,150 350,50 400,100 V200 H0 Z"
            fill="white"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-between">
        {/* Fitbit Icon & Status */}
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-full shadow-lg">
            <Watch className="text-blue-500 w-7 h-7" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Fitbit Sync</h3>
            <p className="text-sm opacity-90">
              {isConnected ? "Connected & Synced" : "Not Connected"}
            </p>
          </div>
        </div>

        {/* Connect / Sync Button */}
        {isConnected ? (
          <Button
            onClick={handleFetchAndSaveData}
            disabled={isLoading}
            className="bg-white text-blue-500 hover:bg-white/90 flex items-center gap-2 px-6 py-2 rounded-md shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Syncing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" /> Sync Now
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={isLoading}
            className="bg-white text-blue-500 hover:bg-white/90 flex items-center gap-2 px-6 py-2 rounded-md shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Connecting...
              </>
            ) : (
              <>
                <Link className="w-5 h-5" /> Connect Fitbit
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default FitbitConnect;
