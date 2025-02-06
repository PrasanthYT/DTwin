import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import SearchCompo from "./components/SearchCompo/SearchCompo";
import SearchResults from "./components/SearchCompo/SearchResults";
import HealthAvatar from "./components/onboarding/health-avatar";
import HealthVoice from "./components/onboarding/health-voice";
import HealthDashboard from "./pages/Dashboard";
import HeartAnalysis from "./components/ui/HeartAnalysis";
import HeartRateMonitor from "./components/ui/HeartRateMonitor";
import HealthSuggestions from "./components/ui/HealthSuggestions";
import WorkoutActivityPage from "./components/ui/WorkoutActivityPage";
import MindWellnessPage from "./components/ui/MindWellnessPage";
import WellnessResourcePage from "./components/ui/WellnessResourcePage";
import NutritionGuidancePage from "./components/ui/NutritionGuidancePage";
import Chatbot from "./components/ai/ChatBot";
import Onboarding from "./components/ui/LandingPage";
import StartingPage from "./components/ui/StartingPage";
import HealthText from "./components/onboarding/health-text";
import NutritionGuidance from "./components/scoreDetails/nutritionGuidance";
import Onboarding from "./components/onboarding/LandingPage";
import StartingPage from "./components/onboarding/StartingPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<SearchCompo />}></Route>
        <Route path="/avatar" element={<HealthAvatar />}></Route>
        <Route path="/voice" element={<HealthVoice />}></Route>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<HealthDashboard />} />
        <Route path="/wellnessai" element={<Chatbot />} />
        <Route path="/home" element={<StartingPage />} />
        <Route path="/search" element={<SearchCompo />}></Route>
        <Route path="/text" element={<HealthText />}></Route>
        <Route path="/searchResults" element={<SearchResults />}></Route>
      <Route path="/healthanalysis" element={<HeartAnalysis/>}/>
      <Route path="/heartratemonitor" element={<HeartRateMonitor/>}/>
      <Route path="/healthsuggestion" element={<HealthSuggestions/>}/>
      <Route path="workoutactivitypage" element={<WorkoutActivityPage/>}/>
      <Route path="/mindwellnesspage" element={<MindWellnessPage/>}/>
      <Route path="/wellnessresourcepage" element={<WellnessResourcePage/>}/>
      <Route path="/nutritionguidancepage" element={<NutritionGuidancePage/>}/>

      </Routes>
    </Router>
  );
}

export default App;