"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Wind,
  Heart,
  Brain,
  Zap,
  Play,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function BreathingPage() {
  const { currentEmotion, addActivityLog } = useStore();
  const { user: firebaseUser, loading } = useAuth();
  const router = useRouter();

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<
    "inhale" | "hold" | "exhale" | "rest" | "complete"
  >("inhale");
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [breathingStyle, setBreathingStyle] = useState<
    "4-7-8" | "box" | "deep"
  >("4-7-8");
  const [sessionStart, setSessionStart] = useState<number | null>(null);

  const breathingPatterns: {
    [key: string]: { in: number; hold: number; out: number; rest?: number };
  } = {
    "4-7-8": { in: 4, hold: 7, out: 8, rest: 0 },
    box: { in: 4, hold: 4, out: 4, rest: 4 },
    deep: { in: 5, hold: 5, out: 6, rest: 0 },
  };

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/auth/login");
    }
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    if (!isActive) return;

    const pattern = breathingPatterns[breathingStyle];
    const phaseOrder: Array<"inhale" | "hold" | "exhale" | "rest"> = [
      "inhale",
      "hold",
      "exhale",
      ...(pattern.rest ? ["rest"] : []),
    ];

    const currentPhaseIndex = phaseOrder.indexOf(phase);
    let currentPhaseDuration = 0;

    if (phase === "inhale") currentPhaseDuration = pattern.in;
    else if (phase === "hold") currentPhaseDuration = pattern.hold;
    else if (phase === "exhale") currentPhaseDuration = pattern.out;
    else if (phase === "rest") currentPhaseDuration = pattern.rest || 0;

    const timer = setTimeout(() => {
      setCount((c) => {
        if (c + 1 >= currentPhaseDuration) {
          const nextPhaseIndex = (currentPhaseIndex + 1) % phaseOrder.length;
          setPhase(phaseOrder[nextPhaseIndex]);

          if (
            phaseOrder[nextPhaseIndex] === "inhale" &&
            count + 1 >= currentPhaseDuration
          ) {
            setCycles((prev) => prev + 1);
          }

          return 0;
        }
        return c + 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isActive, phase, count, breathingStyle]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!firebaseUser) {
    return null;
  }

  const pattern = breathingPatterns[breathingStyle];
  const phaseOrder: string[] = [
    "inhale",
    "hold",
    "exhale",
    ...(pattern.rest ? ["rest"] : []),
  ];
  let currentPhaseDuration = 0;

  if (phase === "inhale") currentPhaseDuration = pattern.in;
  else if (phase === "hold") currentPhaseDuration = pattern.hold;
  else if (phase === "exhale") currentPhaseDuration = pattern.out;
  else if (phase === "rest") currentPhaseDuration = pattern.rest || 0;

  const progress = (count / currentPhaseDuration) * 100;

  const handleStart = () => {
    setIsActive(true);
    setSessionStart(Date.now());
    setCount(0);
    setCycles(0);
    setPhase("inhale");
  };

  const handleStop = () => {
    setIsActive(false);
    if (sessionStart && cycles > 0) {
      addActivityLog({
        activityType: "breathing",
        activityName: `${breathingStyle} Breathing`,
        duration: Math.ceil((Date.now() - sessionStart) / 60000),
        rating: Math.min(5, Math.ceil(cycles / 4)),
        mood: currentEmotion?.dominantEmotion,
        feedback: `${cycles} complete cycles`,
        startTime: sessionStart,
        endTime: Date.now(),
      });
    }
    setCount(0);
    setCycles(0);
    setSessionStart(null);
  };

  const phaseEmojis: { [key: string]: string } = {
    inhale: "🌬️",
    hold: "⏸️",
    exhale: "💨",
    rest: "😌",
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Breathing & Meditation</h1>
          <p className="text-foreground/60">
            Calm your mind and body with guided breathing exercises
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Main Breathing Exercise */}
          <div className="lg:col-span-2">
            <Card className="p-12 text-center">
              {/* Breathing Circle */}
              <div className="mb-12 flex justify-center">
                <motion.div
                  animate={{
                    scale:
                      phase === "inhale" ? 1.3 : phase === "exhale" ? 1 : 1.15,
                  }}
                  transition={{
                    duration: currentPhaseDuration,
                    ease: "easeInOut",
                  }}
                  className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-primary flex items-center justify-center"
                >
                  <div className="text-6xl">{phaseEmojis[phase]}</div>
                </motion.div>
              </div>

              {/* Phase and Count */}
              <div className="mb-8">
                <h3 className="text-4xl font-bold mb-2 capitalize">
                  {phase}...
                </h3>
                <p className="text-2xl text-primary font-bold">
                  {currentPhaseDuration - count} seconds
                </p>
                <div className="mt-4 w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-foreground/60 mb-1">Cycles</p>
                  <p className="text-3xl font-bold text-primary">{cycles}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-foreground/60 mb-1">Duration</p>
                  <p className="text-3xl font-bold text-secondary">
                    {sessionStart
                      ? Math.ceil((Date.now() - sessionStart) / 60000)
                      : 0}
                    m
                  </p>
                </div>
              </div>

              {/* Controls */}
              <button
                onClick={isActive ? handleStop : handleStart}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                {isActive ? (
                  <>
                    <AlertCircle size={24} /> Stop
                  </>
                ) : (
                  <>
                    <Play size={24} /> Start
                  </>
                )}
              </button>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Breathing Styles */}
            <Card className="p-6">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Wind className="text-primary" />
                Choose Style
              </h4>
              <div className="space-y-2">
                {Object.entries(breathingPatterns).map(([name, pattern]) => (
                  <button
                    key={name}
                    onClick={() => {
                      setBreathingStyle(name as "4-7-8" | "box" | "deep");
                      setIsActive(false);
                      setCount(0);
                      setCycles(0);
                      setPhase("inhale");
                    }}
                    disabled={isActive}
                    className={`w-full p-3 rounded-lg text-left text-sm font-medium transition-all ${
                      breathingStyle === name
                        ? "bg-primary text-white"
                        : "bg-white/5 text-foreground/60 hover:bg-white/10 disabled:opacity-50"
                    }`}
                  >
                    <p className="font-bold capitalize">{name}</p>
                    <p className="text-xs mt-1 opacity-80">
                      In: {pattern.in}s • Hold: {pattern.hold}s • Out:{" "}
                      {pattern.out}s
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-blue-500/10 border-blue-500/20">
              <h4 className="font-bold mb-3 text-blue-300 flex items-center gap-2">
                <Brain size={18} />
                Tips
              </h4>
              <ul className="text-sm space-y-2 text-foreground/70">
                <li>• Find a quiet, comfortable place</li>
                <li>• Sit upright or lie down</li>
                <li>• Start with 5 minutes</li>
                <li>• Breathe through your nose</li>
                <li>• Be consistent daily</li>
              </ul>
            </Card>

            {/* Benefits */}
            <Card className="p-6 bg-green-500/10 border-green-500/20">
              <h4 className="font-bold mb-3 text-green-300 flex items-center gap-2">
                <Heart size={18} />
                Benefits
              </h4>
              <ul className="text-sm space-y-2 text-foreground/70">
                <li>✓ Reduce anxiety</li>
                <li>✓ Lower stress</li>
                <li>✓ Better focus</li>
                <li>✓ Improve sleep</li>
                <li>✓ Boost mood</li>
              </ul>
            </Card>

            {/* Session Result */}
            {sessionStart && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
              >
                <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                  <CheckCircle2 size={18} />
                  Session Active
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Zap className="text-yellow-400" />
              4-7-8 Breathing
            </h4>
            <p className="text-sm text-foreground/70">
              Great for stress relief and relaxation. Inhale for 4, hold for 7,
              exhale for 8.
            </p>
          </Card>

          <Card className="p-6">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Wind className="text-blue-400" />
              Box Breathing
            </h4>
            <p className="text-sm text-foreground/70">
              Perfect for focus and clarity. Equal counts for all phases: 4
              seconds each.
            </p>
          </Card>

          <Card className="p-6">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Heart className="text-red-400" />
              Deep Breathing
            </h4>
            <p className="text-sm text-foreground/70">
              Ideal for everyday calm. Inhale for 5, hold for 5, exhale for 6
              seconds.
            </p>
          </Card>
        </div>
      </PageWrapper>
    </div>
  );
}
