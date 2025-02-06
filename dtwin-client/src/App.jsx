import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/ui/Home";
import SignIn from "./components/ui/SignIn";
import SignUp from "./components/ui/SignUp";
import SearchCompo from "./components/SearchCompo/SearchCompo";
import HealthDashboard from "./components/ui/HealthDashboard";
import HeartAnalysis from "./components/ui/HeartAnalysis";
import HeartRateMonitor from "./components/ui/HeartRateMonitor";
import HealthSuggestions from "./components/ui/HealthSuggestions";
import WorkoutActivityPage from "./components/ui/WorkoutActivityPage";
import MindWellnessPage from "./components/ui/MindWellnessPage";
import WellnessResourcePage from "./components/ui/WellnessResourcePage";
import NutritionGuidancePage from "./components/ui/NutritionGuidancePage";
// import { path } from 'path';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/search" element={<SearchCompo />}></Route>
      <Route path="/healthdashboard" element={<HealthDashboard/>} />
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