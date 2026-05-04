"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import EmotionTrendChart from "@/components/charts/EmotionTrendChart";
import { getSmartRecommendations, calculateMoodTrend } from "@/lib/utils";
import {
  Flame,
  Brain,
  Activity,
  Music,
  Moon,
  TrendingUp,
  ChevronRight,
  Smile,
  BarChart3,
  Zap,
  Award,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  const {
    user,
    streak,
    currentEmotion,
    emotionHistory,
    totalActivitiesCompleted,
    longestStreak,
  } = useStore();
  const { user: firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [greeting, setGreeting] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [moodTrend, setMoodTrend] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/auth/login");
    }
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("🌅 Good Morning");
    else if (hour < 17) setGreeting("☀️ Good Afternoon");
    else setGreeting("🌙 Good Evening");
  }, []);

  useEffect(() => {
    if (currentEmotion?.dominantEmotion) {
      setRecommendations(
        getSmartRecommendations(currentEmotion.dominantEmotion),
      );
    }

    const trend = calculateMoodTrend(emotionHistory, 7);
    setMoodTrend(trend);
  }, [currentEmotion, emotionHistory]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!firebaseUser) {
    return null;
  }

  const moodDirection =
    moodTrend.length > 1
      ? moodTrend[moodTrend.length - 1].avgIntensity > moodTrend[0].avgIntensity
        ? "up"
        : "down"
      : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">
            {greeting}, {user?.name || "Friend"}
          </h1>
          <p className="text-foreground/60 text-lg">
            How are you feeling today?
          </p>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="flex items-center gap-4 bg-primary/10 border-primary/20">
            <div className="p-4 bg-primary/20 rounded-2xl">
              <Smile className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Current Mood</p>
              <h3 className="text-2xl font-bold">
                {currentEmotion?.dominantEmotion || "Neutral"}
              </h3>
              {currentEmotion?.intensity && (
                <p className="text-xs text-foreground/40">
                  Intensity: {currentEmotion.intensity}%
                </p>
              )}
            </div>
          </Card>

          <Card className="flex items-center gap-4 bg-orange-500/10 border-orange-500/20">
            <div className="p-4 bg-orange-500/20 rounded-2xl">
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Streak</p>
              <h3 className="text-2xl font-bold">{streak} Days</h3>
              <p className="text-xs text-foreground/40">
                Best: {longestStreak} days
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 bg-accent/10 border-accent/20">
            <div className="p-4 bg-accent/20 rounded-2xl">
              <Activity className="w-8 h-8 text-accent" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Completed</p>
              <h3 className="text-2xl font-bold">{totalActivitiesCompleted}</h3>
              <p className="text-xs text-foreground/40">activities logged</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 bg-secondary/10 border-secondary/20">
            <div className="p-4 bg-secondary/20 rounded-2xl">
              <BarChart3 className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Check-ins</p>
              <h3 className="text-2xl font-bold">{emotionHistory.length}</h3>
              {moodDirection && (
                <p className="text-xs text-foreground/40 flex items-center gap-1">
                  {moodDirection === "up" ? (
                    <>
                      <ArrowUpRight className="w-3 h-3 text-green-400" />{" "}
                      trending up
                    </>
                  ) : (
                    <>
                      <ArrowDownLeft className="w-3 h-3 text-red-400" />{" "}
                      trending down
                    </>
                  )}
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Text Analysis",
              icon: Brain,
              href: "/text-emotion",
              color: "bg-purple-500",
            },
            {
              label: "Face Detection",
              icon: Smile,
              href: "/face-emotion",
              color: "bg-pink-500",
            },
            {
              label: "Voice Analysis",
              icon: Music,
              href: "/voice-emotion",
              color: "bg-blue-500",
            },
            {
              label: "Analytics",
              icon: BarChart3,
              href: "/analytics",
              color: "bg-green-500",
            },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className="flex flex-col items-center gap-3 p-4 hover:scale-105 transition-transform cursor-pointer text-center h-full">
                <div className={`p-3 rounded-xl ${action.color} text-white`}>
                  <action.icon size={24} />
                </div>
                <span className="font-medium text-sm">{action.label}</span>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Emotion Trend */}
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-primary" />
              Your 7-Day Trend
            </h2>
            {emotionHistory.length > 0 ? (
              <EmotionTrendChart emotionHistory={emotionHistory} days={7} />
            ) : (
              <div className="h-64 flex items-center justify-center text-foreground/40">
                <p>Start tracking your emotions to see trends</p>
              </div>
            )}
            <Link
              href="/analytics"
              className="mt-6 w-full py-2 bg-white/5 text-foreground/60 rounded-xl text-center text-sm hover:bg-white/10 transition-colors"
            >
              View Full Analytics →
            </Link>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-white/10 flex flex-col p-8">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <Zap size={24} />
              <h2 className="text-xl font-bold">Personalized Suggestions</h2>
            </div>
            <div className="space-y-4 flex-1">
              {recommendations.length > 0 ? (
                recommendations.slice(0, 3).map((rec, index) => (
                  <motion.div
                    key={rec.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{rec.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{rec.name}</p>
                        <p className="text-xs text-foreground/60 mt-1">
                          {rec.description}
                        </p>
                      </div>
                      <ChevronRight className="text-foreground/40 group-hover:text-foreground/60 transition-colors" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-foreground/40 text-sm">
                  Log an emotion check-in to get personalized suggestions
                </p>
              )}
            </div>
            <Link
              href="/mood-support"
              className="mt-6 w-full py-3 bg-primary text-white rounded-xl text-center font-bold hover:bg-primary/90 transition-colors"
            >
              Explore All Recommendations
            </Link>
          </Card>
        </div>
      </PageWrapper>
    </div>
  );
}
