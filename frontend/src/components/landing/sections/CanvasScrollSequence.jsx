import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const TOTAL_FRAMES = 240;

/**
 * Helper to generate padded frame filename: ezgif-frame-001.jpg ... ezgif-frame-240.jpg
 */
function getFramePath(index) {
  const paddedIndex = String(index).padStart(3, '0');
  return `/frames/ezgif-frame-${paddedIndex}.jpg`;
}

export default function CanvasScrollSequence() {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);

  const imagesRef       = useRef([]);
  const targetFrameRef  = useRef(1);
  const currentFrameRef = useRef(1);
  const animationFrameRef = useRef(null);

  const prefersReducedMotion = useReducedMotion();

  /* ── 1. Preload Image Sequence ──────────────────────────────── */
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        // Fallback for missing frame
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };
      images[i] = img;
    }
    imagesRef.current = images;
  }, []);

  /* ── 2. Canvas Fitting / Cover Math ─────────────────────────── */
  const renderFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width  = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    // Aspect Cover math
    const imgRatio    = img.naturalWidth / img.naturalHeight;
    const canvasRatio = rect.width / rect.height;

    let drawWidth, drawHeight, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawWidth  = rect.width;
      drawHeight = rect.width / imgRatio;
      drawX      = 0;
      drawY      = (rect.height - drawHeight) / 2;
    } else {
      drawWidth  = rect.height * imgRatio;
      drawHeight = rect.height;
      drawX      = (rect.width - drawWidth) / 2;
      drawY      = 0;
    }

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, []);

  /* ── 3. Scroll Handler (Maps Scroll % to Target Frame) ───────── */
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;

      if (totalScrollableHeight <= 0) return;

      // Calculate progress 0.0 to 1.0
      const rawProgress = -rect.top / totalScrollableHeight;
      const clampedProgress = Math.min(1, Math.max(0, rawProgress));

      setCurrentProgress(clampedProgress);

      const target = Math.floor(clampedProgress * (TOTAL_FRAMES - 1)) + 1;
      targetFrameRef.current = Math.min(TOTAL_FRAMES, Math.max(1, target));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  /* ── 4. Buttery Lerp Animation Loop ─────────────────────────── */
  useEffect(() => {
    if (!imagesLoaded) return;

    const lerpLoop = () => {
      const target  = targetFrameRef.current;
      const current = currentFrameRef.current;

      // Easing speed factor: 0.12 lerp factor for buttery smooth motion
      const diff = target - current;

      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current = current + diff * 0.14;
        renderFrame(Math.round(currentFrameRef.current));
      } else {
        currentFrameRef.current = target;
        renderFrame(target);
      }

      animationFrameRef.current = requestAnimationFrame(lerpLoop);
    };

    animationFrameRef.current = requestAnimationFrame(lerpLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [imagesLoaded, renderFrame]);

  // Determine text overlays based on scroll progress
  const getMilestoneText = () => {
    if (currentProgress < 0.25) {
      return {
        tag: 'FRESHLY COOKED',
        title: 'Crafted Daily With Care',
        desc: 'Every morning starts with fresh ingredients, traditional spices, and motherly love.',
      };
    } else if (currentProgress < 0.55) {
      return {
        tag: 'AUTHENTIC RECIPES',
        title: 'Pure Home-Style Taste',
        desc: 'No artificial preservatives, no heavy oils — just clean, wholesome Indian thali comfort.',
      };
    } else if (currentProgress < 0.80) {
      return {
        tag: 'COMPLETE NUTRITION',
        title: '7 Balanced Items Per Meal',
        desc: 'Roti, Seasonal Sabji, Dal, Basmati Rice, Raita, Fresh Salad, and Pickle in every meal.',
      };
    } else {
      return {
        tag: 'DOORSTEP DELIVERY',
        title: 'Delivered Fresh To You',
        desc: 'Hot, hygienic meal box delivered right on time for your lunch and dinner.',
      };
    }
  };

  const milestone = getMilestoneText();

  return (
    <section
      ref={containerRef}
      id="thali-experience"
      aria-label="Thali Journey Experience"
      className="relative h-[320vh] bg-land-dark scroll-mt-24"
    >
      {/* Sticky Fullscreen Frame Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* Fullscreen HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Vignette Gradient Overlays */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-land-dark via-transparent to-land-dark/70 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-land-dark/80 via-transparent to-land-dark/80 pointer-events-none" />

        {/* Preload Overlay */}
        {!imagesLoaded && (
          <div className="absolute inset-0 z-30 bg-land-dark flex flex-col items-center justify-center text-white px-4">
            <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-land-primary animate-spin mb-4" />
            <p className="font-['Poppins'] font-bold text-lg mb-2">Loading Interactive Experience</p>
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-land-primary transition-all duration-150"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono text-gray-400 mt-2">{loadProgress}%</span>
          </div>
        )}

        {/* Floating Animated Text Overlay */}
        {imagesLoaded && (
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-start justify-end h-full pb-16 sm:pb-24 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={milestone.tag}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-xl bg-land-dark/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl pointer-events-auto"
              >
                <span className="inline-block px-3.5 py-1 rounded-full bg-land-primary/20 border border-land-primary/40 text-land-primary text-xs font-extrabold tracking-widest uppercase mb-3">
                  ✨ {milestone.tag}
                </span>

                <h3 className="font-['Poppins'] font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight mb-3">
                  {milestone.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium mb-6">
                  {milestone.desc}
                </p>

                {/* Progress Bar Indicator */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-land-primary to-amber-400"
                      style={{ width: `${Math.round(currentProgress * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-400 font-bold">
                    {Math.round(currentProgress * 100)}% SCROLLED
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
