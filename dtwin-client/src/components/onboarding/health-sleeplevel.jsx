import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { cn } from '@/lib/utils';
import { Slider } from '../ui/slider';

// Placeholder icons - Replace with your actual icons
const sleepIcons = [
    '/sleep-icon-1.png',
    '/sleep-icon-2.png',
    '/sleep-icon-3.png',
    '/sleep-icon-4.png',
    '/sleep-icon-5.png',
];

// Sleep level data
const sleepLevels = [
    {
        level: 1,
        text: 'Very Low',
        description: '~1-3 hrs/day',
    },
    {
        level: 2,
        text: 'Low',
        description: '~3-5 hrs/day',
    },
    {
        level: 3,
        text: 'Moderate',
        description: '~5-8 hrs/day',
    },
    {
        level: 4,
        text: 'High',
        description: '~8-10 hrs/day',
    },
    {
        level: 5,
        text: 'Very High',
        description: '~10-12 hrs/day',
    },
];

export default function HealthSleepLevel() {
    const [sleepLevel, setSleepLevel] = useState(3);

    const handleSliderChange = (value) => {
        setSleepLevel(value);
    };

    return (
        <div className="min-h-screen bg-white px-4 pt-3 flex flex-col max-w-md mx-auto">
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
            <h1 className="text-[28px] font-semibold text-gray-900 mb-12">
                What is your current sleep level?
            </h1>

            {/* Sleep Level Selector */}
            <div className="relative">
                {/* Sleep Details */}
                <div
                    className="sleepdetails absolute top-[45%] left-1/2 transform -translate-x-1/2 text-center"
                    style={{ width: '80%' }} // Adjust width as needed
                >
                    <img
                        src={sleepIcons[sleepLevel - 1]} // Dynamic icon based on sleepLevel 
                        alt={`Sleep Level ${sleepLevel}`}
                        className="mx-auto h-16 w-16 mb-2" // Adjust size as needed
                    />
                    <h4 className="text-lg font-medium text-gray-900">{sleepLevels[sleepLevel - 1].text}</h4>
                    <p className="text-gray-500">{sleepLevels[sleepLevel - 1].description}</p>
                </div>

                {/* Slider */}
                <div className="mb-8">
                    <Slider
                        defaultValue={[sleepLevel]}
                        onChange={handleSliderChange}
                        max={5} // 5 sleep levels
                        className="slider-custom" // Apply custom slider styles 
                    />
                </div>

                {/* Level Number (Right Bottom) */}
                <div className="absolute bottom-0 right-4 text-lg font-bold text-gray-900">
                    {sleepLevel}
                </div>
            </div>

            {/* Continue Button */}
            <button className="w-full bg-[#0066FF] text-white rounded-xl py-4 flex items-center justify-center gap-2 text-[16px] font-medium">
                Continue
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
}
