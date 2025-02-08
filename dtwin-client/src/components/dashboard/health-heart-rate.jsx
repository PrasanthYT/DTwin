import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Line, LineChart, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function HealthHeartRate() {
  const [selectedRange, setSelectedRange] = useState("1 Week");
  const [heartRateData, setHeartRateData] = useState({
    "1 Day": [],
    "1 Week": [],
    "1 Month": [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchHeartRateData();
  }, []);

  // ✅ Fetch Heart Rate Data from Fitbit API
  const fetchHeartRateData = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Adjust based on auth method
      const response = await axios.get("http://localhost:4200/api/fitbit/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const weeklyData = response.data?.data?.weeklyData || [];
        const formattedData = processHeartRateData(weeklyData);
        setHeartRateData(formattedData);
      }
    } catch (error) {
      console.error("❌ Error fetching heart rate data:", error);
    }
  };

  // ✅ Process Fitbit Data into Chart Format
  const processHeartRateData = (weeklyData) => {
    // Sort data by date (latest first)
    const sortedData = weeklyData.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Extract data points for different ranges
    const oneDayData = sortedData.slice(0, 1).flatMap((day) => [
      {
        day: "12AM",
        value:
          day?.heartRate?.["activities-heart"]?.[0]?.value?.restingHeartRate ||
          0,
      },
      {
        day: "6AM",
        value:
          day?.heartRate?.["activities-heart"]?.[0]?.value?.restingHeartRate ||
          0,
      },
      {
        day: "12PM",
        value:
          day?.heartRate?.["activities-heart"]?.[0]?.value?.restingHeartRate ||
          0,
      },
      {
        day: "6PM",
        value:
          day?.heartRate?.["activities-heart"]?.[0]?.value?.restingHeartRate ||
          0,
      },
    ]);

    const oneWeekData = sortedData.slice(0, 7).map((day) => ({
      day: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
      value:
        day?.heartRate?.["activities-heart"]?.[0]?.value?.restingHeartRate || 0,
    }));

    const oneMonthData = [
      { day: "Week 1", value: getAverage(weeklyData.slice(0, 7)) },
      { day: "Week 2", value: getAverage(weeklyData.slice(7, 14)) },
      { day: "Week 3", value: getAverage(weeklyData.slice(14, 21)) },
      { day: "Week 4", value: getAverage(weeklyData.slice(21, 28)) },
    ];

    return {
      "1 Day": oneDayData,
      "1 Week": oneWeekData,
      "1 Month": oneMonthData,
    };
  };

  // ✅ Helper Function to Calculate Weekly Average
  const getAverage = (data) => {
    const total = data.reduce(
      (sum, day) =>
        sum +
        (day?.heartRate?.["activities-heart"]?.[0]?.value?.restingHeartRate ||
          0),
      0
    );
    return data.length ? Math.round(total / data.length) : 0;
  };

  // ✅ Get Current Heart Rate (Most Recent Entry)
  const latestHeartRate = heartRateData["1 Week"]?.[0]?.value || "--";

  // ✅ Determine Heart Rate Status & Message
  const getHeartRateStatus = (bpm) => {
    if (bpm >= 100) {
      return {
        label: "High",
        message:
          "Your heart rate is elevated. Take a break, hydrate, and relax.",
        color: "bg-red-100 text-red-500",
      };
    } else if (bpm < 60) {
      return {
        label: "Low",
        message:
          "Your heart rate is lower than normal. Consider consulting a doctor if you feel dizzy.",
        color: "bg-yellow-100 text-yellow-500",
      };
    } else {
      return {
        label: "Normal",
        message:
          "Your heart rate is within the healthy range. Keep up your fitness routine!",
        color: "bg-green-100 text-green-500",
      };
    }
  };

  // ✅ Get Latest Heart Rate Status
  const heartRateStatus = getHeartRateStatus(latestHeartRate);

  const handleback = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button onClick={handleback} variant="outline" size="icon" className="rounded-xl">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Heart Rate</h1>
        </div>
        <div className="bg-blue-50 text-blue-500 px-4 py-1 rounded-full text-sm">
          {latestHeartRate >= 100
            ? "High"
            : latestHeartRate < 60
            ? "Low"
            : "Normal"}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-50 p-2 rounded-xl">
          <div className="text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
        </div>
        <div>
          <span className="text-4xl font-bold">{latestHeartRate}</span>
          <span className="text-xl text-gray-400 ml-1">BPM</span>
        </div>
      </div>

      <Tabs defaultValue="1 Week" onValueChange={setSelectedRange}>
        <TabsList className="flex gap-2 mb-8">
          {Object.keys(heartRateData).map((range) => (
            <TabsTrigger key={range} value={range} className="rounded-full">
              {range}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(heartRateData).map(([range, data]) => (
          <TabsContent
            key={range}
            value={range}
            className="mb-8 h-[200px] w-full"
          >
            <LineChart data={data} width={350} height={200}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </TabsContent>
        ))}
      </Tabs>

      <Card className={`${heartRateStatus.color} border-none p-4 mt-4`}>
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">{`Heart Rate Status: ${heartRateStatus.label}`}</h2>
          <p className="text-gray-500">
          {heartRateStatus.message}
          </p>
        </CardContent>
      </Card>

      <button className="w-full max-w-md bg-[#0066FF] text-white rounded-xl py-4 flex items-center justify-center gap-2 text-[16px] font-medium mt-6">
        Continue
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
