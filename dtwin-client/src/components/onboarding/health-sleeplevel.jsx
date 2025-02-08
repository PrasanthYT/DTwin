"use client"

import { useState } from "react"
import { ChevronLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const sleepLevels = [
  {
    level: 1,
    text: "Very Low",
    description: "~1-3 hrs daily",
  },
  {
    level: 2,
    text: "Low",
    description: "~3-5 hrs daily",
  },
  {
    level: 3,
    text: "Moderate",
    description: "~5-6hr daily",
  },
  {
    level: 4,
    text: "High",
    description: "~8-10 hrs daily",
  },
  {
    level: 5,
    text: "Very High",
    description: "~10-12 hrs daily",
  },
]

const CustomSlider = ({ value, onChange }) => {
  const handleSliderClick = (e) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const clickX = e.clientX - rect.left; // Get the click position relative to slider
  
    // Calculate the new value based on the click position
    const newValue = Math.round((clickX / rect.width) * (sleepLevels.length - 1)) + 1;
  
    // Ensure the value remains between 1 and 5
    onChange(Math.max(1, Math.min(5, newValue)));
  };

  const calculateMarkerPosition = (currentValue) => {
    return `${((currentValue - 1) / 4) * 100}%`
  }

  return (
    <div className="relative w-full h-[300px] mb-24">
      {/* Rotated slider container */}
      <div className="absolute bottom-0 left-0 w-full h-full origin-bottom-left -rotate-45" onClick={handleSliderClick}>
        {/* Track */}
        <div className="absolute bottom-0 left-0 w-[141%] h-0.5 bg-gray-200 origin-bottom-left">
          {/* Filled track */}
          <div
            className="absolute h-0.5 bg-[#0066FF]"
            style={{
              width: calculateMarkerPosition(value),
              left: 0,
            }}
          />
          {/* Dots */}
          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              className={`absolute w-2 h-2 rounded-full top-1/2 -translate-y-1/2 ${
                dot <= value ? "bg-[#0066FF]" : "bg-gray-200"
              }`}
              style={{ left: `${((dot - 1) / 4) * 100}%` }}
            />
          ))}
          {/* Diamond handle */}
          <div
            className="absolute w-12 h-12 bg-[#0066FF] rounded-lg top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{
              left: calculateMarkerPosition(value),
            }}
          >
            <div className="absolute inset-0 m-3 bg-white rounded-sm" />
          </div>
        </div>
      </div>
      {/* Large number display - bottom right */}
      <div className="absolute bottom-0 right-0 text-[120px] font-bold text-[#1a2b4b] leading-none">{value}</div>
    </div>
  )
}

export default function HealthSleepLevel({ nextStep, prevStep, setUserData }) {
  const [sleepLevel, setSleepLevel] = useState(3)

  const handleNext = () => {
    setUserData((prev) => ({ ...prev, sleepLevel: sleepLevel }))
    nextStep()
  }

  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-gray-200" onClick={prevStep}>
          <ChevronLeft className="h-6 w-6 text-[#1a2b4b]" />
        </Button>
        <Progress value={77.77} className="h-2 w-32" />
        <Button variant="ghost" className="text-base text-[#1a2b4b]">
          Skip
        </Button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-12 text-[#1a2b4b]">What is your current sleep level?</h1>

      {/* Sleep Level Info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="#1a2b4b"
              strokeWidth="2"
            />
            <path
              d="M15 9C15 9.82843 12.3137 10.5 9 10.5C5.68629 10.5 3 9.82843 3 9"
              stroke="#1a2b4b"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-lg text-[#1a2b4b]">{sleepLevels[sleepLevel - 1].text}</p>
          <p className="text-gray-500">{sleepLevels[sleepLevel - 1].description}</p>
        </div>
      </div>

      {/* Custom Slider */}
      <CustomSlider value={sleepLevel} onChange={setSleepLevel} />

      {/* Continue Button */}
      <button
        className="w-full bg-[#0066FF] text-white rounded-2xl py-4 flex items-center justify-center gap-2 text-lg font-medium mt-auto"
        onClick={handleNext}
      >
        Continue
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  )
}

