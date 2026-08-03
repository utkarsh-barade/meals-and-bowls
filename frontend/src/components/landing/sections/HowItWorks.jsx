import { useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { SectionHeader }  from '@/components/landing/ui/SectionHeader';
import { FadeUp }         from '@/components/landing/animations/FadeUp';
import { scrollToSection } from '@/components/landing/hooks/useSmoothScroll';

/* ── Data ─────────────────────────────────────────────────────── */
const STEPS = [
  {
    num:   1,
    icon:  '📋',
    title: 'Choose Your Plan',
    desc:  'Browse our affordable meal plans and pick the one that fits your schedule and appetite.',
    color: 'from-orange-500 to-amber-400',
    bg:    'bg-orange-50',
    border:'border-orange-200/60',
  },
  {
    num:   2,
    icon:  '✍️',
    title: 'Register & Pay',
    desc:  'Quick and simple registration. Secure monthly payment via UPI, bank transfer, or cash.',
    color: 'from-green-500 to-emerald-400',
    bg:    'bg-green-50',
    border:'border-green-200/60',
  },
  {
    num:   3,
    icon:  '🍱',
    title: 'Enjoy Fresh Meals',
    desc:  'Sit back and enjoy freshly prepared home-style meals delivered straight to your door.',
    color: 'from-blue-500 to-indigo-400',
    bg:    'bg-blue-50',
    border:'border-blue-200/60',
  },
  {
    num:   4,
    icon:  '📊',
    title: 'Track Your Meals',
    desc:  'Manage your attendance, mark leaves, view meal history, and stay in control via your portal.',
    color: 'from-purple-500 to-violet-400',
    bg:    'bg-purple-50',
    border:'border-purple-200/60',
  },
];

/* ── Animated Counter ─────────────────────────────────────────── */
function AnimatedNumber({ target }) {
  const ref              = useRef(null);
  const count            = useMotionValue(0);
  const rounded          = useTransform(count, (v) => String(Math.round(v)).padStart(2, '0'));
  const isInView         = useInView(ref, { once: true, margin: '-80px' });
  const prefersReduced   = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReduced) { count.set(target); return; }
    const controls = animate(count, target, { duration: 1.2, ease: 'easeOut', delay: 0.2 });
    return controls.stop;
  }, [isInView, count, target, prefersReduced]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

/* ── Step Card ────────────────────────────────────────────────── */
function StepCard({ step, index, isLast }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative flex flex-col items-center">

      {/* Connector line (desktop, horizontal) */}
      {!isLast && (
        <div
          aria-hidden="true"
          className="
            hidden lg:block
            absolute top-10 left-[calc(50%+3rem)] right-[calc(-50%+3rem)]
            h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
            z-0
          "
        />
      )}

      <FadeUp delay={index * 0.12}>
        <motion.div
          className={`
            relative z-10 flex flex-col items-center text-center
            p-6 rounded-3xl border ${step.border} ${step.bg}
            cursor-default w-full
          `}
          whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        >
          {/* Step number circle */}
          <div className={`
            w-20 h-20 rounded-full
            bg-gradient-to-br ${step.color}
            flex items-center justify-center
            text-white font-['Poppins'] font-black text-2xl
            shadow-lg mb-5
            ring-4 ring-white
          `}>
            <AnimatedNumber target={step.num} />
          </div>

          {/* Icon */}
          <span
            role="img"
            aria-hidden="true"
            className="text-4xl mb-4 block"
          >
            {step.icon}
          </span>

          <h3 className="font-['Poppins'] font-bold text-lg text-land-dark mb-2 leading-snug">
            {step.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
            {step.desc}
          </p>
        </motion.div>
      </FadeUp>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────── */
export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="howitworks-heading"
      className="py-20 md:py-28 bg-land-dark relative overflow-x-clip scroll-mt-24"
    >
      {/* Dark bg decorations */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <SectionHeader
            badge="Simple Process"
            title="Start eating well in"
            highlight="4 easy steps."
            description="Getting started with Meals & Bowls is incredibly simple. From sign-up to your first fresh meal — it takes just minutes."
            theme="dark"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {STEPS.map((step, i) => (
            <StepCard
              key={step.num}
              step={step}
              index={i}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeUp delay={0.5}>
          <div className="text-center mt-14">
            <a
              href="#plans"
              onClick={(e) => { e.preventDefault(); scrollToSection('#plans', -80); }}
              className="
                inline-flex items-center gap-2 px-8 py-4 rounded-full
                bg-land-primary text-white font-semibold text-base
                hover:bg-orange-500 hover:shadow-2xl hover:shadow-orange-900/40 hover:scale-105
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary focus-visible:ring-offset-2 focus-visible:ring-offset-land-dark
              "
            >
              View Meal Plans
              <span aria-hidden="true" className="text-lg">→</span>
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
