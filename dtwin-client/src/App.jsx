import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/ui/Home";
import SignIn from "./components/ui/SignIn";
import SignUp from "./components/ui/SignUp";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;