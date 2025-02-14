import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import SearchCompo from "./components/SearchCompo/SearchCompo";
import SearchResults from "./components/SearchCompo/SearchResults";
import HealthVoice from "./components/onboarding/health-voice";
import HealthDashboard from "./pages/Dashboard";
import HeartAnalysis from "./components/ui/HeartAnalysis";
import HealthSuggestions from "./components/ui/HealthSuggestions";
import WorkoutActivityPage from "./components/ui/WorkoutActivityPage";
import MindWellnessPage from "./components/ui/MindWellnessPage";
import WellnessResourcePage from "./components/ui/WellnessResourcePage";
import NutritionGuidancePage from "./components/ui/NutritionGuidancePage";
import Chatbot from "./components/ai/ChatBot";
import HealthText from "./components/onboarding/health-text";
import Onboarding from "./components/onboarding/LandingPage";
import StartingPage from "./components/onboarding/StartingPage";
import Fitbit from "./components/Fitbit/Fitbit";
import FoodScanner from "./components/ai/Foodscanner";
import HealthHeartRate from "./components/dashboard/health-heart-rate";
import HealthBloodPressure from "./components/dashboard/health-blood-pressure";
import HealthWeightTracking from "./components/dashboard/health-weight-tracking";
import HealthScore from "./components/ui/HealthDashboard";
import AddMeds from "./components/onboarding/health-addmeds";
import SplashScreen from "./components/onboarding/SplashScreen";
import PrivateRoute from "./PrivateRoute";
import Settings from "./components/dashboard/settings";
import FoodAlternatives from "./components/SearchCompo/alternativeFood";

// ✅ PublicRoute to prevent signed-in users from accessing auth pages
const PublicRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [hasVisited, setHasVisited] = useState(
    localStorage.getItem("hasVisited")
  );

  // ✅ Show splash screen for 2.5 seconds before routing
  useEffect(() => {
    setTimeout(() => setIsSplashVisible(false), 2500);
  }, []);

  // ✅ Handle onboarding completion
  const markOnboardingComplete = () => {
    localStorage.setItem("hasVisited", "true");
    setHasVisited("true");
  };

  // ✅ Show splash screen before routing
  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            hasVisited ? <Navigate to="/dashboard" replace /> : <StartingPage />
          }
        />
        {/* Public routes */}
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <PublicRoute>
              <Onboarding />
            </PublicRoute>
          }
        />
        <Route
          path="/home"
          element={<Home onComplete={markOnboardingComplete} />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <HealthDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchCompo />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/healthsuggestion"
          element={
            <PrivateRoute>
              <HealthSuggestions />
            </PrivateRoute>
          }
        />
        <Route
          path="/voice"
          element={
            <PrivateRoute>
              <HealthVoice />
            </PrivateRoute>
          }
        />
        <Route
          path="/wellnessai"
          element={
            <PrivateRoute>
              <Chatbot />
            </PrivateRoute>
          }
        />
        <Route
          path="/text"
          element={
            <PrivateRoute>
              <HealthText />
            </PrivateRoute>
          }
        />
        <Route
          path="/searchResults"
          element={
            <PrivateRoute>
              <SearchResults />
            </PrivateRoute>
          }
        />
        <Route
          path="/healthanalysis"
          element={
            <PrivateRoute>
              <HeartAnalysis />
            </PrivateRoute>
          }
        />
        <Route
          path="/heartratemonitor"
          element={
            <PrivateRoute>
              <HealthHeartRate />
            </PrivateRoute>
          }
        />
        <Route
          path="/workoutactivitypage"
          element={
            <PrivateRoute>
              <WorkoutActivityPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mindwellnesspage"
          element={
            <PrivateRoute>
              <MindWellnessPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/wellnessresourcepage"
          element={
            <PrivateRoute>
              <WellnessResourcePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/nutritionguidancepage"
          element={
            <PrivateRoute>
              <NutritionGuidancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/Fitbit"
          element={
            <PrivateRoute>
              <Fitbit />
            </PrivateRoute>
          }
        />
        <Route
          path="/foodscan"
          element={
            <PrivateRoute>
              <FoodScanner />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <HealthBloodPressure />
            </PrivateRoute>
          }
        />
        <Route
          path="/weighttrack"
          element={
            <PrivateRoute>
              <HealthWeightTracking />
            </PrivateRoute>
          }
        />
        <Route
          path="/healthscore"
          element={
            <PrivateRoute>
              <HealthScore />
            </PrivateRoute>
          }
        />
        <Route
          path="/addmeds"
          element={
            <PrivateRoute>
              <AddMeds />
            </PrivateRoute>
          }
        />
        <Route
          path="/alternativeFood"
          element={
            <PrivateRoute>
              <FoodAlternatives />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
