import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "@radix-ui/react-progress";

export default function VoiceAIAnalysis() {
  const [listening, setListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const recognitionRef = useRef(null);
  const targetText = "The lazy fox jumps over the wild dog";

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      setRecognizedText(transcript.trim());
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const toggleListening = () => {
    if (recognitionRef.current) {
      if (listening) {
        recognitionRef.current.stop();
      } else {
        setRecognizedText("");
        recognitionRef.current.start();
      }
    }
  };

  const renderTextWithHighlight = () => {
    const targetWords = targetText.toLowerCase().split(" "); // Convert target text to lowercase
    const spokenWords = recognizedText.toLowerCase().split(" "); // Convert recognized text to lowercase
  
    const highlightTracker = {}; // To track occurrences
  
    return targetWords.map((word, index) => {
      const originalWord = targetText.split(" ")[index]; // Keep original casing
      if (!highlightTracker[word]) {
        highlightTracker[word] = 0; // Initialize count
      }
  
      const isMatched =
        spokenWords.filter((w) => w === word).length > highlightTracker[word];
  
      if (isMatched) {
        highlightTracker[word] += 1; // Increment count after highlighting
      }
  
      return (
        <span
          key={index}
          className={`px-1 py-0.5 ${
            isMatched ? "bg-gray-800 text-white" : "text-gray-400"
          }`}
        >
          {originalWord}
        </span>
      );
    });
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-6">
      <div className="mb-6 flex items-center justify-between w-full max-w-md">
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-200">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Progress value={100} className="h-2 w-32" />
        <Button variant="ghost" className="text-sm text-gray-600">Skip</Button>
      </div>

      <h2 className="text-xl font-bold text-center">Voice AI Analysis</h2>
      <p className="text-gray-500 text-center text-sm my-2">
        Please say the following words below. Don’t worry, we don’t steal voice data.
      </p>

      <div className="h-[300px] flex items-center">
        <div className="relative flex items-center justify-center w-48 h-48">
          {[0.4, 0.55, 0.7, 0.85, 1].map((scaleFactor, index) => (
            <motion.div
              key={index}
              className="absolute rounded-[50px] bg-blue-500"
              style={{
                width: `${(3 + index * 3) / 12 * 100}%`,
                height: `${(3 + index * 3) / 12 * 100}%`,
                boxShadow: `0 0 10px rgba(0, 100, 255, ${0.2 + index * 0.1})`,
              }}
              animate={{
                scale: listening ? 1.3 : 1,
                opacity: listening ? 1 - index * 0.25 : 0.7,
              }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-lg font-semibold text-center">
        {renderTextWithHighlight()}
      </p>

      <button
        onClick={toggleListening}
        className={`mt-4 px-4 py-2 rounded-lg ${listening ? "bg-red-600" : "bg-blue-600"} text-white`}
      >
        {listening ? "Stop Recording" : "Start Recording"}
      </button>

      <p className="text-gray-600 text-sm mt-2">Recognized: {recognizedText}</p>
    </div>
  );
}
