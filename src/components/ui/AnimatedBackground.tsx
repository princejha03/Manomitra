"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ParticleBackground() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; targetX: number; targetY: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
      duration: Math.random() * 20 + 10,
      targetX: Math.random() * 100 - 50,
      targetY: Math.random() * 100 - 50,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-gradient-to-br from-[#0D1117] via-[#1a0533] to-[#0D1117]" suppressHydrationWarning>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20 blur-xl"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 10,
            height: p.size * 10,
          }}
          animate={{
            x: [0, p.targetX, 0],
            y: [0, p.targetY, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
