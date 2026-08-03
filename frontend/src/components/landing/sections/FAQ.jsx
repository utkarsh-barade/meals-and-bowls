import { useState } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';
import { FadeUp }        from '@/components/landing/animations/FadeUp';

/* ── Data from Official Poster ─────────────────────────────── */
const FAQS = [
  {
    q: 'What items are included in each Thali meal?',
    a: 'Every single meal comes with 7 complete items: Roti, Seasonal Sabji (menu changes daily), Dal, Rice, Raita, Salad, and Pickle. Freshly cooked with pure, homely taste.',
  },
  {
    q: 'What subscription plans do you offer and what is their validity?',
    a: 'We offer 2 monthly plans:\n• Plan 1: 30 Meals for ₹2,700 (Valid for 35 Days)\n• Plan 2: 56 Meals for ₹5,000 (Valid for 40 Days - Best Value)\nSubscriptions must be completed within the validity period.',
  },
  {
    q: 'Is Jain food available?',
    a: 'Yes! Jain food (prepared without onion and garlic) is available on request. Please inform us of your preference when activating your subscription.',
  },
  {
    q: 'Are takeaway / parcel options available and what are the charges?',
    a: 'Yes, meals are valid for both dine-in and takeaway. For takeaway / parcel orders, there is a nominal charge of ₹10 extra per meal.',
  },
  {
    q: 'Can I consume meals at both Lunch and Dinner?',
    a: 'Yes, meals can be consumed at Lunch or Dinner as per availability. For Plan 2 (56 Meals), you can easily cover both daily lunch and dinner.',
  },
  {
    q: 'What happens when the validity period ends?',
    a: 'Subscriptions must be used within their validity period (35 days for Plan 1, 40 days for Plan 2). Unused meals cannot be carried forward after the validity period expires.',
  },
  {
    q: 'Can I transfer my subscription or request a refund?',
    a: 'Subscriptions are non-transferable and no refunds are issued once a plan has been activated. Please ensure you select the plan that best fits your schedule.',
  },
];

/* ── Accordion Item ───────────────────────────────────────────── */
function AccordionItem({ faq, index, isOpen, onToggle }) {
  const prefersReducedMotion = useReducedMotion();
  const id = `faq-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <FadeUp delay={index * 0.05}>
      <div className={`
        rounded-2xl border overflow-hidden
        transition-colors duration-200
        ${isOpen
          ? 'border-land-primary/40 bg-orange-50/50 dark:bg-gray-800/90 dark:border-orange-500/50'
          : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-orange-200/50 dark:hover:border-gray-700'}
        shadow-sm shadow-black/4
      `}>
        <button
          id={id}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="
            w-full flex items-center justify-between gap-4
            px-6 py-5 text-left
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-land-primary
            cursor-pointer
          "
        >
          <span className={`
            font-['Poppins'] font-semibold text-sm sm:text-base leading-snug
            ${isOpen ? 'text-land-primary' : 'text-land-dark dark:text-white'}
            pr-4
          `}>
            {faq.q}
          </span>

          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: 'easeInOut' }
            }
            className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${isOpen
                ? 'bg-land-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}
              transition-colors duration-200
            `}
            aria-hidden="true"
          >
            <ChevronDown size={16} strokeWidth={2.5} />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={id}
              key="answer"
              initial={prefersReducedMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0 }}
              animate={prefersReducedMotion
                ? { opacity: 1 }
                : { height: 'auto', opacity: 1 }}
              exit={prefersReducedMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0 }}
              transition={{
                height:  { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.22 },
              }}
              style={{ overflow: 'hidden' }}
            >
              <div className="px-6 pb-5">
                <div className="w-full h-px bg-orange-200/40 dark:bg-gray-700/60 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {faq.a}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeUp>
  );
}

/* ── Section ──────────────────────────────────────────────────── */
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-20 md:py-28 bg-land-bg dark:bg-[#0E131F] transition-colors duration-300 scroll-mt-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeader
            badge="FAQ"
            title="Common questions,"
            highlight="answered."
            description="Everything you need to know about Meals & Bowls thali subscriptions, pricing, and terms."
          />
        </div>

        <div
          className="space-y-3"
          role="list"
          aria-label="Frequently asked questions"
        >
          {FAQS.map((faq, i) => (
            <div key={i} role="listitem">
              <AccordionItem
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
