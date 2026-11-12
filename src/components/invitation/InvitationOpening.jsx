import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';
import { lockScroll, unlockScroll } from '../../lib/smoothScroll';
import { prefersReducedMotion } from '../../lib/motion';
import { audioEngine } from '../../lib/audioEngine';
import { EnvelopeBack, EnvelopeFlap, EnvelopePocket } from './SealedEnvelope';
import WeddingCard, { CardDoors, addCardReveal } from './WeddingCard';
import HeroBackdrop from './FloralDecorations';
import { buildCardFlight, pinOpeningScene } from './CardScrollTransition';
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
  const pinWrap = useRef(null);
  const openTl = useRef(null);
  const busy = useRef(false);
  const release = useRef(() => {});
  const hurry = useRef(() => {});
  const [phase, setPhase] = useState('sealed');
  const [petals, setPetals] = useState(false);
  const [isTouch] = useState(() => window.matchMedia?.('(pointer: coarse)').matches);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    let released = false;
    let cleanupAttempts = () => {};
    let finishRaf = 0;
    const venueEl = () => document.querySelector('.venue');
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

      // Final page layout from the start (see pinOpeningScene): the scene is
      // pinned for the flight, and the venue rises over its last stretch.
      // Created first, so every later section measures around it.
      if (!reduced) {
        venueEl()?.classList.add('is-risen');
        pinOpeningScene(root.current, pinWrap.current);
      }

      /* ── Scene 1: the close-up ── */
      gsap.set(q('.io-scene'), { scale: 2.1, rotation: -6, xPercent: 7, yPercent: -14 });
      // While sealed, the card is effectively invisible (0.001 rather than
      // hidden, so it's still pre-rendered). The envelope is built from separate
      // paper pieces whose edges meet exactly; on some phones pixel rounding
      // left hairline gaps where the pink card peeked through before opening.
      gsap.set(q('.io-card'), { scale: 0.92, zIndex: 2, opacity: 0.001 });
      gsap.set(q('.env-pocket__address'), { autoAlpha: 0 });
      // (3D perspective is applied only when the flap/doors start to move — see
      // the timeline. Set at load, it put the doors, card and pocket on extra
      // GPU layers for the whole sealed screen: ~80 MB on a 3× phone screen.)
      gsap.set(flap, { transformOrigin: '50% 0%' });
      gsap.set(q('.door--l'), { transformOrigin: '0% 50%' });
      gsap.set(q('.door--r'), { transformOrigin: '100% 50%' });
      gsap.set(q('.io-scroll-cue'), { autoAlpha: 0 });
      gsap.set(q('.io-toran'), { autoAlpha: 0 });
      // near-zero (not hidden) so the browser rasterises the bouquets during the
      // idle sealed screen instead of mid-animation
      gsap.set(q('.io-flora'), { opacity: 0.001 });
      // fades in only — zooming this large layer cost a lot of GPU memory
      gsap.set(q('.io-mandala'), { autoAlpha: 0.12 });
      // The envelope scene is ONE pre-rasterised GPU layer while the camera
      // zooms out (drawn during the idle sealed screen, so the tap doesn't
      // stall). Released once the camera settles — see the timeline.
      gsap.set(q('.io-scene'), { willChange: 'transform' });

      /* ── Scene 2: opening choreography (≈ 8s) ──
         Every tween moves only transform / opacity, so the browser can hand
         the motion to the GPU. Beats overlap like a real hand-opened card. */
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
      let flipped = false;
      const envParts = q('.env-back, .env-pocket, .env-flap, .env-flap-shadow');

      // (Only the parts that move on their own are pre-drawn layers: the scene,
      // card, flap and doors. Earlier, many more permanent layers ran some
      // phones out of graphics memory — parts of the envelope/card flickered.)
      tl.to(q('.io-hint'), { autoAlpha: 0, y: 12, duration: 0.5, ease: 'power2.out' }, 0)
        .to(q('.env-seal__ring'), { autoAlpha: 0, duration: 0.25 }, 0)
        // the wax seal (whole, monogram intact) lifts slightly as it's picked
        // up — it's attached to the flap, so it then rides up with it
        .to(q('.env-seal'), { y: -6, scale: 1.06, duration: 0.6, ease: 'power2.out' }, 0.15)
        // camera eases back to show the whole envelope
        .to(q('.io-scene'), { scale: 0.74, rotation: 0, xPercent: 0, yPercent: 0, y: () => vh() * 0.1, duration: 2.2, ease: 'power3.inOut' }, 0.25)
        .to(q('.io-mandala'), { autoAlpha: 0.26, duration: 2.6, ease: 'power2.inOut' }, 0.25)
        .to(q('.env-pocket__address'), { autoAlpha: 1, duration: 0.9, ease: 'power1.out' }, 1.1)
        // the flap lifts and folds back
        .set(flap, { transformPerspective: 1100 }, 0.84)
        .to(flap, {
          rotationX: 180,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate() {
            if (!flipped && gsap.getProperty(flap, 'rotationX') > 90) {
              flipped = true;
              flap.classList.add('is-open');
              gsap.set(flap, { zIndex: 1 });
            }
          },
        }, 0.85)
        // the card becomes visible as the flap starts to lift (still covered)
        .set(q('.io-card'), { opacity: 1 }, 0.85)
        .to(q('.env-flap-shadow'), { autoAlpha: 0, duration: 0.5 }, 0.85)
        .to(q('.env-sides'), { autoAlpha: 0, duration: 0.45, ease: 'power1.in' }, 1.0)
        .to(q('.env-back__liner'), { opacity: 1, duration: 0.7 }, 1.05)
        // the card is drawn up out of the envelope
        .to(q('.io-card'), { yPercent: -72, duration: 1.25, ease: 'power2.inOut' }, 2.1)
        .set(q('.io-card'), { zIndex: 10 }, 3.35)
        .call(() => setPetals(true), null, 3.35)
        // the envelope falls away while the camera settles on the card
        .to(envParts, { y: () => vh() * 0.95, rotation: 3, autoAlpha: 0, duration: 1.25, ease: 'power2.in' }, 3.35)
        .to(q('.io-scene'), { scale: 1, y: 0, duration: 1.4, ease: 'power3.inOut' }, 3.4)
        .to(q('.io-card'), { yPercent: 0, scale: 1, duration: 1.4, ease: 'power3.inOut' }, 3.4)
        // camera has settled — release the scene layer (see above)
        .set(q('.io-scene'), { willChange: 'auto' }, 4.8)
        // florals and toran arrive at different speeds (depth); each bouquet
        // blooms in as a whole so the GPU moves it without repainting
        .fromTo(q('.io-flora--tl'), { xPercent: -45, yPercent: -25, rotation: -16 }, { xPercent: 0, yPercent: 0, rotation: 0, autoAlpha: 1, duration: 1.8, ease: 'power3.out' }, 3.9)
        .fromTo(q('.io-flora--br'), { xPercent: 45, yPercent: 25, rotation: 16 }, { xPercent: 0, yPercent: 0, rotation: 0, autoAlpha: 1, duration: 1.8, ease: 'power3.out' }, 4.0)
        .fromTo(q('.io-toran'), { yPercent: -100 }, { yPercent: 0, autoAlpha: 1, duration: 1.3, ease: 'power3.out' }, 4.2)
        // gate-fold doors part like temple doors
        .set(q('.door'), { transformPerspective: 1400, backfaceVisibility: 'hidden' }, 4.59)
        .to(q('.door--l'), { rotationY: -118, duration: 1.7, ease: 'power3.inOut' }, 4.6)
        .to(q('.door--r'), { rotationY: 118, duration: 1.7, ease: 'power3.inOut' }, 4.6)
        .to(q('.door'), { autoAlpha: 0, duration: 0.6, ease: 'power1.in' }, 5.4);

      // the card's contents write themselves in as the doors part
      const reveal = addCardReveal(gsap.timeline(), (s) => q(`.io-card ${s}`), 0);
      reveal.timeScale(1.6);
      tl.add(reveal, 5.0);

      tl.to(q('.io-scroll-cue'), { autoAlpha: 1, duration: 0.8 }, '-=0.6');

      // A visitor who tries to scroll (or taps again) mid-sequence shouldn't
      // feel stuck — speed the rest of the opening up instead.
      const onAttempt = () => hurry.current();
      hurry.current = () => {
        // ignore the very gesture that opened it
        if (tl.isActive() && tl.time() > 0.8 && tl.timeScale() < 3) tl.timeScale(3);
      };
      const attemptEvents = ['wheel', 'touchmove', 'keydown'];
      attemptEvents.forEach((ev) => window.addEventListener(ev, onAttempt, { passive: true }));
      const stopListening = () => attemptEvents.forEach((ev) => window.removeEventListener(ev, onAttempt));
      cleanupAttempts = stopListening;

      tl.eventCallback('onComplete', () => {
        stopListening();
        setPhase('revealed');
        /* ── Scene 3: scroll-scrubbed flight ──
           Built only now, so it records the *revealed* state as its start.
           The pin and layout already exist, so this only measures itself —
           no page-wide re-measure. Next frame, so it doesn't share a frame
           with React's re-render. */
        finishRaf = requestAnimationFrame(() => {
          if (!reduced) ctx.add(() => buildCardFlight(pinWrap.current, q));
          release.current();
        });
      });
      openTl.current = tl;
    }, root);

    // Warm up the music engine while the visitor looks at the envelope, so the
    // tap itself does no heavy work (it used to freeze the first frames).
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => audioEngine.prepare(), { timeout: 2500 })
      : window.setTimeout(() => audioEngine.prepare(), 1200);

    return () => {
      (window.cancelIdleCallback || window.clearTimeout)(idle);
      cancelAnimationFrame(finishRaf);
      cleanupAttempts();
      ctx.revert();
      venueEl()?.classList.remove('is-risen');
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

  // The scene never changes after mount (GSAP animates it directly). Keeping
  // the same element references means a phase change re-renders only the
  // section's attributes — not thousands of SVG nodes (that cost ~100ms
  // right on the tap).
  const backdrop = useMemo(() => <HeroBackdrop />, []);
  const stage = useMemo(
    () => (
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
              {/* the wax seal is part of the flap, so it lifts with it */}
              <EnvelopeFlap />
            </div>
          </div>
        </div>
      </div>
    ),
    [],
  );

  return (
    // pre-made pin wrapper — see buildCardFlight (avoids DOM re-parenting)
    <div ref={pinWrap} className="io-pin">
      <section
        ref={root}
        className={`io io--${phase}`}
        onClick={sealed ? open : phase === 'opening' ? () => hurry.current() : undefined}
        onKeyDown={sealed ? onKey : undefined}
        role={sealed ? 'button' : undefined}
        tabIndex={sealed ? 0 : undefined}
        aria-label={sealed ? 'Open the wedding invitation' : 'Wedding invitation'}
      >
        {backdrop}
        <FloatingPetals active={petals} density={0.9} />

        {stage}

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
    </div>
  );
}
