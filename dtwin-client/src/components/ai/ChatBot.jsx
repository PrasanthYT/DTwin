import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hey there! I'm Dr. Lyla, your friendly AI therapist and life guide. 😊 What's your name?", audioFile: "" }
  ]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [playingAudio, setPlayingAudio] = useState(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleChat = () => {
    if (isExpanded) {
      navigate('/dashboard'); // Navigate to dashboard when chat is collapsed
    }
    setIsExpanded(!isExpanded);
  };

  const detectEmotion = (message) => {
    if (/sad|depressed|down|lonely|anxious/i.test(message)) return "sad";
    if (/happy|excited|joyful|grateful/i.test(message)) return "happy";
    if (/angry|frustrated|mad|upset/i.test(message)) return "angry";
    if (/nervous|worried|stressed/i.test(message)) return "anxious";
    if (/lost|unmotivated|confused/i.test(message)) return "lost";
    return "neutral";
  };

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

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!userName) {
      setUserName(input);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: input },
        { role: "bot", content: `Nice to meet you, ${input}! 😊 What’s on your mind today?`, audioFile: "" }
      ]);
      setInput("");
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const emotion = detectEmotion(input);
    const systemPrompt = getSystemPrompt(emotion);

    try {
      const response = await fetch("https://api.chai-research.com/v1/chat/completions", {
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
            { role: "user", content: input },
          ],
          max_tokens: 1000,
        }),
      });

      const json = await response.json();
      if (json.choices && json.choices.length > 0) {
        const botResponse = json.choices[0].message.content;
        let audioFile = await generateSpeech(botResponse);

        let words = botResponse.split(" ");
        let typedMessage = "";
        setMessages((prev) => [...prev, { role: "bot", content: "", audioFile }]);
        setIsTyping(false);
        for (let i = 0; i < words.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          typedMessage += words[i] + " ";
          setMessages((prev) => [...prev.slice(0, -1), { role: "bot", content: typedMessage, audioFile }]);
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
        { role: "bot", content: "Oops! Something went wrong. Let's try that again. 😊", audioFile: "" }
      ]);
      setIsTyping(false);
    }
  };

  const generateSpeech = async (text) => {
    try {
      const response = await fetch("https://dtwin.onrender.com/api/speech/generate", {
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
      });

      const data = await response.json();
      return data.audioFile || "";
    } catch (error) {
      console.error("Error generating speech:", error);
      return "";
    }
  };

  const handlePlayAudio = (audioUrl) => {
    if (!audioUrl) return;

    setPlayingAudio(audioUrl);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => setPlayingAudio(null);
  };

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <AnimatePresence>
      {isExpanded ? (
        <motion.div className="fixed inset-0 bg-white flex flex-col shadow-lg z-50">
          <div className="bg-blue-500 p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-medium text-blue-100 ">Dr. Lyla • AI Therapist</h2>
            <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">
              <ChevronDown color={"white"} size={24} />
            </button>
          </div>

          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} my-2 relative`}>
                {msg.role === "bot" && msg.audioFile && (
                  <button 
                    onClick={() => handlePlayAudio(msg.audioFile)}
                    className="absolute -top-5 left-2 mt-1 mr-1 text-gray-500 hover:text-gray-700"
                  >
                    {playingAudio === msg.audioFile ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                )}
                <div className={`p-3 max-w-[80%] rounded-xl shadow-md ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}>
                  {msg.content}
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
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && handleSend()} 
              placeholder="Share your thoughts..." 
              className="flex-1 p-2 border bg-gray-200 rounded-lg mr-2 text-lg" 
            />
            <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Send
            </button>
          </div>
        </motion.div>
      ) : (
        <></>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;
