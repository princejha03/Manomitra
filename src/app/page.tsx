"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Moon, Sparkles, Shield, Brain } from "lucide-react";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { useAuth } from "@/hooks/useAuth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleRelaxClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden" suppressHydrationWarning>
      <AnimatedBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 flex flex-col items-center max-w-4xl text-center"
      >
        {/* Logo */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 mb-6"
        >
          <Moon className="w-12 h-12 text-primary" />
          <h1 className="text-5xl font-poppins font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            ManoMitra
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-2xl font-playfair italic text-white/80 mb-12"
        >
          Your Mind Deserves a Friend
        </motion.p>

        {/* About Card */}
        <motion.div
          variants={itemVariants}
          className="glass p-8 rounded-3xl mb-12 max-w-2xl text-lg text-white/90 leading-relaxed shadow-2xl"
        >
          ManoMitra is a safe space where your emotions are heard, understood,
          and supported. We use AI to understand how you feel — through your
          words, your face, and your voice — and guide you toward calm, balance,
          and joy. No judgment. No pressure. Just support.
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {[
            { icon: Sparkles, text: "10,000+ Minds Supported" },
            { icon: Shield, text: "Private & Secure" },
            { icon: Brain, text: "AI-Powered" },
          ].map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-white/70 text-sm"
            >
              <badge.icon className="w-4 h-4 text-secondary" />
              <span>{badge.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Relax Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRelaxClick}
          className="group relative px-12 py-6 bg-linear-to-r from-primary to-secondary rounded-full text-white text-2xl font-bold tracking-widest shadow-[0_0_30px_rgba(108,99,255,0.4)] transition-shadow hover:shadow-[0_0_50px_rgba(108,99,255,0.6)] animate-breathing overflow-hidden"
        >
          <span className="relative z-10">🌿 RELAX</span>
          <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
        </motion.button>
      </motion.div>
    </main>
  );
}
