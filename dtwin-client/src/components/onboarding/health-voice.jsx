import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-6">
      <div className="mb-6 flex items-center justify-between w-full max-w-md">
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-200">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Progress value={100} className="h-2 w-32 ml-3 rounded-sm  bg-black" />
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
                opacity: listening ? 1 - index * 0.05 : 0.45,
              }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 mb-3 text-3xl font-semibold text-center">
          <span className="bg-gray-800 rounded-md text-white px-2 text-center">The lazy fox jumps</span>
          <span className="text-gray-500 p-1">over the wild dog.</span>
      </p>

      <Button
                        className="w-full px-10 py-6 text-base font-medium bg-blue-600 hover:bg-blue-700"
                    >
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
    </div>
  );
}
