import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { prefersReducedMotion } from './motion';

/**
 * One smooth-scroll system for the whole site: Lenis drives the scroll,
 * GSAP's ticker drives Lenis, and Lenis notifies ScrollTrigger.
 * On touch devices Lenis leaves native momentum scrolling alone.
 */
let lenis = null;
let locks = 0;

export function initSmoothScroll() {
  if (prefersReducedMotion()) return () => {};

  // lerp 0.1 = smooth but responsive; lower values felt floaty/laggy with the
  // scrubbed scenes on top. Touch devices keep native momentum scrolling.
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  if (locks > 0) lenis.stop();

  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function lockScroll() {
  locks += 1;
  document.documentElement.classList.add('scroll-locked');
  lenis?.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.documentElement.classList.remove('scroll-locked');
    lenis?.start();
  }
}
