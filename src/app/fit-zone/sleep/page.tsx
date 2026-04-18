"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { sleepHistory, sleepHygieneTips, SleepLog } from "@/data/sleepData";
import { 
  Moon, 
  Sparkles, 
  Clock, 
  Star, 
  AlertCircle, 
  TrendingUp, 
  Smartphone,
  ChevronRight,
  Brain,
  Activity
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const architectureData = [
  { time: "23:00", stage: 1, label: "Awake" },
  { time: "23:15", stage: 2, label: "Light" },
  { time: "23:45", stage: 3, label: "Deep" },
  { time: "00:30", stage: 4, label: "REM" },
  { time: "01:00", stage: 2, label: "Light" },
  { time: "02:00", stage: 3, label: "Deep" },
  { time: "03:00", stage: 4, label: "REM" },
  { time: "04:30", stage: 3, label: "Deep" },
  { time: "05:30", stage: 4, label: "REM" },
  { time: "06:30", stage: 2, label: "Light" },
  { time: "07:00", stage: 1, label: "Awake" },
];

export default function SleepOptimizationPage() {
  const { user } = useStore();
  const [bedtime, setBedtime] = useState("23:00");
  const [waketime, setWaketime] = useState("07:00");
  const [quality, setQuality] = useState(4);
  
  const calculateDuration = (start: string, end: string) => {
    const s = new Date(`2000-01-01T${start}:00`);
    const e = new Date(`2000-01-01T${end}:00`);
    if (e < s) e.setDate(e.getDate() + 1);
    return (e.getTime() - s.getTime()) / (1000 * 60 * 60);
  };

  const duration = calculateDuration(bedtime, waketime);
  const cycles = Math.floor(duration * 60 / 90);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Sleep Optimization</h1>
          <p className="text-foreground/60 text-lg">Rest is not a luxury, it's a necessity for your mental health.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Section A: Sleep Tracker Input */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-8 space-y-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity size={20} className="text-primary" /> Track Your Rest
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <Moon size={20} className="text-indigo-400" />
                    <span className="text-sm font-medium">Bedtime</span>
                  </div>
                  <input 
                    type="time" 
                    value={bedtime} 
                    onChange={(e) => setBedtime(e.target.value)}
                    className="bg-transparent text-lg font-bold outline-none" 
                  />
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={20} className="text-amber-400" />
                    <span className="text-sm font-medium">Wake Time</span>
                  </div>
                  <input 
                    type="time" 
                    value={waketime} 
                    onChange={(e) => setWaketime(e.target.value)}
                    className="bg-transparent text-lg font-bold outline-none" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground/60">Sleep Quality</p>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => setQuality(star)}
                      className={`p-3 rounded-xl transition-all ${star <= quality ? "text-amber-400 bg-amber-400/10" : "text-foreground/20 bg-white/5"}`}
                    >
                      <Star size={24} fill={star <= quality ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => {
                  alert("Sleep log saved successfully! 🌙");
                }}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
              >
                Save Sleep Log
              </button>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-white/10">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-indigo-400">
                <Clock size={20} /> Sleep Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Total Duration</span>
                  <span className="font-bold">{duration.toFixed(1)} Hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">90-min Cycles</span>
                  <span className="font-bold">{cycles} Cycles</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[80%]" />
                </div>
                <p className="text-[10px] text-foreground/40 text-center uppercase tracking-widest font-bold">
                  Target: 5-6 cycles (7.5-9 hours)
                </p>
              </div>
            </Card>
          </div>

          {/* Section B: Sleep Architecture Chart */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Sleep Architecture</h2>
                <div className="flex gap-4">
                  {["Awake", "Light", "Deep", "REM"].map((label, idx) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${["bg-red-400", "bg-blue-400", "bg-indigo-600", "bg-purple-400"][idx]}`} />
                      <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={architectureData}>
                    <defs>
                      <linearGradient id="colorStage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis hide domain={[1, 4]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#161B22", border: "1px solid #ffffff10", borderRadius: "12px", color: "#fff" }}
                    />
                    <Area 
                      type="stepAfter" 
                      dataKey="stage" 
                      stroke="#6366f1" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorStage)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Gravity AI Sleep Insight */}
            <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-white/10 flex items-center justify-between p-8">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-indigo-500 rounded-2xl shadow-xl text-white">
                  <Sparkles size={32} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-indigo-400 mb-1 uppercase tracking-widest">Gravity AI Sleep Insight</p>
                  <h3 className="text-xl font-bold mb-2">"Your patterns suggest sleep anxiety. Try a 10-min Raga session before bed."</h3>
                  <p className="text-sm text-foreground/60">Gravity AI recommends: Magnesium, 18°C Room, No Screens from 10 PM.</p>
                </div>
              </div>
            </Card>

            {/* Hygiene Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="space-y-6">
                <h3 className="font-bold flex items-center gap-2">
                  <Smartphone size={20} className="text-primary" /> Digital Detox
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Wind-down starts", time: "21:00", icon: Moon },
                    { label: "Phone away", time: "21:30", icon: Smartphone },
                    { label: "In bed", time: "22:15", icon: Clock },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <item.icon size={16} className="text-foreground/40" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <span className="font-bold text-sm">{item.time}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="space-y-6">
                <h3 className="font-bold flex items-center gap-2">
                  <AlertCircle size={20} className="text-amber-400" /> Sleep Hygiene Tips
                </h3>
                <div className="space-y-3">
                  {sleepHygieneTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-foreground/60 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
