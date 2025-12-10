'use client';

import { motion } from 'motion/react';

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center">
      <div className="relative flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <motion.div
            className="border-primary/20 border-t-primary absolute h-16 w-16 rounded-full border-4"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Inner Ring */}
          <motion.div
            className="border-primary/20 border-b-primary absolute h-10 w-10 rounded-full border-4"
            animate={{ rotate: -360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Center Dot */}
          <motion.div
            className="bg-primary h-2 w-2 rounded-full shadow-[0_0_15px_var(--primary)]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Loading Text */}
        <motion.div
          className="mt-2 flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-foreground text-lg font-medium tracking-widest">
            Li2
          </h3>
          <p className="text-muted-foreground text-xs tracking-[0.2em]">
            LOADING
          </p>
        </motion.div>
      </div>
    </div>
  );
}
