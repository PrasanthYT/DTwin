import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const foodData = location.state;

  if (!foodData) {
    navigate("/search");
    return null;
  }

  const nutritionData = [
    { name: "Carbohydrate", value: parseFloat(foodData.carbohydrates) || 0, color: "#9333ea" },
    { name: "Protein", value: parseFloat(foodData.protein) || 0, color: "#ef4444" },
    { name: "Fat", value: parseFloat(foodData.fat) || 0, color: "#eab308" }
  ];

  const totalCalories = nutritionData.reduce((sum, item) => {
    const caloriesPerGram = item.name === "Fat" ? 9 : 4;
    return sum + item.value * caloriesPerGram;
  }, 0);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddFood = async () => {
  try {
    // Get token from local storage (or context if you're using React state management)
    const token = localStorage.getItem("token");
    console.log(token) // Ensure you're storing the token after login

    if (!token) {
      alert("User not authenticated!");
      return;
    }

    // Decode the token to extract the user ID
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decoding JWT payload
    const userId = decodedToken.userId; // Extract userId from JWT payload

    const response = await axios.post(
      "http://localhost:4200/api/food/add",
      {
        userId,
        name: foodData.name,
        calories: foodData.calories,
        carbohydrates: foodData.carbohydrates,
        protein: foodData.protein,
        fat: foodData.fat,
        quantity: 100,
      },
      {
        headers: { Authorization: `Bearer ${token}` }, // Send token in headers
      }
    );

    alert("Food added successfully!");
    console.log(response.data);
  } catch (error) {
    console.error("Error adding food:", error);
    alert("Failed to add food.");
  }
};

  return (
    <div className="max-w-md mx-auto bg-white">
      <div className="relative h-48">
        <img src={foodData.image} alt={foodData.name} className="w-full h-full object-cover rounded-t-lg" />
        <button className="absolute top-4 left-4 text-white" onClick={handleBack}>
          <ChevronLeft size={24} className="text-white" />
        </button>
      </div>

      <Card className="border-0 rounded shadow-none">
        <CardContent className="p-5 border-t-2 rounded-t-xl z-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">{foodData.name}</h2>
              <p className="text-gray-500">100.00gm | {foodData.calories} cal</p>
            </div>

            <div className="flex gap-4 px-2 items-center justify-between">
              <div className="relative flex justify-start w-[8rem]">
                <input type="text" value="100" className="w-[5rem] p-2 border rounded-lg text-center" readOnly />
                <span className="absolute right-3 top-2.5 text-gray-400">g</span>
              </div>
              <Button className="bg-red-400 hover:bg-red-500 text-white px-6 w-[9rem]" onClick={handleAddFood}>
                Add food
              </Button>
            </div>

            <div className="">
              <h3 className="text-lg font-medium mb-4">What it contains</h3>
              <div className="flex items-center justify-around py-3 relative">
                <div className="relative">
                  <div className="flex relative right-[10%] w-[11rem]">
                    <PieChart width={200} height={200}>
                      <Pie data={nutritionData} cx={100} cy={100} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                        {nutritionData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                  <div className="absolute top-1/2 left-[42%] transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-xl font-bold">{Math.round(totalCalories)}</div>
                    <div className="text-sm flex items-center text-gray-500">CALORIES</div>
                  </div>
                </div>

                <div className="space-y-2 mt-4 w-[11rem]">
                  {nutritionData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span>{item.value}g</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span>Carbohydrate (g)</span>
                  <span>{foodData.carbohydrates}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Dietary fiber (g)</span>
                  <span>{foodData.fiber || "N/A"}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Sugars (g)</span>
                  <span>{foodData.sugars || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Protein (g)</span>
                  <span>{foodData.protein}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchResults;
