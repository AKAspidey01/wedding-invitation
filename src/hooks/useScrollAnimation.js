import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

/**
 * Section entrance: builds a paused GSAP timeline scoped to `ref`
 * and plays it once when the section enters the viewport.
 * With reduced motion the content is simply shown.
 *
 * build(tl, q) — q is a scoped selector (gsap.utils.selector)
 */
export function useSectionReveal(ref, build, { start = 'top 72%', trigger } = {}) {
  useLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 1.1 },
        scrollTrigger: {
          trigger: trigger ? q(trigger)[0] : ref.current,
          start,
          once: true,
        },
      });
      build(tl, q);
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Scroll-scrubbed parallax/ambient motion scoped to `ref`.
 * setup(q) creates tweens with their own scrollTriggers.
 */
export function useScrollScene(ref, setup) {
  useLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => setup(gsap.utils.selector(ref)), ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export { ScrollTrigger };
