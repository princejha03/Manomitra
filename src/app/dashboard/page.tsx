"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import {
  Flame,
  Brain,
  Activity,
  Music,
  Moon,
  Search,
  TrendingUp,
  ChevronRight,
  Smile,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import Link from "next/link";

const dummyMoodData = [
  { day: "Mon", score: 65, emotion: "Happy" },
  { day: "Tue", score: 45, emotion: "Sad" },
  { day: "Wed", score: 80, emotion: "Happy" },
  { day: "Thu", score: 30, emotion: "Anxious" },
  { day: "Fri", score: 55, emotion: "Neutral" },
  { day: "Sat", score: 90, emotion: "Happy" },
  { day: "Sun", score: 75, emotion: "Calm" },
];

export default function Dashboard() {
  const { user, streak, currentEmotion } = useStore();
  const { user: firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [greeting, setGreeting] = useState("");

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!firebaseUser) {
    return null;
  }

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="flex items-center gap-4 bg-primary/10 border-primary/20">
            <div className="p-4 bg-primary/20 rounded-2xl">
              <Smile className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Current Mood</p>
              <h3 className="text-2xl font-bold">
                {currentEmotion?.dominantEmotion || "Neutral"}
              </h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4 bg-orange-500/10 border-orange-500/20">
            <div className="p-4 bg-orange-500/20 rounded-2xl">
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Streak</p>
              <h3 className="text-2xl font-bold">{streak} Days</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4 bg-accent/10 border-accent/20">
            <div className="p-4 bg-accent/20 rounded-2xl">
              <Activity className="w-8 h-8 text-accent" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Activities Today</p>
              <h3 className="text-2xl font-bold">2 / 3 Completed</h3>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Check Mood",
              icon: Search,
              href: "/text-emotion",
              color: "bg-purple-500",
            },
            {
              label: "Start Yoga",
              icon: Activity,
              href: "/fit-zone/yoga",
              color: "bg-green-500",
            },
            {
              label: "Play Music",
              icon: Music,
              href: "/fit-zone/music",
              color: "bg-blue-500",
            },
            {
              label: "Sleep Plan",
              icon: Moon,
              href: "/fit-zone/sleep",
              color: "bg-indigo-500",
            },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className="flex flex-col items-center gap-3 p-4 hover:scale-105 transition-transform cursor-pointer text-center">
                <div className={`p-3 rounded-xl ${action.color} text-white`}>
                  <action.icon size={24} />
                </div>
                <span className="font-medium text-sm">{action.label}</span>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Emotion Timeline */}
          <Card className="h-100 flex flex-col">
            <h2 className="text-xl font-bold mb-6">Emotion Timeline</h2>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dummyMoodData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff10"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#ffffff40"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161B22",
                      border: "1px solid #ffffff10",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6C63FF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* AI Recommendation */}
          <Card className="bg-linear-to-br from-primary/20 to-secondary/20 border-white/10 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Brain size={24} />
              <h2 className="text-xl font-bold">AI Insight</h2>
            </div>
            <div className="flex-1">
              <p className="text-lg mb-6 leading-relaxed">
                "Based on your mood today, we noticed you might be feeling a bit
                stressed. How about a 5-minute grounding exercise to help you
                find your center?"
              </p>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <TrendingUp className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">5-Min Meditation</p>
                  <p className="text-xs text-foreground/60">
                    Guided breathing session
                  </p>
                </div>
                <ChevronRight className="text-foreground/40" />
              </div>
            </div>
            <Link
              href="/mood-support"
              className="mt-6 w-full py-3 bg-primary text-white rounded-xl text-center font-bold hover:bg-primary/90 transition-colors"
            >
              See All Recommendations
            </Link>
          </Card>
        </div>
      </PageWrapper>
    </div>
  );
}
