"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { 
  FileText, 
  Sparkles, 
  Target, 
  Heart,
  ChevronRight,
  Send,
  Brain,
  Zap,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { journalingPrompts, affirmations, cognitiveDistortions } from "@/data/activitiesData";

type Tab = "Journal" | "Affirmations" | "Grounding" | "CBT Tools" | "Gratitude";

export default function MentalWellnessPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Journal");
  const { user, currentEmotion } = useStore();
  
  // Journaling State
  const [journalEntry, setJournalEntry] = useState("");
  const [isJournaling, setIsJournaling] = useState(false);
  
  // Affirmation State
  const [selectedAffCategory, setSelectedAffCategory] = useState("Anxiety Relief");
  const [activeAffIndex, setActiveAffIndex] = useState(0);

  // Grounding State
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingSteps = [
    { label: "5 things you can see", icon: "👁️" },
    { label: "4 things you can touch", icon: "✋" },
    { label: "3 things you can hear", icon: "👂" },
    { label: "2 things you can smell", icon: "👃" },
    { label: "1 thing you can taste", icon: "👅" }
  ];

  // CBT State
  const [selectedDistortion, setSelectedDistortion] = useState<string | null>(null);
  const [cbtThought, setCbtThought] = useState("");
  const [cbtReframed, setCbtReframed] = useState("");

  // Gratitude State
  const [gratitudeItems, setGratitudeItems] = useState(["", "", ""]);

  const handleGratitudeChange = (index: number, value: string) => {
    const newItems = [...gratitudeItems];
    newItems[index] = value;
    setGratitudeItems(newItems);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Mental Wellness Toolkit</h1>
          <p className="text-foreground/60 text-lg">A sanctuary for your thoughts and a gym for your mind.</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-4 mb-10 pb-4 custom-scrollbar">
          {[
            { id: "Journal", icon: FileText },
            { id: "Affirmations", icon: Sparkles },
            { id: "Grounding", icon: Target },
            { id: "CBT Tools", icon: Brain },
            { id: "Gratitude", icon: Heart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap border ${
                activeTab === tab.id 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "bg-white/5 text-foreground/40 border-white/10 hover:bg-white/10"
              }`}
            >
              <tab.icon size={18} />
              {tab.id}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Journal Tab */}
          {activeTab === "Journal" && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-8 h-full flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Today's Prompt</h3>
                    <p className="text-xl font-bold italic">"{journalingPrompts[0]}"</p>
                  </div>
                  <textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:ring-2 focus:ring-primary outline-none resize-none transition-all placeholder:text-foreground/20"
                    placeholder="Write your heart out..."
                  />
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-xs text-foreground/40">{journalEntry.split(/\s+/).filter(Boolean).length} words</span>
                    <button
                      onClick={() => {
                        if (journalEntry.trim()) {
                          setIsJournaling(true);
                          setTimeout(() => {
                            setIsJournaling(false);
                            setJournalEntry("");
                            alert("Journal entry saved successfully! 📖");
                          }, 1500);
                        }
                      }}
                      disabled={!journalEntry.trim() || isJournaling}
                      className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isJournaling ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                      Save Entry
                    </button>
                  </div>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-white/10">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> AI Journal Analysis
                  </h3>
                  <p className="text-sm text-foreground/60 mb-6">
                    ManoMitra can analyze your entries to identify emotional patterns and growth themes.
                  </p>
                  <button 
                    onClick={() => alert("Analyzing your emotional patterns... (Demo Mode)")}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
                  >
                    Analyze My Patterns
                  </button>
                </Card>
                <Card className="border-dashed border-2 border-white/10">
                  <h3 className="font-bold mb-4">Past Entries</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-3 bg-white/5 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">April {10+i}, 2026</p>
                            <p className="text-xs text-foreground/40">156 words • Calm</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-foreground/20 group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Affirmations Tab */}
          {activeTab === "Affirmations" && (
            <motion.div
              key="affirmations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto w-full"
            >
              <div className="flex justify-center gap-4 mb-10 overflow-x-auto pb-2 custom-scrollbar">
                {Object.keys(affirmations).map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedAffCategory(cat); setActiveAffIndex(0); }}
                    className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${
                      selectedAffCategory === cat 
                      ? "bg-secondary text-white border-secondary" 
                      : "bg-white/5 text-foreground/40 border-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <Card className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-secondary/10 to-primary/10 border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    key={activeAffIndex}
                    transition={{ duration: 10, ease: "linear" }}
                    className="h-full bg-secondary"
                    onAnimationComplete={() => setActiveAffIndex((prev) => (prev + 1) % (affirmations as any)[selectedAffCategory].length)}
                  />
                </div>
                <Sparkles className="text-secondary/20 w-16 h-16 mb-8" />
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={activeAffIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-3xl font-playfair italic leading-relaxed mb-12"
                  >
                    "{(affirmations as any)[selectedAffCategory][activeAffIndex]}"
                  </motion.h3>
                </AnimatePresence>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveAffIndex((prev) => (prev - 1 + (affirmations as any)[selectedAffCategory].length) % (affirmations as any)[selectedAffCategory].length)}
                    className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all text-foreground/40"
                  >
                    <ChevronRight size={24} className="rotate-180" />
                  </button>
                  <button 
                    onClick={() => setActiveAffIndex((prev) => (prev + 1) % (affirmations as any)[selectedAffCategory].length)}
                    className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all text-foreground/40"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Grounding Tab */}
          {activeTab === "Grounding" && (
            <motion.div
              key="grounding"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto w-full"
            >
              <Card className="p-10 text-center space-y-10">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">5-4-3-2-1 Technique</h2>
                  <p className="text-foreground/60">A grounding exercise to bring you back to the present moment.</p>
                </div>

                <div className="relative py-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={groundingStep}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="space-y-6"
                    >
                      <div className="text-8xl mb-4">{groundingSteps[groundingStep].icon}</div>
                      <h3 className="text-2xl font-bold">{groundingSteps[groundingStep].label}</h3>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Type what you notice..."
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {groundingSteps.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full transition-all ${i === groundingStep ? "w-8 bg-primary" : "bg-white/10"}`} 
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => groundingStep < 4 ? setGroundingStep(groundingStep + 1) : setGroundingStep(0)}
                    className="px-10 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
                  >
                    {groundingStep === 4 ? "Restart" : "Next Sense"}
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
          
          {/* CBT Tools Tab */}
          {activeTab === "CBT Tools" && (
            <motion.div
              key="cbt"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <Card className="p-8 space-y-6">
                <h3 className="text-xl font-bold">Thought Reframing</h3>
                <p className="text-sm text-foreground/60 italic">Challenge your negative thoughts and find a more balanced perspective.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Original Thought</label>
                    <textarea 
                      value={cbtThought}
                      onChange={(e) => setCbtThought(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-24 outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g. 'I'm failing at everything...'"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Identify Cognitive Distortion</label>
                    <div className="grid grid-cols-1 gap-2">
                      {cognitiveDistortions.map(d => (
                        <button
                          key={d.id}
                          onClick={() => setSelectedDistortion(d.id)}
                          className={`p-3 text-left rounded-xl text-sm transition-all border ${
                            selectedDistortion === d.id ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-foreground/60 hover:bg-white/10"
                          }`}
                        >
                          <span className="font-bold">{d.name}</span>: {d.description}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-8 space-y-6 flex flex-col justify-center">
                <div className="p-6 bg-secondary/10 border border-secondary/20 rounded-2xl">
                  <h3 className="font-bold text-secondary flex items-center gap-2 mb-4">
                    <Sparkles size={20} /> Balanced Perspective
                  </h3>
                  <textarea 
                    value={cbtReframed}
                    onChange={(e) => setCbtReframed(e.target.value)}
                    className="w-full bg-transparent border-none p-0 h-40 outline-none resize-none italic text-lg"
                    placeholder="Reframing: 'I'm having a hard time with this specific task, but I've succeeded in many other things...'"
                  />
                </div>
                <button className="w-full py-4 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20">
                  Save Reframed Thought
                </button>
              </Card>
            </motion.div>
          )}

          {/* Gratitude Tab */}
          {activeTab === "Gratitude" && (
            <motion.div
              key="gratitude"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-xl mx-auto w-full"
            >
              <Card className="p-10 space-y-10 text-center">
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-breathing">
                    <Heart size={40} fill="currentColor" />
                  </div>
                  <h2 className="text-3xl font-bold">Gratitude Jar</h2>
                  <p className="text-foreground/60 italic">"Gratitude turns what we have into enough."</p>
                </div>

                <div className="space-y-4">
                  {gratitudeItems.map((item, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">{idx + 1}</span>
                      <input 
                        type="text" 
                        value={item}
                        onChange={(e) => handleGratitudeChange(idx, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="I'm grateful for..."
                      />
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    // Reset and show success (mock)
                    setGratitudeItems(["", "", ""]);
                    alert("Your gratitude has been saved! 🌸");
                  }}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                >
                  Save to Jar
                </button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </PageWrapper>
    </div>
  );
}
