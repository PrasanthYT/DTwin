import React from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeartAnalysis = () => {
  const avgHeartRate = 85;
  const minHeartRate = 65;
  const maxHeartRate = 95;
  const status = "Healthy";

  return (
    <div className="w-screen h-screen bg-[#F2F7FB] p-6 flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between">
      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl border-gray-200"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
        <h2 className="text-lg font-semibold">Smart Heart Analysis</h2>
        <button className="p-2">⋮</button>
      </div>
      
      {/* Status */}
      <div className="mt-4">
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">{status}</span>
      </div>
      
      {/* Summary */}
      <h1 className="text-3xl font-bold mt-2">Normal</h1>
      <p className="text-gray-500">No health abnormality.</p>
      
      {/* Placeholder for Side Image */}
      <div className="absolute right-0 top-1/6 w-1/2 h-3/4 flex items-center flex-end">
        <img src="/heartanalysis.png" alt="Heart Analysis" className="w-full h-full object-contain" />
      </div>
      
      {/* Stats */}
      <div className="mt-6 space-y-4 pr-20">
        <div className="bg-white p-3 rounded-xl shadow flex flex-col items-center w-2/5">
          <span className="text-xl font-bold">{avgHeartRate} bpm</span>
          <span className="text-gray-500 text-sm">Avg Heart Rate</span>
        </div>
        <div className="bg-white p-3 rounded-xl shadow flex flex-col items-center w-2/5">
          <span className="text-xl font-bold">{minHeartRate} bpm</span>
          <span className="text-gray-500 text-sm">Min Heart Rate</span>
        </div>
        <div className="bg-white p-3 rounded-xl shadow flex flex-col items-center w-2/5">
          <span className="text-xl font-bold text-red-500">{maxHeartRate} bpm</span>
          <span className="text-gray-500 text-sm">Max Heart Rate</span>
        </div>
      </div>
      
      {/* Add Button */}
      <button className="mt-6 bg-blue-500 text-white p-3 rounded-xl text-xl flex items-center justify-center shadow w-12 h-12">
        +
      </button>
    </div>
  );
};

export default HeartAnalysis;
