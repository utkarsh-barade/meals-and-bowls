import { useState, lazy, Suspense } from 'react';
import Navbar from '@/components/landing/layout/Navbar';
import Footer from '@/components/landing/layout/Footer';
import Hero   from '@/components/landing/sections/Hero';
import PageLoader from '@/components/landing/ui/PageLoader';
import { useSmoothScroll } from '@/components/landing/hooks/useSmoothScroll';
import { ThemeProvider } from '@/components/landing/context/ThemeContext';

// Code-split heavy below-the-fold marketing sections
const CanvasScrollSequence = lazy(() => import('@/components/landing/sections/CanvasScrollSequence'));
const WhyUs                = lazy(() => import('@/components/landing/sections/WhyUs'));
const MealPlans            = lazy(() => import('@/components/landing/sections/MealPlans'));
const HowItWorks           = lazy(() => import('@/components/landing/sections/HowItWorks'));
const Features             = lazy(() => import('@/components/landing/sections/Features'));
const Gallery              = lazy(() => import('@/components/landing/sections/Gallery'));
const Testimonials         = lazy(() => import('@/components/landing/sections/Testimonials'));
const FAQ                  = lazy(() => import('@/components/landing/sections/FAQ'));
const Contact              = lazy(() => import('@/components/landing/sections/Contact'));

function SectionFallback() {
  return (
    <div className="w-full py-20 bg-transparent flex items-center justify-center" aria-hidden="true">
      <div className="w-8 h-8 rounded-full border-2 border-orange-200 border-t-land-primary animate-spin" />
    </div>
  );
}

function LandingPageContent() {
  const [isLoading, setIsLoading] = useState(true);
  useSmoothScroll();

  return (
    <div className="bg-land-bg dark:bg-[#0B0F17] text-land-dark dark:text-white font-['Inter'] min-h-screen w-full max-w-full overflow-x-clip relative transition-colors duration-300">

      {/* Flashy Page Intro Loader */}
      {isLoading && (
        <PageLoader onComplete={() => setIsLoading(false)} />
      )}

      {/* Skip-to-content — keyboard accessibility */}
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only
          fixed top-4 left-4 z-[100]
          px-4 py-2 rounded-lg
          bg-land-primary text-white text-sm font-semibold
          focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
        "
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        {/* 1 — Hero (Loaded directly for LCP speed) */}
        <Hero />

        {/* 2 — Fullscreen Sticky Canvas Frame Sequence Scrubbing */}
        <Suspense fallback={<SectionFallback />}>
          <CanvasScrollSequence />
          <WhyUs />
          <MealPlans />
          <HowItWorks />
          <Features />
          <Gallery />
          <Testimonials />
          <FAQ />
          <Contact />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

/**
 * LandingPage — root "/" component wrapped in ThemeProvider.
 */
export default function LandingPage() {
  return (
    <ThemeProvider>
      <LandingPageContent />
    </ThemeProvider>
  );
}
