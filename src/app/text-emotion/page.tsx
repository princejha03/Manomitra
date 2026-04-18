"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { analyzeTextEmotion } from "@/lib/huggingface";
import { analyzeTextGravity } from "@/lib/gravityai";
import { 
  Loader2, 
  Zap, 
  HelpCircle,
  TrendingUp,
  Brain
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Cell
} from "recharts";
import { useRouter } from "next/navigation";
import { mapToInternalEmotion } from "@/lib/utils";

const emotionColors: Record<string, string> = {
  joy: "#FFD700",
  sadness: "#6495ED",
  anger: "#FF6B6B",
  fear: "#FFA07A",
  surprise: "#98FB98",
  disgust: "#C0C0C0",
  neutral: "#98FB98",
};

const emotionEmojis: Record<string, string> = {
  joy: "😊",
  sadness: "😔",
  anger: "😠",
  fear: "😨",
  surprise: "😲",
  disgust: "🤢",
  neutral: "😐",
};

export default function TextEmotionModule() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [gravityResults, setGravityResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentEmotion, addEmotionToHistory } = useStore();
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!text.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const [hfResult, gravityResult] = await Promise.all([
        analyzeTextEmotion(text),
        analyzeTextGravity(text)
      ]);

      if (hfResult && Array.isArray(hfResult)) {
        setResults(hfResult);
        setGravityResults(gravityResult);

        // Find dominant emotion
        const dominant = hfResult.reduce((prev: any, current: any) => 
          prev.score > current.score ? prev : current
        );

        const internalDominant = mapToInternalEmotion(dominant.label);

        const emotionProfile = {
          dominantEmotion: internalDominant,
          intensity: Math.round(dominant.score * 100),
          wellbeingIndex: gravityResult?.wellbeing_score || 70,
          scores: hfResult.reduce((acc: any, curr: any) => ({ ...acc, [mapToInternalEmotion(curr.label)]: curr.score }), {}),
          timestamp: Date.now(),
        };

        setCurrentEmotion(emotionProfile);
        addEmotionToHistory(emotionProfile);
      } else {
        setError("Could not analyze text. Please try again with different words.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const placeholders = [
    "How are you feeling right now?",
    "What happened today?",
    "What's on your mind?",
    "You can say anything here..."
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Text Emotion Analysis</h1>
          <p className="text-foreground/60">Share your thoughts and let ManoMitra understand your heart.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4">Express Yourself</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:ring-2 focus:ring-primary outline-none resize-none transition-all placeholder:text-foreground/20"
              placeholder={placeholders[0]}
              maxLength={2000}
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-foreground/40">{text.length} / 2000 characters</span>
              <button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Zap size={20} fill="currentColor" /> Analyze My Emotions
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 text-red-400 rounded-xl flex items-center gap-2 text-sm border border-red-500/20">
                <Brain size={16} /> {error}
              </div>
            )}
          </Card>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {results ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <Card className="text-center p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-white/10">
                  <div className="text-7xl mb-4">
                    {emotionEmojis[results[0].label] || "😐"}
                  </div>
                  <h3 className="text-3xl font-bold mb-2 capitalize">
                    Feeling {results[0].label}
                  </h3>
                  <p className="text-foreground/60 mb-6">
                    ManoMitra is {Math.round(results[0].score * 100)}% confident in this analysis.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-sm text-foreground/40 mb-1">Wellbeing Score</p>
                      <p className="text-2xl font-bold text-secondary">
                        {gravityResults?.wellbeing_score || 70}/100
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-sm text-foreground/40 mb-1">Intensity</p>
                      <p className="text-2xl font-bold text-primary">
                        {Math.round(results[0].score * 100)}%
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h4 className="font-bold mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    Emotion Breakdown
                  </h4>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={results} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="label" 
                          type="category" 
                          stroke="#ffffff60" 
                          fontSize={12} 
                          width={80}
                        />
                        <Bar 
                          dataKey="score" 
                          radius={[0, 8, 8, 0]} 
                          animationDuration={1500}
                        >
                          {results.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={emotionColors[entry.label] || "#6C63FF"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <button
                  onClick={() => router.push("/mood-support")}
                  className="w-full py-4 bg-secondary text-white rounded-xl font-bold text-lg hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2"
                >
                  <Brain size={20} /> Based on your emotions → See Recommendations
                </button>
              </motion.div>
            ) : (
              <Card className="flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-white/10 opacity-60">
                <HelpCircle size={64} className="text-foreground/20 mb-4" />
                <h3 className="text-xl font-bold text-foreground/40">Waiting for Analysis</h3>
                <p className="text-sm text-foreground/40 max-w-xs mt-2">
                  Once you analyze your text, your emotion profile will appear here.
                </p>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </PageWrapper>
    </div>
  );
}
