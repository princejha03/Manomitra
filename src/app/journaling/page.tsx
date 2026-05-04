"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import {
  getJournalPrompt,
  getCopingStrategies,
  getAffirmation,
  journalPrompts,
} from "@/lib/wellnessResources";
import { Emotion } from "@/types";
import {
  BookOpen,
  Lightbulb,
  Heart,
  RefreshCw,
  Save,
  Smile,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function JournalingPage() {
  const { currentEmotion, addActivityLog } = useStore();
  const { user: firebaseUser, loading } = useAuth();
  const router = useRouter();

  const [journalText, setJournalText] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [selectedMood, setSelectedMood] = useState<Emotion | null>(
    currentEmotion?.dominantEmotion || "Calm",
  );
  const [copingTips, setCopingTips] = useState<any[]>([]);
  const [affirmation, setAffirmation] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [sessionStart, setSessionStart] = useState(Date.now());

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/auth/login");
    }
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    if (selectedMood) {
      const prompt = getJournalPrompt(selectedMood);
      setCurrentPrompt(prompt);
      setCopingTips(getCopingStrategies(selectedMood));
      setAffirmation(getAffirmation(selectedMood));
    }
  }, [selectedMood]);

  useEffect(() => {
    setWordCount(journalText.trim().split(/\s+/).length);
  }, [journalText]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!firebaseUser) {
    return null;
  }

  const moods: Emotion[] = [
    "Happy",
    "Sad",
    "Anxious",
    "Angry",
    "Calm",
    "Neutral",
  ];

  const handleSaveJournal = () => {
    if (journalText.trim() && selectedMood) {
      addActivityLog({
        activityType: "journaling",
        activityName: "Journaling Session",
        duration: Math.ceil((Date.now() - sessionStart) / 60000),
        rating: journalText.length > 200 ? 5 : journalText.length > 100 ? 4 : 3,
        mood: selectedMood,
        feedback: journalText.substring(0, 100) + "...",
        startTime: sessionStart,
        endTime: Date.now(),
      });
      setSaved(true);
      setTimeout(() => {
        setJournalText("");
        setSaved(false);
        setSessionStart(Date.now());
      }, 2000);
    }
  };

  const handleNewPrompt = () => {
    if (selectedMood) {
      const prompts = journalPrompts[selectedMood];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setCurrentPrompt(randomPrompt);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Journaling Space</h1>
          <p className="text-foreground/60">
            Reflect, process, and understand your emotions through writing
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Main Journal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Selector */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Smile className="text-primary" />
                How are you feeling?
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                      selectedMood === mood
                        ? "bg-primary text-white"
                        : "bg-white/5 text-foreground/60 hover:bg-white/10"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </Card>

            {/* Journal Input */}
            <Card className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="text-primary" />
                  Your Thoughts
                </h3>
                <span className="text-sm text-foreground/60">
                  {wordCount} words
                </span>
              </div>

              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write freely. There's no right or wrong here. Let your thoughts flow..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 text-foreground placeholder-foreground/40 resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
              />

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleSaveJournal}
                  disabled={!journalText.trim()}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {saved ? "Saved!" : "Save Entry"}
                </button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prompt */}
            {currentPrompt && (
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-white/10">
                <div className="flex items-start gap-3 mb-3">
                  <Lightbulb className="text-yellow-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-2">Journal Prompt</h4>
                    <p className="text-sm italic leading-relaxed">
                      "{currentPrompt}"
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleNewPrompt}
                  className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  New Prompt
                </button>
              </Card>
            )}

            {/* Coping Strategies */}
            <Card className="p-6">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Heart className="text-red-400" />
                Coping Strategies
              </h4>
              <div className="space-y-3">
                {copingTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <p className="font-medium text-sm mb-1">{tip.name}</p>
                    <p className="text-xs text-foreground/60">
                      {tip.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Affirmation */}
            {affirmation && (
              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <p className="text-sm font-medium mb-2 text-green-400">
                  Today's Affirmation
                </p>
                <p className="text-sm italic leading-relaxed">
                  "✨ {affirmation}"
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Tips */}
        <Card className="p-6 bg-blue-500/10 border-blue-500/20">
          <div className="flex gap-4 items-start">
            <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold mb-2 text-blue-300">Journaling Tips</h4>
              <ul className="text-sm space-y-1 text-foreground/70">
                <li>• Write without judgment or editing</li>
                <li>• Focus on your feelings, not facts</li>
                <li>• Use all five senses in your descriptions</li>
                <li>• It's okay to be raw and honest</li>
                <li>• There's no "right" way to journal</li>
              </ul>
            </div>
          </div>
        </Card>
      </PageWrapper>
    </div>
  );
}
