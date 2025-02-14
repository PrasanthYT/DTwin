import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Search,
  Plus,
  MessageSquare,
  Activity,
  X,
  LogOut,
  Heart,
  Droplet,
  Moon,
  Footprints,
  Flame,
} from "lucide-react";
import BottomNav from "../components/dashboard/bottom-nav";
import FitbitConnect from "@/components/Fitbit/FitbitConnect";
import { Separator } from "@/components/ui/separator";
import Fitbit from "@/components/Fitbit/Fitbit";

function MetricCard({
  icon: Icon,
  title,
  value,
  unit,
  color,
  max,
  badge,
  onClick,
}) {
  return (
    <Card
      className="hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-${color}-100 rounded-lg`}>
            <Icon className={`w-6 h-6 text-${color}-500`} />
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <div className="text-3xl font-bold">
          {value}{" "}
          {unit && (
            <span className="text-sm font-normal text-gray-500">{unit}</span>
          )}
        </div>
        <Progress value={value} max={max} className="h-2" />
        {badge && badge}
      </CardContent>
    </Card>
  );
}

function getBloodSugarBadge(value) {
  if (value > 140)
    return (
      <Badge variant="destructive" className="font-medium">
        High
      </Badge>
    );
  if (value < 90)
    return (
      <Badge variant="warning" className="font-medium">
        Low
      </Badge>
    );
  return (
    <Badge variant="success" className="font-medium">
      Normal
    </Badge>
  );
}

const HealthDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [fitbitData, setFitbitData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(userData);

  const randomBloodSugar = Math.floor(Math.random() * (180 - 70 + 1)) + 70;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUserData();
      await fetchFitbitData();
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "https://dtwin.onrender.com/api/auth/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("✅ User Data:", response.data);
        setUserData(response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  const fetchFitbitData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "https://dtwin.onrender.com/api/fitbit/get",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("✅ Fitbit Data:", response.data);
        setFitbitData(response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching Fitbit data:", error);
    }
  };

  const email = userData?.user?.username || "";
  const extractedName = email.split("@")[0];
  const username = userData?.user?.name || extractedName || "User";
  const healthScore = userData?.user?.healthData?.healthScore || "--";
  const avatar = userData?.user?.userDetails?.avatar || null;
  const userId = userData?.user?.userId;

  const isFitbitDataAvailable =
    fitbitData && String(fitbitData.userId) === String(userData?.user?.userId);

  const weeklyData = isFitbitDataAvailable ? fitbitData.weeklyData : [];
  const latestDay =
    weeklyData.length > 0 ? weeklyData[weeklyData.length - 1] : null;

  const today = new Date().toISOString().split("T")[0];

  const sortedWeeklyData =
    fitbitData?.data?.weeklyData?.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    ) || [];

  const recentData = sortedWeeklyData.find(
    (day) => new Date(day.date) <= new Date(today)
  );

  const recentRestingHeartRate = recentData
    ? recentData?.heartRate?.["activities-heart"]?.[0]?.value
        ?.restingHeartRate ||
      recentData?.activity?.summary?.restingHeartRate ||
      "--"
    : "--";

  const recentSleepData = sortedWeeklyData.find(
    (day) => new Date(day.date) <= new Date(today)
  );

  const recentSleepDuration = recentSleepData?.sleep?.minutesAsleep
    ? (recentSleepData.sleep.minutesAsleep / 60).toFixed(1)
    : "--";

  const recentSleepEfficiency = recentSleepData?.sleep?.efficiency || "--";

  const recentActivityData = sortedWeeklyData.find(
    (day) => new Date(day.date) <= new Date(today)
  );

  const recentDailySteps = recentActivityData?.activity?.summary?.steps || "--";

  const recentActiveMinutes =
    recentActivityData?.activity?.summary?.lightlyActiveMinutes || 0;

  const totalDistance =
    latestDay?.activity?.summary?.distances?.find((d) => d.activity === "total")
      ?.distance || "--";

  const caloriesBurned = latestDay?.activity?.summary?.caloriesOut || "--";

  const handleWellnessAI = () => navigate("/wellnessai");
  const handleSearchBar = () => navigate("/search");
  const handleHeartRate = () => navigate("/heartratemonitor");
  const handleHealthScore = () => navigate("/healthscore");
  const handleAddMeds = () => navigate("/addmeds");

  const handleRemoveMed = async (medication) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "http://localhost:4200/api/auth/remove-medication",
        { medication },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserData();
    } catch (error) {
      console.error("❌ Error removing medication:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-slate-900 overflow-x-hidden">
      <div className="pb-28">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-8 rounded-b-[2.5rem] mb-8 shadow-lg">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium bg-white/20 px-4 py-1 rounded-full">
                {new Date().toDateString()}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-white/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <Avatar className="w-20 h-20 border-4 border-white/30 shadow-xl">
                  <AvatarImage src={avatar} alt={username} />
                  <AvatarFallback className="text-xl">
                    {username[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Hi, {username}!
                  </h1>
                  <div className="flex items-center gap-3 text-white/90">
                    <Badge className="bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap">
                      Pro Member
                    </Badge>
                    <span className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                      <span className="whitespace-nowrap">
                        Health Score: {healthScore}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <Input
                type="text"
                placeholder="Search DTwin..."
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 pl-12 h-12 rounded-xl focus:ring-2 focus:ring-white/50"
                onClick={handleSearchBar}
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {/* Enhanced AI Assistant Card */}
          <Card className="relative border-none overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800"></div>

            {/* Decorative blur effects */}
            <div className="absolute inset-0">
              <div className="absolute -top-32 -right-16 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
              <div className="absolute -bottom-32 -left-16 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
            </div>

            <CardContent className="relative p-8 space-y-6">
              {/* Content section */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-2xl text-white tracking-tight">
                    AI Wellness Assistant
                  </h3>
                  <p className="text-base text-white/80">
                    Get personalized health insights powered by AI
                  </p>
                </div>
              </div>

              {/* Full width button */}
              <Button
                onClick={handleWellnessAI}
                size="lg"
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat Now
              </Button>
            </CardContent>
          </Card>

          <Fitbit />

          {/* Enhanced Health Overview Section */}
          <Card className="shadow-xl border border-gray-200 rounded-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg p-6">
              <CardTitle className="text-3xl font-bold">
                Health Overview
              </CardTitle>
              <CardDescription className="text-lg">
                Track your daily health metrics and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="flex justify-center gap-4 p-2 bg-gray-100 rounded-lg">
                  <TabsTrigger
                    value="metrics"
                    className="px-4 py-2 rounded-lg text-lg font-semibold"
                  >
                    Health Metrics
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="px-4 py-2 rounded-lg text-lg font-semibold"
                  >
                    Activity
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="metrics" className="p-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Heart Rate */}
                    <MetricCard
                      icon={Heart}
                      title="Heart Rate"
                      value={recentRestingHeartRate}
                      unit="BPM"
                      color="red"
                      max={220}
                    />
                    {/* Blood Sugar */}
                    <MetricCard
                      icon={Droplet}
                      title="Blood Sugar"
                      value={randomBloodSugar}
                      unit="mg/dL"
                      color="blue"
                      max={200}
                      badge={getBloodSugarBadge(randomBloodSugar)}
                    />
                    {/* Sleep */}
                    <MetricCard
                      icon={Moon}
                      title="Sleep"
                      value={recentSleepDuration}
                      unit="hours"
                      color="indigo"
                      max={12}
                    />
                    {/* Health Score */}
                    <MetricCard
                      icon={Activity}
                      title="Health Score"
                      value={healthScore}
                      color="green"
                      max={100}
                      onClick={handleHealthScore}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="activity" className="p-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Daily Steps */}
                    <MetricCard
                      icon={Footprints}
                      title="Daily Steps"
                      value={recentDailySteps}
                      color="blue"
                      max={10000}
                    />
                    {/* Active Minutes */}
                    <MetricCard
                      icon={Activity}
                      title="Active Minutes"
                      value={recentActiveMinutes}
                      unit="min"
                      color="green"
                      max={60}
                    />
                    {/* Calories Burned */}
                    <MetricCard
                      icon={Flame}
                      title="Calories Burned"
                      value={caloriesBurned}
                      color="orange"
                      max={3000}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Enhanced Medications Section */}
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Medications</CardTitle>
                <CardDescription>Track your daily medications</CardDescription>
              </div>
              <Button
                onClick={handleAddMeds}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" /> Add Med
              </Button>
            </CardHeader>
            <CardContent>
              {userData?.user?.userDetails?.medications?.length > 0 ? (
                <div className="space-y-4">
                  {userData.user.userDetails.medications.map((med, index) => (
                    <div
                      key={med._id || index}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-lg">{med.name}</h3>
                        <p className="text-sm text-gray-500">{med.category}</p>
                      </div>
                      <Button
                        onClick={() => handleRemoveMed(med)}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-100 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No medications found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HealthDashboard;
