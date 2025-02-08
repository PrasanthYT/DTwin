import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function HealthFitness({ nextStep, prevStep, setUserData }) {
  const [fitnessLevel, setFitnessLevel] = useState(0);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const fitnessLevels = [
    { level: 0, title: "No Exercise", image: "/level-0.png", progress: 0 },
    { level: 1, title: "Beginner", image: "/level-1.png", progress: 33.33 },
    { level: 2, title: "Intermediate", image: "/level-2.png", progress: 66.66 },
    { level: 3, title: "Advanced", image: "/level-3.png", progress: 100 },
  ];

  const findClosestLevel = (progress) => {
    let closest = fitnessLevels[0];
    let minDiff = Math.abs(progress - fitnessLevels[0].progress);

    fitnessLevels.forEach((level) => {
      const diff = Math.abs(progress - level.progress);
      if (diff < minDiff) {
        minDiff = diff;
        closest = level;
      }
    });

    return closest;
  };

  const updateProgress = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = rect.width;
    const relativeX = clientX - rect.left;
    let newProgress = Math.min(
      Math.max((relativeX / sliderWidth) * 100, 0),
      100
    );

    const closest = findClosestLevel(newProgress);
    setFitnessLevel(closest.level);
    setSwipeProgress(closest.progress);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updateProgress(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    updateProgress(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e) => {
    updateProgress(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    updateProgress(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const closest = findClosestLevel(swipeProgress);
    setSwipeProgress(closest.progress);
    setFitnessLevel(closest.level);
  };

  const handleCheckpointClick = (level) => {
    setFitnessLevel(level.level);
    setSwipeProgress(level.progress);
  };

  const handleNext = () => {
    setUserData((prev) => ({
      ...prev,
      fitnessLevel: fitnessLevel,
    }));
    nextStep();
  };

  return (
    <div className="min-h-screen bg-white px-4 pt-3 flex flex-col max-w-md mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-xl border-gray-200"
          onClick={prevStep}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Progress value={66.66} className="h-2 w-32" />
        <Button variant="ghost" className="text-sm text-gray-600">
          Skip
        </Button>
      </div>

      <h1 className="text-[28px] font-semibold text-gray-900 mb-12">
        What is your current fitness level?
      </h1>

      <div className="flex justify-center mb-12 relative h-64">
        {fitnessLevels.map((level, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-300",
              fitnessLevel === index
                ? "opacity-100 transform translate-x-0"
                : "opacity-0"
            )}
          >
            <img
              src={level.image}
              alt={`Level ${level.level}`}
              className="w-64 h-64 object-contain"
            />
          </div>
        ))}
      </div>

      <p className="text-center text-gray-900 font-medium mb-6">
        Level {fitnessLevel}{" "}
        <span className="text-gray-500">
          ({fitnessLevels[fitnessLevel].title})
        </span>
      </p>

      <div className="mb-6 relative">
        <div
          ref={sliderRef}
          className="relative w-full h-14 rounded-xl bg-gray-200 overflow-hidden cursor-pointer"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-200 rounded-xl"
            style={{ width: `${swipeProgress}%` }}
          />

          <div
            className="absolute top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center transition-all duration-200"
            style={{ left: `calc(${swipeProgress}% - 24px)` }}
          >
            <ChevronRight className="h-5 w-5 text-blue-600" />
          </div>

          {fitnessLevels.map((level, index) => (
            <div
              key={index}
              onClick={() => handleCheckpointClick(level)}
              className={cn(
                "absolute top-0 h-full w-1 bg-white transition-all duration-200 cursor-pointer",
                swipeProgress >= level.progress ? "opacity-50" : "opacity-25"
              )}
              style={{ left: `${level.progress}%` }}
            />
          ))}

          <p className="absolute inset-0 flex items-center justify-center text-gray-900 font-medium select-none -z-10">
            {isDragging ? "Release to Set Level" : "Drag to Set Level"}
          </p>
        </div>
      </div>

      <Button
        className="w-full px-10 py-6 text-base font-medium bg-blue-600 hover:bg-blue-700"
        onClick={handleNext}
      >
        Continue
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
