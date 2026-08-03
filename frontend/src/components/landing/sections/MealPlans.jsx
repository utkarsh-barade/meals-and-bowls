import { useState } from 'react';
import { motion }   from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { Link }     from 'react-router-dom';
import { Check, Calendar, Info, Package } from 'lucide-react';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';
import { FadeUp }        from '@/components/landing/animations/FadeUp';

/* ── Data from Official Poster ─────────────────────────────── */
const PLANS = [
  {
    id:       'plan-1',
    name:     'Plan 1',
    mealsCount:'30 Meals',
    tagline:  'Perfect for single meal subscribers',
    price:    2700,
    validity: '35 Days',
    perMeal:  '₹90 / meal',
    featured: false,
    rotation: -1.5,
    features: [
      '30 Total Meals Included',
      'Valid for 35 Days from start',
      'Consume at Lunch or Dinner',
      'Full 7-Item Thali included',
      'Daily Fresh Cooking & Hygienic',
      'WhatsApp delivery updates',
    ],
    cta:      'Subscribe Now',
    color:    'border-emerald-200 dark:border-emerald-800/60 bg-white dark:bg-gray-800/90 hover:border-emerald-400',
    ctaStyle: 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-md shadow-emerald-200 dark:shadow-none',
    badgeColor:'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  },
  {
    id:       'plan-2',
    name:     'Plan 2',
    mealsCount:'56 Meals',
    tagline:  'Most Popular — Complete monthly plan',
    price:    5000,
    validity: '40 Days',
    perMeal:  '₹89 / meal',
    featured: true,
    rotation: 0,
    badge:    'Best Value',
    features: [
      '56 Total Meals Included',
      'Valid for 40 Days from start',
      'Consume at Lunch & Dinner',
      'Full 7-Item Thali included',
      'Daily Fresh Cooking & Hygienic',
      'WhatsApp delivery updates',
      'Priority customer support',
    ],
    cta:      'Subscribe Now',
    color:    'border-land-primary/60 dark:border-orange-500/80 bg-white dark:bg-gray-800/90 hover:border-land-primary',
    ctaStyle: 'bg-gradient-to-r from-land-primary to-orange-500 text-white shadow-xl shadow-orange-300/80 dark:shadow-orange-950/50',
    badgeColor:'bg-land-primary text-white',
  },
];

const THALI_ITEMS = [
  { name: 'Roti',           icon: '🥖', desc: 'Soft freshly made' },
  { name: 'Seasonal Sabji', icon: '🥗', desc: 'Changes daily'    },
  { name: 'Dal',            icon: '🍲', desc: 'Rich & flavorful'  },
  { name: 'Rice',           icon: '🍚', desc: 'Basmati rice'      },
  { name: 'Raita',          icon: '🥣', desc: 'Cool & refreshing' },
  { name: 'Salad',          icon: '🥗', desc: 'Fresh crunchy'     },
  { name: 'Pickle',         icon: '🫙', desc: 'Home-style pickle' },
];

const TERMS = [
  'Subscription must be completed within validity period.',
  'Meals can be consumed at Lunch or Dinner (as per availability).',
  'Takeaway charges: ₹10 extra per meal.',
  'No carry-forward after validity ends.',
  'Non-transferable subscription & no refund once activated.',
  'Fixed menu (seasonal sabji changes daily).',
  'Valid for dine-in / takeaway only.',
];

/* ── PricingCard ──────────────────────────────────────────────── */
function PricingCard({ plan, index }) {
  const prefersReducedMotion = useReducedMotion();

  const buttonPulseProps = (plan.featured && !prefersReducedMotion)
    ? {
        animate: { scale: [1, 1.04, 1] },
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
      }
    : {};

  return (
    <FadeUp delay={index * 0.15}>
      <motion.div
        className={`
          relative h-full rounded-[32px] border-2 p-8 transition-all duration-300
          ${plan.color}
          ${plan.featured
            ? 'shadow-2xl shadow-orange-300/60 dark:shadow-black/60'
            : 'shadow-lg shadow-black/5 dark:shadow-black/40'}
          flex flex-col
          cursor-default group
        `}
        whileHover={prefersReducedMotion ? {} : {
          y: -12,
          scale: plan.featured ? 1.02 : 1.03,
          rotate: plan.rotation,
          boxShadow: plan.featured
            ? '0 35px 70px rgba(249,115,22,0.35)'
            : '0 25px 50px rgba(0,0,0,0.3)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        {/* Popular badge */}
        {plan.badge && (
          <div className={`
            absolute -top-4 left-1/2 -translate-x-1/2
            px-6 py-1.5 rounded-full
            ${plan.badgeColor} text-xs font-extrabold uppercase tracking-wider
            shadow-lg shadow-orange-200/80 dark:shadow-none
          `}>
            ⭐ {plan.badge}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-400">
              {plan.name}
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 text-xs font-bold flex items-center gap-1">
              <Calendar size={12} />
              Valid {plan.validity}
            </span>
          </div>

          <h3 className="font-['Poppins'] font-black text-3xl text-land-dark dark:text-white mb-1">
            {plan.mealsCount}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">{plan.tagline}</p>

          {/* Price Tag */}
          <div className="bg-orange-50/80 dark:bg-gray-900/90 rounded-2xl p-4 border border-orange-100/80 dark:border-gray-700">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-land-primary">₹</span>
              <span className="font-['Poppins'] font-black text-5xl text-land-dark dark:text-white leading-none">
                {plan.price.toLocaleString()}
              </span>
              <span className="text-xs font-bold uppercase text-orange-600 dark:text-orange-400 bg-orange-200/80 dark:bg-orange-950/90 px-2 py-0.5 rounded-md ml-2">
                ONLY
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
              Breakdown: <span className="font-bold text-land-dark dark:text-white">{plan.perMeal}</span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-700 mb-6" />

        {/* Features Checklist */}
        <ul className="space-y-3.5 flex-1 mb-8" role="list" aria-label={`${plan.name} features`}>
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <motion.div
          whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
          {...buttonPulseProps}
        >
          <Link
            to="/login"
            className={`
              flex items-center justify-center gap-2 w-full py-4 rounded-full
              font-bold text-base tracking-wide uppercase
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-land-primary
              ${plan.ctaStyle}
            `}
          >
            {plan.cta}
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </motion.div>
    </FadeUp>
  );
}

/* ── Section ──────────────────────────────────────────────────── */
export default function MealPlans() {
  return (
    <section
      id="plans"
      aria-labelledby="plans-heading"
      className="py-20 md:py-28 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-x-clip scroll-mt-24"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-14">
          <SectionHeader
            badge="Monthly Thali Subscription"
            title="Healthy Food •"
            highlight="Happy Life"
            description="Pure, fresh, homely taste cooked daily. Choose your subscription plan and enjoy delicious meals."
          />
        </div>

        {/* 2 Main Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch mb-20">
          {PLANS.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        {/* Includes Per Meal (7 Items Grid) */}
        <FadeUp delay={0.3}>
          <div className="bg-gradient-to-br from-emerald-900 via-green-950 to-emerald-900 text-white rounded-[32px] p-8 md:p-12 shadow-2xl mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold tracking-widest uppercase mb-3 border border-emerald-700">
                Full Thali Experience
              </span>
              <h3 className="font-['Poppins'] font-extrabold text-2xl sm:text-3xl text-white">
                INCLUDES PER MEAL <span className="text-emerald-400">(7 ITEMS)</span>
              </h3>
              <p className="text-emerald-200/80 text-sm mt-1">Every single meal comes packed with complete nutrition</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              {THALI_ITEMS.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -6, scale: 1.05 }}
                  className="
                    flex flex-col items-center text-center p-4 rounded-2xl
                    bg-white/10 backdrop-blur-md border border-white/10
                    shadow-sm
                  "
                >
                  <span className="text-4xl mb-2" role="img" aria-label={item.name}>{item.icon}</span>
                  <span className="font-['Poppins'] font-bold text-sm text-white mb-0.5">{item.name}</span>
                  <span className="text-[11px] text-emerald-200/70">{item.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Terms & Conditions Box from Poster */}
        <FadeUp delay={0.4}>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">

            {/* Left 2 Cols: Terms list */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-orange-50/70 dark:bg-gray-800/90 border border-orange-200/80 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Info size={20} className="text-land-primary" />
                <h4 className="font-['Poppins'] font-bold text-lg text-land-dark dark:text-white uppercase tracking-wide">
                  Terms &amp; Conditions
                </h4>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3" role="list">
                {TERMS.map((term, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    <span className="text-land-primary font-bold">•</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Col: Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-land-primary text-white flex flex-col items-center justify-center text-center shadow-lg shadow-orange-300/50 dark:shadow-none">
              <span className="text-3xl mb-2">❤️</span>
              <h4 className="font-['Poppins'] font-black text-xl uppercase tracking-tight leading-tight">
                GOOD FOOD<br />GOOD MOOD<br />EVERYDAY!
              </h4>
              <span className="mt-4 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold tracking-wider uppercase">
                🌿 Jain Food Available
              </span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
