import React, { useState } from 'react';
import { ChevronLeft, FileChartColumn, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const RectangularCurvedGraph = ({ data, width, height }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;
    const curveRadius = 25;

    const generatePath = () => {
        let path = '';
        data.forEach((point, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((point.value - minValue) / range) * height;
            
            if (index === 0) {
                path += `M ${x},${y}`;
            } else {
                path += ` L ${x},${y}`;
            }
        });
        return path;
    };

    const generateAreaPath = () => {
        let path = generatePath();
        path += ` L ${width},${height} L 0,${height} Z`;
        return path;
    };

    return (
        <div className="relative w-full h-full">
            <svg width={width} height={height} className="overflow-visible">
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
                    </linearGradient>
                </defs>

                {[...Array(5)].map((_, i) => (
                    <line
                        key={i}
                        x1="0"
                        y1={height * (i / 4)}
                        x2={width}
                        y2={height * (i / 4)}
                        stroke="#E5E7EB"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                ))}

                <path d={generateAreaPath()} fill="url(#areaGradient)" className="transition-all duration-300" />
                <path d={generatePath()} fill="none" stroke="#3B82F6" strokeWidth="2.5" className="transition-all duration-300" />
            </svg>
        </div>
    );
};

export default function HealthHeartRate() {
    const [selectedPeriod, setSelectedPeriod] = useState("1 Week");
    const periods = ["1 Day", "1 Week", "1 Month", "1 Year", "All"];
    const heartRateData = [
        { day: 'Mon', value: 85 },
        { day: 'Tue', value: 75 },
        { day: 'Wed', value: 80 },
        { day: 'Thu', value: 95 },
        { day: 'Fri', value: 90 },
        { day: 'Sat', value: 88 },
        { day: 'Sun', value: 82 }
    ];
    
    const latestHeartRate = heartRateData[heartRateData.length - 1].value;
    const status = latestHeartRate > 100 ? "High Risk" : latestHeartRate < 60 ? "Low" : "Normal";
    
    const getStatusBg = (status) => {
        return status === "Normal" ? "bg-green-100" : status === "High Risk" ? "bg-red-100" : "bg-yellow-100";
    };
    
    const getStatusColor = (status) => {
        return status === "Normal" ? "text-green-600" : status === "High Risk" ? "text-red-600" : "text-yellow-600";
    };

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="flex items-center justify-between">
                <Button variant="outline" size="icon" className="rounded-xl">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Heart Rate</h1>
            </div>

            <div className="mt-6 flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-100">
                    <Heart className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-4xl font-bold">{latestHeartRate}</span>
                <span className="text-xl text-muted-foreground">BPM</span>
            </div>

            <div className="flex gap-2 mt-6 overflow-x-auto">
                {periods.map((period) => (
                    <Button
                        key={period}
                        variant={selectedPeriod === period ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() => setSelectedPeriod(period)}
                    >
                        {period}
                    </Button>
                ))}
            </div>

            <Card className="p-6 rounded-xl w-full mt-6">
                <RectangularCurvedGraph data={heartRateData} width={350} height={200} />
            </Card>

            <div className="px-4 grid gap-4">
                <Card className={`p-4 ${getStatusBg(status)} border-none`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusBg(status)}`}>
                            <Heart className={`h-5 w-5 ${getStatusColor(status)}`} />
                        </div>
                        <div>
                            <h3 className={`font-medium ${getStatusColor(status)}`}>{status}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {status === "Normal"
                                    ? "Your heart rate is within a healthy range (60-100 BPM)"
                                    : status === "High Risk"
                                    ? "Your heart rate is above the normal range (>100 BPM)"
                                    : "Your heart rate is below the normal range (<60 BPM)"}
                            </p>
                        </div>
                    </div>
                </Card>

                <Button className="w-full mt-6" size="lg">
                    View Full Report
                    <FileChartColumn className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
