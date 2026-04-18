"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { chatWithManoBot } from "@/lib/openai";
import { 
  Send, 
  Loader2, 
  Brain, 
  Music, 
  Activity, 
  Moon, 
  Utensils, 
  Wind,
  ShieldAlert,
  PhoneCall,
  User,
  Bot,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { mapToInternalEmotion } from "@/lib/utils";

const moodSliderData: Record<number, { emoji: string, label: string, color: string }> = {
  1: { emoji: "😭", label: "Very Distressed", color: "#FF6B6B" },
  2: { emoji: "😢", label: "Very Distressed", color: "#FF6B6B" },
  3: { emoji: "😔", label: "Low / Sad", color: "#FFA07A" },
  4: { emoji: "😕", label: "Low / Sad", color: "#FFA07A" },
  5: { emoji: "😐", label: "Okay, Getting By", color: "#FFD700" },
  6: { emoji: "🙂", label: "Okay, Getting By", color: "#FFD700" },
  7: { emoji: "😊", label: "Feeling Good", color: "#95D5B2" },
  8: { emoji: "😁", label: "Feeling Good", color: "#95D5B2" },
  9: { emoji: "🤩", label: "Excellent!", color: "#98FB98" },
  10: { emoji: "🥳", label: "Excellent!", color: "#98FB98" },
};

export default function MoodSupportPage() {
  const { user, currentEmotion, chatHistory, addChatMessage, setCurrentEmotion, addEmotionToHistory } = useStore();
  const [sliderValue, setSliderValue] = useState(5);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCrisis, setIsCrisis] = useState(false);
   const [isRefining, setIsRefining] = useState(false);
   const chatEndRef = useRef<HTMLDivElement>(null);

   const handleRefineMood = () => {
    setIsRefining(true);
    const selected = moodSliderData[sliderValue];
    
    const newProfile = {
      dominantEmotion: mapToInternalEmotion(selected.label),
      intensity: sliderValue * 10,
      wellbeingIndex: sliderValue * 10,
      scores: { [mapToInternalEmotion(selected.label)]: 1 } as any,
      timestamp: Date.now(),
    };

    setCurrentEmotion(newProfile);
    addEmotionToHistory(newProfile);
    
    setTimeout(() => {
      setIsRefining(false);
      alert(`Mood refined to ${selected.label}! 🌸`);
    }, 1000);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: userInput,
      timestamp: Date.now()
    };

    addChatMessage(userMessage);
    setUserInput("");
    setIsTyping(true);

    // Crisis detection
    const crisisKeywords = ["die", "end it", "suicide", "kill myself", "hopeless", "no point", "disappear"];
    if (crisisKeywords.some(kw => userInput.toLowerCase().includes(kw))) {
      setIsCrisis(true);
      setIsTyping(false);
      return;
    }

    const response = await chatWithManoBot([...chatHistory, userMessage].slice(-10), {
      user,
      emotion: currentEmotion
    });

    const botMessage = {
      id: (Date.now() + 1).toString(),
      role: "bot" as const,
      content: response.content,
      timestamp: Date.now()
    };

    addChatMessage(botMessage);
    setIsTyping(false);
  };

  const suggestions = [
    { icon: Music, label: "Music", description: "Soothe your soul with Ragas", href: "/fit-zone/music", color: "bg-purple-500" },
    { icon: Activity, label: "Yoga", description: "Ground yourself with movement", href: "/fit-zone/yoga", color: "bg-green-500" },
    { icon: Utensils, label: "Food", description: "Nourish your body and mind", href: "/fit-zone/food", color: "bg-orange-500" },
    { icon: Brain, label: "Mental Health", description: "CBT and journaling tools", href: "/fit-zone/mental", color: "bg-blue-500" },
    { icon: Moon, label: "Sleep", description: "Optimize your rest cycle", href: "/fit-zone/sleep", color: "bg-indigo-500" },
    { icon: Wind, label: "Breathing", description: "A quick 1-min breath work", href: "/welcome", color: "bg-teal-500" },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Mood Support Center</h1>
          <p className="text-foreground/60 text-lg">You are not alone. We're here to help you navigate your emotions.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Section A: Mood Slider */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="text-center p-8">
              <h2 className="text-xl font-bold mb-8">Refine Your Mood</h2>
              <div className="text-7xl mb-6 transition-all duration-300">
                {moodSliderData[sliderValue].emoji}
              </div>
              <p className="text-xl font-bold mb-10" style={{ color: moodSliderData[sliderValue].color }}>
                {moodSliderData[sliderValue].label}
              </p>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={sliderValue} 
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-4 text-xs text-foreground/40 font-bold">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
              <button
                onClick={handleRefineMood}
                disabled={isRefining}
                className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                {isRefining ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-primary" />}
                Refine My Mood
              </button>
            </Card>

            {/* Section B: Smart Suggestions */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles size={24} className="text-primary" /> Personalized for You
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {suggestions.map((item, idx) => (
                  <Link key={item.label} href={item.href}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group p-4 glass border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <div className={`p-3 rounded-xl ${item.color} text-white shadow-lg`}>
                        <item.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.label}</p>
                        <p className="text-xs text-foreground/40">{item.description}</p>
                      </div>
                      <ChevronRight size={16} className="text-foreground/20 group-hover:text-primary transition-colors" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Section C: ManoBot Chatbot */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col p-0 overflow-hidden min-h-[700px]">
              {/* Chat Header */}
              <div className="p-6 bg-primary/10 border-b border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg animate-breathing">
                  <Bot size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold">ManoBot</h3>
                  <p className="text-xs text-primary/60 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Always here to listen
                  </p>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {chatHistory.length === 0 && (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                      <Sparkles className="text-primary" />
                    </div>
                    <p className="text-foreground/60 max-w-xs mx-auto">
                      "Hey {user?.name}, I noticed you're feeling {currentEmotion?.dominantEmotion || "neutral"} today. Would you like to talk about it?"
                    </p>
                  </div>
                )}

                {chatHistory.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-secondary" : "bg-primary"}`}>
                      {msg.role === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user" 
                      ? "bg-secondary text-white rounded-tr-none" 
                      : "bg-white/5 border border-white/10 rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                {isCrisis && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-red-500/10 border-2 border-red-500/20 rounded-2xl space-y-4"
                  >
                    <div className="flex items-center gap-2 text-red-500 font-bold">
                      <ShieldAlert size={24} /> I'm worried about you.
                    </div>
                    <p className="text-sm">
                      I hear you, and I want you to know you're not alone. Things can get better, and there are people who want to support you right now. Please reach out to one of these helplines:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-red-500/20 rounded-xl">
                        <span className="font-bold">iCall (24/7)</span>
                        <a href="tel:9152987821" className="flex items-center gap-2 text-red-500 font-bold">
                          <PhoneCall size={16} /> 9152987821
                        </a>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-500/20 rounded-xl">
                        <span className="font-bold">AASRA</span>
                        <a href="tel:9820466627" className="flex items-center gap-2 text-red-500 font-bold">
                          <PhoneCall size={16} /> 9820466627
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              {!isCrisis && (
                <div className="p-6 bg-white/5 border-t border-white/10">
                  <div className="relative">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type your heart out..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-16 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!userInput.trim() || isTyping}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
                    >
                      {isTyping ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-center mt-3 text-foreground/20">
                    ManoBot is an AI companion, not a medical professional. If you're in crisis, please use the helplines.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
