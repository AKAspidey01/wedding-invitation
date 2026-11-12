import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { lockScroll, unlockScroll } from '../../lib/smoothScroll';
import { prefersReducedMotion } from '../../lib/motion';
import { audioEngine } from '../../lib/audioEngine';
import { EnvelopeBack, EnvelopeFlap, EnvelopePocket, EnvelopeSeal } from './SealedEnvelope';
import WeddingCard, { CardDoors, addCardReveal } from './WeddingCard';
import HeroBackdrop from './FloralDecorations';
import { buildCardFlight } from './CardScrollTransition';
import FloatingPetals from '../animations/FloatingPetals';
import './InvitationOpening.scss';

/**
 * SECTION 1 — the cinematic opening.
 *   Scene 1  close-up of a sealed envelope (tap anywhere)
 *   Scene 2  seal breaks → camera pulls back → flap opens in 3D →
 *            card slides out → gate-fold doors open → contents bloom
 *   Scene 3  scroll-scrubbed flight of the card into a bright distance
 *   Scene 4  petals & leaves drifting throughout
 */
export default function InvitationOpening() {
  const root = useRef(null);
  const openTl = useRef(null);
  const busy = useRef(false);
  const release = useRef(() => {});
  const [phase, setPhase] = useState('sealed');
  const [petals, setPetals] = useState(false);
  const [isTouch] = useState(() => window.matchMedia?.('(pointer: coarse)').matches);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    let released = false;
    lockScroll();
    release.current = () => {
      if (released) return;
      released = true;
      unlockScroll();
    };

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const flap = q('.env-flap')[0];
      const vh = () => window.innerHeight;

      /* ── Scene 1: the close-up ── */
      gsap.set(q('.io-scene'), { scale: 2.45, rotation: -7, xPercent: 8, yPercent: -16 });
      gsap.set(q('.io-card'), { scale: 0.92, zIndex: 2 });
      gsap.set(q('.env-pocket__address'), { autoAlpha: 0 });
      gsap.set(flap, { transformPerspective: 1100, transformOrigin: '50% 0%' });
      gsap.set(q('.door--l'), { transformPerspective: 1400, transformOrigin: '0% 50%' });
      gsap.set(q('.door--r'), { transformPerspective: 1400, transformOrigin: '100% 50%' });
      gsap.set(q('.io-scroll-cue'), { autoAlpha: 0 });
      gsap.set(q('.io-flora, .io-toran'), { autoAlpha: 0 });
      gsap.set(q('.io-mandala'), { scale: 1.4, autoAlpha: 0.12 });

      /* ── Scene 2: opening choreography ── */
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
      let flipped = false;

      tl.to(q('.io-hint'), { autoAlpha: 0, y: 12, duration: 0.6, ease: 'power2.out' }, 0)
        .to(q('.env-seal__ring'), { autoAlpha: 0, duration: 0.3 }, 0)
        // the wax seal cracks in two
        .to(q('.env-seal__half--l'), { x: -10, y: 4, rotation: -14, duration: 0.9, ease: 'power3.out' }, 0.25)
        .to(q('.env-seal__half--r'), { x: 10, y: 6, rotation: 12, duration: 0.9, ease: 'power3.out' }, 0.25)
        .to(q('.env-seal'), { autoAlpha: 0, y: 34, scale: 0.85, duration: 0.8, ease: 'power2.in' }, 0.95)
        // camera pulls back (background moves slower → depth)
        .to(q('.io-scene'), { scale: 0.7, rotation: 0, xPercent: 0, yPercent: 0, y: () => vh() * 0.1, duration: 2.8, ease: 'power3.inOut' }, 0.3)
        .to(q('.io-mandala'), { scale: 1, autoAlpha: 0.26, duration: 3.2, ease: 'power2.inOut' }, 0.3)
        .to(q('.env-pocket__address'), { autoAlpha: 1, duration: 1.2, ease: 'power1.out' }, 1.5)
        // the flap swings open toward the viewer
        .to(flap, {
          rotationX: 180,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate() {
            if (!flipped && gsap.getProperty(flap, 'rotationX') > 90) {
              flipped = true;
              flap.classList.add('is-open');
              gsap.set(flap, { zIndex: 1 });
            }
          },
        }, 1.1)
        .to(q('.env-flap-shadow'), { autoAlpha: 0, duration: 0.6 }, 1.1)
        .to(q('.env-sides'), { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, 1.25)
        .to(q('.env-back__liner'), { opacity: 1, duration: 0.9 }, 1.3)
        // the card slides up out of the envelope
        .to(q('.io-card'), { yPercent: -72, duration: 1.5, ease: 'power2.inOut' }, 2.8)
        .set(q('.io-card'), { zIndex: 10 }, 4.3)
        .call(() => setPetals(true), null, 4.3)
        // envelope falls away; camera settles on the card
        .to(q('.env-back, .env-pocket, .env-flap, .env-flap-shadow'), {
          y: () => vh() * 0.95,
          rotation: 3,
          autoAlpha: 0,
          duration: 1.6,
          ease: 'power2.in',
        }, 4.3)
        .to(q('.io-scene'), { scale: 1, y: 0, duration: 1.8, ease: 'power3.inOut' }, 4.35)
        .to(q('.io-card'), { yPercent: 0, scale: 1, duration: 1.8, ease: 'power3.inOut' }, 4.35)
        // layered parallax: florals and toran arrive at different speeds
        .fromTo(q('.io-flora--tl'), { xPercent: -40, yPercent: -20 }, { xPercent: 0, yPercent: 0, autoAlpha: 1, duration: 2.2, ease: 'power3.out' }, 5.1)
        .fromTo(q('.io-flora--br'), { xPercent: 40, yPercent: 20 }, { xPercent: 0, yPercent: 0, autoAlpha: 1, duration: 2.2, ease: 'power3.out' }, 5.25)
        .from(q('.io-flora .bloom'), { scale: 0, rotation: -50, duration: 1.4, stagger: 0.04, ease: 'back.out(1.2)' }, 5.4)
        .fromTo(q('.io-toran'), { yPercent: -100 }, { yPercent: 0, autoAlpha: 1, duration: 1.6, ease: 'power3.out' }, 5.5)
        // gate-fold doors swing open like temple doors
        .to(q('.door--l'), { rotationY: -118, duration: 2, ease: 'power3.inOut' }, 6.0)
        .to(q('.door--r'), { rotationY: 118, duration: 2, ease: 'power3.inOut' }, 6.0)
        .to(q('.door'), { autoAlpha: 0, duration: 0.8, ease: 'power1.in' }, 6.95);

      addCardReveal(tl, (s) => q(`.io-card ${s}`), 6.45);

      tl.to(q('.io-scroll-cue'), { autoAlpha: 1, duration: 1 }, '-=0.6');
      tl.eventCallback('onComplete', () => {
        setPhase('revealed');
        /* ── Scene 3: scroll-scrubbed flight ──
           Built only now, so it records the *revealed* state as its start. */
        if (!reduced) {
          // lets the venue rise over the final stretch of the flight
          document.documentElement.classList.add('is-flight-ready');
          ctx.add(() => buildCardFlight(root.current, q));
          ScrollTrigger.sort();
        }
        release.current();
        ScrollTrigger.refresh();
      });
      openTl.current = tl;
    }, root);

    return () => {
      ctx.revert();
      document.documentElement.classList.remove('is-flight-ready');
      release.current();
    };
  }, []);

  const open = useCallback(() => {
    if (busy.current || !openTl.current) return;
    busy.current = true;
    audioEngine.start(); // inside the gesture → allowed on mobile
    setPhase('opening');
    const tl = openTl.current;
    if (prefersReducedMotion()) {
      tl.progress(1);
      gsap.from(root.current.querySelector('.io__stage'), { autoAlpha: 0, duration: 0.6 });
      return;
    }
    tl.play();
    // Never trap the visitor: if anything stalls, release scroll anyway.
    window.setTimeout(() => {
      if (tl.progress() < 1) {
        tl.progress(1);
      }
    }, (tl.duration() + 3) * 1000);
  }, []);

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  };

  const sealed = phase === 'sealed';

  return (
    <section
      ref={root}
      className={`io io--${phase}`}
      onClick={sealed ? open : undefined}
      onKeyDown={sealed ? onKey : undefined}
      role={sealed ? 'button' : undefined}
      tabIndex={sealed ? 0 : undefined}
      aria-label={sealed ? 'Open the wedding invitation' : 'Wedding invitation'}
    >
      <HeroBackdrop />
      <FloatingPetals active={petals} density={0.9} />

      <div className="io__stage">
        <div className="io-flight">
          <div className="io-float">
            <div className="io-scene">
              <EnvelopeBack />
              <div className="io-card">
                <WeddingCard />
                <CardDoors />
              </div>
              <EnvelopePocket />
              <EnvelopeFlap />
              <EnvelopeSeal />
            </div>
          </div>
        </div>
      </div>

      <div className="io-hint" aria-hidden={!sealed}>
        <span className="io-hint__dot" />
        <span className="io-hint__text">{isTouch ? 'Tap anywhere to open' : 'Click anywhere to open'}</span>
      </div>

      <div className="io-scroll-cue" aria-hidden="true">
        <span>Scroll to continue</span>
        <i />
      </div>

      <div className="io__fade" aria-hidden="true" />
    </section>
  );
}
