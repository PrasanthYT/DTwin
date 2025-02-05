import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ChevronRight, Search, Plus, MessageSquare, Pill, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HealthDashboard = ({
    username = "Dekomori",
    profileCompletion = 88,
    heartRate = 78.2,
    bloodPressure = 120,
    sleep = 87,
    dailySteps = 8432,
    activeMinutes = 45,
    caloriesBurned = 384
}) => {
    const navigate = useNavigate();
    const handleWellnessAI = () => {
        navigate('/wellnessai')
    }
    return (
        <div className="min-h-screen text-slate-900">
            {/* Dark Header Section */}
            <div className="bg-slate-900 text-white p-4 rounded-b-3xl">
                <div className="max-w-sm mx-auto">
                    {/* Top Bar */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm opacity-80">Tue, 25 Jan 2025</span>
                        <Bell className="w-5 h-5 opacity-80" />
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-xl">👋</span>
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span>Hi, {username}!</span>
                                    <span className="text-yellow-300">⭐</span>
                                    <span className="text-sm opacity-80">Pro Member</span>
                                </div>
                                <div className="text-sm opacity-80">{profileCompletion}% Profile Complete</div>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-80" />
                    </div>

                    {/* Search Bar */}
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search asklepios..."
                            className="w-full bg-white/20 rounded-xl py-2 pl-10 pr-4 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                    </div>
                </div>
            </div>

            {/* White Content Section */}
            <div className="max-w-sm mx-auto p-4">
                {/* AI Wellness Assistant Banner */}
                <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg">AI Wellness Assistant</h3>
                            <p className="text-sm opacity-90">Get personalized health insights</p>
                        </div>
                        <Button onClick={handleWellnessAI} className="bg-white text-indigo-500 hover:bg-white/90">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Chat Now
                        </Button>
                    </div>
                </Card>

                {/* Health Score Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-semibold">Health Score</h2>
                        <button className="text-gray-400">...</button>
                    </div>
                    <Card className="bg-white border shadow-md p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl flex items-center justify-center text-white">
                                <span className="text-2xl font-bold">{profileCompletion}</span>
                            </div>
                            <div>
                                <h2 className="font-semibold">Metabolic Score</h2>
                                <p className="text-sm text-gray-500">Based on your data, we think your health status is above average.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Stats Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold">Smart Health Metrics</h2>
                        <Button variant="link" className="text-blue-500 p-0">See All</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Heart Rate Card */}
                        <Card className="bg-blue-500 text-white border-0 p-3">
                            <h3 className="text-sm">Heart Rate</h3>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-xl font-bold">{heartRate}</span>
                                <span className="text-xs">BPM</span>
                            </div>
                            <div className="mt-2 h-8">
                                <svg className="w-full h-full" viewBox="0 0 100 40">
                                    <path
                                        d="M0 20 L20 20 L30 5 L40 35 L50 20 L60 20 L70 5 L80 35 L90 20 L100 20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>
                        </Card>

                        {/* Blood Pressure Card */}
                        <Card className="bg-red-500 text-white border-0 p-3">
                            <h3 className="text-sm">Blood Sugar</h3>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-xl font-bold">{bloodPressure}</span>
                                <span className="text-xs">mmHg</span>
                            </div>
                            <div className="mt-2 text-center bg-red-600/50 rounded-md py-1 text-xs">
                                NORMAL
                            </div>
                        </Card>

                        {/* Sleep Card */}
                        <Card className="bg-cyan-500 text-white border-0 p-3">
                            <h3 className="text-sm">Sleep</h3>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-xl font-bold">{sleep}</span>
                                <span className="text-xs">hr</span>
                            </div>
                            <div className="flex justify-between mt-2 h-8 gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2 bg-cyan-300 rounded-full"
                                        style={{ height: `${(80 + i * 5)}%` }}
                                    ></div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Activity Tracker */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-semibold">Fitness & Activity</h2>
                        <Button variant="outline" size="sm" className="gap-1">
                            <Plus className="w-4 h-4" /> Add Activity
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 border bg-emerald-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500 rounded-lg">
                                    <Activity className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Daily Steps</p>
                                    <p className="font-semibold">{dailySteps.toLocaleString()}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4 border bg-orange-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500 rounded-lg">
                                    <Activity className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Active Minutes</p>
                                    <p className="font-semibold">{activeMinutes} min</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Medications Management */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-semibold">Medications</h2>
                        <Button variant="outline" size="sm" className="gap-1">
                            <Plus className="w-4 h-4" /> Add Med
                        </Button>
                    </div>
                    <Card className="p-4 border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Pill className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Next Medication</h3>
                                    <p className="text-sm text-gray-500">In 2 hours (4:30 PM)</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default HealthDashboard;