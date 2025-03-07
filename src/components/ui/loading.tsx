import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 mb-4"
      >
        <div className="w-full h-full rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-green-500 border-l-slate-700"></div>
      </motion.div>
      <p className="text-slate-300">Loading your career journey...</p>
    </div>
  );
}