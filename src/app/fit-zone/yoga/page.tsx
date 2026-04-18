"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { yogaData, YogaSequence } from "@/data/yogaData";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Wind,
  Info,
  CheckCircle2,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function YogaByMoodPage() {
  const [selectedSequence, setSelectedSequence] = useState<YogaSequence | null>(null);
  const [activePoseIndex, setActivePoseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const startSequence = (sequence: YogaSequence) => {
    setSelectedSequence(sequence);
    setActivePoseIndex(0);
    setTimeLeft(sequence.poses[0].duration);
    setIsPlaying(true);
    setIsCompleted(false);
  };

  const nextPose = useCallback(() => {
    if (!selectedSequence) return;
    if (activePoseIndex < selectedSequence.poses.length - 1) {
      const nextIndex = activePoseIndex + 1;
      setActivePoseIndex(nextIndex);
      setTimeLeft(selectedSequence.poses[nextIndex].duration);
    } else {
      setIsPlaying(false);
      setIsCompleted(true);
    }
  }, [activePoseIndex, selectedSequence]);

  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      nextPose();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, nextPose]);

  const activePose = selectedSequence?.poses[activePoseIndex];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Yoga & Movement</h1>
          <p className="text-foreground/60 text-lg">Guided somatic practices to release emotional tension.</p>
        </header>

        <AnimatePresence mode="wait">
          {!selectedSequence ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {yogaData.map((seq) => (
                <Card key={seq.id} className="group relative overflow-hidden h-full flex flex-col hover:scale-[1.02] transition-all cursor-pointer">
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      seq.intensity === "light" ? "bg-green-500/20 text-green-500" : "bg-orange-500/20 text-orange-500"
                    }`}>
                      {seq.intensity}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-bold">{seq.title}</h3>
                    <p className="text-foreground/60 text-sm">{seq.poses.length} poses • {seq.duration} minutes</p>
                    <div className="flex flex-wrap gap-2">
                      {seq.mood.map(m => (
                        <span key={m} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                          {m}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 py-4 border-t border-white/5">
                      {seq.poses.slice(0, 3).map((pose, i) => (
                        <div key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative">
                          <Image src={pose.imageUrl} alt={pose.name} fill className="object-cover opacity-60" />
                        </div>
                      ))}
                      <div className="text-xs text-foreground/40 font-bold">+{seq.poses.length - 3} more</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => startSequence(seq)}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all mt-6 shadow-xl shadow-primary/20"
                  >
                    Start Session <Play size={18} fill="currentColor" />
                  </button>
                </Card>
              ))}
            </motion.div>
          ) : isCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center space-y-8 py-20"
            >
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500/40">
                  <CheckCircle2 size={64} className="text-green-500" />
                </div>
              </div>
              <h2 className="text-4xl font-bold">Session Completed!</h2>
              <p className="text-foreground/60 text-lg leading-relaxed">
                Excellent work! How are you feeling now? Take a moment to acknowledge the shift in your energy.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedSequence(null)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Return to Hub
                </button>
                <button
                  onClick={() => startSequence(selectedSequence)}
                  className="flex-1 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
                >
                  Repeat Session
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto w-full"
            >
              {/* Pose Header */}
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setSelectedSequence(null)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-foreground/40"
                >
                  <RotateCcw size={24} />
                </button>
                <div className="text-center">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Pose {activePoseIndex + 1} of {selectedSequence.poses.length}</h3>
                  <h2 className="text-3xl font-bold">{activePose?.name} <span className="text-lg font-normal text-foreground/40">({activePose?.sanskrit})</span></h2>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-foreground/40">
                  <Maximize2 size={24} />
                </button>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <Image src={activePose?.imageUrl || ""} alt={activePose?.name || ""} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Timer Overlay */}
                  <div className="absolute bottom-8 left-8 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
                      {timeLeft}
                    </div>
                    <div className="text-white">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60">Seconds Left</p>
                      <p className="font-bold">Stay with the breath</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <Card className="bg-white/5 border-white/10">
                    <h4 className="font-bold mb-3 flex items-center gap-2 text-primary">
                      <Wind size={20} /> Breathing Cue
                    </h4>
                    <p className="text-lg italic">"{activePose?.breathingCue}"</p>
                  </Card>

                  <div className="space-y-4">
                    <h4 className="font-bold flex items-center gap-2">
                      <Info size={20} className="text-secondary" /> Benefits
                    </h4>
                    <p className="text-foreground/60 leading-relaxed">{activePose?.benefit}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-6 pt-8">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-105 transition-all"
                    >
                      {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                    </button>
                    <button 
                      onClick={nextPose}
                      className="p-4 bg-white/5 text-foreground/40 rounded-full hover:bg-white/10 transition-all"
                    >
                      <SkipForward size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PageWrapper>
    </div>
  );
}
