import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ArrowLeft, ArrowRight, Mic } from "lucide-react";
import VoiceAIAnalysis from "./health-voice"; // Import VoiceAIAnalysis

const HealthText = ({ nextStep, prevStep, userData, setUserData, submitData }) => {
  const [useVoice, setUseVoice] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [newHealthInput, setNewHealthInput] = useState(""); // Store latest input

  // Use Effect to submit when userData is updated
  useEffect(() => {
    if (userData.healthInput && userData.healthReport) {
      console.log("Submitting updated userData:", userData);
      submitData();
      nextStep();
    }
  }, [userData]); // Runs when userData changes

  const handleNext = async () => {
    setLoading(true);
    const input = textInput || recognizedText;
    setNewHealthInput(input);

    try {
      const apiKey = "AIzaSyBpu2KDNWOqG_qzzVLqNfzrZ7SH-KYGvFY";
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const chatSession = model.startChat({
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
        history: [],
      });

      const caseStudyPrompt = `
        Generate a detailed health case study for the following user:

        **User Information:**
        - Age: ${userData.age || "N/A"}
        - Weight: ${userData.weight || "N/A"}
        - Gender: ${userData.gender || "N/A"}
        - Blood Group: ${userData.bloodGroup || "N/A"}
        - Existing Conditions: ${userData.symptoms || "None"}
        - Medications: ${userData.medications || "None"}
        - Fitness Level: ${userData.fitnessLevel || "N/A"}
        - Symptoms Provided: ${input || "None"}
        - Sleep Level: ${userData.sleepLevel || "N/A"} hours

        **Case Study Requirements:**
        - Highlight the symptoms provided by the user.
        - Provide potential diagnoses or health conditions based on the symptoms.
        - Explain possible consequences of not treating these symptoms.
        - Offer personalized health recommendations based on their history.
        - Suggest medical tests or doctor consultations if necessary.
        - Recommend lifestyle changes for prevention.
        - All the organs which might get affected due to the current health condition.
        Structure the response as a **detailed medical case study** in a single paragraph.
      `;

      const result = await chatSession.sendMessage(caseStudyPrompt);
      const aiData = await result.response.text();

      console.log("AI-generated Case Study:", aiData);

      setUserData((prev) => ({
        ...prev,
        healthInput: input, // Store user input
        healthReport: aiData, // Store AI analysis
      }));

    } catch (error) {
      console.error("Error calling AI API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-start pt-16 px-4">
      {useVoice ? (
        <VoiceAIAnalysis
          handleNext={handleNext}
          setUseVoice={setUseVoice}
          setRecognizedText={setRecognizedText}
        />
      ) : (
        <>
          <div className="mb-6 flex items-center w-full max-w-md justify-between">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-200" onClick={prevStep} disabled={loading}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex-1 mx-4 bg-gray-200 rounded-full h-1.5">
              <div className="bg-gray-800 h-1.5 rounded-full" style={{ width: "100%" }} />
            </div>
            <Button variant="ghost" className="text-sm text-gray-600">Skip</Button>
          </div>

          <div className="mb-8 max-w-md">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Textual AI Health <br /> Analysis
            </h1>
            <p className="text-center text-gray-600 text-sm px-4">
              Write any ongoing health conditions you have right now. Our AI will analyze it.
            </p>
          </div>

          <textarea
            className="w-full max-w-md bg-gray-100 rounded-xl border h-[200px] border-blue-500 ring ring-blue-200 p-4 mb-4 text-gray-700"
            placeholder="Describe your symptoms here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={loading}
          />

          <button className="px-4 bg-gray-700 rounded-xl py-3 mb-4 text-white font-medium text-base ring ring-gray-400 flex items-center justify-center transition-colors"
            onClick={() => setUseVoice(true)} disabled={loading}>
            Use Voice Instead <Mic className="ml-2" />
          </button>

          <Button className={`w-full px-10 py-6 text-base font-medium ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
            onClick={handleNext} disabled={loading}>
            {loading ? "Processing..." : "Continue"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
};

export default HealthText;
