import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
      await axios.post(
        "https://dtwin.onrender.com/api/fitbit/save",
        response.data,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Fitbit Data Fetched & Saved Successfully");
      setIsConnected(true);
    } catch (error) {
      console.error("❌ Error Fetching/Saving Fitbit Data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative border-none overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800"></div>

      {/* Decorative blur effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -right-16 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-32 -left-16 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <CardContent className="relative p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 shrink-0">
            <Watch className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-2xl text-white tracking-tight">
              Fitbit Sync
            </h3>
            <p className="text-base text-white/80">
              {isConnected ? "Connected & Synced" : "Not Connected"}
            </p>
          </div>
        </div>

        <Button
          onClick={isConnected ? handleFetchAndSaveData : handleConnect}
          size="lg"
          disabled={isLoading}
          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />{" "}
              {isConnected ? "Syncing..." : "Connecting..."}
            </>
          ) : (
            <>
              {isConnected ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Link className="w-5 h-5" />
              )}
              {isConnected ? "Sync Now" : "Connect Fitbit"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FitbitConnect;
