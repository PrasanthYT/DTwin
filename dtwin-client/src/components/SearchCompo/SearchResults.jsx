import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SugarSpikeAnalyzer from "../ai/SugarspikeAnalyzier";
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


const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(100);
  const selected_Food = localStorage.getItem("selectedFood")
  const [sugarspike, setSugarspike] = useState();

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
    dishName:foodData.name ,
    quantity: 250,
    glycemicIndex: foodData.glycemicIndex,
    glycemicLoad: foodData.glycemicLoad,
    preMealGlucose: 90,
};

  useEffect(() => {
    if (!foodData) {
      navigate("/search");
    } else {
      localStorage.setItem("selectedFood", JSON.stringify(foodData));
      setSugarspike(SugarSpikeAnalyzer(mealInput))


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
  const metabolicScore = calculateMetabolicScore(2000, 50, 90, 80, 600);

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
  const isPositiveScore = metabolicScore >= 0;

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
        "http://localhost:4200/api/food/add",
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
      variant={score >= 0 ? "success" : "destructive"}
      className="flex items-center gap-1 px-3 py-1.5 text-lg font-bold"
    >
      {score >= 0 ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ArrowDown className="h-4 w-4" />
      )}
      <span className="text-xl">{Math.abs(score)}</span>
      <span className="text-sm font-medium text-gray-200">Units</span>
    </Badge>
  );

  const SugarSpikeIndicator = ({ currentValue, baselineValue }) => {
    const difference = sugarspike;
    return (
      <Badge
        variant={difference >= 0 ? "success" : "destructive"}
        className="flex items-center gap-1 px-3 py-1.5 text-lg font-bold"
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
                      onClick={() => navigate("/healthy-swaps")}
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
