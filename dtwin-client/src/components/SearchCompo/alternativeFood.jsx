import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";

const FoodAlternatives = ({ foodData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alternatives, setAlternatives] = useState([]);
  const [error, setError] = useState(null);

  const handleFoodClick = (food) => {
    navigate("/searchResults", { state: { ...food } });
  };
  const getUnsplashImage = async (query) => {
    try {
      const accessKey = "I_ZvZeggu4I1aaGi4lx2xMUd8CIRKrlqHgjzCIHbt7I";
      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(query)}&per_page=1&orientation=squarish`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        }
      );
  
      const data = await response.json();
      return data.results?.[0]?.urls?.regular || 'https://via.placeholder.com/150';
    } catch (error) {
      console.error('Unsplash API Error:', error);
      return 'https://via.placeholder.com/150';
    }
  };
  const fetchAlternatives = async (foodItem) => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyBdwqtlWDMCKv_hvJX4tVAFA6pGV8k9Ojk"
      );

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: `When provided with a food item in the following format:

{
  id: [number],
  name: "[Food Name]",
  image: "[Image URL]",
  calories: [number],
  protein: [number],
  carbs: [number],
  fat: [number],
  glycemicIndex: [number],
  glycemicLoad: [number],
  fiber: [number],
  sugar: [number],
  userMetabolism: [0 - 100 value where 100 is best and 0 is worst]
}

Your task is to suggest a list of alternative 3 foods that:

1. Have similar caloric content.
2. Possess a lower glycemic index.
3. Closely resemble the taste profile of the original food.
4. Are healthier options compared to the original item.

Each suggested food should be presented in the same format as the input, with accurate nutritional information. Ensure that the alternatives are appropriate for the user's metabolism and dietary preferences.
respond in list of JSON format 
[{
  id: [number],
  name: "[Food Name 2 words]",
  image: "[Image URL]",
  calories: [number],
  protein: [number],
  carbs: [number],
  fat: [number],
  glycemicIndex: [number],
  glycemicLoad: [number],
  fiber: [number],
  sugar: [number],
  reason: ["why this food is better in 20 words"]
}]`,
      });

      const generationConfig = {
        temperature: 0.15,
        topP: 0.95,
        maxOutputTokens: 8192,
      };

      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(JSON.stringify(foodItem));
      let responseText = result.response.text();
      responseText = responseText.replace(/```json|```/g, "").trim();
      const aiResponse = JSON.parse(responseText);
      console.log(aiResponse);
      const alternativesWithImages = await Promise.all(
        aiResponse.map(async (food) => ({
          ...food,
          image: await getUnsplashImage(food.name),
        }))
      );
      setAlternatives(alternativesWithImages);
    } catch (err) {
      setError("Failed to fetch alternatives: " + err.message);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!foodData) {
      fetchAlternatives({
        id: 14,
        name: "Pani Puri",
        image: "https://example.com/pani_puri.jpg",
        calories: 150,
        protein: 3,
        carbs: 25,
        fat: 5,
        glycemicIndex: 65,
        glycemicLoad: 15,
        fiber: 2,
        sugar: 5,
      });
    }
  }, [foodData]);

  //   if (!foodData) {
  //     return <div className="p-4">No food data provided</div>;
  //   }

  const handleBack = () => {
    navigate("/searchResults");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 p-4 rounded-b-3xl shadow-lg">
        <header className="sticky top-0 z-20 bg-blue-600 text-white py-2.5 flex items-center gap-3 w-full">
          <ChevronLeft
            onClick={handleBack}
            className="w-10 h-8 cursor-pointer hover:bg-blue-700 rounded-full p-1 transition-colors"
          />
          <h1 className="text-xl font-bold tracking-tight">
            Healthier Alternatives
          </h1>
        </header>
      </div>

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gray-200" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-4 bg-red-50 border-red-200 text-red-600 text-center">
            ⚠️ {error}
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Suggested Alternatives
            </h2>
            {alternatives &&
              alternatives.map((food) => (
                <Card
                  key={food.id}
                  onClick={() => handleFoodClick(food)}
                  className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {food.name}
                      </h3>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                          {food.calories} kcal
                        </span>
                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                          GI: {food.glycemicIndex}
                        </span>
                        <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full">
                          Protein: {food.protein}g
                        </span>
                      </div>
                      <div className="relative mt-2">
                        <p
                          className="text-sm text-gray-600 leading-tight line-clamp-2"
                          title={food.reason}
                        >
                          {food.reason}
                        </p>
                        {food.reason.length > 80 && (
                          <span className="absolute bottom-0 right-0 bg-white pl-1 text-blue-600 text-sm cursor-help">
                            ...
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 ml-2 transition-colors" />
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodAlternatives;
