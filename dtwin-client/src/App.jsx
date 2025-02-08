import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

// PublicRoute component to prevent authenticated users from accessing auth pages
const PublicRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  useEffect(() => {
    if (!localStorage.getItem("hasVisited")) {
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  return (
    <Router>
      <Routes>
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
        <Route path="/home" element={<Home />} />

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
          path="/bloodpressure"
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

        {/* Default route */}
        <Route path="/" element={<StartingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
