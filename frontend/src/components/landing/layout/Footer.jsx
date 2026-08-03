import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { scrollToSection } from '@/components/landing/hooks/useSmoothScroll';
import logoImg from '@/assets/landing/logo.webp';

/* ── Data ──────────────────────────────────────────────────────── */
const QUICK_LINKS = [
  { label: 'Home',        href: '#home' },
  { label: 'Meal Plans',  href: '#plans' },
  { label: 'How It Works',href: '#how-it-works' },
  { label: 'Gallery',     href: '#gallery' },
  { label: 'About Us',    href: '#about' },
  { label: 'FAQ',         href: '#faq' },
  { label: 'Contact',     href: '#contact' },
];

const CONTACT_ITEMS = [
  {
    icon: '📱',
    label: 'Phone',
    value: '+91 70495 92280',
    href:  'tel:+917049592280',
  },
  {
    icon: '💬',
    label: 'WhatsApp',
    value: 'Chat with us',
    href:  'https://wa.me/917049592280',
    external: true,
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'mealsbowls@gmail.com',
    href:  'mailto:mealsbowls@gmail.com',
  },
  {
    icon: '📍',
    label: 'Location',
    value: 'India',
    href:  null,
  },
];

const SOCIAL_LINKS = [
  {
    label: 'WhatsApp',
    href:  'https://wa.me/917049592280',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href:  'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href:  'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

/* ── Component ─────────────────────────────────────────────────── */
export default function Footer() {
  const year = new Date().getFullYear();
  const prefersReducedMotion = useReducedMotion();

  // Button pulse every 6 seconds
  const buttonPulse = prefersReducedMotion
    ? {}
    : {
        animate: { scale: [1, 1.04, 1] },
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
      };

  return (
    <footer className="bg-land-dark text-white" aria-label="Site footer">

      {/* ── CTA Banner with Animated Gradient ────────────────── */}
      <div className="relative border-b border-white/10 overflow-hidden">
        {/* Subtle animated gradient background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-[length:200%_100%] animate-pulse"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-['Poppins'] font-bold text-2xl md:text-3xl text-white leading-tight">
                Ready to eat fresh every day?
              </h2>
              <p className="mt-2 text-gray-400 text-sm">
                Join hundreds of happy customers enjoying home-style meals.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <motion.a
                href="#plans"
                onClick={(e) => { e.preventDefault(); scrollToSection('#plans', -80); }}
                className="
                  px-6 py-3 rounded-full bg-land-primary text-white text-sm font-semibold
                  hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-900/40
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary focus-visible:ring-offset-2 focus-visible:ring-offset-land-dark
                "
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
                {...buttonPulse}
              >
                View Meal Plans
              </motion.a>
              <Link
                to="/login"
                className="
                  px-6 py-3 rounded-full border border-white/20 text-white text-sm font-semibold
                  hover:bg-white/10 hover:scale-105
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-land-dark
                "
              >
                Customer Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollToSection('#home', -80); }}
              className="inline-flex items-center gap-2.5 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary rounded-lg"
              aria-label="Meals & Bowls home"
            >
              <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md flex-shrink-0 flex items-center justify-center">
                <img src={logoImg} alt="Meals & Bowls logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="font-['Poppins'] font-bold text-lg text-white">
                Meals <span className="text-land-primary">&amp;</span> Bowls
              </span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Fresh, hygienic, home-style meals delivered to your doorstep every day.
              Subscription-based meal service you can trust.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="
                    w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400
                    hover:bg-land-primary hover:text-white
                    transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary focus-visible:ring-offset-2 focus-visible:ring-offset-land-dark
                  "
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-['Poppins'] font-semibold text-white text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3" role="list">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => {
                      if (href.startsWith('#')) {
                        e.preventDefault();
                        scrollToSection(href, -80);
                      }
                    }}
                    className="
                      text-sm text-gray-400 hover:text-land-primary
                      transition-colors duration-200 inline-flex items-center gap-1.5 group
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary rounded
                    "
                  >
                    <span className="text-land-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 transition-transform duration-200">›</span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-['Poppins'] font-semibold text-white text-sm uppercase tracking-wider mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4" role="list">
              {CONTACT_ITEMS.map(({ icon, label, value, href, external }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5" role="img" aria-hidden="true">{icon}</span>
                  <div>
                    <span className="block text-xs text-gray-500 mb-0.5">{label}</span>
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="text-sm text-gray-300 hover:text-land-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary rounded"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-300">{value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours / Trust Signals */}
          <div>
            <h3 className="font-['Poppins'] font-semibold text-white text-sm uppercase tracking-wider mb-5">
              Service Hours
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Lunch Delivery</span>
                <span className="text-gray-300 font-medium">12:00 – 1:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Dinner Delivery</span>
                <span className="text-gray-300 font-medium">7:00 – 9:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Days</span>
                <span className="text-gray-300 font-medium">Mon – Sat</span>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {['🏠 Home Style', '🥦 Fresh Daily', '✅ Hygienic'].map(b => (
                <span key={b} className="px-3 py-1.5 rounded-full bg-white/10 text-xs text-gray-300 font-medium">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            © {year} Meals &amp; Bowls. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Made with <span className="text-red-400" aria-hidden="true">❤️</span>
            <span className="sr-only">love</span> for fresh, healthy eating.
          </p>
        </div>
      </div>
    </footer>
  );
}
