import React, { useState } from "react";
import { ChevronLeft, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "../ui/progress";

const sleepLevels = [
  {
    level: 1,
    text: "Very Low",
    description: "~1-3 hrs/day",
  },
  {
    level: 2,
    text: "Low",
    description: "~3-5 hrs/day",
  },
  {
    level: 3,
    text: "Moderate",
    description: "~5-6 hrs/day",
  },
  {
    level: 4,
    text: "High",
    description: "~8-10 hrs/day",
  },
  {
    level: 5,
    text: "Very High",
    description: "~10-12 hrs/day",
  },
];

const CustomSlider = ({ value, onChange }) => {
  const handleSliderClick = (e) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const sliderWidth = rect.width;
    const newValue = Math.ceil((clickPosition / sliderWidth) * 5);
    onChange(newValue);
  };

  const calculateMarkerPosition = (currentValue) => {
    return `${((currentValue - 1) / 4) * 100}%`;
  };

  return (
    <div
      className="w-full h-2 bg-gray-200 relative cursor-pointer"
      onClick={handleSliderClick}
    >
      <div
        className="absolute h-2 bg-blue-500"
        style={{
          width: calculateMarkerPosition(value),
          left: 0,
        }}
      />
      <div
        className="absolute w-8 h-8 bg-blue-500 rounded-full top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex items-center justify-center"
        style={{
          left: calculateMarkerPosition(value),
        }}
      >
        <div className="w-4 h-4 bg-white rounded-full" />
      </div>
    </div>
  );
};

export default function HealthSleepLevel({ nextStep, prevStep, setUserData }) {
  const [sleepLevel, setSleepLevel] = useState(3);

  const handleNext = () => {
    setUserData((prev) => ({ ...prev, sleepLevel: sleepLevel }));
    nextStep();
  };

  return (
    <div className="flex flex-col h-screen bg-white p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-xl border-gray-200"
          onClick={prevStep}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Progress value={77.77} className="h-2 w-32" />
        <Button variant="ghost" className="text-sm text-gray-600">
          Skip
        </Button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-8 text-center">
        What is your current sleep level?
      </h1>

      {/* Sleep Level Info */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-4">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <circle cx="12" cy="12" r="5" />
          </svg>
        </div>
        <div>
          <p className="font-semibold">{sleepLevels[sleepLevel - 1].text}</p>
          <p className="text-gray-500 text-sm">
            {sleepLevels[sleepLevel - 1].description}
          </p>
        </div>
      </div>

      {/* Custom Slider */}
      <div className="px-4 mb-6">
        <CustomSlider value={sleepLevel} onChange={setSleepLevel} />
      </div>

      {/* Continue Button */}
      <button
        className="w-full bg-[#0066FF] text-white rounded-xl py-4 flex items-center justify-center gap-2 text-[16px] font-medium"
        onClick={handleNext}
      >
        Continue
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
