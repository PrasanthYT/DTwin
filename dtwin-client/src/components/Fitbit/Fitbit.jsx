import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@tremor/react";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

function Fitbit() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fitbitData, setFitbitData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await axios.get("https://dtwin.onrender.com/auth");
      window.location.href = response.data.authUrl;
    } catch (error) {
      setError(
        error.response?.data?.error || "Error initiating authentication"
      );
      console.error("Auth error:", error);
    }
  };

  const exchangeCodeForToken = async (code) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post("https://dtwin.onrender.com/token", {
        code,
      });
      const { access_token } = response.data;
      localStorage.setItem("fitbitToken", access_token);
      setIsAuthenticated(true);
      await fetchFitbitData(access_token);
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      setError(
        error.response?.data?.error || "Error exchanging code for token"
      );
      console.error("Token exchange error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitFitbitData = async (fitbitData) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch("https://dtwin.onrender.com/api/fitbit/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fitbitData),
      });

      if (response.ok) {
        console.log("✅ Fitbit data saved successfully");
      } else {
        console.error("❌ Failed to save Fitbit data:", response.status);
      }
    } catch (error) {
      console.error("❌ Error submitting Fitbit data:", error);
    }
  };

  // ✅ Fetch Fitbit Data and Save It
  const fetchFitbitData = async (token) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://dtwin.onrender.com/fitbit-data?token=${token}`
      );
      setFitbitData(response.data);
      console.log("Fitbit data:", response.data);

      // ✅ Save to Backend
      await submitFitbitData(response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error fetching Fitbit data";
      setError(errorMessage);
      console.error("❌ Data fetch error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("fitbitToken");
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
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
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full mt-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800">
              Connect Fitbit
            </h2>
            <p className="text-gray-500 mt-2">
              Sync your health data by connecting your Fitbit account.
            </p>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mt-3 rounded">
                {error}
              </div>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                "Connect Fitbit"
              )}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

export default Fitbit;
