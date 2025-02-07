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
import HealthAvatar from "../components/onboarding/health-avatar";
import HealthText from "../components/onboarding/health-text";

function Home() {
  const [currentStep, setCurrentStep] = useState(0);

  // State to store all user inputs
  const [userData, setUserData] = useState({
    healthGoal: "",
    gender: "",
    weight: "",
    age: "",
    bloodGroup: "",
    fitnessLevel: "",
    sleepLevel: "",
    medications: [],
    symptoms: [],
  });

  const steps = [
    (props) => (
      <HealthGoals {...props} userData={userData} setUserData={setUserData} />
    ),
    (props) => (
      <HealthGenders {...props} userData={userData} setUserData={setUserData} />
    ),
    (props) => (
      <HealthWeight {...props} userData={userData} setUserData={setUserData} />
    ),
    (props) => (
      <HealthAge {...props} userData={userData} setUserData={setUserData} />
    ),
    (props) => (
      <HealthBloodFGroup
        {...props}
        userData={userData}
        setUserData={setUserData}
      />
    ),
    (props) => (
      <HealthFitness {...props} userData={userData} setUserData={setUserData} />
    ),
    (props) => (
      <HealthSleepLevel
        {...props}
        userData={userData}
        setUserData={setUserData}
      />
    ),
    (props) => (
      <HealthMedication
        {...props}
        userData={userData}
        setUserData={setUserData}
      />
    ),
    (props) => (
      <HealthSymptoms
        {...props}
        userData={userData}
        setUserData={setUserData}
      />
    ),
    // HealthLoading,
    (props) => (
      <HealthSetup
        {...props}
        userData={userData}
        setUserData={setUserData}
        submitData={submitData}
      />
    ),
    (props) => (
      <HealthAvatar {...props} userData={userData} setUserData={setUserData} />
    ),
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

  // Function to send data to the backend
  const submitData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      console.log("hi")
      const response = await fetch("http://localhost:5000/api/auth/user-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          healthGoal: userData.healthGoal,
          gender: userData.gender,
          weight: userData.weight,
          age: userData.age,
          bloodGroup: userData.bloodGroup,
          fitnessLevel: userData.fitnessLevel,
          sleepLevel: userData.sleepLevel,
          medications: userData.medications,
          symptoms: userData.symptoms,
          avatar: userData.avatar,
        }),
      });

      if (response.ok) {
        console.log("Data submitted successfully");
        nextStep();
      } else {
        console.log("Failed to submit data", response);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const CurrentComponent = steps[currentStep];

  return <CurrentComponent nextStep={nextStep} prevStep={prevStep} />;
}

export default Home;
