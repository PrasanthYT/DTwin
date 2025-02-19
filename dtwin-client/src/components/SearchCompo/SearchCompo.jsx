import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_KEY = "f0a387d9c1604a82af7ab6e765417a33";
  const API_URL = "https://api.spoonacular.com/food/ingredients/search";

  const dummyFoods = [
    {
      id: 1,
      name: "Dosa",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpukhyE3yqkxdv1lw29iVKSqIPj9WZNfi6wA&s",
      calories: 168,
      protein: 3.9,
      carbs: 28.2,
      fat: 3.7,
      glycemicIndex: 77,
      glycemicLoad: 14,
      fiber: 2.6,
      sugar: 14
    },
    {
      id: 2,
      name: "Paneer Butter Masala",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE2i0uRJZ9gTQXx5eJARrReUI82gHpDwC4xA&s",
      calories: 320,
      protein: 12,
      carbs: 14,
      fat: 25,
      glycemicIndex: 55,
      glycemicLoad: 8,
      fiber: 3,
      sugar: 6
    },
    {
      id: 3,
      name: "Biryani",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtDiMiok2ektyhL9ZFNhPX3psPNJKIaVY3Ng&s",
      calories: 290,
      protein: 12,
      carbs: 45,
      fat: 7,
      glycemicIndex: 65,
      glycemicLoad: 20,
      fiber: 2.5,
      sugar: 5
    },
    {
      id: 4,
      name: "Samosa",
      image: "https://www.cookrepublic.com/wp-content/uploads/2021/08/airfryer-veg-samosa02-500x500.jpg",
      calories: 262,
      protein: 5,
      carbs: 32,
      fat: 13,
      glycemicIndex: 60,
      glycemicLoad: 18,
      fiber: 3,
      sugar: 2
    },
    {
      id: 5,
      name: "Chole Bhature",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLV7xAZVR-Kq2eFVM7H5HDiaHRESqwCeu40w&s",
      calories: 450,
      protein: 12,
      carbs: 50,
      fat: 20,
      glycemicIndex: 70,
      glycemicLoad: 35,
      fiber: 10,
      sugar: 8
    },
    {
      id: 6,
      name: "Palak Paneer",
      image: "https://www.chefajaychopra.com/assets/img/recipe/1-1666433552palakpaneer1webp.webp",
      calories: 240,
      protein: 10,
      carbs: 12,
      fat: 18,
      glycemicIndex: 38,
      glycemicLoad: 5,
      fiber: 4,
      sugar: 4
    },
    {
      id: 7,
      name: "Butter Chicken",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQfysu3jzv-y7psPTFkWdSQpZPFyr0qjd3jw&s",
      calories: 490,
      protein: 32,
      carbs: 14,
      fat: 35,
      glycemicIndex: 55,
      glycemicLoad: 8,
      fiber: 2,
      sugar: 6
    },
    {
      id: 8,
      name: "Aloo Gobi",
      image: "https://example.com/aloo_gobi.jpg",
      calories: 150,
      protein: 4,
      carbs: 20,
      fat: 6,
      glycemicIndex: 60,
      glycemicLoad: 12,
      fiber: 5,
      sugar: 4
    },
    {
      id: 9,
      name: "Rogan Josh",
      image: "https://example.com/rogan_josh.jpg",
      calories: 350,
      protein: 30,
      carbs: 10,
      fat: 20,
      glycemicIndex: 50,
      glycemicLoad: 5,
      fiber: 3,
      sugar: 2
    },
    {
      id: 10,
      name: "Tandoori Chicken",
      image: "https://example.com/tandoori_chicken.jpg",
      calories: 265,
      protein: 30,
      carbs: 3,
      fat: 15,
      glycemicIndex: 45,
      glycemicLoad: 2,
      fiber: 1,
      sugar: 1
    },
    {
      id: 11,
      name: "Naan",
      image: "https://example.com/naan.jpg",
      calories: 262,
      protein: 8,
      carbs: 50,
      fat: 5,
      glycemicIndex: 70,
      glycemicLoad: 35,
      fiber: 2,
      sugar: 2
    },
    {
      id: 12,
      name: "Gulab Jamun",
      image: "https://example.com/gulab_jamun.jpg",
      calories: 150,
      protein: 2,
      carbs: 30,
      fat: 5,
      glycemicIndex: 75,
      glycemicLoad: 20,
      fiber: 0,
      sugar: 25
    },
    {
      id: 13,
      name: "Jalebi",
      image: "https://example.com/jalebi.jpg",
      calories: 150,
      protein: 1,
      carbs: 35,
      fat: 5,
      glycemicIndex: 80,
      glycemicLoad: 25,
      fiber: 0,
      sugar: 30
    },
    {
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
      sugar: 5
    },
    {
      id: 15,
      name: "Masala Dosa",
      image: "https://example.com/masala_dosa.jpg",
      calories: 206,
      protein: 4,
      carbs: 32,
      fat: 7,
      glycemicIndex: 77,
      glycemicLoad: 16,
      fiber: 3,
      sugar: 2
    },
    {
      id: 16,
      name: "Idli",
      image: "https://example.com/idli.jpg",
      calories: 58,
      protein: 2,
      carbs: 12,
      fat: 0.4,
      glycemicIndex: 70,
      glycemicLoad: 8,
      fiber: 0.5,
      sugar: 0.5
    },
    {
      id: 17,
      name: "Vada Pav",
      image: "https://example.com/vada_pav.jpg",
      calories: 300,
      protein: 6,
      carbs: 40,
      fat: 12,
      glycemicIndex: 70,
      glycemicLoad: 28,
      fiber: 4,
      sugar: 4
    },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await axios.get(API_URL, {
        params: { query, number: 1, apiKey: API_KEY },
      });

      if (response.data.results.length === 0) {
        toast.error("No results found!");
        setLoading(false);
        return;
      }

      const foodItem = response.data.results[0];
      const nutritionResponse = await axios.get(
        `https://api.spoonacular.com/food/ingredients/${foodItem.id}/information`,
        { params: { amount: 100, unit: "g", apiKey: API_KEY } }
      );
      const glycemicResponse = await axios.post(
        `https://api.spoonacular.com/food/ingredients/glycemicLoad`,
        { ingredients: [query] },
        {
          headers: { "Content-Type": "application/json" },
          params: { apiKey: API_KEY },
        }
      );

      const newFood = {
        id: foodItem.id,
        name: foodItem.name,
        image: `https://spoonacular.com/cdn/ingredients_250x250/${foodItem.image}`,
        calories: nutritionResponse.data.nutrition.nutrients.find(
          (n) => n.name === "Calories"
        )?.amount,
        protein: nutritionResponse.data.nutrition.nutrients.find(
          (n) => n.name === "Protein"
        )?.amount,
        carbohydrates: nutritionResponse.data.nutrition.nutrients.find(
          (n) => n.name === "Carbohydrates"
        )?.amount,
        fat: nutritionResponse.data.nutrition.nutrients.find(
          (n) => n.name === "Fat"
        )?.amount,
        glycemicIndex: glycemicResponse.data.ingredients[0]?.glycemicIndex || "N/A",
        glycemicLoad: glycemicResponse.data.ingredients[0]?.glycemicLoad || "N/A",
        fiber: nutritionResponse.data.nutrition.nutrients.find(
          (n) => n.name === "Fiber"
        )?.amount || 0,
        sugar: nutritionResponse.data.nutrition.nutrients.find(
          (n) => n.name === "Sugar"
        )?.amount || 0,
      };

      setResults([newFood]);
    } catch (error) {
      console.error("Error fetching food data:", error);
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFoodClick = (food) => {
    navigate("/searchResults", { state: food });
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-blue-600 p-4 rounded-b-3xl mb-4">
        <header className="sticky top-0 z-10 bg-blue-600 text-white py-2.5 flex items-center gap-3 w-full">
          <ChevronLeft onClick={handleBack} className="w-10 h-8 cursor-pointer" />
          <h1 className="text-[1.5rem] font-semibold">Search</h1>
        </header>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for food..."
            className="pl-9 bg-white w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div className="px-4 md:px-8">
        <h2 className="text-lg font-semibold mb-4">
          {results.length + dummyFoods.length} Results
        </h2>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        <div className="space-y-3">
          {[...results, ...dummyFoods].map((food, index) => (
            <Card key={index} className="p-4 cursor-pointer" onClick={() => handleFoodClick(food)}>
              <div className="flex items-center gap-4">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{food.name}</h3>
                  <p>Calories: {food.calories} kcal</p>
                  <p>Carbs: {food.carbohydrates} g</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
