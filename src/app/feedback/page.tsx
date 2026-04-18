"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import {
  Star,
  Heart,
  Send,
  ChevronRight,
  Flame,
  CheckCircle2,
  Share2,
  Home,
  PartyPopper,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const { user, streak, currentEmotion } = useStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selectedHelpful, setSelectedHelpful] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const toggleHelpful = (id: string) => {
    setSelectedHelpful((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Here we would call Gravity AI feedback endpoint
  };

  const helpfulOptions = [
    { id: "ManoBot", emoji: "🤖", label: "ManoBot" },
    { id: "Ragas", emoji: "🎵", label: "Music Therapy" },
    { id: "Yoga", emoji: "🧘", label: "Yoga" },
    { id: "Breathing", emoji: "🌬️", label: "Breathing" },
    { id: "Journaling", emoji: "📝", label: "Journaling" },
    { id: "Nutrition", emoji: "🍎", label: "Nutrition Tips" },
  ];

  const ratingMessages: Record<number, string> = {
    5: "You made our day too! 💜",
    4: "Thank you! We'll keep improving 🌱",
    3: "Thank you! We'll keep improving 🌱",
    2: "We're sorry. Tell us what went wrong",
    1: "We're sorry. Tell us what went wrong",
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto w-full space-y-10"
            >
              <header className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary shadow-xl shadow-primary/20 animate-breathing">
                    <Heart size={40} fill="currentColor" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold">
                  Thank you for being here.
                </h1>
                <p className="text-foreground/60 text-lg italic">
                  "You are not your worst day. You are not your darkest thought.
                  You are still here. And that matters. 💜"
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Session Summary Card */}
                <Card className="bg-linear-to-br from-primary/10 to-secondary/10 border-white/10 p-8 flex flex-col items-center justify-center text-center space-y-6">
                  <h2 className="text-xl font-bold uppercase tracking-widest text-primary">
                    Session Summary
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">😔</div>
                    <ChevronRight className="text-foreground/20" />
                    <div className="text-4xl">😊</div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-accent">+15 Points</p>
                    <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">
                      Mood Improvement
                    </p>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                        Activities
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold flex items-center justify-center gap-1">
                        <Flame size={20} className="text-orange-500" /> {streak}
                      </p>
                      <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                        Day Streak
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Rating Section */}
                <Card className="p-8 space-y-8 text-center">
                  <h2 className="text-xl font-bold">
                    How was ManoMitra today?
                  </h2>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className={`p-2 transition-all duration-300 transform ${
                          (hoverRating || rating) >= star
                            ? "scale-125 text-amber-400"
                            : "text-foreground/10"
                        }`}
                      >
                        <Star
                          size={32}
                          fill={
                            (hoverRating || rating) >= star
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-primary animate-pulse min-h-[20px]">
                    {rating > 0 ? ratingMessages[rating] : ""}
                  </p>
                </Card>
              </div>

              {/* Most Helpful Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">
                  What helped you most today?
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {helpfulOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => toggleHelpful(opt.id)}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                        selectedHelpful.includes(opt.id)
                          ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10"
                          : "bg-white/5 border-white/10 text-foreground/40 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Open Feedback */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">
                  Any suggestions for us?
                </h2>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:ring-2 focus:ring-primary outline-none resize-none transition-all placeholder:text-foreground/20 h-32"
                  placeholder="We're listening..."
                />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-10 pb-20">
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Submit Feedback <Send size={20} />
                </button>
                <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <Share2 size={20} /> Share ManoMitra
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center space-y-10 py-20"
            >
              <div className="flex justify-center">
                <div className="w-40 h-40 bg-accent/20 rounded-full flex items-center justify-center text-accent shadow-2xl animate-breathing border-4 border-accent/20">
                  <PartyPopper size={80} />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-bold">You did great!</h2>
                <p className="text-xl text-foreground/60 leading-relaxed">
                  Your feedback has been saved. We're using it to make ManoMitra
                  even more supportive for your next session.
                </p>
              </div>
              <Card className="p-8 bg-linear-to-r from-primary/10 to-secondary/10 border-white/10">
                <p className="text-lg font-playfair italic">
                  "Tomorrow is a fresh start. You've got this."
                </p>
              </Card>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <Home size={20} /> Dashboard
                </button>
                <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2 justify-center">
                  <Bell size={20} /> Set Reminder
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PageWrapper>
    </div>
  );
}
