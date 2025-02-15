import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Heart,
  Moon,
  Brain,
  BarChart,
  Play,
  AlertTriangle,
  RefreshCw,
  Loader2,
  TrendingUp,
  TrendingDown,
  Info,
  ArrowRight
} from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import axios from "axios";

// Initialize the Google Generative AI client
// Note: In a real app, you'd want to use environment variables for the API key
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyBdwqtlWDMCKv_hvJX4tVAFA6pGV8k9Ojk");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "Objective:\nProcess health metrics based on a given scenario and baseline data, providing updated health metrics, potential risks, health impacts, and a summary.\nInput Format:\nThe input will be a JSON object containing:\njson\nCopy\nEdit\n{\n  \"scenario\": \"Description of the scenario affecting health metrics\",\n  \"baselineMetrics\": {\n    \"heartRate\": 70,\n    \"sleepHours\": 7,\n    \"stressLevel\": 3,\n    \"bloodSugar\": 100,\n    \"bloodPressure\": { \"systolic\": 120, \"diastolic\": 80 },\n    \"dailySteps\": 8000,\n    \"activeMinutes\": 30,\n    \"healthScore\": 85\n  }\n}\nExpected Output Format:\nThe system should return a JSON object containing:\nUpdated Metrics (same format as baseline with necessary changes based on scenario).\nPotential Risks (list of possible health risks due to changes).\nHealth Impacts (explanation of how changes affect well-being).\nOverall Summary (brief evaluation of whether the changes are beneficial or harmful).\nExample Output:\njson\nCopy\nEdit\n{\n  \"updatedMetrics\": {\n    \"heartRate\": 80,\n    \"sleepHours\": 5,\n    \"stressLevel\": 7,\n    \"bloodSugar\": 110,\n    \"bloodPressure\": { \"systolic\": 130, \"diastolic\": 85 },\n    \"dailySteps\": 5000,\n    \"activeMinutes\": 20,\n    \"healthScore\": 70\n  },\n  \"potentialRisks\": [\n    \"Increased risk of hypertension\",\n    \"Higher stress levels leading to anxiety\",\n    \"Elevated blood sugar, risk of prediabetes\"\n  ],\n  \"healthImpacts\": [\n    \"Higher than normal, indicating stress or lack of rest\",\n    \"Reduced sleep can lead to cognitive impairment and fatigue\",\n    \"Elevated levels may cause long-term cardiovascular issues\"\n  ],\n  \"overallSummary\": \"The current changes indicate increased health risks due to lack of sleep, reduced physical activity, and heightened stress. This could lead to long-term complications if not addressed.\"\n}\nProcessing Logic:\nAnalyze the scenario's effect on baseline metrics.\nAdjust the metrics accordingly.\nIdentify and list potential risks.\nProvide an analysis of health impacts.\nGenerate an overall summary.\nThis instruction ensures a clear and structured approach for Google Studio to process and evaluate health scenarios effectively. 🚀\n",
});

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-lg border border-gray-200">
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-blue-600">
          <span className="font-medium">Baseline:</span> {payload[0].value}
        </p>
        <p className="text-red-600">
          <span className="font-medium">Simulated:</span> {payload[1].value}
        </p>
      </div>
    );
  }
  return null;
};

const HealthSimulator = () => {
  // State for user input and API response
  const [scenario, setScenario] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Baseline health metrics
  const [baselineMetrics, setBaselineMetrics] = useState({
    heartRate: 70,
    sleepHours: 7,
    stressLevel: 3,
    bloodSugar: 100,
    bloodPressure: { systolic: 120, diastolic: 80 },
    dailySteps: 8000,
    activeMinutes: 30,
    healthScore: 85
  });
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = sessionStorage.getItem("token");
        
        // Fetch user data
        const userResponse = await axios.get(
          "https://dtwin.onrender.com/api/auth/user",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Fetch Fitbit data
        const fitbitResponse = await axios.get(
          "https://dtwin.onrender.com/api/fitbit/get",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (userResponse.status === 200 && fitbitResponse.status === 200) {
          const userData = userResponse.data;
          const fitbitData = fitbitResponse.data;
          
          // Extract relevant health metrics
          if (fitbitData?.data?.weeklyData?.length > 0) {
            // Get the most recent data
            const weeklyData = fitbitData.data.weeklyData;
            const sortedWeeklyData = [...weeklyData].sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
            const recentData = sortedWeeklyData[0];
            
            // Extract sleep data
            const recentSleepData = sortedWeeklyData.find(
              (day) => day.sleep?.sleepRecords?.length > 0
            );
            const recentSleepRecord = recentSleepData?.sleep?.sleepRecords?.[0] || null;
            
            // Update baseline metrics with actual data
            setBaselineMetrics({
              heartRate: recentData?.activity?.summary?.restingHeartRate || 70,
              sleepHours: recentSleepRecord?.minutesAsleep 
                ? parseFloat((recentSleepRecord.minutesAsleep / 60).toFixed(1))
                : 7,
              stressLevel: 3, // Default as this isn't available in the data
              bloodSugar: Math.floor(Math.random() * (140 - 80 + 1)) + 80, // Random value since it's not in the API
              bloodPressure: { systolic: 120, diastolic: 80 }, // Default values
              dailySteps: recentData?.activity?.summary?.steps || 8000,
              activeMinutes: recentData?.activity?.summary?.lightlyActiveMinutes || 30,
              healthScore: userData?.user?.healthData?.healthScore || 85
            });
          }
          
          setUserData({...userData, fitbitData});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load your health data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle running the simulation with Google Generative AI
  const runSimulation = async () => {
    if (!scenario.trim()) return;
    
    setIsSimulating(true);
    setError(null);
    
    try {
      // Prepare the input data for the AI
      const inputData = {
        scenario: scenario,
        baselineMetrics: baselineMetrics
      };
      
      // Configure the generation parameters
      const generationConfig = {
        temperature: 0.15,
        topP: 0.95,
        maxOutputTokens: 8192,
      };
      
      // Create a chat session and send the message
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
      
      const result = await chatSession.sendMessage(JSON.stringify(inputData));
      let responseText = result.response.text();
      
      // Clean up the response text (remove markdown code blocks if present)
      responseText = responseText.replace(/```json|```/g, "").trim();
      
      // Parse the JSON response
      const aiResponse = JSON.parse(responseText);
      console.log("AI Response:", aiResponse);
      
      // Update the simulation results
      setSimulationResults({
        ...aiResponse,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Simulation error:", error);
      setError("An error occurred during the simulation. Please try again.");
    } finally {
      setIsSimulating(false);
    }
  };
  
  // Reset the simulation
  const resetSimulation = () => {
    setSimulationResults(null);
    setScenario('');
    setError(null);
  };
  
  // Prepare data for the comparison chart
  const prepareChartData = () => {
    if (!simulationResults) return [];
    
    const metrics = [
      { name: 'Heart Rate', baseline: baselineMetrics.heartRate, simulated: simulationResults.updatedMetrics.heartRate },
      { name: 'Sleep Hours', baseline: baselineMetrics.sleepHours, simulated: simulationResults.updatedMetrics.sleepHours },
      { name: 'Stress Level', baseline: baselineMetrics.stressLevel, simulated: simulationResults.updatedMetrics.stressLevel },
      { name: 'Blood Sugar', baseline: baselineMetrics.bloodSugar, simulated: simulationResults.updatedMetrics.bloodSugar },
      { name: 'Active Minutes', baseline: baselineMetrics.activeMinutes, simulated: simulationResults.updatedMetrics.activeMinutes },
      { name: 'Health Score', baseline: baselineMetrics.healthScore, simulated: simulationResults.updatedMetrics.healthScore }
    ];
    
    return metrics;
  };

  // Calculate changes for metrics
  const getMetricChange = (baseline, simulated) => {
    const change = simulated - baseline;
    const isPositive = change >= 0;
    return { 
      value: Math.abs(change), 
      isPositive, 
      icon: isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
    };
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
              <h1 className="text-2xl font-bold text-indigo-800 mb-2">Loading Health Data</h1>
              <p className="text-gray-600">Please wait while we retrieve your latest health metrics...</p>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <Skeleton className="h-8 w-3/4 mx-auto rounded-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-24 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
            </div>
            <Skeleton className="h-10 w-40 mx-auto rounded-md mt-6" />
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2 text-indigo-800">AI Health Simulator</h1>
        <p className="text-gray-600 text-center mb-6">
          Enter a real-life scenario to see how your body might respond, powered by AI
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-6 border border-red-200 bg-red-50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </div>
          </Alert>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Describe a scenario:</label>
          <Textarea
            placeholder="Example: I haven't slept for the past 30 hours, or I've been exercising intensely for 2 weeks"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="w-full h-24 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <label className="block text-sm font-medium text-gray-700">Resting Heart Rate: <span className="font-semibold">{baselineMetrics.heartRate} BPM</span></label>
            </div>
            <Slider
              value={[baselineMetrics.heartRate]}
              min={40}
              max={120}
              step={1}
              onValueChange={(val) => setBaselineMetrics({...baselineMetrics, heartRate: val[0]})}
              className="my-2"
            />
            <p className="text-xs text-gray-500 mt-1">Normal range: 60-100 BPM</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-5 h-5 text-indigo-400" />
              <label className="block text-sm font-medium text-gray-700">Sleep Hours: <span className="font-semibold">{baselineMetrics.sleepHours}</span></label>
            </div>
            <Slider
              value={[baselineMetrics.sleepHours]}
              min={0}
              max={12}
              step={0.5}
              onValueChange={(val) => setBaselineMetrics({...baselineMetrics, sleepHours: val[0]})}
              className="my-2"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 7-9 hours</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-green-500" />
              <label className="block text-sm font-medium text-gray-700">Daily Steps: <span className="font-semibold">{baselineMetrics.dailySteps.toLocaleString()}</span></label>
            </div>
            <Slider
              value={[baselineMetrics.dailySteps]}
              min={0}
              max={20000}
              step={500}
              onValueChange={(val) => setBaselineMetrics({...baselineMetrics, dailySteps: val[0]})}
              className="my-2"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 8,000-10,000 steps</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-amber-500" />
              <label className="block text-sm font-medium text-gray-700">Blood Sugar: <span className="font-semibold">{baselineMetrics.bloodSugar} mg/dL</span></label>
            </div>
            <Slider
              value={[baselineMetrics.bloodSugar]}
              min={70}
              max={200}
              step={1}
              onValueChange={(val) => setBaselineMetrics({...baselineMetrics, bloodSugar: val[0]})}
              className="my-2"
            />
            <p className="text-xs text-gray-500 mt-1">Normal fasting range: 70-100 mg/dL</p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            disabled={!scenario || isSimulating} 
            onClick={runSimulation}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6 py-2 rounded-full shadow-md transition-all duration-200 transform hover:scale-105"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Consulting AI...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run AI Simulation
              </>
            )}
          </Button>
        </div>
      </Card>
      
      {simulationResults && (
        <Card className="p-6 mb-8 border-0 shadow-lg bg-white overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-indigo-600" />
              AI Simulation Results
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetSimulation}
              className="text-gray-600 hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>
          
          {/* Comparison Chart with enhanced styling */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-indigo-600" />
              Health Metrics Comparison
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsBarChart
                data={prepareChartData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                barCategoryGap="20%"
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#4b5563', fontSize: 12 }}
                  tickLine={{ stroke: '#9ca3af' }}
                  axisLine={{ stroke: '#9ca3af' }}
                />
                <YAxis 
                  tick={{ fill: '#4b5563', fontSize: 12 }}
                  tickLine={{ stroke: '#9ca3af' }}
                  axisLine={{ stroke: '#9ca3af' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: 10 }}
                  iconType="circle"
                />
                <Bar 
                  dataKey="baseline" 
                  name="Baseline" 
                  fill="#60a5fa" 
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList dataKey="baseline" position="top" fill="#3b82f6" fontSize={12} />
                </Bar>
                <Bar 
                  dataKey="simulated" 
                  name="Simulated" 
                  fill="#f87171" 
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList dataKey="simulated" position="top" fill="#ef4444" fontSize={12} />
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Metric Changes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {prepareChartData().map((metric) => {
              const change = getMetricChange(metric.baseline, metric.simulated);
              return (
                <div 
                  key={metric.name} 
                  className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col"
                >
                  <span className="text-sm text-gray-600 mb-1">{metric.name}</span>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{metric.simulated}</span>
                    <div className={`flex items-center text-xs ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {change.icon}
                      <span className="ml-1">{change.value.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Potential Risks
              </h3>
              {simulationResults.potentialRisks && simulationResults.potentialRisks.length > 0 ? (
                <ul className="space-y-3">
                  {simulationResults.potentialRisks.map((risk, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{risk}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center text-gray-600 bg-gray-100 p-3 rounded">
                  <Info className="w-5 h-5 mr-2 text-blue-500" />
                  No significant risks detected
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Health Impacts
              </h3>
              {simulationResults.healthImpacts && simulationResults.healthImpacts.length > 0 ? (
                <ul className="space-y-3">
                  {simulationResults.healthImpacts.map((impact, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{impact}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center text-gray-600 bg-gray-100 p-3 rounded">
                  <Info className="w-5 h-5 mr-2 text-blue-500" />
                  No significant health impacts detected
                </div>
              )}
            </div>
          </div>
          
          {/* Explanations Section with improved styling */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              AI Analysis
            </h3>
            <Card className="p-5 bg-indigo-50 border border-indigo-100">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {simulationResults.overallSummary || "No detailed explanation provided by the AI."}
              </p>
            </Card>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center text-xs text-gray-500">
              <Info className="w-4 h-4 mr-2 text-gray-400" />
              <p>
                Simulation generated at {new Date(simulationResults.timestamp).toLocaleString()}. 
                This is an AI-powered simulation and should not be used for actual medical decisions.
                Always consult with healthcare professionals for medical advice.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HealthSimulator;