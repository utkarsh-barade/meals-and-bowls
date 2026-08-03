import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';
import { FadeUp }        from '@/components/landing/animations/FadeUp';

const CONTACT_METHODS = [
  {
    icon:  '💬',
    label: 'WhatsApp',
    value: '+91 70495 92280',
    sub:   'Chat with us instantly',
    href:  'https://wa.me/917049592280',
    external: true,
    color: 'bg-[#25D366]/10 border-[#25D366]/30 text-[#25D366]',
    iconBg:'bg-[#25D366]/15',
    ctaLabel: 'Open WhatsApp',
    ctaColor:'bg-[#25D366] hover:bg-green-500',
  },
  {
    icon:  '📱',
    label: 'Phone',
    value: '+91 70495 92280',
    sub:   'Mon–Sat, 9 AM – 8 PM',
    href:  'tel:+917049592280',
    color: 'bg-blue-50 border-blue-200/60 text-blue-600',
    iconBg:'bg-blue-100',
    ctaLabel: 'Call Now',
    ctaColor:'bg-blue-600 hover:bg-blue-700',
  },
  {
    icon:  '✉️',
    label: 'Email',
    value: 'mealsbowls@gmail.com',
    sub:   'We reply within 24 hours',
    href:  'mailto:mealsbowls@gmail.com',
    color: 'bg-orange-50 border-orange-200/60 text-orange-600',
    iconBg:'bg-orange-100',
    ctaLabel: 'Send Email',
    ctaColor:'bg-land-primary hover:bg-orange-500',
  },
];

const SERVICE_HOURS = [
  { day: 'Lunch Delivery',  time: '12:00 – 1:30 PM' },
  { day: 'Dinner Delivery', time: '7:00 – 9:00 PM'  },
  { day: 'Operating Days',  time: 'Mon – Sat'        },
  { day: 'Premium Plan',    time: 'All 7 days'       },
];

/* ── Contact Card ─────────────────────────────────────────────── */
function ContactCard({ method, index }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <FadeUp delay={index * 0.1}>
      <motion.div
        className={`
          h-full p-6 rounded-3xl border ${method.color}
          flex flex-col gap-4 cursor-default group
        `}
        whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${method.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}>
            <span role="img" aria-hidden="true">{method.icon}</span>
          </div>
          <div>
            <p className="font-['Poppins'] font-bold text-sm text-land-dark">{method.label}</p>
            <p className="text-xs text-gray-400">{method.sub}</p>
          </div>
        </div>

        <p className="font-semibold text-land-dark text-sm">{method.value}</p>

        <a
          href={method.href}
          {...(method.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={`
            mt-auto inline-flex items-center justify-center gap-1.5 py-2.5 px-5 rounded-full
            text-white text-xs font-semibold
            transition-all duration-200 hover:scale-105 hover:shadow-md
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-land-primary
            ${method.ctaColor}
          `}
        >
          {method.ctaLabel}
          <span aria-hidden="true">→</span>
        </a>
      </motion.div>
    </FadeUp>
  );
}

/* ── Section ──────────────────────────────────────────────────── */
export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-20 md:py-28 bg-land-dark relative overflow-x-clip scroll-mt-24"
    >
      {/* Dark background decorations */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <SectionHeader
            badge="Contact Us"
            title="Get in touch"
            highlight="anytime."
            description="Questions about plans? Want to subscribe? We're always available via WhatsApp, phone, or email."
            theme="dark"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Left: Contact methods + hours */}
          <div className="space-y-8">
            {/* Contact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {CONTACT_METHODS.map((m, i) => (
                <ContactCard key={m.label} method={m} index={i} />
              ))}
            </div>

            {/* Service hours */}
            <FadeUp delay={0.3}>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <h3 className="font-['Poppins'] font-semibold text-white mb-4 flex items-center gap-2">
                  <span aria-hidden="true">🕐</span> Service Hours
                </h3>
                <ul className="space-y-3">
                  {SERVICE_HOURS.map(({ day, time }) => (
                    <li key={day} className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{day}</span>
                      <span className="text-sm text-white font-medium bg-white/10 px-3 py-1 rounded-full">
                        {time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>

          {/* Right: Map + address */}
          <div className="space-y-5">
            <FadeUp delay={0.15}>
              {/* Map placeholder — replace src with real Google Maps embed URL */}
              <div
                className="
                  relative w-full h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden
                  border border-white/10 bg-gray-800
                "
                aria-label="Location map"
              >
                {/* Google Maps embed — update lat/lng to actual address */}
                <iframe
                  title="Meals & Bowls Location"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15089.55!2d73.8567!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(30%) contrast(1.1)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
                {/* Map overlay badge */}
                <div className="
                  absolute top-4 left-4
                  bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5
                  shadow-lg border border-gray-100
                ">
                  <p className="font-['Poppins'] font-bold text-xs text-land-dark">📍 Meals & Bowls</p>
                  <p className="text-[11px] text-gray-500">India</p>
                </div>
              </div>
            </FadeUp>

            {/* Address card */}
            <FadeUp delay={0.25}>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <h3 className="font-['Poppins'] font-semibold text-white mb-4">📍 Find Us</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Serving customers across the region.<br />
                  Contact us for your delivery area confirmation.
                </p>

                {/* Quick-action WhatsApp CTA */}
                <a
                  href="https://wa.me/917049592280?text=Hi%2C%20I%20want%20to%20know%20more%20about%20Meals%20%26%20Bowls%20subscription"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-5 flex items-center gap-3 p-4 rounded-2xl
                    bg-[#25D366]/15 border border-[#25D366]/30
                    hover:bg-[#25D366]/25 hover:scale-[1.01]
                    transition-all duration-200 group
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-land-dark
                  "
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-[#25D366] transition-colors">
                      Ask about your delivery area
                    </p>
                    <p className="text-xs text-gray-500">Reply usually within minutes</p>
                  </div>
                  <span aria-hidden="true" className="ml-auto text-[#25D366]">→</span>
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
