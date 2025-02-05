import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/ui/Home";
import SignIn from "./components/ui/SignIn";
import SignUp from "./components/ui/SignUp";
import SearchCompo from "./components/SearchCompo/SearchCompo";
import Onboarding from "./components/ui/LandingPage";
import StartingPage from "./components/ui/StartingPage";
// import { path } from 'path';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/home" element={<StartingPage />} />
      <Route path="/search" element={<SearchCompo />}></Route>

      </Routes>
    </Router>
  );
}

export default App;