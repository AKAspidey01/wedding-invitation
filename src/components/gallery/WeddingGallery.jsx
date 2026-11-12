import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { weddingConfig } from '../../data/weddingConfig';
import { useSectionReveal } from '../../hooks/useScrollAnimation';
import { prefersReducedMotion } from '../../lib/motion';
import SectionHeading from '../shared/SectionHeading';
import { Mandala } from '../decor/Ornaments';
import { FloralSprig, Lotus } from '../decor/Flowers';
import Lightbox from './Lightbox';
import './WeddingGallery.scss';

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

/** SECTION 5 — swipeable 3D coverflow of the couple's photographs. */
export default function WeddingGallery() {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const centers = useRef([]);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(null);
  const photos = weddingConfig.gallery;

  // Coverflow: transforms are written straight to the DOM on scroll (no re-render per frame).
  useEffect(() => {
    const track = trackRef.current;
    const slides = Array.from(track.querySelectorAll('.gslide'));
    const media = slides.map((s) => s.querySelector('.gslide__media'));
    // Last values written per slide — only touch the DOM when something changed.
    const written = slides.map(() => ({ c: NaN, z: NaN }));
    const reduced = prefersReducedMotion();
    let raf = 0;
    let slideW = 1;
    let half = 0;
    let current = -1;

    const update = () => {
      raf = 0;
      const mid = track.scrollLeft + half;
      let best = 0;
      let bestD = Infinity;
      slides.forEach((s, i) => {
        const d = (centers.current[i] - mid) / slideW;
        const ad = Math.abs(d);
        if (ad < bestD) {
          bestD = ad;
          best = i;
        }
        if (reduced) return;
        // Rounded so sub-pixel scroll noise doesn't trigger style writes;
        // slides beyond the clamp stay untouched while others move.
        const c = Math.round(Math.max(-1.6, Math.min(1.6, d)) * 1000) / 1000;
        if (c !== written[i].c) {
          written[i].c = c;
          const a = Math.min(Math.abs(c), 1);
          s.style.transform = `perspective(1000px) translate3d(0,0,${-a * 110}px) rotateY(${-c * 28}deg)`;
          s.style.opacity = String(1 - a * 0.3);
          if (media[i]) media[i].style.transform = `translate3d(${c * -8}%,0,0) scale(1.18)`;
        }
        const z = 100 - Math.round(ad * 10);
        if (z !== written[i].z) {
          written[i].z = z;
          s.style.zIndex = String(z);
        }
      });
      // Re-render only when the centred slide actually changes.
      if (best !== current) {
        current = best;
        setActive(best);
      }
    };
    const measure = () => {
      slideW = slides[0]?.offsetWidth || 1;
      half = track.clientWidth / 2;
      centers.current = slides.map((s) => s.offsetLeft + s.offsetWidth / 2);
      update();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    measure();
    track.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, []);

  const goTo = useCallback((i) => {
    const track = trackRef.current;
    const idx = Math.max(0, Math.min(photos.length - 1, i));
    track.scrollTo({ left: centers.current[idx] - track.clientWidth / 2, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [photos.length]);

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

      {/* data-lenis-prevent-horizontal: let sideways trackpad swipes scroll the
          track natively instead of being cancelled by the page smooth-scroll. */}
      <div
        className="gallery__track"
        ref={trackRef}
        role="list"
        aria-label="Photo gallery — swipe to browse"
        data-lenis-prevent-horizontal
      >
        {photos.map((p, i) => (
          <div key={i} className={`gslide ${i === active ? 'is-active' : ''}`} role="listitem">
            <div className="gslide__card">
              <button
                type="button"
                className="gslide__frame"
                onClick={() => (i === active ? p.src && setOpen(i) : goTo(i))}
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
