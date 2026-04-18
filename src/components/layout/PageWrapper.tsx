"use client";

import { motion } from "framer-motion";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex-1 min-h-screen p-6 lg:p-10 ml-20 lg:ml-[280px]"
    >
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
