import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function SearchBox() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const API_KEY = "91ed0a11f18147dab60ff46998078997"
  const API_URL = "https://api.promptrepo.com/api/private/fuck-sheet5"

  useEffect(() => {
    fetchDefaultResults()
  }, [])

  const fetchDefaultResults = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        API_URL,
        Array(10).fill({ "Food Name": "" }),
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      )

      const formattedResults = response.data.map((item) => ({
        ...item,
        details: JSON.parse(item["Food Details (Glycemic Index, Protein, Carbohydrates)"]),
      }))

      setResults(formattedResults)
    } catch (error) {
      console.error("Error fetching default data:", error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) {
      fetchDefaultResults()
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(API_URL, [{ "Food Name": query }], {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      })

      const formattedResults = response.data.map((item) => ({
        ...item,
        details: JSON.parse(item["Food Details (Glycemic Index, Protein, Carbohydrates)"]),
      }))

      setResults(formattedResults)
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBackClick = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-blue-600 text-white p-4 flex items-center gap-3">
        <Button onClick={handleBackClick} variant="ghost" size="icon" className="text-white">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Search</h1>
      </header>

      {/* Search Section */}
      <div className="p-4">
        <div className="relative">
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
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          <Button size="sm" variant="secondary" className="whitespace-nowrap">
            Wellness
          </Button>
          <Button size="sm" variant="secondary" className="whitespace-nowrap">
            Activity
          </Button>
          <Button size="sm" variant="secondary" className="whitespace-nowrap">
            Resources
          </Button>
          <Button size="sm" variant="secondary" className="whitespace-nowrap">
            Community
          </Button>
        </div>

        {/* Results Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {query ? `${results.length} Results` : 'Popular Foods'}
            </h2>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              Newest <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          <div className="space-y-3">
            {results.length > 0
              ? results.map((food, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={food["Food Image"]}
                          // alt={food["Food Name"]}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{food["Food Name"]}</h3>
                            <p className="text-sm text-muted-foreground">
                              • {food["Food Type (Breakfast, Lunch, Dinner)"]}
                            </p>
                            <div className="mt-2 space-y-1 text-sm">
                              <p>Calories: {food["Food Calorie"]} kcal</p>
                              <p>Protein: {food.details["Protein (g)"]}g</p>
                              <p>Carbs: {food.details["Carbohydrates (g)"]}g</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              : !loading && <div className="text-center py-8 text-muted-foreground">No results found</div>}
          </div>
        </div>
      </div>
    </div>
  )
}