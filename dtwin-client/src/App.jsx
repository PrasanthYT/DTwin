import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/ui/Home";
import SignIn from "./components/ui/SignIn";
import SignUp from "./components/ui/SignUp";
import SearchCompo from "./components/SearchCompo/SearchCompo";
import HealthDashboard from "./components/ui/HealthDashboard";
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
      </Routes>
    </Router>
  );
}

export default App;