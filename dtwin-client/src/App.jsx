import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/ui/Home";
import SignIn from "./components/ui/SignIn";
import SignUp from "./components/ui/SignUp";
import SearchCompo from "./components/SearchCompo/SearchCompo";
import HealthAvatar from "./components/onboarding/health-avatar";
import HealthVoice from "./components/onboarding/health-voice";
// import { path } from 'path';
import HealthDashboard from "./pages/Dashboard";
import Chatbot from "./components/ai/ChatBot";
import Onboarding from "./components/ui/LandingPage";
import StartingPage from "./components/ui/StartingPage";

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
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<HealthDashboard />} />
        <Route path="/wellnessai" element={<Chatbot />} />
        <Route path="/home" element={<StartingPage />} />
        <Route path="/search" element={<SearchCompo />}></Route>
      </Routes>
    </Router>
  );
}

export default App;