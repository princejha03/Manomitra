"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import EmotionTrendChart from "@/components/charts/EmotionTrendChart";
import {
  getEmotionStats,
  analyzeActivityEffectiveness,
  detectMoodPatterns,
} from "@/lib/utils";
import {
  TrendingUp,
  Activity,
  Calendar,
  Zap,
  Target,
  Clock,
  Heart,
  AlertCircle,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Analytics() {
  const { emotionHistory, activityLogs, streak, longestStreak } = useStore();
  const { user: firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(7);
  const [stats, setStats] = useState<any>(null);
  const [activityEffectiveness, setActivityEffectiveness] = useState<any>(null);
  const [patterns, setPatterns] = useState<any>(null);

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/auth/login");
    }
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    const newStats = getEmotionStats(emotionHistory, timeRange);
    setStats(newStats);

    const effectiveness = analyzeActivityEffectiveness(
      activityLogs,
      emotionHistory,
    );
    setActivityEffectiveness(effectiveness);

    const moodPatterns = detectMoodPatterns(emotionHistory);
    setPatterns(moodPatterns);
  }, [timeRange, emotionHistory, activityLogs]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!firebaseUser) {
    return null;
  }

  const emotionColors: { [key: string]: string } = {
    Happy: "#fbbf24",
    Sad: "#60a5fa",
    Anxious: "#f87171",
    Angry: "#dc2626",
    Calm: "#a78bfa",
    Neutral: "#9ca3af",
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Your Wellness Analytics</h1>
          <p className="text-foreground/60">
            Deep insights into your emotional patterns and progress
          </p>
        </header>

        {/* Time Range Selector */}
        <div className="flex gap-4 mb-8">
          {([7, 30, 90] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? "bg-primary text-white"
                  : "bg-white/5 text-foreground/60 hover:bg-white/10"
              }`}
            >
              {range} Days
            </button>
          ))}
        </div>

        {/* Emotion Trend Chart */}
        <Card className="mb-10 p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-primary" />
            Emotional Trend
          </h2>
          <EmotionTrendChart emotionHistory={emotionHistory} days={timeRange} />
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="p-6 bg-primary/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">Check-ins</p>
                <h3 className="text-3xl font-bold">
                  {stats?.totalEntries || 0}
                </h3>
              </div>
              <Heart className="w-12 h-12 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-secondary/10 border-secondary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">Avg Mood</p>
                <h3 className="text-3xl font-bold">
                  {stats?.averageIntensity || 0}%
                </h3>
              </div>
              <Zap className="w-12 h-12 text-secondary opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-orange-500/10 border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">
                  Current Streak
                </p>
                <h3 className="text-3xl font-bold">{streak}</h3>
              </div>
              <Award className="w-12 h-12 text-orange-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-rose-500/10 border-rose-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">
                  Longest Streak
                </p>
                <h3 className="text-3xl font-bold">{longestStreak}</h3>
              </div>
              <Target className="w-12 h-12 text-rose-500 opacity-50" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Dominant Emotions */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Heart className="text-primary" />
              Dominant Emotions
            </h3>
            <div className="space-y-4">
              {stats?.dominantEmotions?.length > 0 ? (
                stats.dominantEmotions.map((emotion: string, index: number) => {
                  const count = stats.emotionBreakdown[emotion] || 0;
                  const percentage = Math.round(
                    (count / stats.totalEntries) * 100,
                  );
                  return (
                    <motion.div
                      key={emotion}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor:
                              emotionColors[emotion] || "#9ca3af",
                          }}
                        />
                        <span className="font-medium">{emotion}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{percentage}%</p>
                        <p className="text-xs text-foreground/40">
                          {count} times
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-foreground/40">No emotion data yet</p>
              )}
            </div>
          </Card>

          {/* Activity Effectiveness */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Activity className="text-secondary" />
              Top Activities
            </h3>
            <div className="space-y-4">
              {activityEffectiveness && activityEffectiveness.length > 0 ? (
                activityEffectiveness.slice(0, 5).map((activity: any) => (
                  <motion.div
                    key={activity.type}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold capitalize">
                        {activity.type}
                      </span>
                      <span className="text-sm text-foreground/60">
                        {activity.count}x
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${(activity.avgRating / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-foreground/40 mt-2">
                      Avg Rating: {activity.avgRating.toFixed(1)}/5 • Avg
                      Duration: {activity.avgDuration}m
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-foreground/40">No activities logged yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Mood Patterns */}
        {patterns && (
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="text-rose-500" />
              Your Patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-foreground/60 mb-2">Best Time</p>
                <p className="text-xl font-bold text-green-400">
                  {patterns.bestTime}
                </p>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-foreground/60 mb-2">Need Support</p>
                <p className="text-xl font-bold text-red-400">
                  {patterns.worstTime}
                </p>
              </div>
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-foreground/60 mb-2">Tip</p>
                <p className="text-sm text-blue-300">
                  {patterns.triggers[0] || "Keep tracking to discover patterns"}
                </p>
              </div>
            </div>
          </Card>
        )}
      </PageWrapper>
    </div>
  );
}
