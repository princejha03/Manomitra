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
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
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
import { cn } from "@/lib/utils";

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
  const { user, streak, currentEmotion, emotionHistory, todos, addTodo, toggleTodo, deleteTodo } = useStore();
  const { user: firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [greeting, setGreeting] = useState("");
  const [newTodo, setNewTodo] = useState("");

  const chartData = emotionHistory.length >= 3 
    ? emotionHistory.slice(-7).map(e => ({
        day: new Date(e.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
        score: e.intensity,
        emotion: e.dominantEmotion
      }))
    : dummyMoodData;

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/auth/login");
    }
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setGreeting("🌅 Good Morning");
      else if (hour >= 12 && hour < 17) setGreeting("☀️ Good Afternoon");
      else if (hour >= 17 && hour < 21) setGreeting("🌙 Good Evening");
      else setGreeting("🌌 Good Night");
    };

    updateGreeting();
    // Update greeting every minute in case time changes while user is on page
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-foreground/60 font-medium">Loading your wellness dashboard...</p>
        </div>
      </div>
    );
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
          <Card className="h-[400px] flex flex-col">
            <h2 className="text-xl font-bold mb-6">Emotion Timeline</h2>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
        </div>

        {/* Todo List & More */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Todo List */}
          <Card className="lg:col-span-1 flex flex-col max-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="text-primary" size={24} />
                Daily Wellness Tasks
              </h2>
              <span className="text-xs text-foreground/40 font-medium">
                {todos.filter(t => t.completed).length}/{todos.length} Done
              </span>
            </div>
            
            <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a wellness task..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                type="submit"
                className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all"
              >
                <Plus size={20} />
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {todos.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2 text-foreground/20">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-sm text-foreground/40 italic">No tasks yet. Add one to stay mindful!</p>
                </div>
              ) : (
                todos.sort((a, b) => b.createdAt - a.createdAt).map((todo) => (
                  <div
                    key={todo.id}
                    className={cn(
                      "group flex items-center gap-3 p-3 rounded-xl border border-white/5 transition-all",
                      todo.completed ? "bg-white/5 opacity-60" : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="text-primary hover:scale-110 transition-transform"
                    >
                      {todo.completed ? (
                        <CheckCircle2 size={20} fill="currentColor" />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>
                    <span className={cn(
                      "flex-1 text-sm font-medium",
                      todo.completed && "line-through"
                    )}>
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500/50 hover:text-red-500 transition-all p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="lg:col-span-2 bg-linear-to-br from-primary/10 to-accent/10 border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-accent" size={24} />
              Your Progress Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xs text-foreground/40 uppercase font-bold tracking-wider mb-1">Consistency</p>
                <div className="flex items-end gap-2">
                  <h4 className="text-3xl font-bold">85%</h4>
                  <span className="text-green-500 text-xs font-bold mb-1">+12%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-green-500 w-[85%]" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xs text-foreground/40 uppercase font-bold tracking-wider mb-1">Mood Stability</p>
                <div className="flex items-end gap-2">
                  <h4 className="text-3xl font-bold">Good</h4>
                  <span className="text-blue-500 text-xs font-bold mb-1">Stable</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-blue-500 w-[70%]" />
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-primary/20 rounded-2xl border border-primary/30 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-primary mb-1">Weekly Challenge</h4>
                <p className="text-xs text-foreground/80">Complete 5 yoga sessions this week to earn a badge!</p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                2/5
              </div>
            </div>
          </Card>
        </div>
      </PageWrapper>
    </div>
  );
}
