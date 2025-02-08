"use client"

import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Line, LineChart, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const dataSets = {
  "1 Day": [
    { day: "12AM", value: 80 },
    { day: "6AM", value: 85 },
    { day: "12PM", value: 90 },
    { day: "6PM", value: 88 },
  ],
  "1 Week": [
    { day: "Mon", value: 85 },
    { day: "Tue", value: 82 },
    { day: "Wed", value: 91 },
    { day: "Thu", value: 80 },
    { day: "Fri", value: 90 },
    { day: "Sat", value: 88 },
    { day: "Sun", value: 85 },
  ],
  "1 Month": [
    { day: "Week 1", value: 87 },
    { day: "Week 2", value: 83 },
    { day: "Week 3", value: 89 },
    { day: "Week 4", value: 84 },
  ],
};

export default function HealthHeartRate() {
  const [selectedRange, setSelectedRange] = useState("1 Week");
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-xl">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Heart Rate</h1>
        </div>
        <div className="bg-blue-50 text-blue-500 px-4 py-1 rounded-full text-sm">Normal</div>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-50 p-2 rounded-xl">
          <div className="text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
        </div>
        <div>
          <span className="text-4xl font-bold">95</span>
          <span className="text-xl text-gray-400 ml-1">BPM</span>
        </div>
      </div>

      <Tabs defaultValue="1 Week" onValueChange={setSelectedRange}>
        <TabsList className="flex gap-2 mb-8">
          {Object.keys(dataSets).map((range) => (
            <TabsTrigger key={range} value={range} className="rounded-full">
              {range}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(dataSets).map(([range, data]) => (
          <TabsContent key={range} value={range} className="mb-8 h-[200px] w-full">
            <LineChart data={data} width={350} height={200}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-gray-50 border-none p-4 mt-4">
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">Heart Rate Status</h2>
          <p className="text-gray-500">Your heart rate is within the normal range.</p>
        </CardContent>
      </Card>

      <button className="w-full max-w-md bg-[#0066FF] text-white rounded-xl py-4 flex items-center justify-center gap-2 text-[16px] font-medium mt-6">
                Continue
                <ChevronRight className="h-5 w-5" />
            </button>
    </div>
  );
}