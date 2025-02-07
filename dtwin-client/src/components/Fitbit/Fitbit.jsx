import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Fitbit() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fitbitData, setFitbitData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const storedToken = localStorage.getItem("fitbitToken");

    if (code) {
      exchangeCodeForToken(code);
    } else if (storedToken) {
      setIsAuthenticated(true);
      fetchFitbitData(storedToken);
    }
  }, []);

  const handleAuth = async () => {
    setError(null);
    try {
      const response = await axios.get("http://localhost:4200/auth");
      window.location.href = response.data.authUrl;
    } catch (error) {
      setError(error.response?.data?.error || "Error initiating authentication");
      console.error("Auth error:", error);
    }
  };

  const exchangeCodeForToken = async (code) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:4200/token", { code });
      const { access_token } = response.data;
      localStorage.setItem("fitbitToken", access_token);
      setIsAuthenticated(true);
      await fetchFitbitData(access_token);
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      setError(error.response?.data?.error || "Error exchanging code for token");
      console.error("Token exchange error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFitbitData = async (token) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:4200/fitbit-data?token=${token}`);
      setFitbitData(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error fetching Fitbit data";
      setError(errorMessage);
      console.error("Data fetch error:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("fitbitToken");
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fitbitToken");
    setIsAuthenticated(false);
    setFitbitData(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fitbit Weekly Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="text-gray-600 mb-4">Loading...</div>
      )}

      {!isAuthenticated ? (
        <button
          onClick={handleAuth}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Authenticate with Fitbit
        </button>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Weekly Health Insights</h2>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>

          {fitbitData && (
            <div className="space-y-6">
              {/* Steps Chart */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold mb-4">Daily Steps</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={fitbitData.weeklyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} />
                      <YAxis />
                      <Tooltip labelFormatter={formatDate} />
                      <Legend />
                      <Line type="monotone" dataKey="activity.summary.steps" name="Steps" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sleep Chart */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold mb-4">Sleep Duration</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={fitbitData.weeklyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} />
                      <YAxis />
                      <Tooltip labelFormatter={formatDate} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="sleep.minutesAsleep" 
                        name="Sleep (minutes)" 
                        stroke="#82ca9d" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Heart Rate Chart */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold mb-4">Heart Rate</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={fitbitData.weeklyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} />
                      <YAxis />
                      <Tooltip labelFormatter={formatDate} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="heartRate.activities-heart[0].value.restingHeartRate" 
                        name="Resting Heart Rate" 
                        stroke="#ff7300" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Daily Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {fitbitData.weeklyData.map((day) => (
                  <div key={day.date} className="bg-white p-4 rounded shadow">
                    <h4 className="font-bold mb-2">{formatDate(day.date)}</h4>
                    <div className="space-y-2 text-sm">
                      <p>Steps: {day.activity.summary.steps}</p>
                      <p>Calories: {day.activity.summary.caloriesOut}</p>
                      <p>Sleep: {day.sleep?.minutesAsleep || 'N/A'} min</p>
                      <p>Heart Rate: {day.heartRate['activities-heart'][0].value.restingHeartRate || 'N/A'} bpm</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Fitbit;