"use client";

import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { 
  Music, 
  Activity, 
  Brain, 
  Utensils, 
  Moon, 
  Sparkles, 
  ChevronRight,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const fitZones = [
  { 
    id: "music", 
    title: "Music by Mood", 
    description: "Ragas and lo-fi beats curated for your soul.", 
    icon: Music, 
    color: "from-purple-500 to-indigo-600", 
    href: "/fit-zone/music",
    count: 24
  },
  { 
    id: "yoga", 
    title: "Yoga & Movement", 
    description: "Guided sessions to ground your energy.", 
    icon: Activity, 
    color: "from-green-500 to-emerald-600", 
    href: "/fit-zone/yoga",
    count: 15
  },
  { 
    id: "mental", 
    title: "Mental Wellness", 
    description: "CBT tools, journaling, and grounding exercises.", 
    icon: Brain, 
    color: "from-blue-500 to-cyan-600", 
    href: "/fit-zone/mental",
    count: 32
  },
  { 
    id: "food", 
    title: "Food & Nutrition", 
    description: "Mood-boosting recipes and Ayurvedic wisdom.", 
    icon: Utensils, 
    color: "from-orange-500 to-red-600", 
    href: "/fit-zone/food",
    count: 18
  },
  { 
    id: "sleep", 
    title: "Sleep Optimization", 
    description: "Track and improve your rest cycles.", 
    icon: Moon, 
    color: "from-indigo-600 to-blue-900", 
    href: "/fit-zone/sleep",
    count: 10
  },
];

export default function FitZoneHub() {
  const { currentEmotion } = useStore();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">Fit Zone Hub</h1>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-bold border border-primary/10">
              {currentEmotion?.dominantEmotion || "Neutral"} Mode
            </span>
          </div>
          <p className="text-foreground/60 text-lg">Your personalized toolkit for holistic wellness.</p>
        </header>

        {/* AI Insight Bar */}
        <Card className="mb-10 bg-gradient-to-r from-primary/10 to-secondary/10 border-white/10 flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20 text-white">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">AI Recommendation</p>
              <h3 className="text-lg font-bold">"Best for you right now: Guided Yoga and Indian Classical Ragas"</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-green-500">Mood Improving</span>
          </div>
        </Card>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fitZones.map((zone, idx) => (
            <Link key={zone.id} href={zone.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative h-full"
              >
                <Card className="h-full p-8 overflow-hidden hover:scale-[1.02] transition-all cursor-pointer border-white/10 bg-white/5 flex flex-col">
                  {/* Background Gradient */}
                  <div className={`absolute -right-20 -top-20 w-48 h-48 bg-gradient-to-br ${zone.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-14 h-14 bg-gradient-to-br ${zone.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl`}>
                      <zone.icon size={28} />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{zone.title}</h3>
                      {idx < 2 && (
                        <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                          AI Recommended
                        </span>
                      )}
                    </div>
                    
                    <p className="text-foreground/60 text-sm mb-8 leading-relaxed flex-1">
                      {zone.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-bold text-foreground/40 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        {zone.count} activities inside
                      </span>
                      <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </PageWrapper>
    </div>
  );
}
