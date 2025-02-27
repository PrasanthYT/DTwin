import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";

// import SugarSpikeAnalyzer from "../ai/SugarspikeAnalyzier";
import {
  ChevronLeft,
  FolderCog,
  Plus,
  ArrowUpRight,
  Utensils,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(100);
  const selected_Food = localStorage.getItem("selectedFood");
  const [caloriesBurnt, setCaloriesBurnt] = useState(0);
  const [hrv, setHrv] = useState(0);
  const [sleepScore, setSleepScore] = useState(0);
  const [fastingGlucose, setFastingGlucose] = useState(0);
  const [caloriesEaten, setCaloriesEaten] = useState(0);
  const [metabolicScore, setMetabolicScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sugarspike, setSugarspike] = useState();
  const apiKey = "AIzaSyDK1ktNxAi5UPMZSSivCJcXxFjyxz483gA";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      '    systemInstruction: "The AI should analyze the user\'s meal data and predict the expected glucose spike in mg/dL within 60 minutes.\\n\\nInput Data:\\nThe AI will receive JSON input containing meal details, including:\\n- Dish Name: The name of the food item consumed.\\n- Quantity: The amount of the food item in grams or milliliters.\\n- Glycemic Index (GI): The food’s GI value.\\n- Glycemic Load (GL): The food’s GL value.\\n- Pre-meal Glucose Level (Optional): The user’s glucose level before eating.\\n\\nOutput Format:\\nThe AI must return a JSON response containing:\\n- glucoseSpike: A numerical value representing the predicted glucose spike in mg/dL.\\n\\nProcessing Rules:\\n- The prediction should be based on scientific research on GI, GL, and meal absorption rates.\\n- If pre-meal glucose data is provided, adjust the prediction dynamically based on the expected body response.\\n- The response must be a valid JSON object containing only the glucose spike value.\\n\\nExample JSON Response:\\n{\\n  \\"glucoseSpike\\": 45\\n}\\n\\nIntegration Notes:\\n- The AI should provide only the numerical glucose spike prediction, with no additional text or recommendations.\\n- The response format should always be strictly JSON.\\n- The model should use structured calculations based on meal data and past research.\\n",\n',
  });

  const generationConfig = {
    temperature: 0.35,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const [foodData, setFoodData] = useState(
    location.state ||
      JSON.parse(localStorage.getItem("selectedFood")) || {
        name: "Dosa",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpukhyE3yqkxdv1lw29iVKSqIPj9WZNfi6wA&s",
        calories: 168,
        protein: 3.9,
        carbohydrates: 28.2,
        fat: 3.7,
        glycemicIndex: 77,
        glycemicLoad: 14,
        fiber: 2.6,
        sugar: 14,
      }
  );
  const mealInput = {
    dishName: foodData.name,
    quantity: quantity,
    glycemicIndex: foodData.glycemicIndex,
    glycemicLoad: foodData.glycemicLoad,
    preMealGlucose: foodData.sugar,
  };
  async function SugarSpikeAnalyzer() {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: 'dishName\n: \n"Paneer Butter Masala"\nglycemicIndex\n: \n55\nglycemicLoad\n: \n8\npreMealGlucose\n: \n90\nquantity\n: \n2',
            },
          ],
        },
        {
          role: "model",
          parts: [{ text: '```json\n{\n  "glucoseSpike": 38\n}\n```\n' }],
        },
        {
          role: "user",
          parts: [
            {
              text: 'dishName\n:\n"Paneer Butter Masala"\nglycemicIndex\n:\n55\nglycemicLoad\n:\n8\npreMealGlucose\n:\n90\nquantity\n:\n2',
            },
          ],
        },
        {
          role: "model",
          parts: [{ text: '```json\n{\n  "glucoseSpike": 38\n}\n```' }],
        },
      ],
    });

    const result = await chatSession.sendMessage(JSON.stringify(mealInput));
    let responseText = result.response.text();
    responseText = responseText.replace(/```json|```/g, "").trim();

    try {
      let parsedResponse = JSON.parse(responseText);
      let glucoseSpike = parsedResponse.glucoseSpike;
      setSugarspike(glucoseSpike);
      console.log(glucoseSpike); // This will print 52
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  useEffect(() => {
    if (!foodData) {
      navigate("/search");
    } else {
      localStorage.setItem("selectedFood", JSON.stringify(foodData));
      SugarSpikeAnalyzer(mealInput);
    }
  }, [foodData]);

  const handleBack = () => navigate("/search");

  // ✅ Dynamically scale food values based on quantity
  const scaledFoodData = {
    ...foodData,
    calories: ((foodData.calories * quantity) / 100).toFixed(1),
    protein: ((foodData.protein * quantity) / 100).toFixed(1),
    carbohydrates: ((foodData.carbs * quantity) / 100).toFixed(1),
    fat: ((foodData.fat * quantity) / 100).toFixed(1),
    fiber: ((foodData.fiber * quantity) / 100).toFixed(1),
    sugar: ((foodData.sugar * quantity) / 100).toFixed(1),
  };

  const nutritionData = [
    {
      name: "Carbohydrate",
      value: foodData.carbs || 0,
      color: "#9333ea",
    },
    { name: "Protein", value: foodData.protein || 0, color: "#ef4444" },
    { name: "Fat", value: foodData.fat || 0, color: "#eab308" },
  ];

  const totalCalories = scaledFoodData.calories;

  useEffect(() => {
    fetchMetabolicData();
  }, []);

  const fetchMetabolicData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.userId;
      if (!userId) throw new Error("Invalid token: User ID not found");

      // ✅ Fetch Fitbit Data
      const fitbitResponse = await axios.get(
        "https://dtwin.onrender.com/api/fitbit/get",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fitbitData = fitbitResponse.data.data.weeklyData[0]; // Latest Fitbit data

      const caloriesOut = fitbitData.activity.summary.caloriesOut;
      const restingHR = fitbitData.activity.summary.restingHeartRate;
      const sleepScore = fitbitData.sleep.sleepRecords?.[0]?.efficiency || 0; // ✅ Corrected sleep score extraction

      setCaloriesBurnt(caloriesOut);
      setHrv(fitbitData.hrv?.value || 55); // ✅ Set HRV from Fitbit API if available
      setSleepScore(sleepScore);

      // ✅ Fetch Glucose Data (Fixed API Call)
      const glucoseResponse = await axios.get(
        `https://dtwin.onrender.com/api/glucose/get?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const latestGlucose = glucoseResponse.data.data?.[0]?.glucoseLevel || 0;
      setFastingGlucose(latestGlucose);

      // ✅ Calculate Metabolic Score
      const score = calculateMetabolicScore(
        caloriesOut,
        restingHR,
        latestGlucose,
        sleepScore,
        totalCalories
      );
      setMetabolicScore(score);
    } catch (error) {
      console.error("❌ Error fetching metabolic data:", error);
      setError("Failed to load metabolic data.");
    } finally {
      setLoading(false);
    }
  };

  function calculateMetabolicScore(
    caloriesBurnt,
    hrv,
    fastingGlucose,
    sleepScore,
    caloriesEaten
  ) {
    const tef = caloriesEaten * 0.1;
    const adaptiveThermogenesis = hrv + fastingGlucose + sleepScore;
    const rawScore = caloriesBurnt + adaptiveThermogenesis + tef;
    const maxPossibleScore = 5000; // Adjust this based on expected ranges
    let metabolicScore = (rawScore / maxPossibleScore) * 100;
    metabolicScore = Math.max(0, Math.min(100, metabolicScore));
    return Math.round(metabolicScore);
  }

  // Example usage
  // const metabolicScore = calculateMetabolicScore(2000, 50, 90, 80, 600);

  const metabolicData = [
    { time: "Morning", level: 70 },
    { time: "Afternoon", level: 85 },
    { time: "Evening", level: 78 },
    { time: "Night", level: 65 },
  ];

  const sugarSpikeData = [
    { time: "0h", glucose: 95 },
    { time: "0.5h", glucose: 140 },
    { time: "1h", glucose: 160 },
    { time: "1.5h", glucose: 130 },
    { time: "2h", glucose: 105 },
    { time: "2.5h", glucose: 90 },
  ];

  // const metabolicScore =
  //   metabolicData[metabolicData.length - 1].level - metabolicData[0].level;
  const isPositiveScore = metabolicScore >= 30;

  const handleQuantityChange = (e) => {
    let newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity <= 0) newQuantity = 1; // Prevents negative or zero values
    setQuantity(newQuantity);
  };

  const handleAddFood = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return toast.error("Please login first");

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      await axios.post(
        "https://dtwin.onrender.com/api/food/add",
        { userId, ...scaledFoodData, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Food added successfully!");
    } catch (error) {
      console.error("Error adding food:", error);
      toast.error("Failed to add food.");
    }
  };

  const ScoreDisplay = ({ score }) => (
    <Badge
      className={`flex items-center gap-1 px-3 py-1.5 text-lg font-bold ${
        score >= 30 ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {score >= 30 ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ArrowDown className="h-4 w-4" />
      )}
      <span className="text-xl">{Math.abs(score)}</span>
      <span className="text-sm font-medium text-gray-200">Units</span>
    </Badge>
  );

  const SugarSpikeIndicator = ({ currentValue, baselineValue }) => {
    const difference = currentValue - baselineValue; // ✅ Ensure calculation is correct
    return (
      <Badge
        className={`flex items-center gap-1 px-3 py-1.5 text-lg font-bold 
          ${
            difference >= 0
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }
        `}
      >
        {difference >= 0 ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
        <span className="text-xl">{Math.abs(difference)}</span>
        <span className="text-sm font-medium text-gray-200">mg/dL</span>
      </Badge>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white relative z-10">
      <div className="relative h-64 rounded-b-xl shadow-lg overflow-hidden">
        <img
          src={foodData.image}
          alt={foodData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white/100 rounded-xl shadow-md"
          onClick={handleBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <Card className="mx-4 -mt-8 relative border-0 rounded-xl shadow-xl">
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {foodData.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">
                    {scaledFoodData.calories} cal
                  </Badge>
                  <Badge variant="outline">{quantity} g</Badge>
                </div>
              </div>
              <Badge
                className={
                  foodData.glycemicIndex <= 40 && foodData.glycemicLoad <= 10
                    ? "bg-green-700" // 🟢 Good Impact
                    : "bg-red-700" // 🔴 Bad Impact
                }
              >
                {foodData.glycemicIndex <= 40 && foodData.glycemicLoad <= 10
                  ? "Good Impact"
                  : "Bad Impact"}
              </Badge>
            </div>
          </div>

          {/* ✅ Functional Quantity Input */}
          <div className="flex gap-4 items-center">
            <Input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="text-center w-24 border border-gray-300 rounded-md p-2"
            />
            <Button className="flex-1 bg-blue-700" onClick={handleAddFood}>
              <Plus className="mr-2 h-4 w-4" /> Add Food
            </Button>
          </div>

          {/* Nutritional Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Nutritional Content</h3>
            <div className="flex flex-col items-center">
              <PieChart width={200} height={200}>
                <Pie
                  data={nutritionData}
                  cx={100}
                  cy={100}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {nutritionData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="text-center mt-2">
                <div className="text-xl font-bold">
                  {Math.round(totalCalories)}
                </div>
                <div className="text-sm text-gray-500">CALORIES</div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Carbohydrate (g)</span>
              <span>{scaledFoodData.carbohydrates}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Dietary fiber (g)</span>
              <span>{scaledFoodData.fiber || "N/A"}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Sugars (g)</span>
              <span>{scaledFoodData.sugar || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Protein (g)</span>
              <span>{scaledFoodData.protein}</span>
            </div>
          </div>

          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full" variant="outline">
                View Metabolic Impact
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Metabolic Impact Analysis</DrawerTitle>
                  <DrawerDescription>
                    Analyze how this food affects your metabolic health
                  </DrawerDescription>
                </DrawerHeader>

                <div className="p-4 space-y-6">
                  {/* Metabolic Score Section */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Metabolic Score</h3>
                    <div className="relative w-full h-48 bg-gray-50 rounded-xl">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={metabolicData}
                          margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis dataKey="time" className="text-sm" />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="level"
                            stroke="#4f46e5"
                            fill="#c7d2fe"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>

                      {/* Metabolic Score Badge */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ScoreDisplay score={metabolicScore} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Sugar Spike Section */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">
                      Predicted Glucose Response
                    </h3>
                    <div className="relative w-full h-48 bg-gray-50 rounded-xl">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={sugarSpikeData}
                          margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis dataKey="time" className="text-sm" />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="glucose"
                            stroke="#f59e0b"
                            fill="#fde68a"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>

                      {/* Sugar Spike Badge */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <SugarSpikeIndicator
                          currentValue={
                            sugarSpikeData[sugarSpikeData.length - 1].glucose
                          }
                          baselineValue={sugarSpikeData[0].glucose}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <DrawerFooter>
                  {isPositiveScore ? (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleAddFood}
                    >
                      <Utensils className="mr-2 h-4 w-4" /> Add to Food Log
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="secondary"
                      size="lg"
                      onClick={() => navigate("/alternativefood")}
                    >
                      <ArrowUpRight className="mr-2 h-4 w-4" /> See Healthy
                      Swaps
                    </Button>
                  )}
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchResults;
