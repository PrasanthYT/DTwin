import { useState, useEffect } from "react";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const dataSets = {
  "Blood Sugar": [
    { day: "Mon", fasting: 90, postMeal: 140 },
    { day: "Tue", fasting: 95, postMeal: 145 },
    { day: "Wed", fasting: 85, postMeal: 130 },
    { day: "Thu", fasting: 92, postMeal: 135 },
    { day: "Fri", fasting: 89, postMeal: 138 },
    { day: "Sat", fasting: 87, postMeal: 142 },
    { day: "Sun", fasting: 91, postMeal: 136 },
  ],
  "SpO₂ Levels": [
    { day: "Mon", spo2: 98 },
    { day: "Tue", spo2: 97 },
    { day: "Wed", spo2: 96 },
    { day: "Thu", spo2: 98 },
    { day: "Fri", spo2: 99 },
    { day: "Sat", spo2: 97 },
    { day: "Sun", spo2: 98 },
  ],
};

export default function HealthSugarSpO2() {
  const [selectedRange, setSelectedRange] = useState("Blood Sugar");
  const navigate = useNavigate();

  const handleBack = () => navigate("/dashboard");

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-xl bg-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Blood Sugar & SpO₂</h1>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>

      <Tabs defaultValue="Blood Sugar" onValueChange={setSelectedRange}>
        <TabsList className="flex gap-2 mb-6 overflow-x-auto">
          {Object.keys(dataSets).map((range) => (
            <TabsTrigger key={range} value={range} className="rounded-full">
              {range}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(dataSets).map(([range, data]) => (
          <TabsContent key={range} value={range} className="mb-6">
            <Card className="w-full overflow-x-auto">
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fill: "#4b5563", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "8px" }} />
                    {range === "Blood Sugar" ? (
                      <>
                        <Line type="monotone" dataKey="fasting" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Fasting" />
                        <Line type="monotone" dataKey="postMeal" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Post Meal" />
                      </>
                    ) : (
                      <Line type="monotone" dataKey="spo2" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="SpO₂" />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}