import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { gsap } from '../../lib/gsap';
import { weddingConfig } from '../../data/weddingConfig';
import { useSectionReveal } from '../../hooks/useScrollAnimation';
import { prefersReducedMotion } from '../../lib/motion';
import SectionHeading from '../shared/SectionHeading';
import { Mandala } from '../decor/Ornaments';
import { FloralSprig, Lotus } from '../decor/Flowers';
import Lightbox from './Lightbox';
import './WeddingGallery.scss';

gsap.registerPlugin(Draggable, InertiaPlugin);

/** Slide artwork — memoised so changing the active slide never re-renders it. */
const SlideMedia = memo(function SlideMedia({ photo, index }) {
  return photo.src ? (
    <img className="gslide__media" src={photo.src} alt={photo.alt} loading="lazy" decoding="async" draggable="false" />
  ) : (
    <span className="gslide__media gslide__placeholder" aria-hidden="true">
      <Mandala />
      <svg viewBox="-30 -30 60 36">
        <Lotus bloom="" />
      </svg>
      <span>Photograph {index + 1}</span>
      <small>Add to /public/images/gallery</small>
    </span>
  );
});

/**
 * SECTION 5 — 3D coverflow of the couple's photographs.
 *
 * The strip is moved with GSAP Draggable (+ inertia) rather than native
 * horizontal scrolling. That lets the browser keep *vertical* swipes for the
 * page (touch-action: pan-y) — a native horizontal scroller swallowed them, so
 * visitors couldn't scroll past the gallery. Sideways drags/flicks glide with
 * momentum and settle on a photo.
 */
export default function WeddingGallery() {
  const ref = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const api = useRef({ goTo: () => {} });
  const dragged = useRef(false);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(null);
  const photos = weddingConfig.gallery;

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const slides = Array.from(track.querySelectorAll('.gslide'));
    const media = slides.map((s) => s.querySelector('.gslide__media'));
    // Last values written per slide — only touch the DOM when something changed.
    const written = slides.map(() => ({ c: NaN, z: NaN }));
    const reduced = prefersReducedMotion();
    let slideW = 1;
    let centers = [];
    let snaps = [0];
    let current = 0;
    let wheelTimer = 0;

    const nearest = (x) => {
      let best = 0;
      snaps.forEach((s, i) => {
        if (Math.abs(s - x) < Math.abs(snaps[best] - x)) best = i;
      });
      return best;
    };

    // Coverflow: tilt/recede each slide by its distance from the centre.
    const update = () => {
      const x = gsap.getProperty(track, 'x');
      const mid = viewport.clientWidth / 2 - x;
      slides.forEach((s, i) => {
        const d = (centers[i] - mid) / slideW;
        if (reduced) return;
        // rounded so sub-pixel noise doesn't trigger style writes; slides past
        // the clamp stay untouched while the others move
        const c = Math.round(Math.max(-1.6, Math.min(1.6, d)) * 1000) / 1000;
        if (c !== written[i].c) {
          written[i].c = c;
          const a = Math.min(Math.abs(c), 1);
          s.style.transform = `perspective(1000px) translate3d(0,0,${-a * 110}px) rotateY(${-c * 28}deg)`;
          s.style.opacity = String(1 - a * 0.3);
          if (media[i]) media[i].style.transform = `translate3d(${c * -8}%,0,0) scale(1.18)`;
        }
        const z = 100 - Math.round(Math.abs(d) * 10);
        if (z !== written[i].z) {
          written[i].z = z;
          s.style.zIndex = String(z);
        }
      });
      const best = nearest(x);
      if (best !== current) {
        current = best;
        setActive(best); // re-renders only the controls; slide art is memoised
      }
    };

    const drag = Draggable.create(track, {
      type: 'x',
      inertia: true,
      edgeResistance: 0.8,
      dragResistance: 0,
      throwResistance: 1800,
      maxDuration: 1.1,
      minDuration: 0.35,
      overshootTolerance: 0,
      dragClickables: true, // slides are buttons — still draggable
      allowContextMenu: true,
      zIndexBoost: false,
      minimumMovement: 6,
      // (default allowNativeTouchScrolling → Draggable sets touch-action: pan-y:
      //  vertical swipes stay native page scrolling, horizontal ones drag)
      snap: { x: (endX) => snaps[nearest(endX)] },
      onPress() {
        dragged.current = false;
        gsap.killTweensOf(track);
      },
      onDragStart() {
        dragged.current = true;
      },
      onDrag: update,
      onThrowUpdate: update,
      onThrowComplete: update,
      onRelease() {
        // a slow release without a flick still settles on the nearest photo
        if (!this.tween) goTo(nearest(this.x));
      },
    })[0];

    function goTo(i, instant = false) {
      const idx = Math.max(0, Math.min(slides.length - 1, i));
      gsap.to(track, {
        x: snaps[idx],
        duration: instant || reduced ? 0 : 0.75,
        ease: 'power3.out',
        overwrite: true,
        onUpdate: update,
        onComplete() {
          update();
          drag.update();
        },
      });
    }
    api.current.goTo = goTo;

    const measure = () => {
      const vw = viewport.clientWidth;
      slideW = slides[0]?.offsetWidth || 1;
      centers = slides.map((s) => s.offsetLeft + s.offsetWidth / 2);
      snaps = centers.map((c) => vw / 2 - c);
      drag.applyBounds({ minX: snaps[snaps.length - 1], maxX: snaps[0] });
      gsap.set(track, { x: snaps[current] });
      drag.update();
      update();
    };

    // Trackpads / horizontal mouse wheels move the strip; vertical wheel keeps
    // scrolling the page (handled by Lenis).
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      // Keep sideways gestures from Lenis (which listens on window). Don't use
      // data-lenis-prevent-* for this: Lenis's CSS then adds
      // overscroll-behavior: contain, which blocks vertical page scrolling too.
      e.stopPropagation();
      gsap.killTweensOf(track);
      const x = gsap.getProperty(track, 'x') - e.deltaX;
      gsap.set(track, { x: Math.max(snaps[snaps.length - 1], Math.min(snaps[0], x)) });
      update();
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => goTo(nearest(gsap.getProperty(track, 'x'))), 140);
    };

    measure();
    viewport.addEventListener('wheel', onWheel, { passive: false });
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    return () => {
      window.clearTimeout(wheelTimer);
      viewport.removeEventListener('wheel', onWheel);
      ro.disconnect();
      drag.kill();
      gsap.killTweensOf(track);
    };
  }, []);

  const goTo = useCallback((i) => api.current.goTo(i), []);

  const onSlideClick = (i, p) => {
    if (dragged.current) return; // the press was a drag, not a tap
    if (i === active) {
      if (p.src) setOpen(i);
    } else goTo(i);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  useSectionReveal(ref, (tl, q) => {
    tl.from(q('.r-head'), { autoAlpha: 0, y: 26, stagger: 0.12 }, 0)
      .from(q('.r-head-rule'), { autoAlpha: 0, scaleX: 0.3, duration: 1 }, 0.2)
      .from(q('.gslide__card'), { autoAlpha: 0, y: 80, rotationY: -35, x: 60, transformPerspective: 900, duration: 1.4, stagger: 0.12 }, 0.35)
      .from(q('.gallery__controls'), { autoAlpha: 0, y: 16 }, 0.9);
  });

  // Static decoration — same element reference each render, so React skips it.
  const header = useMemo(
    () => (
      <>
        <FloralSprig className="gallery__sprig gallery__sprig--l" />
        <FloralSprig className="gallery__sprig gallery__sprig--r" />
        <SectionHeading id="gallery-title" script="Cherished Moments" eyebrow="Our story in frames" />
      </>
    ),
    [],
  );

  return (
    <section ref={ref} className="gallery" aria-labelledby="gallery-title">
      {header}

      <div className="gallery__viewport" ref={viewportRef} onKeyDown={onKeyDown}>
        <div className="gallery__track" ref={trackRef} role="list" aria-label="Photo gallery — swipe to browse">
          {photos.map((p, i) => (
            <div key={i} className={`gslide ${i === active ? 'is-active' : ''}`} role="listitem">
              <div className="gslide__card">
                <button
                  type="button"
                  className="gslide__frame"
                  onClick={() => onSlideClick(i, p)}
                  aria-label={p.src ? `View ${p.alt}` : `Photo placeholder ${i + 1}`}
                  tabIndex={i === active ? 0 : -1}
                >
                  <span className="gslide__clip">
                    <SlideMedia photo={p} index={i} />
                  </span>
                </button>
                {p.caption && <p className="gslide__caption">{p.caption}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="gallery__controls">
        <button type="button" className="gallery__arrow" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous photo">
          <ChevronLeft size={20} strokeWidth={1.6} />
        </button>
        <div className="gallery__dots">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === active ? 'is-active' : ''}
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === active}
            >
              <i />
            </button>
          ))}
        </div>
        <button type="button" className="gallery__arrow" onClick={() => goTo(active + 1)} disabled={active === photos.length - 1} aria-label="Next photo">
          <ChevronRight size={20} strokeWidth={1.6} />
        </button>
      </div>

      <AnimatePresence>
        {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
