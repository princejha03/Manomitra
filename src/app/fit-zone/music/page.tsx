"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { musicData, Playlist } from "@/data/musicData";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  TrendingUp,
  Sparkles,
  Info,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const moods = [
  "Happy", "Sad", "Anxious", "Calm", "Energetic", "Focused", "Neutral"
];

export default function MusicByMoodPage() {
  const { currentEmotion } = useStore();
  const [selectedMood, setSelectedMood] = useState<string>(currentEmotion?.dominantEmotion || "Neutral");
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredPlaylists = musicData.filter(p => p.mood.includes(selectedMood));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Music by Mood</h1>
          <p className="text-foreground/60 text-lg">Heal through Ragas, beats, and the wisdom of sound.</p>
        </header>

        {/* Mood Selector */}
        <div className="flex overflow-x-auto gap-4 mb-10 pb-4 custom-scrollbar">
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap border ${
                selectedMood === mood 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "bg-white/5 text-foreground/40 border-white/10 hover:bg-white/10"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* AI Enhancement Card */}
        <Card className="mb-10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-white/10 flex items-center justify-between p-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-500 rounded-2xl shadow-xl text-white">
              <Sparkles size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-400 mb-1 uppercase tracking-widest">Gravity AI Healing Journey</p>
              <h3 className="text-xl font-bold mb-2">"Starting with Raga Bhairavi to validate your sadness, transitioning to Yaman for a mood lift."</h3>
              <p className="text-sm text-foreground/40 flex items-center gap-2">
                <TrendingUp size={14} /> Tempo: 60-80 BPM | Healing Freq: 432Hz
              </p>
            </div>
          </div>
          <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-2">
            Play Journey <ChevronRight size={18} />
          </button>
        </Card>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {filteredPlaylists.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="group h-full p-0 overflow-hidden bg-white/5 border-white/10 hover:scale-[1.02] transition-all flex flex-col">
                <div className={`h-40 w-full bg-gradient-to-br ${p.coverColor} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <button 
                      onClick={() => { setActivePlaylist(p); setIsPlaying(true); }}
                      className="p-4 bg-white rounded-full text-black shadow-2xl scale-75 group-hover:scale-100 transition-transform"
                    >
                      <Play size={32} fill="currentColor" />
                    </button>
                  </div>
                  {p.raga && (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                      {p.raga}
                    </span>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{p.title}</h3>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {p.genre}
                    </span>
                  </div>
                  <p className="text-foreground/60 text-sm mb-6 flex-1">{p.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-xs text-foreground/40 font-bold">{p.duration} Minutes</span>
                    <button className="text-foreground/40 hover:text-primary transition-colors">
                      <Info size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Music Therapy Info */}
        <Card className="mb-10 bg-white/5 border-white/10 border-dashed border-2">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/5 rounded-xl text-foreground/40">
              <Info size={24} />
            </div>
            <div>
              <h4 className="font-bold mb-2">Why Ragas?</h4>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Indian Classical Ragas are time-specific and mood-specific sound structures that resonate with the body's energy centers. Raga Yaman is known to evoke peace and devotion, while Bhairav is for early morning mental clarity.
              </p>
            </div>
          </div>
        </Card>

        {/* Bottom Player */}
        <AnimatePresence>
          {activePlaylist && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-0 left-[280px] right-0 h-24 bg-card/80 backdrop-blur-2xl border-t border-white/10 z-50 flex items-center px-10 gap-12"
            >
              <div className="flex items-center gap-4 min-w-[300px]">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${activePlaylist.coverColor} shadow-lg`} />
                <div>
                  <h4 className="font-bold text-sm">{activePlaylist.title}</h4>
                  <p className="text-xs text-foreground/40">{activePlaylist.raga || activePlaylist.genre}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl">
                <div className="flex items-center gap-8">
                  <button className="text-foreground/40 hover:text-foreground transition-colors"><SkipBack size={20} /></button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-xl hover:scale-105 transition-all"
                  >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                  </button>
                  <button className="text-foreground/40 hover:text-foreground transition-colors"><SkipForward size={20} /></button>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[35%] rounded-full shadow-[0_0_10px_rgba(108,99,255,0.8)]" />
                </div>
              </div>

              <div className="flex items-center gap-4 min-w-[200px] justify-end">
                <Volume2 size={20} className="text-foreground/40" />
                <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-foreground/40 w-[70%] rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PageWrapper>
    </div>
  );
}
