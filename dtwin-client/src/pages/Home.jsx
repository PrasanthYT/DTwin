import React, { useState } from "react";
import HealthGenders from "../components/onboarding/health-gender";
import HealthGoals from "../components/onboarding/health-goal";
import HealthWeight from "../components/onboarding/health-weight";
import HealthAge from "../components/onboarding/health-age";
import HealthBloodFGroup from "../components/onboarding/health-blood-group";
import HealthFitness from "../components/onboarding/health-fitness";
import HealthSleepLevel from "../components/onboarding/health-sleeplevel";
import HealthMedication from "../components/onboarding/health-medications";
import HealthSymptoms from "../components/onboarding/health-symptoms";
import HealthSetup from "../components/onboarding/health-setup";
import HealthLoading from "../components/onboarding/health-loading";
import HealthAvatar from "../components/onboarding/health-avatar"
function Home() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    HealthGoals,
    HealthGenders,
    HealthWeight,
    HealthAge,
    HealthBloodFGroup,
    HealthFitness,
    HealthSleepLevel,
    HealthMedication,
    HealthSymptoms,
    // HealthLoading,
    HealthSetup,
    HealthAvatar,
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const CurrentComponent = steps[currentStep];

  return <CurrentComponent nextStep={nextStep} prevStep={prevStep} />;
}

export default Home;
