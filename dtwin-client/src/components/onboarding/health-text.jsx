import {
  ArrowLeft,
  ArrowRight,
  CornerUpLeftIcon,
  CornerUpRightIcon,
  FileText,
  FileTextIcon,
  LucideFileText,
  Mic,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const HealthText = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-start pt-16 px-4">
      <div className="mb-6 flex items-center w-full max-w-md justify-between">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-xl border-gray-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1 mx-4 bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-gray-800 h-1.5 rounded-full"
            style={{ width: "100%" }}
          />
        </div>
        <Button variant="ghost" className="text-sm text-gray-600">
          Skip
        </Button>
      </div>

      {/* Title */}
      <div className="mb-8 max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Textual Al Health <br /> Analysis
        </h1>
        <p className="text-center text-gray-600 text-sm px-4">
          Write any ongoing health conditions you have right now. Our Al will
          analyze it.
        </p>
      </div>

      {/* Text Area */}
      <div className="w-full max-w-md bg-gray-100 rounded-xl border h-[200px] border-blue-500 ring  ring-blue-200 p-4 mb-4 relative">
        {" "}
        {/* Added relative */}
        <p className="text-gray-500  text-xl font-medium  leading-relaxed">
          I haven't been eating well lately, and{" "}
          <div className="inline-block h-6 bg-red-600 w-[3px]"></div>
          <span className="text-red-500 bg-red-100 p-1">
            I dont know why . My
          </span>
          <span className="text-red-500 bg-red-100 p-1">
            right foot also hurts
          </span>
          <div className="inline-block h-6 bg-red-600 w-[2px] mr-1"></div>
          so much, please help me, doc Al
        </p>
        <div className="mt-2 text-gray-500 text-sm text-right absolute bottom-2 right-4">
          {" "}
          {/* Absolute positioning */}
          <div className="flex items-center gap-x-2">
            <LucideFileText color="gray" /> 100/250
          </div>
        </div>
        <div className="absolute  bottom-2 left-2 flex space-x-2">
          <button className="bg-gray-200 rounded-lg px-2 py-1 text-gray-600 text-sm">
            <CornerUpLeftIcon color="gray" />
          </button>
          <button className="bg-gray-200 rounded-lg px-2 py-1 text-gray-600 text-sm">
            <CornerUpRightIcon color="gray" />
          </button>
        </div>
      </div>

      {/* Voice Input Button */}
      <button className=" px-4 bg-gray-700 rounded-xl py-3 mb-4 text-white font-medium text-base ring ring-gray-400 flex items-center justify-center  transition-colors">
        Use Voice Instead <Mic className="ml-2" />
      </button>

      {/* Continue Button */}
      <Button className="w-full px-10 py-6 text-base font-medium bg-blue-600 hover:bg-blue-700">
        Continue
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};

export default HealthText;
