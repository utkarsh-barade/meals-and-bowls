import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';
import { FadeUp }        from '@/components/landing/animations/FadeUp';

/* ── Data ─────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    id:       1,
    name:     'Priya Sharma',
    location: 'Working Professional, Pune',
    avatar:   '👩',
    initials: 'PS',
    rating:   5,
    text:     'The meals are absolutely delicious and taste just like home-cooked food. I\'ve saved so much time and money since subscribing. The WhatsApp updates are a brilliant touch!',
    highlight:'Saves time & money',
    color:    'from-orange-50 to-amber-50',
    border:   'border-orange-200/50',
  },
  {
    id:       2,
    name:     'Rahul Mehta',
    location: 'Engineering Student, Nagpur',
    avatar:   '👨',
    initials: 'RM',
    rating:   5,
    text:     'Affordable, fresh, and absolutely consistent. As a student living alone, this has been a lifesaver. I never have to worry about what to eat anymore.',
    highlight:'Perfect for students',
    color:    'from-blue-50 to-indigo-50',
    border:   'border-blue-200/50',
  },
  {
    id:       3,
    name:     'Ankita Joshi',
    location: 'Night-shift Nurse',
    avatar:   '👩‍⚕️',
    initials: 'AJ',
    rating:   5,
    text:     'The leave management feature is brilliant. I work irregular hours and they are always accommodating. I only pay for meals I actually receive. Honestly impressive service.',
    highlight:'Flexible leave system',
    color:    'from-green-50 to-emerald-50',
    border:   'border-green-200/50',
  },
  {
    id:       4,
    name:     'Deepak Rathod',
    location: 'Software Engineer',
    avatar:   '👨‍💻',
    initials: 'DR',
    rating:   5,
    text:     'Been subscribed for over 6 months now. The food quality is consistently excellent — fresh, well-spiced, and genuinely home-style. Highly recommended to anyone tired of ordering from apps.',
    highlight:'Consistent quality',
    color:    'from-purple-50 to-violet-50',
    border:   'border-purple-200/50',
  },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`text-base ${i < count ? 'text-amber-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ review, index }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <FadeUp delay={index * 0.1}>
      <motion.article
        aria-label={`Review by ${review.name}`}
        className={`
          relative h-full p-7 rounded-3xl border ${review.border}
          bg-gradient-to-br ${review.color}
          backdrop-blur-sm
          shadow-sm shadow-black/5
          cursor-default flex flex-col
          group overflow-hidden
        `}
        whileHover={prefersReducedMotion ? {} : {
          y: -8,
          scale: 1.02,
          boxShadow: '0 20px 40px rgba(0,0,0,0.10)',
        }}
        transition={{ type: 'spring', stiffness: 340, damping: 22 }}
      >
        {/* Glass shimmer on hover */}
        <div className="
          absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-br from-white/50 to-transparent
        " />

        {/* Quote mark */}
        <span aria-hidden="true" className="
          absolute top-5 right-6 text-6xl font-serif text-land-primary/15
          leading-none pointer-events-none
        ">
          "
        </span>

        {/* Rating */}
        <div className="mb-4">
          <StarRating count={review.rating} />
        </div>

        {/* Review text */}
        <blockquote className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">
          "{review.text}"
        </blockquote>

        {/* Highlight pill */}
        {review.highlight && (
          <span className="
            inline-block self-start px-3 py-1 rounded-full
            bg-white/80 border border-gray-100
            text-xs font-semibold text-land-primary
            mb-5
          ">
            ✓ {review.highlight}
          </span>
        )}

        {/* Reviewer */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/50">
          <div className="
            w-11 h-11 rounded-full
            bg-white shadow-sm
            flex items-center justify-center
            text-2xl flex-shrink-0
          ">
            <span role="img" aria-label={review.name}>{review.avatar}</span>
          </div>
          <div>
            <p className="font-['Poppins'] font-bold text-sm text-land-dark">{review.name}</p>
            <p className="text-xs text-gray-500">{review.location}</p>
          </div>
        </div>
      </motion.article>
    </FadeUp>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-20 md:py-28 relative overflow-x-clip scroll-mt-24"
      style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFFDF8 50%, #F0FFF4 100%)' }}
    >
      {/* Soft blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-orange-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-green-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <SectionHeader
            badge="Testimonials"
            title="Our customers"
            highlight="love us."
            description="Real stories from real subscribers — people who enjoy fresh, home-style meals every day with Meals & Bowls."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((review, i) => (
            <TestimonialCard key={review.id} review={review} index={i} />
          ))}
        </div>

        {/* Rating summary strip */}
        <FadeUp delay={0.4}>
          <div className="
            mt-12 flex flex-col sm:flex-row items-center justify-center gap-6
            p-6 rounded-3xl bg-white/70 backdrop-blur-sm
            border border-white shadow-sm shadow-black/5
          ">
            <div className="text-center">
              <p className="font-['Poppins'] font-black text-5xl text-land-primary">4.9</p>
              <StarRating count={5} />
              <p className="text-xs text-gray-500 mt-1">Average Rating</p>
            </div>
            <div className="hidden sm:block w-px h-16 bg-gray-200" />
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { value: '500+', label: 'Happy Customers' },
                { value: '98%',  label: 'Satisfaction Rate' },
                { value: '6mo',  label: 'Avg. Subscription' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-['Poppins'] font-bold text-2xl text-land-dark">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
