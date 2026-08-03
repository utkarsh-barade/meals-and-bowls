import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useReducedMotion } from 'framer-motion';

/**
 * useSmoothScroll
 *
 * Configures silky-smooth inertia / momentum scrolling via modern Lenis v1.
 * Scoped strictly to LandingPage component. Cleanly destroyed on unmount or when reduced-motion is requested.
 */
export function useSmoothScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      delete window.lenis;
      lenis.destroy();
    };
  }, [prefersReducedMotion]);
}

/**
 * scrollToSection
 * Helper utility to smoothly scroll to any element by ID or hash.
 * Uses offset -96px to clear the fixed navbar height (80px) with comfortable padding.
 */
export function scrollToSection(href, offset = -96) {
  if (!href || !href.startsWith('#')) return;
  const targetId = href.substring(1);
  const targetEl = document.getElementById(targetId);

  if (targetEl) {
    if (window.lenis) {
      window.lenis.scrollTo(targetEl, { offset, duration: 1.2 });
    } else {
      const top = targetEl.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
