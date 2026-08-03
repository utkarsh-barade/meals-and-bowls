import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { scrollToSection } from '@/components/landing/hooks/useSmoothScroll';
import { useTheme } from '@/components/landing/hooks/useTheme';
import logoImg from '@/assets/landing/logo.webp';

const NAV_LINKS = [
  { label: 'Home',        href: '#home' },
  { label: 'Plans',       href: '#plans' },
  { label: 'Gallery',     href: '#gallery' },
  { label: 'About',       href: '#about' },
  { label: 'Contact',     href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#home');
  const prefersReducedMotion = useReducedMotion();
  const { isDark, toggleTheme } = useTheme();

  /* ── Scroll detection ──────────────────────────────────────── */
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* ── Close mobile menu on resize to desktop ─────────────────── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Lock body scroll when mobile menu is open ──────────────── */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setActiveHash(href);
    setIsMenuOpen(false);
    scrollToSection(href, -80);
  };

  return (
    <>
      <motion.header
        role="banner"
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0 }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300 ease-in-out
          ${isScrolled
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-sm border-b border-orange-100/60 dark:border-gray-800'
            : 'bg-transparent'}
        `}
      >
        <nav
          aria-label="Main navigation"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* ── Logo ───────────────────────────────────────────── */}
            <a
              href="#home"
              aria-label="Meals & Bowls – go to homepage"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary focus-visible:ring-offset-2 rounded-lg"
            >
              <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md shadow-orange-200/60 ring-2 ring-orange-200 dark:ring-orange-400 flex-shrink-0 flex items-center justify-center">
                <img src={logoImg} alt="Meals & Bowls logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="font-['Poppins'] font-bold text-lg text-land-dark dark:text-white leading-none">
                Meals <span className="text-land-primary">&amp;</span> Bowls
              </span>
            </a>

            {/* ── Desktop Nav Links ───────────────────────────────── */}
            <ul className="hidden md:flex items-center gap-1" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={`
                      px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary focus-visible:ring-offset-2
                      ${activeHash === href
                        ? 'text-land-primary bg-orange-50 dark:bg-orange-950/40 font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:text-land-primary dark:hover:text-land-primary hover:bg-orange-50/70 dark:hover:bg-gray-800'}
                    `}
                    aria-current={activeHash === href ? 'page' : undefined}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            {/* ── Desktop CTA & Dark Mode Toggle ──────────────────── */}
            <div className="hidden md:flex items-center gap-3">

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="
                  p-2.5 rounded-full text-gray-600 dark:text-gray-300
                  bg-gray-100/80 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-gray-700
                  hover:text-land-primary dark:hover:text-amber-400
                  transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary
                "
              >
                {isDark ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} />}
              </button>

              <Link
                to="/login"
                className="
                  inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full
                  bg-land-primary text-white text-sm font-semibold
                  hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-200/70 hover:scale-105
                  active:scale-95 transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary focus-visible:ring-offset-2
                "
              >
                Customer Login
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* ── Mobile Hamburger & Theme Toggle ─────────────────── */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="
                  p-2 rounded-full text-gray-600 dark:text-gray-300
                  bg-gray-100 dark:bg-gray-800
                  transition-colors
                "
              >
                {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
              </button>

              <button
                type="button"
                onClick={() => setIsMenuOpen(o => !o)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                className="
                  p-2.5 rounded-xl text-gray-600 dark:text-gray-300
                  hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-land-primary
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary focus-visible:ring-offset-2
                  transition-colors duration-200
                "
              >
                {isMenuOpen
                  ? <X size={22} strokeWidth={2.5} />
                  : <Menu size={22} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile Menu Overlay ──────────────────────────────────── */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-hidden="true"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-land-dark/60 backdrop-blur-sm" />
        </div>
      )}

      {/* ── Mobile Menu Drawer ───────────────────────────────────── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden
          bg-white dark:bg-gray-900 shadow-2xl shadow-black/20
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <span className="font-['Poppins'] font-bold text-land-dark dark:text-white">
            Meals <span className="text-land-primary">&amp;</span> Bowls
          </span>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer links */}
        <nav aria-label="Mobile navigation" className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium
                    transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary
                    ${activeHash === href
                      ? 'text-land-primary bg-orange-50 dark:bg-orange-950/40 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-land-primary hover:bg-orange-50/70 dark:hover:bg-gray-800'}
                  `}
                  aria-current={activeHash === href ? 'page' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer footer CTA */}
        <div className="px-6 py-6 border-t border-gray-100 dark:border-gray-800">
          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="
              flex items-center justify-center gap-2 w-full py-3.5 rounded-full
              bg-land-primary text-white text-sm font-semibold
              hover:bg-orange-500 transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary focus-visible:ring-offset-2
            "
          >
            Customer Login
            <span aria-hidden="true">→</span>
          </Link>
          <p className="text-xs text-center text-gray-400 mt-3">
            Existing customer? Login to your account.
          </p>
        </div>
      </div>
    </>
  );
}
