import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, Pause, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      role: "bot",
      content:
        "Hey there! I'm Dr. Lyla, your friendly AI therapist and life guide. 😊 What's your name?",
      audioFile: "",
    },
  ]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const recognitionRef = useRef(null);
  const tempMessageIdRef = useRef(null); // Reference for the temporary user message.
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  // Ref to track whether the user's name has been set
  const hasSetNameRef = useRef(false);

  // Toggle the chat view and navigate when collapsing the chat.
  const toggleChat = () => {
    console.log("Toggling chat. isExpanded:", isExpanded);
    if (isExpanded) {
      navigate("/dashboard");
    }
    setIsExpanded(!isExpanded);
  };

  // Modified handleSend: accepts an optional text parameter.
  const handleSend = async (text) => {
    // Use the provided text if available; otherwise use the input state.
    const messageText = text !== undefined ? text : input;
    console.log("handleSend called with messageText:", messageText);
    if (!messageText.trim()) return;

    // If the user's name is not set, treat this as the name input.
    if (!hasSetNameRef.current) {
      console.log("Setting user name to:", messageText);
      setUserName(messageText);
      console.log(userName)
      hasSetNameRef.current = true;
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "user", content: messageText, audioFile: "" },
        {
          id: Date.now() + 1,
          role: "bot",
          content: `Nice to meet you, ${messageText}! 😊 What’s on your mind today?`,
          audioFile: "",
        },
      ]);
      setInput("");
      return;
    }

    // Function to analyze emotion using NLP Cloud
    const analyzeEmotion = async (text) => {
      try {
        const response = await axios.post(
          "https://api.nlpcloud.io/v1/gpu/finetuned-llama-3-70b/sentiment",
          {
            text: text,
            target: "NLP Cloud", // No specific target for general sentiment analysis
          },
          {
            headers: {
              Authorization: 'Token 193eae775ed15753b1f68d6a1ae141acda03527e',
            },
          }
        );

        console.log(
          "NLP Cloud sentiment response:",
          response.data.scored_labels[1].label.toLowerCase()
        );
        return response.data.scored_labels[1].label.toLowerCase();
      } catch (error) {
        console.error("Error analyzing sentiment:", error);
        return "neutral"; // Default to neutral on error
      }
    };

    // Append the user's message.
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: messageText,
      audioFile: "",
    };
    console.log("Appending user message:", userMessage);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Wait for emotion analysis to complete.
    const emotion = await analyzeEmotion(messageText);
    console.log("Detected emotion:", emotion);
    const systemPrompt = getSystemPrompt(emotion[0]);

    try {
      console.log("Fetching bot response...");
      const response = await fetch(
        "https://api.chai-research.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API_KEY": "75d5c115b7bc4e72b8746c7845a2526f",
          },
          body: JSON.stringify({
            model: "chai_v1",
            messages: [
              { role: "system", content: systemPrompt },
              ...messages.slice(-1000),
              { role: "user", content: messageText },
            ],
            max_tokens: 1000,
          }),
        }
      );

      const json = await response.json();
      console.log("Received API response:", json);
      if (json.choices && json.choices.length > 0) {
        const botResponse = json.choices[0].message.content;
        let audioFile = await generateSpeech(botResponse);

        let words = botResponse.split(" ");
        let typedMessage = "";
        // Add a placeholder for the bot's response.
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), role: "bot", content: "", audioFile },
        ]);
        setIsTyping(false);
        // Simulate typing by gradually updating the message.
        for (let i = 0; i < words.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          typedMessage += words[i] + " ";
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { id: Date.now(), role: "bot", content: typedMessage, audioFile },
          ]);
        }

        setIsTyping(false);
        if (audioFile) {
          handlePlayAudio(audioFile);
        }
      }
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          content: "Oops! Something went wrong. Let's try that again. 😊",
          audioFile: "",
        },
      ]);
      setIsTyping(false);
    }
  };

  // Returns the system prompt based on the detected emotion.
  const getSystemPrompt = (emotion) => {
    const basePrompt = `You are Lyla, a compassionate and understanding AI therapist. Your responses are warm, supportive, and human-like be professional.`;
    const moodPrompts = {
      sad: "I'm here for you. Want to share what's on your mind?",
      happy: "That’s great! Tell me more about what’s making you happy.",
      angry: "I understand. Want to vent, or find solutions together?",
      anxious: "Take a deep breath. You're not alone in this.",
      lost: "Feeling lost is tough, but I'm here to help you navigate it.",
      neutral: "What's been on your mind lately?",
    };
    return `${basePrompt} ${moodPrompts[emotion]}`;
  };

  // Generates speech from text.
  const generateSpeech = async (text) => {
    console.log("Generating speech for text:", text);
    try {
      const response = await fetch(
        "https://dtwin.onrender.com/api/speech/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voiceId: "en-US-iris",
            style: "Neutral",
            text: text,
            rate: 0,
            pitch: 0,
            sampleRate: 48000,
            format: "MP3",
            encodeAsBase64: false,
            modelVersion: "GEN2",
          }),
        }
      );

      const data = await response.json();
      console.log("Received speech data:", data);
      return data.audioFile || "";
    } catch (error) {
      console.error("Error generating speech:", error);
      return "";
    }
  };

  // Handles playing the generated audio.
  const handlePlayAudio = (audioUrl) => {
    if (!audioUrl) return;
    console.log("Playing audio from URL:", audioUrl);
    setPlayingAudio(audioUrl);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => {
      console.log("Audio playback ended.");
      setPlayingAudio(null);
    };
  };

  // ***************************************
  // Speech Recognition Setup (no backend transcription)
  // ***************************************
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onstart = () => {
      console.log("Speech recognition started.");
      setIsRecording(true);
      finalTranscript = "";
      setRecognizedText("");
      // Add a temporary user message for live transcription.
      const tempId = Date.now();
      tempMessageIdRef.current = tempId;
      setMessages((prev) => [
        ...prev,
        { id: tempId, role: "user", content: "", audioFile: "" },
      ]);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      const combinedTranscript = finalTranscript + interimTranscript;
      console.log("Speech recognition result:", combinedTranscript);
      setRecognizedText(combinedTranscript);
      // Update the temporary user message with the live transcript.
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessageIdRef.current
            ? { ...msg, content: combinedTranscript }
            : msg
        )
      );
      // (No update to the input field here.)
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      setIsRecording(false);
      const transcriptToUse =
        finalTranscript.trim() || recognizedText.trim();
      console.log("Final transcript to use:", transcriptToUse);
      // Capture the temporary message ID before clearing it.
      const tempId = tempMessageIdRef.current;
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      tempMessageIdRef.current = null;
      // When the mic button is released, send the final transcription as the message.
      if (transcriptToUse !== "") {
        handleSend(transcriptToUse);
      }
      setRecognizedText("");
    };

    recognitionRef.current = recognition;

    return () => {
      console.log("Cleaning up speech recognition.");
      recognition.stop();
    };
  }, []); // Run once on mount

  // Start and stop recording using webkitSpeechRecognition.
  const startRecording = () => {
    console.log("startRecording called.");
    if (recognitionRef.current && !isRecording) {
      setRecognizedText("");
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    console.log("stopRecording called.");
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  // Scroll to the bottom when messages update.
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <AnimatePresence>
      {isExpanded ? (
        <motion.div className="fixed inset-0 bg-white flex flex-col shadow-lg z-50">
          <div className="bg-blue-500 p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-medium text-blue-100">
              Dr. Lyla • AI Therapist
            </h2>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronDown color="white" size={24} />
            </button>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50"
          >
            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } my-2 relative`}
              >
                {msg.audioFile && (
                  <button
                    onClick={() => handlePlayAudio(msg.audioFile)}
                    className="absolute -top-5 left-2 mt-1 mr-1 text-gray-500 hover:text-gray-700"
                  >
                    {playingAudio === msg.audioFile ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} />
                    )}
                  </button>
                )}
                <div
                  className={`p-3 max-w-[80%] rounded-xl shadow-md ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {msg.content || (msg.audioFile && "Voice Message")}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-1 p-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            )}
          </div>

          <div className="flex p-4 border-t bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                console.log("Input changed:", e.target.value);
                setInput(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Share your thoughts..."
              className="flex-1 p-2 border bg-gray-200 rounded-lg mr-2 text-lg"
            />
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition mr-2 ${
                isRecording ? "bg-red-400" : ""
              }`}
              title={
                isRecording ? "Recording..." : "Hold to record voice message"
              }
            >
              <Mic size={20} color={isRecording ? "white" : "currentColor"} />
            </button>
            <button
              onClick={() => handleSend()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Chatbot;
