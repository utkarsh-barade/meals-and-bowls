import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';
import { FadeUp }        from '@/components/landing/animations/FadeUp';

const FEATURES = [
  {
    icon:  '💬',
    title: 'WhatsApp Updates',
    desc:  'Real-time notifications for every meal — delivery time, menu, and daily updates directly to your WhatsApp.',
    badge: 'Most Used',
    badgeColor: 'bg-green-100 text-green-700',
    gradient: 'from-green-500/10 to-emerald-400/5',
    iconBg:  'bg-green-100',
  },
  {
    icon:  '📊',
    title: 'Meal Tracking',
    desc:  'Full history of every meal received with daily attendance records. Always stay informed.',
    gradient: 'from-blue-500/10 to-blue-400/5',
    iconBg:  'bg-blue-100',
  },
  {
    icon:  '🌴',
    title: 'Leave Management',
    desc:  'Mark your leave in advance through WhatsApp or the portal. Never pay for meals you miss.',
    badge: 'Save Money',
    badgeColor: 'bg-orange-100 text-orange-700',
    gradient: 'from-orange-500/10 to-amber-400/5',
    iconBg:  'bg-orange-100',
  },
  {
    icon:  '👥',
    title: 'Guest Meals',
    desc:  'Hosting a friend or family member? Add a guest meal with a simple WhatsApp message — we\'ll handle the rest.',
    gradient: 'from-purple-500/10 to-violet-400/5',
    iconBg:  'bg-purple-100',
  },
  {
    icon:  '📦',
    title: 'Parcel Support',
    desc:  'Need your meal packed for takeaway? Parcel support is available for all Standard and Premium subscribers.',
    gradient: 'from-amber-500/10 to-yellow-400/5',
    iconBg:  'bg-amber-100',
  },
  {
    icon:  '🔒',
    title: 'Secure & Transparent',
    desc:  'Simple monthly billing with full payment transparency. No hidden charges, no surprises.',
    gradient: 'from-indigo-500/10 to-blue-400/5',
    iconBg:  'bg-indigo-100',
  },
];

function FeatureItem({ feat, index }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <FadeUp delay={index * 0.07}>
      <motion.div
        className={`
          relative h-full p-7 rounded-3xl
          border border-gray-100
          bg-gradient-to-br ${feat.gradient} bg-white
          shadow-sm shadow-black/4
          cursor-default group overflow-hidden
        `}
        whileHover={prefersReducedMotion ? {} : {
          y: -8,
          scale: 1.02,
          borderColor: 'rgba(249,115,22,0.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.09)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      >
        {/* Hover glow */}
        <div className="
          absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100
          transition-opacity duration-400
          bg-gradient-to-br from-orange-50/60 to-transparent
        " />

        {/* Icon + badge row */}
        <div className="flex items-start justify-between mb-5">
          <div className={`
            w-13 h-13 w-12 h-12 rounded-2xl ${feat.iconBg}
            flex items-center justify-center text-2xl
            group-hover:scale-110 transition-transform duration-300
          `}>
            <span role="img" aria-hidden="true">{feat.icon}</span>
          </div>

          {feat.badge && (
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${feat.badgeColor}`}>
              {feat.badge}
            </span>
          )}
        </div>

        <h3 className="font-['Poppins'] font-bold text-base text-land-dark mb-2 leading-snug">
          {feat.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {feat.desc}
        </p>
      </motion.div>
    </FadeUp>
  );
}

export default function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-20 md:py-28 bg-land-bg scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <SectionHeader
            badge="Features"
            title="Everything you need,"
            highlight="built in."
            description="Meals & Bowls is more than just food delivery — it's a complete meal subscription system designed for your lifestyle."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <FeatureItem key={feat.title} feat={feat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
