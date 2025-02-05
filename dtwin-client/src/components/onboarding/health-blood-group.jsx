import { useState } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const bloodTypes = ["A", "B", "AB", "O"]
const rhFactors = ["+", "-"]

export default function HealthBloodFGroup() {
    const [selectedType, setSelectedType] = useState("A")
    const [selectedRh, setSelectedRh] = useState("+")

    return (
        <div className="min-h-screen bg-white px-4 pt-3 flex flex-col max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl border-gray-200"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Progress value={33} className="h-2 w-32" />
                <Button variant="ghost" className="text-sm text-gray-600">
                    Skip
                </Button>
            </div>

            {/* Title */}
            <h1 className="text-[28px] font-semibold text-gray-900 mb-8">
                What's your official blood type?
            </h1>

            {/* Blood Type Selection */}
            <div className="grid grid-cols-4 gap-2 mb-12">
                {bloodTypes.map((type) => (
                    <Button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        variant="outline"
                        className={cn(
                            "h-12 text-lg font-medium",
                            selectedType === type
                                ? "bg-[#1E2B3A] text-white border-[#1E2B3A]"
                                : "text-gray-600"
                        )}
                    >
                        {type}
                    </Button>
                ))}
            </div>

            {/* Selected Blood Type Display */}
            <div className="flex justify-center items-center mb-12">
                <div className="text-[120px] font-bold text-[#1E2B3A] leading-none">
                    {selectedType}
                    <span className="text-red-500 text-[60px] align-top ml-2">
                        {selectedRh}
                    </span>
                </div>
            </div>

            {/* Rh Factor Selection */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                {rhFactors.map((rh) => (
                    <Button
                        key={rh}
                        onClick={() => setSelectedRh(rh)}
                        variant={selectedRh === rh ? "default" : "secondary"}
                        className={cn(
                            "h-14 text-lg font-medium",
                            selectedRh === rh
                                ? "bg-[#0066FF] hover:bg-[#0066FF]/90"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                        )}
                    >
                        {rh}
                    </Button>
                ))}
            </div>

            {/* Continue Button */}
            <button className="w-full max-w-md bg-[#0066FF] text-white rounded-xl py-4 flex items-center justify-center gap-2 text-[16px] font-medium mt-6">
                Continue
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    )
}
