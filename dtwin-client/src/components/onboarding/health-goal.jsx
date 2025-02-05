import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bot, Heart, PillIcon as Pills, Scale, Smartphone } from "lucide-react";

export default function HealthGoals() {
  const [selectedGoal, setSelectedGoal] = useState("");

  const goals = [
    { id: "healthy", label: "I wanna get healthy", icon: Heart },
    { id: "weight", label: "I wanna lose weight", icon: Scale },
    { id: "chatbot", label: "I wanna try AI Chatbot", icon: Bot },
    { id: "meds", label: "I wanna manage meds", icon: Pills },
    { id: "trying", label: "Just trying out the app", icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl border-gray-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Progress value={33} className="h-2 w-32" />
          <Button variant="ghost" className="text-sm text-gray-600">
            Skip
          </Button>
        </div>

        {/* Title */}
        <h1 className="mb-8 text-2xl font-bold">What is your health goal for the app?</h1>

        {/* Goals */}
        <RadioGroup value={selectedGoal} onValueChange={setSelectedGoal} className="space-y-3">
          {goals.map((goal) => {
            const Icon = goal.icon;
            return (
              <Card
                key={goal.id}
                className={`cursor-pointer border transition-all hover:border-blue-600 ${selectedGoal === goal.id ? "border-blue-600 bg-blue-600 text-white" : "bg-white"
                  }`}
              >
                <label htmlFor={goal.id} className="flex cursor-pointer items-center gap-3 p-4">
                  <RadioGroupItem value={goal.id} id={goal.id} className="sr-only" />
                  <Icon className={`h-5 w-5 ${selectedGoal === goal.id ? "text-white" : "text-blue-600"}`} />
                  <span className="text-base">{goal.label}</span>
                </label>
              </Card>
            );
          })}
        </RadioGroup>

        {/* Continue Button */}
        <Button
          className="mt-8 w-full bg-blue-600 py-6 text-base font-medium hover:bg-blue-700"
          disabled={!selectedGoal}
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
