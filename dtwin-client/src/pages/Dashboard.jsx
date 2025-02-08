import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ChevronRight,
  Search,
  Plus,
  MessageSquare,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/dashboard/bottom-nav";
import FitbitConnect from "@/components/Fitbit/FitbitConnect";
import axios from "axios";

const HealthDashboard = () => {
  const navigate = useNavigate();

  // ** State for User & Fitbit Data **
  const [userData, setUserData] = useState(null);
  const [fitbitData, setFitbitData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ** Fetch Data on Component Mount **
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUserData();
      await fetchFitbitData();
      setLoading(false);
    };
    fetchData();
  }, []);

  // ** Fetch User Data **
  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:4200/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        console.log("✅ User Data:", response.data);
        setUserData(response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  // ** Fetch Fitbit Data **
  const fetchFitbitData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:4200/api/fitbit/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        console.log("✅ Fitbit Data:", response.data);
        setFitbitData(response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching Fitbit data:", error);
    }
  };

  const username = userData?.user?.username || "User";
  const healthScore = userData?.user?.healthData?.healthScore || "--";
  const userId = userData?.user?.userId; // Corrected userId extraction

  console.log("👤 Username:", username);
  console.log("📊 Health Score:", healthScore);
  console.log("🆔 User ID:", userId);

  // ✅ Ensure Fitbit Data Matches User
  const isFitbitDataAvailable =
    fitbitData && String(fitbitData.userId) === String(userData?.user?.userId);

  // ✅ Extract Weekly Data Safely
  const weeklyData = isFitbitDataAvailable ? fitbitData.weeklyData : [];
  const latestDay =
    weeklyData.length > 0 ? weeklyData[weeklyData.length - 1] : null;

  // ✅ Extract Health Metrics
  // ✅ Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // ✅ Sort weeklyData by date (descending) to get the latest first
  const sortedWeeklyData =
    fitbitData?.data?.weeklyData?.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    ) || [];

  // ✅ Find today's data or the most recent available
  const recentData = sortedWeeklyData.find(
    (day) => new Date(day.date) <= new Date(today)
  );

  // ✅ Extract the resting heart rate safely
  const recentRestingHeartRate = recentData
    ? recentData?.heartRate?.["activities-heart"]?.[0]?.value
        ?.restingHeartRate ||
      recentData?.activity?.summary?.restingHeartRate ||
      "--"
    : "--"; // Fallback if no data is available

  console.log("📊 Recent Resting Heart Rate:", recentRestingHeartRate);

  // ✅ Find today's sleep data or the most recent available
  const recentSleepData = sortedWeeklyData.find(
    (day) => new Date(day.date) <= new Date(today)
  );

  // ✅ Extract sleep duration in hours and efficiency
  const recentSleepDuration = recentSleepData
    ? Math.round((recentSleepData?.sleep?.duration || 0) / (1000 * 60 * 60)) ||
      "--"
    : "--"; // Convert from milliseconds to hours
  const recentSleepEfficiency = recentSleepData?.sleep?.efficiency || "--";

  console.log("🛌 Recent Sleep Duration (hours):", recentSleepDuration);
  console.log("📈 Sleep Efficiency:", recentSleepEfficiency);

  // ✅ Find today's or the most recent available data
  const recentActivityData = sortedWeeklyData.find(
    (day) => new Date(day.date) <= new Date(today)
  );

  // ✅ Extract Daily Steps
  const recentDailySteps = recentActivityData?.activity?.summary?.steps || "--";

  // ✅ Extract Active Minutes (Fairly + Very Active Minutes)
  const recentActiveMinutes =
    recentActivityData?.activity?.summary?.lightlyActiveMinutes || 0;

  // ✅ Extract Total Distance (if needed)
  const totalDistance =
    latestDay?.activity?.summary?.distances?.find((d) => d.activity === "total")
      ?.distance || "--";

  // ✅ Extract Calories Burned
  const caloriesBurned = latestDay?.activity?.summary?.caloriesOut || "--";

  console.log("📊 Extracted Fitbit Data:", {
    recentSleepDuration,
    recentDailySteps,
    recentActiveMinutes,
    totalDistance,
    caloriesBurned,
  });

  // ** Handle Navigation **
  const handleWellnessAI = () => navigate("/wellnessai");
  const handleSearchBar = () => navigate("/search");

  const handleHeartRate = () => navigate("/heartratemonitor");

  return (
    // Added overflow-x-hidden to prevent horizontal scroll
    <div className="min-h-screen text-slate-900 overflow-x-hidden">
      {/* Main content wrapper with bottom padding for navigation */}
      <div className="pb-28">
        {" "}
        {/* Increased padding bottom to 7rem (28) */}
        {/* Dark Header Section */}
        <div className="bg-slate-900 text-white p-4 rounded-b-3xl mb-4">
          <div className="max-w-sm mx-auto">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-80">
                {new Date().toDateString()}
              </span>
              <Bell className="w-5 h-5 opacity-80" />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-xl">👋</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span>Hi, {username}!</span>
                    <span className="text-yellow-300">⭐</span>
                    <span className="text-sm opacity-80">Pro Member</span>
                  </div>
                  <div className="text-sm opacity-80">
                    Health Score {healthScore}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-80" />
            </div>

            <div className="relative mt-4" onClick={handleSearchBar}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search asklepios..."
                className="w-full bg-white/20 rounded-xl py-2 pl-10 pr-4 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>
        {/* Scrollable content area */}
        <div className="max-w-sm mx-auto px-4 space-y-6">
          {/* AI Assistant Card */}
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">AI Wellness Assistant</h3>
                <p className="text-sm opacity-90">
                  Get personalized health insights
                </p>
              </div>
              <Button
                onClick={handleWellnessAI}
                className="bg-white text-indigo-500 hover:bg-white/90"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat Now
              </Button>
            </div>
          </Card>

          <FitbitConnect />

          {/* Health Score */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Health Score</h2>
              <button className="text-gray-400">...</button>
            </div>
            <Card className="bg-white border shadow-sm p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl flex items-center justify-center text-white">
                  <span className="text-2xl font-bold">{healthScore}</span>
                </div>
                <div>
                  <h2 className="font-semibold">Metabolic Score</h2>
                  <p className="text-sm text-gray-500">
                    Based on your data, we think your health status is above
                    average.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Smart Health Metrics */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Smart Health Metrics</h2>
              <Button variant="link" className="text-blue-500 p-0">
                See All
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Card onClick={handleHeartRate} className="bg-blue-500 text-white border-0 p-3">
                <h3 className="text-sm">Heart Rate</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-bold">
                    {recentRestingHeartRate}
                  </span>
                  <span className="text-xs">BPM</span>
                </div>
                <div className="mt-2 h-8">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    <path
                      d="M0 20 L20 20 L30 5 L40 35 L50 20 L60 20 L70 5 L80 35 L90 20 L100 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </Card>

              <Card className="bg-red-500 text-white border-0 p-3">
                <h3 className="text-sm">Blood Sugar</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-bold">20</span>
                  <span className="text-xs">mmHg</span>
                </div>
                <div className="mt-2 text-center bg-red-600/50 rounded-md py-1 text-xs">
                  High
                </div>
              </Card>

              <Card className="bg-cyan-500 text-white border-0 p-3">
                <h3 className="text-sm">Sleep</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-bold">
                    {recentSleepDuration}
                  </span>
                  <span className="text-xs">hr</span>
                </div>
                <div className="flex justify-between mt-2 h-8 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 bg-cyan-300 rounded-full"
                      style={{ height: `${80 + i * 5}%` }}
                    ></div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Activity Tracker */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Fitness & Activity</h2>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="w-4 h-4" /> Add Activity
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 border bg-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Daily Steps</p>
                    <p className="font-semibold">{recentDailySteps}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border bg-orange-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Minutes</p>
                    <p className="font-semibold">{recentActiveMinutes} min</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Medications Section - Last item before navigation */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Medications</h2>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="w-4 h-4" /> Add Med
              </Button>
            </div>
            {/* ✅ Extract Medications Safely */}
            {userData?.user?.userDetails?.medications?.length > 0 ? (
              userData.user.userDetails.medications.map((med, index) => (
                <Card key={med._id || index} className="p-4 border mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Activity className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">{med.name}</h3>
                        <p className="text-sm text-gray-500">{med.category}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-4 border">
                <p className="text-sm text-gray-500">No medications found</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default HealthDashboard;
