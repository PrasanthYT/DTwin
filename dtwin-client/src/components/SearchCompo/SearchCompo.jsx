import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchData from "../../lib/dummy.json";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allData, setAllData] = useState(SearchData);
  const [filteredData, setFilteredData] = useState(SearchData);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_PROMPTREPO_API_KEY;
  const API_URL = import.meta.env.VITE_PROMPTREPO_API_URL;

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    if (selectedFilter === "All") {
      setFilteredData(allData);
    } else {
      setFilteredData(allData.filter(food => food.category === selectedFilter));
    }
  }, [selectedFilter, allData]);

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem("searchResults"));
    if (savedResults) {
      setResults(savedResults);
    }
  }, []);

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
      const formattedResults = response.data.map(item => ({ ...item }));
      localStorage.setItem("searchResults", JSON.stringify(formattedResults))
      setResults(formattedResults.length > 0 ? formattedResults : []);
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDummyFoodClick = (food) => {
    navigate("/searchResults", {
      state: { ...food },
    });
  };

  const handleFoodClick = (food) => {
    localStorage.setItem("selectedFood", JSON.stringify(food));
    navigate("/searchResults", { state: { ...food } });
  };
  
  const handleback = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-blue-600 p-4 rounded-b-3xl mb-4">
        <header className="sticky top-0 right-0 z-10 bg-blue-600 text-white py-2.5 flex items-center justify-start gap-3 w-full">
          <ChevronLeft onClick={handleback} className="w-10 h-8" />
          <h1 className="text-[1.5rem] font-semibold">Search</h1>
        </header>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for food..."
            className="pl-9 bg-white w-full rounded-md border border-input px-3 py-2"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto">
        {["All", "Breakfast", "Lunch", "Dinner"].map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      <div className="px-4 md:px-8 bg-grey-100">
        <h2 className="text-lg font-semibold mb-4">
          {query ? `${results.length} Results` : `Popular Foods (${filteredData.length})`}
        </h2>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        <div className="space-y-3">
          {results.length > 0
            ? results.map((food, index) => (
                <Card key={index} className="p-4" onClick={() => handleFoodClick(food)}>
                  <div className="flex gap-4">
                    <img src={food["Food Image"]} alt={food["Food Name"]} className="w-24 h-24 rounded-lg object-cover" />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{food["Food Name"]}</h3>
                      <p>Calories: {food["Food Calorie"]} kcal</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>
              ))
            : !loading && query && <div className="text-center py-8 text-muted-foreground">No results found</div>}

          {!query &&
            filteredData.map((food, index) => (
              <Card key={index} className="p-4" onClick={() => handleDummyFoodClick(food)}>
                <div className="flex gap-4">
                  <img src={food.image} alt={food.name} className="w-24 h-24 rounded-lg object-cover" />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{food.name}</h3>
                    <p>Calories: {food.calories} kcal</p>
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
