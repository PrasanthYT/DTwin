import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchData from "../../lib/dummy.json";
import { FaPlus } from "react-icons/fa";
// import { BsArrowLeftSquare } from "react-icons/bs";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allData, setAllData] = useState(SearchData);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_KEY = "91ed0a11f18147dab60ff46998078997";
  const API_URL = "https://api.promptrepo.com/api/private/fuck-sheet5";

  useEffect(() => {
    if (!query.trim()) {
      setResults([]); // Clear results when search is empty
    }
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await axios.post(API_URL, [{ "Food Name": query }], {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });

      const formattedResults = response.data.map((item) => ({
        ...item,
        details: JSON.parse(
          item["Food Details (Glycemic Index, Protein, Carbohydrates)"]
        ),
      }));

      setResults(formattedResults.length > 0 ? formattedResults : []);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFoodClick = (food) => {
    navigate("/searchResults", {
      state: {
        name: food.name || food["Food Name"],
        calories: food.calories || food["Food Calorie"],
        image: food.image || food["Food Image"],
        protein: food.protein || food.details?.["Protein (g)"],
        carbohydrates:
          food.carbohydrates || food.details?.["Carbohydrates (g)"],
        fat: food.fat || food.details?.["Fat (g)"],
        fiber: food.fiber || food.details?.["Dietary Fiber (g)"],
        sugars: food.sugars || food.details?.["Sugars (g)"],
      },
    });
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-blue-600 p-4 rounded-b-3xl mb-4">
          <header className="
          sticky top-0 right-0 z-10 bg-blue-600 text-white py-2.5 flex items-center justify-start gap-3 w-full">
              <ChevronLeft className="w-10 h-8" />
            <h1 className="text-[1.5rem] font-semibold">Search</h1>
          </header>

          {/* Search Section */}
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for food..."
              className="pl-9 bg-white w-full rounded-md border border-input px-3 py-2"
            />
          </div>

          {/* Filter Tags */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide whitespace-nowrap">
            <div className="flex items-center align-center justify-around px-2 border-[1px] border-solid border-white rounded">
              <FaPlus className="w-3 h-3 text-white" />
              <Button
                size="sm"
                variant="secondary"
                className="whitespace-nowrap text-white bg-blue-600"
              >
                BreakFast
              </Button>
            </div>
            <div className="flex items-center align-center px-2 border-[1px] border-solid border-white rounded">
              <FaPlus className="w-3 h-3 text-white" />
              <Button
                size="sm"
                variant="secondary"
                className="whitespace-nowrap text-white bg-blue-600"
              >
                Lunch
              </Button>
            </div>
            <div className="flex items-center align-center px-2 border-[1px] border-solid border-white rounded">
              <FaPlus className="w-3 h-3 text-white" />
              <Button
                size="sm"
                variant="secondary"
                className="whitespace-nowrap text-white bg-blue-600"
              >
                Dinner
              </Button>
            </div>
            <div className="flex items-center align-center px-2 border-[1px] border-solid border-white rounded">
              <FaPlus className="h-3 w-3 text-white" />
              <Button
                size="sm"
                variant="secondary"
                className="whitespace-nowrap text-white bg-blue-600"
              >
                High Protein
              </Button>
            </div>
            
          </div>
        </div>

        {/* Results Section */}
        <div className="px-4 md:px-8 bg-grey-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {query
                ? `${results.length} Results`
                : `Popular Foods (${allData.length})`}
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              Newest <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          <div className="space-y-3">
            {allData && results.length > 0
              ? results.map((food, index) => (
                  <Card
                    key={index}
                    className="p-4"
                    onClick={() => handleFoodClick(food)}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={food["Food Image"]}
                          alt={food["Food Name"]}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {food["Food Name"]}
                            </h3>
                            {/* <p className="text-sm text-muted-foreground">
                            • {food["Food Type (Breakfast, Lunch, Dinner)"]}
                          </p> */}
                            <div className="mt-2 space-y-1 text-sm">
                              <p>Calories: {food["Food Calorie"]} kcal</p>
                              <p>
                                Protein:{" "}
                                {food.details?.["Protein (g)"] || "N/A"}g
                              </p>
                              <p>
                                Carbs:{" "}
                                {food.details?.["Carbohydrates (g)"] || "N/A"}g
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              : !loading &&
                query && (
                  <div className="text-center py-8 text-muted-foreground">
                    No results found
                  </div>
                )}
            {!query &&
              allData.map((food, index) => (
                <Card
                  key={index}
                  className="p-4"
                  onClick={() => handleFoodClick(food)}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{food.name}</h3>

                          <div className="mt-2 space-y-1 text-sm">
                            <p>Calories: {food.calories} kcal</p>
                            <p>Protein: {food.protein}g</p>
                            <p>Carbs: {food.carbohydrates}g</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
}
