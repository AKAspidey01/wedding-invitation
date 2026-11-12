import { gsap } from '../../lib/gsap';

/**
 * Scene 3 — scroll-scrubbed: the card floats away from the viewer into a
 * bright, dreamy distance. Fully reversible; pinned for a long scroll.
 */
export function buildCardFlight(trigger, q) {
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: '+=190%',
      pin: true,
      scrub: 1.1,
      anticipatePin: 1,
      // created after the later sections' triggers → must be measured first
      refreshPriority: 10,
    },
  });

  gsap.set(q('.io-flight'), { transformPerspective: 900, transformOrigin: '50% 50%' });

  tl.to(q('.io-scroll-cue'), { autoAlpha: 0, duration: 0.06 }, 0)
    // the card lifts, turns gently and recedes along the Z axis
    .to(q('.io-flight'), { y: () => -window.innerHeight * 0.04, rotationX: 8, rotationY: -10, duration: 0.25, ease: 'sine.inOut' }, 0)
    .to(q('.io-flight'), { z: -2600, rotationY: 16, rotationX: 14, rotation: -5, y: () => -window.innerHeight * 0.1, duration: 0.75, ease: 'power2.in' }, 0.25)
    .to(q('.io-flight'), { autoAlpha: 0, duration: 0.18, ease: 'power1.in' }, 0.8)
    // the light it travels into grows warm and wide
    .to(q('.io-glow'), { scale: 3.2, autoAlpha: 1, duration: 1, ease: 'power1.in' }, 0)
    .to(q('.io-mandala'), { scale: 1.7, rotation: 40, autoAlpha: 0.25, duration: 1 }, 0)
    // foreground florals drift outward past the camera
    .to(q('.io-flora--tl'), { xPercent: -70, yPercent: -40, scale: 1.4, autoAlpha: 0, duration: 0.7, ease: 'power1.in' }, 0.1)
    .to(q('.io-flora--br'), { xPercent: 70, yPercent: 40, scale: 1.4, autoAlpha: 0, duration: 0.7, ease: 'power1.in' }, 0.1)
    .to(q('.io-toran'), { yPercent: -120, autoAlpha: 0, duration: 0.45, ease: 'power1.in' }, 0.12)
    // soft clouds rush past
    .fromTo(q('.io-cloud'), { scale: 0.4, autoAlpha: 0 }, { scale: 1.3, autoAlpha: 0.9, duration: 0.35, stagger: 0.06, ease: 'power1.out' }, 0.3)
    .to(q('.io-cloud'), { scale: 3.4, autoAlpha: 0, duration: 0.4, stagger: 0.06, ease: 'power1.in' }, 0.62)
    // the scene dissolves into warm ivory light as the venue rises over it
    .to(q('.io__fade'), { autoAlpha: 0.75, duration: 0.3 }, 0.7);

  return tl;
}
