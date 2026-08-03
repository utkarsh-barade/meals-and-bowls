import { useRef } from 'react';
import { Link }   from 'react-router-dom';
import {
  motion,
  useReducedMotion,
} from 'framer-motion';

import { useMouseTilt }    from '@/components/landing/hooks/useMouseTilt';
import { scrollToSection } from '@/components/landing/hooks/useSmoothScroll';
import thaliImage          from '@/assets/landing/thali-hero.webp';

/* ─────────────────────────────────────────────────────────────────────────────
   FLASHY ANIMATION VARIANTS
───────────────────────────────────────────────────────────────────────────── */

const containerVariants = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren:   0.1,
    },
  },
};

const makeSlideUp = (reduced) => ({
  hidden:  { opacity: 0, y: reduced ? 0 : 50, scale: reduced ? 1 : 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: reduced ? 0.01 : 0.7, ease: [0.22, 1, 0.36, 1] },
  },
});

const fadeVariant = {
  hidden:  { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeInOut' } },
};

const makeScaleIn = (reduced) => ({
  hidden:  { opacity: 0, scale: reduced ? 1 : 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, type: 'spring', stiffness: 350, damping: 18 },
  },
});

const makeImageReveal = (reduced) => ({
  hidden:  { opacity: 0, scale: reduced ? 1 : 0.75, rotate: reduced ? 0 : -8 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.9, type: 'spring', stiffness: 220, damping: 18, delay: 0.2 },
  },
});

/* ─────────────────────────────────────────────────────────────────────────────
   HERO COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  /* ── Mouse tilt (desktop only) ────────────────────────────── */
  const { ref: tiltRef, rotateX, rotateY, handleMouseMove, handleMouseLeave } =
    useMouseTilt({ maxTilt: 12 });

  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
  const tiltProps = (!prefersReducedMotion && !isTouchDevice)
    ? { style: { rotateX, rotateY, transformPerspective: 900 }, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave }
    : {};

  /* ── Derived variants ───────────────────────────────────────── */
  const slideUp   = makeSlideUp(prefersReducedMotion);
  const scaleIn   = makeScaleIn(prefersReducedMotion);
  const imgReveal = makeImageReveal(prefersReducedMotion);

  /* ── Floating animation for image ─────────────────────────────── */
  const floatAnim = prefersReducedMotion
    ? {}
    : {
        animate:    { y: [0, -18, 0] },
        transition: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
      };

  /* ── Scroll-indicator bounce ────────────────────────────────── */
  const scrollBounce = prefersReducedMotion
    ? {}
    : {
        animate:    { y: [0, 8, 0] },
        transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
      };

  /* ── Flashy glowing aura animation ───────────────────────────── */
  const auraPulse = prefersReducedMotion
    ? {}
    : {
        animate:    { scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] },
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      };

  return (
    <section
      id="home"
      aria-label="Meals & Bowls – Fresh meals delivered daily"
      className="
        relative min-h-screen flex flex-col justify-between overflow-x-clip scroll-mt-24
        bg-land-bg dark:bg-[#0B0F17] pt-20 pb-12 transition-colors duration-300
      "
    >
      {/* ── Flashy background particle blobs ─────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Top-right warm glowing blob */}
        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="
            absolute -top-52 -right-52
            w-[800px] h-[800px]
            bg-gradient-to-br from-orange-300/40 dark:from-orange-600/20 via-amber-200/30 dark:via-amber-500/10 to-transparent
            rounded-full blur-3xl
          "
        />

        {/* Bottom-left emerald glowing blob */}
        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.15, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="
            absolute -bottom-52 -left-52
            w-[700px] h-[700px]
            bg-gradient-to-tr from-green-200/40 dark:from-emerald-600/20 via-emerald-100/30 dark:via-teal-500/10 to-transparent
            rounded-full blur-3xl
          "
        />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #F97316 1.5px, transparent 1.5px)',
            backgroundSize:  '36px 36px',
          }}
        />
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-20 items-center min-h-[calc(100vh-5rem)]">

          {/* ═══════════════════════════════════════════════════
              LEFT: Flashy text content with staggered pop-in
          ═══════════════════════════════════════════════════ */}
          <motion.div
            className="flex flex-col items-start justify-center py-8 lg:py-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Pill badge with pulse ring */}
            <motion.div variants={slideUp} className="mb-6">
              <div className="
                inline-flex items-center gap-2.5 px-4 py-2 rounded-full
                border border-orange-300/80 dark:border-orange-500/40 bg-gradient-to-r from-orange-100/90 dark:from-orange-950/60 to-amber-100/90 dark:to-amber-950/60
                backdrop-blur-md shadow-md shadow-orange-200/50 dark:shadow-none
              ">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-land-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-land-primary" />
                </span>
                <span className="text-sm font-bold text-orange-800 dark:text-orange-300 leading-none uppercase tracking-wide">
                  PURE • FRESH • HOMELY TASTE
                </span>
              </div>
            </motion.div>

            {/* Flashy Headline with gradient sweep */}
            <motion.h1
              variants={slideUp}
              className="
                font-['Poppins'] font-extrabold
                text-5xl sm:text-6xl lg:text-[62px] xl:text-[72px]
                text-land-dark dark:text-white leading-[1.05] tracking-tight mb-5
              "
            >
              Eat Fresh,{' '}
              <span className="
                text-transparent bg-clip-text
                bg-gradient-to-r from-land-primary via-orange-500 to-amber-500
                relative inline-block
                after:content-[''] after:absolute after:bottom-1 after:left-0
                after:w-full after:h-[6px] after:rounded-full
                after:bg-gradient-to-r after:from-land-primary after:to-amber-400
                shadow-sm
              ">
                Stay Healthy
              </span>
              <br />
              <span className="text-land-dark dark:text-white">Every Day</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeVariant}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-lg font-normal"
            >
              <strong className="text-land-primary font-bold">Monthly Thali Subscription</strong> — Healthy Food • Happy Life.
              Fresh, hygienic home-style meals delivered daily. Save more &amp; eat better every day!
            </motion.p>

            {/* Flashy CTA buttons with shine sweep */}
            <motion.div
              variants={scaleIn}
              className="flex flex-wrap gap-4 mb-10"
            >
              {/* Primary CTA with animated shimmer effect */}
              <motion.a
                href="#plans"
                onClick={(e) => { e.preventDefault(); scrollToSection('#plans', -80); }}
                className="
                  relative overflow-hidden
                  inline-flex items-center gap-2 px-8 py-4 rounded-full
                  bg-gradient-to-r from-land-primary via-orange-500 to-amber-500
                  text-white font-bold text-base tracking-wide
                  shadow-xl shadow-orange-300/80 dark:shadow-orange-950/50
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary focus-visible:ring-offset-2
                  group
                "
                whileHover={prefersReducedMotion ? {} : { scale: 1.06, y: -3, boxShadow: '0 25px 50px rgba(249,115,22,0.45)' }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {/* Button shine sweep effect */}
                <span className="
                  absolute inset-0 w-1/2 h-full
                  bg-gradient-to-r from-transparent via-white/40 to-transparent
                  -skew-x-12 -translate-x-full group-hover:translate-x-[300%]
                  transition-transform duration-1000 ease-in-out
                " />

                <span className="relative z-10">Explore Plans</span>
                <span aria-hidden="true" className="relative z-10 text-xl group-hover:translate-x-1 transition-transform duration-200">→</span>
              </motion.a>

              {/* Secondary CTA */}
              <motion.div
                whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/login"
                  className="
                    inline-flex items-center gap-2 px-8 py-4 rounded-full
                    border-2 border-land-dark dark:border-white/40 text-land-dark dark:text-white font-bold text-base
                    hover:bg-land-dark dark:hover:bg-white hover:text-white dark:hover:text-land-dark
                    transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-dark focus-visible:ring-offset-2
                  "
                >
                  Customer Login
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats row with glowing numbers */}
            <motion.div
              variants={slideUp}
              className="flex flex-wrap gap-8 sm:gap-12 pt-6 border-t border-gray-200/80 dark:border-gray-800 w-full max-w-lg"
            >
              {[
                { value: '500+', label: 'Happy Customers', icon: '😊' },
                { value: '5K+',  label: 'Meals Served',    icon: '🍱' },
                { value: '4.9★', label: 'Avg. Rating',     icon: '⭐' },
              ].map(({ value, label, icon }) => (
                <div key={label} className="flex flex-col">
                  <span aria-hidden="true" className="text-2xl mb-1">{icon}</span>
                  <span className="font-['Poppins'] font-black text-3xl text-land-dark dark:text-white leading-none">
                    {value}
                  </span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════
              RIGHT: Glowing Thali Image with Spring Badges & Tilt
          ═══════════════════════════════════════════════════ */}
          <div className="relative flex items-center justify-center lg:justify-end py-8 lg:py-0">

            {/* Entrance reveal wrapper */}
            <motion.div
              variants={imgReveal}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              {/* Tilt + float wrapper */}
              <motion.div
                ref={tiltRef}
                {...tiltProps}
                {...floatAnim}
                className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-[27rem] md:h-[27rem] cursor-default"
                style={{
                  ...tiltProps.style,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Outer animated aura glow ring */}
                <motion.div
                  {...auraPulse}
                  aria-hidden="true"
                  className="
                    absolute inset-0 rounded-full
                    bg-gradient-to-br from-orange-400/50 via-amber-300/40 to-orange-200/30
                    blur-3xl scale-125
                  "
                />

                {/* Inner glowing ring */}
                <div className="
                  absolute inset-0 rounded-full
                  border-4 border-orange-200/80 dark:border-orange-500/40
                  bg-gradient-to-br from-white/80 dark:from-gray-800/80 via-orange-50/50 dark:via-gray-900/50 to-amber-50/30
                  backdrop-blur-md shadow-2xl shadow-orange-300/50 dark:shadow-none
                " />

                {/* Thali meal WebP image */}
                <img
                  src={thaliImage}
                  alt="Fresh Indian thali meal with dal, roti, rice, and green vegetables"
                  className="
                    absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)]
                    rounded-full object-cover
                    shadow-2xl shadow-orange-900/20
                    ring-4 ring-white dark:ring-gray-800
                  "
                  loading="eager"
                  decoding="async"
                  width="432"
                  height="432"
                />

                {/* Flashy Badge 1: Today's Special */}
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 15, delay: 0.6 }}
                  className="
                    absolute -top-4 -right-4 sm:-top-6 sm:-right-6
                    bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl
                    shadow-2xl shadow-black/15 dark:shadow-black/60
                    border-2 border-orange-200 dark:border-orange-500/40 px-4 py-3
                    min-w-[140px]
                  "
                >
                  <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest mb-0.5">
                    Today's Special
                  </p>
                  <p className="font-['Poppins'] font-bold text-sm text-land-dark dark:text-white">
                    Dal Tadka + Roti 🌾
                  </p>
                </motion.div>

                {/* Flashy Badge 2: Next Delivery */}
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 15, delay: 0.8 }}
                  className="
                    absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6
                    bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl
                    shadow-2xl shadow-black/15 dark:shadow-black/60
                    border-2 border-green-200 dark:border-emerald-500/40 px-4 py-3
                    min-w-[140px]
                  "
                >
                  <p className="text-[10px] text-green-600 dark:text-emerald-400 font-bold uppercase tracking-widest mb-0.5">
                    Next Delivery
                  </p>
                  <p className="font-['Poppins'] font-bold text-sm text-land-green">
                    12:30 PM Today ✅
                  </p>
                </motion.div>

                {/* Flashy Badge 3: 5 Star Badge */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 1.0 }}
                  className="
                    absolute top-1/2 -translate-y-1/2 -left-6 sm:-left-8
                    w-14 h-14 rounded-2xl
                    bg-gradient-to-br from-amber-400 to-orange-400
                    shadow-xl shadow-orange-300/60 dark:shadow-none
                    ring-4 ring-white dark:ring-gray-800
                    flex items-center justify-center
                  "
                >
                  <span className="text-2xl animate-spin" style={{ animationDuration: '10s' }} role="img" aria-label="5-star rating">⭐</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── Scroll indicator ──────────────────────────────── */}
        <motion.div
          className="flex justify-center pb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          aria-hidden="true"
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-gray-400"
            {...scrollBounce}
          >
            <span className="text-[11px] font-bold tracking-widest uppercase text-orange-600/80 dark:text-orange-400">
              Scroll to explore
            </span>
            <div className="
              w-[22px] h-[36px] rounded-full
              border-2 border-orange-300/80 dark:border-orange-500/50
              flex justify-center pt-2
            ">
              <motion.div
                className="w-1 h-2.5 rounded-full bg-land-primary"
                animate={prefersReducedMotion ? {} : { y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
