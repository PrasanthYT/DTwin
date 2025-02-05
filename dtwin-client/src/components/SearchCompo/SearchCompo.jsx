import React, { useState } from "react";
import axios from "axios";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "91ed0a11f18147dab60ff46998078997";
  const API_URL = "https://api.promptrepo.com/api/private/fuck-sheet4";

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        [{ "Food Name": query }],
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );

      const formattedResults = response.data.map((item) => ({
        ...item,
        details: JSON.parse(item["Food Details (Glycemic Index, Protein, Carbohydrates)"]),
      }));

      setResults(formattedResults);
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for food..."
        className="border border-gray-300 rounded-md p-2 w-full"
      />
      <button
        onClick={handleSearch}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
      >
        Search
      </button>

      {loading && <p className="mt-2">Loading...</p>}

      <ul className="mt-4">
        {results.length > 0 ? (
          results.map((food, index) => (
            <li key={index} className="border-b p-2">
              <p className="font-bold text-lg">{food["Food Name"]}</p>
              <p><strong>Score:</strong> {food.score.toFixed(2)}</p>
              <p><strong>Category:</strong> {food["Food Category (SetA, SetB, SetC)"]}</p>
              <p><strong>Type:</strong> {food["Food Type (Breakfast, Lunch, Dinner)"]}</p>
              <p><strong>Calories:</strong> {food["Food Calorie"]} kcal</p>
              <p><strong>Glycemic Index:</strong> {food.details["Glycemic Index"]}</p>
              <p><strong>Protein:</strong> {food.details["Protein (g)"]} g</p>
              <p><strong>Carbohydrates:</strong> {food.details["Carbohydrates (g)"]} g</p>
            </li>
          ))
        ) : (
          !loading && <p className="text-gray-500">No results found</p>
        )}
      </ul>
    </div>
  );
};

export default SearchBox;
