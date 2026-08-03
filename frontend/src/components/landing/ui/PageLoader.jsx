import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import logoImg from '@/assets/landing/logo.webp';

/**
 * PageLoader — Animated splash screen featuring the official Meals & Bowls logo.
 *
 * Intro animation sequence:
 *  1. Outer ring draws itself (pathLength 0 → 1).
 *  2. Crossed spoon & fork animate & pop into place with elastic spring bounce.
 *  3. Official logo image scale-reveals with glowing ambient aura.
 *  4. Brand title & progress bar animate from 0% → 100%.
 */
export default function PageLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    const duration = 1600; // 1.6s for logo creation animation
    const interval = 20;
    const steps = duration / interval;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const current = Math.min(100, Math.round((stepCount / steps) * 100));
      setProgress(current);

      if (current >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="page-loader"
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.08,
          filter: 'blur(16px)',
          transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
        }}
        className="
          fixed inset-0 z-[9999]
          bg-gradient-to-br from-land-dark via-[#18110b] to-land-dark
          flex flex-col items-center justify-center
          overflow-hidden select-none pointer-events-auto
        "
      >
        {/* Ambient glowing background aura */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.35, 1],
              opacity: [0.3, 0.65, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[650px] h-[650px] rounded-full
              bg-gradient-to-tr from-land-primary/40 via-amber-500/30 to-orange-600/20
              blur-3xl
            "
          />
        </div>

        {/* Center Animated Logo Construction */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">

          {/* Logo Animation Container */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-6 flex items-center justify-center">

            {/* SVG Animated Outer Ring */}
            <svg
              className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none"
              viewBox="0 0 200 200"
            >
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
            </svg>

            {/* SVG Crossed Spoon & Fork Animated Assembly */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 200 200"
            >
              {/* Spoon Handle & Bowl */}
              <motion.path
                d="M60,140 L125,75 M125,75 C132,68 145,68 152,75 C159,82 159,95 152,102 L135,119"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              />
              {/* Fork Handle & Tines */}
              <motion.path
                d="M140,140 L75,75 M75,75 L60,60 M70,70 L55,55 M80,80 L65,65"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              />
            </svg>

            {/* Official Logo Image reveal */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.4,
                type: 'spring',
                stiffness: 260,
                damping: 18,
              }}
              className="
                relative z-20 w-36 h-36 sm:w-44 sm:h-44 rounded-full
                bg-white p-2 flex items-center justify-center
                shadow-[0_0_50px_rgba(249,115,22,0.7)]
                ring-4 ring-amber-400/40
              "
            >
              <img
                src={logoImg}
                alt="Meals & Bowls official logo"
                className="w-full h-full object-contain rounded-full"
              />
            </motion.div>

            {/* Pulsing ring aura */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="absolute inset-2 rounded-full border-2 border-land-primary pointer-events-none"
            />
          </div>

          {/* Animated title */}
          <motion.h1
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="
              font-['Poppins'] font-black text-3xl sm:text-4xl lg:text-5xl
              text-white tracking-wider uppercase mb-2
            "
          >
            MEALS <span className="text-transparent bg-clip-text bg-gradient-to-r from-land-primary via-amber-300 to-orange-400 animate-pulse">&amp;</span> BOWLS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="text-orange-200/90 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-8"
          >
            Fresh • Hygienic • Delivered Daily
          </motion.p>

          {/* Progress bar */}
          <div className="w-56 sm:w-72 flex flex-col items-center gap-2">
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/15">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-land-primary via-amber-400 to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.9)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
            <div className="flex justify-between w-full text-xs font-mono text-gray-400 px-1">
              <span>PREPARING EXPERIENCE</span>
              <span className="text-land-primary font-bold">{progress}%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
