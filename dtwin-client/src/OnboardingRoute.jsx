import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const OnboardingRoute = () => {
  const hasVisited = localStorage.getItem("hasVisited"); // ✅ Check if user has visited before
  return hasVisited ? <Navigate to="/signin" replace /> : <Outlet />;
};

export default OnboardingRoute;