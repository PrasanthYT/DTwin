import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

export default function HealthFitness({ nextStep, prevStep, setUserData }) {
  const [fitnessLevel, setFitnessLevel] = useState(0);
  const scrollRef = useRef(null);

  const handleNext = () => {
    setUserData((prev) => ({ ...prev, fitnessLevel: fitnessLevel }));
    nextStep();
  };

  // Define fitness level data (images and text)
  const fitnessLevels = [
    {
      image: "/level-0.png",
      text: "Level 0 (No Exercise)",
    },
    {
      image: "/level-1.png",
      text: "Level 1 (Beginner)",
    },
    {
      image: "/level-2.png",
      text: "Level 2 (Intermediate)",
    },
    {
      image: "/level-3.png",
      text: "Level 3 (Advanced)",
    },
  ];

  // Function to scroll to the selected fitness level
  useEffect(() => {
    if (scrollRef.current) {
      const scrollToIndex = fitnessLevel;
      const elementToScrollTo = scrollRef.current.children[scrollToIndex];

      if (elementToScrollTo) {
        elementToScrollTo.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [fitnessLevel]);

  return (
    <div className="min-h-screen bg-white px-4 pt-3 flex flex-col max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-xl border-gray-200"
          onClick={prevStep}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Progress value={66.66} className="h-2 w-32" />
        <Button variant="ghost" className="text-sm text-gray-600">
          Skip
        </Button>
      </div>

      {/* Title */}
      <h1 className="text-[28px] font-semibold text-gray-900 mb-12">
        What is your current fitness level?
      </h1>

      {/* Fitness Level Selector (Scrollable) */}
      <div
        className="mb-12 py-10 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        ref={scrollRef}
        style={{ scrollSnapType: "x mandatory" }}
      >
        {fitnessLevels.map((level, index) => (
          <button
            key={index}
            onClick={() => setFitnessLevel(index)}
            className={cn(
              "flex flex-shrink-0 snap-center items-center justify-center w-48 h-64 transition-all duration-200 mx-2 rounded-lg transform hover:scale-105", // Increased height to h-64
              fitnessLevel === index
                ? "relative bg-[#0066FF] shadow-[0_0_0_12px_rgba(0,102,255,0.08)]"
                : ""
            )}
          >
            <div className="flex flex-col items-center">
              <img
                src={level.image}
                alt={`Fitness Level ${index}`}
                className="h-24 w-24 mb-2"
              />
              <span
                className={cn(
                  "font-medium transition-all text-[24px]",
                  fitnessLevel === index ? "text-white" : "text-black"
                )}
              >
                <span className="text-xs">Level</span> {index}
              </span>
              <p
                className={cn(
                  "text-sm",
                  fitnessLevel === index ? "text-white" : "text-black"
                )}
              >
                {level.text}
              </p>
            </div>
          </button>
        ))}
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
