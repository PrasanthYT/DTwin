import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HealthDashboard = ({ score = 88, heartRate = 95, bloodPressure = 121, sleep = 6.5 }) => {
  return (
    <div className="min-h-screen flex flex-col items-center text-white p-4 relative">
      {/* Blue Background for Top Half with Design */}
      <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-r from-blue-600 to-blue-500 rounded-b-3xl shadow-xl"></div>

      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-sm z-10 mt-4">
        <button className="text-white text-xl">&#x2190;</button>
        <h1 className="text-lg font-semibold">Metabolic Score</h1>
        <Button className="bg-white text-black px-4 py-1 rounded-lg">Normal</Button>
      </div>

      {/* Score Section */}
      <div className="mt-6 text-center z-10">
        <h2 className="text-6xl font-bold">{score}</h2>
        <p className="text-lg mt-2">You are a healthy individual.</p>
      </div>

      {/* Stats Cards */}
      <div className="w-full max-w-sm mt-24 z-10 space-y-6 pb-10">
        <Card className="p-4 bg-white text-black rounded-xl flex justify-between items-center shadow-lg">
          <div>
            <h3 className="text-lg font-semibold">Heart Rate</h3>
            <p className="text-2xl font-bold">{heartRate} <span className="text-sm">bpm</span></p>
          </div>
          <img src="/heartrateimage.png" alt="Heart Rate Graph" className="w-16 h-10" />
        </Card>

        <Card className="p-4 bg-white text-black rounded-xl flex justify-between items-center shadow-lg">
          <div>
            <h3 className="text-lg font-semibold">Blood Pressure</h3>
            <p className="text-2xl font-bold">{bloodPressure} <span className="text-sm">mmHg</span></p>
          </div>
          <img src="/bpimage.png" alt="Blood Pressure Graph" className="w-16 h-10" />
        </Card>

        <Card className="p-4 bg-white text-black rounded-xl flex justify-between items-center shadow-lg">
          <div>
            <h3 className="text-lg font-semibold">Sleep</h3>
            <p className="text-2xl font-bold">{sleep} <span className="text-sm">hr</span></p>
          </div>
          <img src="./sleepimage.png" alt="Sleep Graph" className="w-16 h-10" />
        </Card>
      </div>
    </div>
  );
};

export default HealthDashboard;
