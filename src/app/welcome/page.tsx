"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Music, Play, SkipForward } from "lucide-react";

const quotes = [
  "You've made it here. That itself takes courage.",
  "Breathe. You are exactly where you need to be.",
  "Your mind is a garden. Let's plant some peace today.",
  "One breath at a time. One moment at a time.",
  "You are not your thoughts. You are the observer.",
  "Peace is not the absence of storm, but the calm within.",
  "Be gentle with yourself. You are doing your best.",
  "Your breath is an anchor in the storm of life.",
  "Quiet the mind and the soul will speak.",
  "Healing takes time, and you have plenty of it."
];

export default function WelcomeBreathing() {
  const { user } = useStore();
  const router = useRouter();
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [cycle, setCycle] = useState(1);
  const [timer, setTimer] = useState(4);
  const [quote, setQuote] = useState("");
  const [isMusicOn, setIsMusicOn] = useState(false);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const nextPhase = useCallback(() => {
    if (phase === "Inhale") {
      setPhase("Hold");
      setTimer(4);
    } else if (phase === "Hold") {
      setPhase("Exhale");
      setTimer(6);
    } else {
      setPhase("Inhale");
      setTimer(4);
      setCycle((prev) => prev + 1);
    }
  }, [phase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          nextPhase();
          return 0; // Will be reset in nextPhase
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextPhase]);

  const circleVariants = {
    Inhale: { scale: 1.5, backgroundColor: "#48CAE4" },
    Hold: { scale: 1.5, backgroundColor: "#6C63FF" },
    Exhale: { scale: 1, backgroundColor: "#95D5B2" },
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome back, {user?.name || "Friend"} 🌸</h1>
        <p className="text-xl font-playfair italic text-foreground/60 mb-12">"{quote}"</p>

        {/* Breathing Circle */}
        <div className="relative flex flex-col items-center justify-center h-100">
          <motion.div
            variants={circleVariants}
            animate={phase}
            transition={{ duration: phase === "Hold" ? 0.5 : phase === "Inhale" ? 4 : 6, ease: "easeInOut" }}
            className="w-48 h-48 rounded-full flex flex-col items-center justify-center text-white shadow-[0_0_50px_rgba(108,99,255,0.3)]"
          >
            <span className="text-2xl font-bold mb-1">{phase}...</span>
            <span className="text-xl opacity-80">{timer}s</span>
          </motion.div>
          
          <div className="absolute -bottom-12 text-foreground/40 font-medium">
            Cycle {cycle} of 3
          </div>
        </div>

        {/* Controls */}
        <div className="mt-20 flex items-center justify-center gap-6">
          <button
            onClick={() => setIsMusicOn(!isMusicOn)}
            className={`p-4 rounded-full transition-all ${isMusicOn ? "bg-primary text-white" : "bg-white/5 text-foreground/40"}`}
          >
            <Music size={24} />
          </button>

          {cycle >= 2 ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => router.push("/text-emotion")}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all"
            >
              I'm Ready <Play size={20} fill="currentColor" />
            </motion.button>
          ) : (
            <button
              onClick={() => router.push("/text-emotion")}
              className="flex items-center gap-2 text-foreground/40 font-medium hover:text-foreground transition-colors"
            >
              Skip <SkipForward size={20} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Background Audio */}
      {isMusicOn && (
        <audio autoPlay loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
      )}
    </main>
  );
}
