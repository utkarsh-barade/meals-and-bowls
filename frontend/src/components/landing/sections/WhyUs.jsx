import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';
import { FadeUp }        from '@/components/landing/animations/FadeUp';

/* ── Data from Official Poster ─────────────────────────────── */
const REASONS = [
  {
    icon:  '🌱',
    title: 'Daily Fresh Cooking',
    desc:  'Cooked fresh every morning with quality ingredients. Never reheated or day-old.',
    color: 'from-orange-100 to-amber-50 dark:from-gray-800 dark:to-gray-800/80',
    border:'border-orange-200/60 dark:border-gray-700/80',
  },
  {
    icon:  '🛡️',
    title: 'Hygienic & Clean',
    desc:  'Prepared in a spotlessly clean kitchen following strict safety & hygiene protocols.',
    color: 'from-green-100 to-emerald-50 dark:from-gray-800 dark:to-gray-800/80',
    border:'border-green-200/60 dark:border-gray-700/80',
  },
  {
    icon:  '🏠',
    title: 'Homemade Taste',
    desc:  'Pure, homely flavor made with love — just like food cooked at home.',
    color: 'from-amber-100 to-yellow-50 dark:from-gray-800 dark:to-gray-800/80',
    border:'border-amber-200/60 dark:border-gray-700/80',
  },
  {
    icon:  '🏅',
    title: 'Best Quality Ingredients',
    desc:  'Hand-picked seasonal vegetables, fresh spices, basmati rice, and pure oil.',
    color: 'from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80',
    border:'border-blue-200/60 dark:border-gray-700/80',
  },
  {
    icon:  '💰',
    title: 'Budget Friendly Meals',
    desc:  'Starting at just ₹89 per meal. Premium home-style food at affordable rates.',
    color: 'from-purple-100 to-violet-50 dark:from-gray-800 dark:to-gray-800/80',
    border:'border-purple-200/60 dark:border-gray-700/80',
  },
  {
    icon:  '🌿',
    title: 'Jain Food Available',
    desc:  'Special Jain thali preparations available without onion & garlic on request.',
    color: 'from-emerald-100 to-teal-50 dark:from-gray-800 dark:to-gray-800/80',
    border:'border-emerald-200/60 dark:border-gray-700/80',
    badge: 'On Request',
  },
];

function FeatureCard({ icon, title, desc, color, border, badge, index }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <FadeUp delay={index * 0.08}>
      <motion.div
        className={`
          relative h-full p-7 rounded-3xl border ${border}
          bg-gradient-to-br ${color}
          shadow-sm shadow-black/5 dark:shadow-black/40
          cursor-default overflow-hidden
          group
        `}
        whileHover={prefersReducedMotion ? {} : {
          y: -8,
          scale: 1.02,
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      >
        {/* Badge */}
        {badge && (
          <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider">
            {badge}
          </span>
        )}

        {/* Icon */}
        <div className="
          w-14 h-14 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
          shadow-sm flex items-center justify-center mb-5
          text-3xl
          group-hover:scale-110 transition-transform duration-300
        ">
          <span role="img" aria-hidden="true">{icon}</span>
        </div>

        {/* Text */}
        <h3 className="font-['Poppins'] font-bold text-lg text-land-dark dark:text-white mb-2 leading-snug">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {desc}
        </p>
      </motion.div>
    </FadeUp>
  );
}

export default function WhyUs() {
  return (
    <section
      id="about"
      aria-labelledby="whyus-heading"
      className="py-20 md:py-28 bg-land-bg dark:bg-[#0E131F] transition-colors duration-300 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-14">
          <SectionHeader
            badge="Why Choose Us?"
            title="Pure • Fresh •"
            highlight="Homely Taste"
            description="We believe everyone deserves healthy, delicious home-cooked meals every day — prepared with care, hygiene, and authentic flavors."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((r, i) => (
            <FeatureCard key={r.title} {...r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
