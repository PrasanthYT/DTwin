import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "@radix-ui/react-progress";
import toast from "react-hot-toast";

export default function VoiceAIAnalysis({ handleNext, setUseVoice, setRecognizedText }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState(""); // Stores live recognized speech
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Your browser does not support speech recognition.");
      setUseVoice(false);
      return;
    }
  
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
  
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
  
    recognition.onresult = (event) => {
      let newTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        newTranscript += event.results[i][0].transcript + " ";
      }
      setTranscript(newTranscript.trim());
      setRecognizedText(newTranscript.trim());
    };
  
    recognitionRef.current = recognition;
  
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop(); // ✅ Ensure cleanup is only called if recognition exists
        recognitionRef.current = null; // ✅ Avoid memory leaks
      }
    };
  }, []);
  

  const toggleListening = () => {
    if (recognitionRef.current) {
      if (listening) {
        recognitionRef.current.stop();
      } else {
        setTranscript(""); // Clear text when restarting
        recognitionRef.current.start();
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-6">
      <div className="mb-6 flex items-center justify-between w-full max-w-md">
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-200">
          <ArrowLeft className="h-6 w-6" onClick={() => setUseVoice(false)} />
        </Button>
        <Progress value={100} className="h-2 w-32" />
        <Button variant="ghost" className="text-sm text-gray-600">Skip</Button>
      </div>

      <h2 className="text-xl font-bold text-center">Voice AI Analysis</h2>
      <p className="text-gray-500 text-center text-sm my-2">
        Please say the following words below. Don’t worry, we don’t steal voice data.
      </p>

      {/* Live recognized text display */}
      <p className="text-lg font-semibold text-center mt-2 text-blue-600">
        {transcript || "Start speaking..."}
      </p>

      {/* Voice animation effect */}
      <div className="h-[300px] flex items-center">
        <div className="relative flex items-center justify-center w-48 h-48">
          {[0.4, 0.55, 0.7, 0.85, 1].map((scale, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-blue-500"
              style={{ width: "100%", height: "100%" }}
              animate={{
                scale: listening ? scale : 1,
                opacity: listening ? 1 - index * 0.25 : 0.7,
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

      {/* Start/Stop Recording Button */}
      <button
        onClick={toggleListening}
        className={`mt-4 px-4 py-2 rounded-lg ${listening ? "bg-red-600" : "bg-blue-600"} text-white`}
      >
        {listening ? "Stop Recording" : "Start Recording"}
      </button>

      {/* Continue Button (same as HealthText) */}
      <Button className="w-full px-10 py-6 text-base font-medium bg-blue-600 hover:bg-blue-700 mt-6" onClick={handleNext}>
        Continue
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
