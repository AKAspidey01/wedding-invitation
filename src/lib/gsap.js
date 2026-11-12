import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers resize the viewport when the URL bar shows/hides —
// ignore those so pinned scenes don't jump.
ScrollTrigger.config({ ignoreMobileResize: true });
gsap.defaults({ ease: 'power2.out' });

export { gsap, ScrollTrigger };
