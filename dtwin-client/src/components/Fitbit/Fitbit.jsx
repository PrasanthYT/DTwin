import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@tremor/react";
import { CheckCircle, Loader2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ Toast for error messages

function Fitbit() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") === "true"
  );
  const [fitbitData, setFitbitData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) checkSession();
  }, []);

  // ✅ Check if user is authenticated via session
  const checkSession = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4200/api/fitbit/session",
        { withCredentials: true }
      );

      if (response.data.authenticated) {
        setIsAuthenticated(true);
        sessionStorage.setItem("isAuthenticated", "true"); // ✅ Store in sessionStorage
        fetchFitbitData();
      }
    } catch (error) {
      console.error("Session check failed:", error);
    }
  };

  // ✅ Start Fitbit Authentication
  const handleAuth = async () => {
    setError(null);
    try {
      const response = await axios.get("http://localhost:4200/auth/fitbit", {
        withCredentials: true,
      });
      window.location.href = response.data.authUrl; // Redirect to Fitbit login
    } catch (error) {
      setError(error.response?.data?.error || "Error initiating authentication");
      console.error("Auth error:", error);
      toast.error("Failed to authenticate with Fitbit");
    }
  };

  // ✅ Fetch Fitbit Data and Push to Backend
  const fetchFitbitData = async () => {
    setError(null);
    setIsSyncing(true);

    try {
      const response = await axios.get(
        "http://localhost:4200/api/fitbit/data",
        { withCredentials: true }
      );

      setFitbitData(response.data);
      setIsAuthenticated(true);

      // ✅ Send Fitbit data to backend for saving
      await saveFitbitData(response.data);
      toast.success("Fitbit data synced successfully!");
    } catch (error) {
      setError(error.response?.data?.error || "Error fetching Fitbit data");
      console.error("❌ Data fetch error:", error);
      toast.error("Error fetching Fitbit data. Please try again.");

      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem("isAuthenticated"); // ✅ Remove if session expired
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // ✅ Save Fitbit Data to Backend with JWT Authorization
  const saveFitbitData = async (data) => {
    try {
      const token = sessionStorage.getItem("token"); // 🔥 Get JWT token
      if (!token) {
        console.error("❌ No auth token found in sessionStorage");
        toast.error("Authentication expired. Please reconnect.");
        return;
      }

      await axios.post("http://localhost:4200/api/fitbit/save", data, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      console.log("✅ Fitbit data saved successfully!");
    } catch (error) {
      console.error("❌ Error saving Fitbit data:", error.response?.data || error);
      toast.error("Error saving Fitbit data.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg bg-white text-center">
        {isAuthenticated ? (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">
              Fitbit Connected!
            </h2>
            <p className="text-gray-500 mt-2">
              Your Fitbit data is now synced successfully.
            </p>
            <button
              onClick={fetchFitbitData}
              disabled={isSyncing}
              className="w-full mt-4 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCcw className="w-5 h-5 mr-2" />
                  Sync Now
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800">
              Connect Fitbit
            </h2>
            <p className="text-gray-500 mt-2">
              Sync your health data by connecting your Fitbit account.
            </p>
            {error && <div className="text-red-500 mt-3">{error}</div>}
            <button
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                "Connect Fitbit"
              )}
            </button>
          </>
        )}
      </Card>
    </div>
  );
}

export default Fitbit;
