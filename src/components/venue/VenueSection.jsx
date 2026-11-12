import { useRef } from 'react';
import { MapPin } from 'lucide-react';
import { weddingConfig, formatTime, formatDate } from '../../data/weddingConfig';
import { useSectionReveal, useScrollScene } from '../../hooks/useScrollAnimation';
import { gsap } from '../../lib/gsap';
import { HallBack, HallFront, HallMid } from './BanquetHall';
import { FloralCluster } from '../decor/Flowers';
import { Diya, OrnamentRule } from '../decor/Ornaments';
import './VenueSection.scss';

/**
 * SECTION 2 — the banquet hall. Venue details are inscribed inside the
 * hall's grand arch rather than placed on a separate card.
 */
export default function VenueSection() {
  const ref = useRef(null);
  const { venue, events } = weddingConfig;
  const photo = venue.backgroundImage;

  useSectionReveal(
    ref,
    (tl, q) => {
      tl.fromTo(
        q('.venue__frame'),
        { clipPath: 'inset(7% 7% 7% 7% round 36px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.8, ease: 'power3.inOut' },
        0,
      )
        .from(q('.venue__back'), { scale: 1.2, duration: 2.2, ease: 'power3.out' }, 0)
        .from(q('.venue__front'), { scale: 1.15, autoAlpha: 0, duration: 1.8, ease: 'power3.out' }, 0.3)
        .from(q('.venue__reveal'), { autoAlpha: 0, y: 36, duration: 1.1, stagger: 0.16 }, 0.7)
        .from(q('.venue__flora'), { autoAlpha: 0, y: 60, duration: 1.4, stagger: 0.1 }, 0.9)
        .from(q('.venue__flora .bloom'), { scale: 0, rotation: -40, duration: 1.2, stagger: 0.03, ease: 'back.out(1.2)' }, 1);
    },
    { start: 'top 75%' },
  );

  // Depth: the back wall drifts slowly, the drapes and garlands faster.
  useScrollScene(ref, (q) => {
    const st = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 };
    gsap.fromTo(q('.venue__back'), { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: st });
    gsap.fromTo(q('.venue__mid'), { yPercent: -2 }, { yPercent: 8, ease: 'none', scrollTrigger: { ...st } });
    gsap.fromTo(q('.venue__front'), { yPercent: 4 }, { yPercent: -6, ease: 'none', scrollTrigger: { ...st } });
    gsap.fromTo(q('.venue__content'), { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { ...st } });
  });

  const dated = events.filter((e) => e.date);

  return (
    <section ref={ref} className={`venue ${photo ? 'venue--photo' : ''}`} aria-labelledby="venue-title">
      <div className="venue__frame">
        <div className="venue__back">
          {photo ? (
            <picture>
              {venue.backgroundImageWebp && <source srcSet={venue.backgroundImageWebp} type="image/webp" />}
              <img src={photo} alt="" loading="lazy" decoding="async" />
            </picture>
          ) : (
            <HallBack />
          )}
        </div>
        <div className="venue__mid">{!photo && <HallMid />}</div>
        <div className="venue__veil" />
        <div className="venue__front">
          <HallFront curtains={!photo} />
        </div>
      </div>

      <div className="venue__content">
        <p className="venue__eyebrow venue__reveal">The Celebration Venue</p>
        <h2 id="venue-title" className="venue__name venue__reveal">
          {venue.name}
        </h2>
        <OrnamentRule className="venue__rule venue__reveal" />
        <ul className="venue__times">
          {events.map((e) => (
            <li key={e.id} className="venue__reveal">
              <span>{e.title}</span>
              <strong>{formatTime(e.time)}</strong>
              {e.date && <em>{formatDate(e.date, { weekday: undefined })}</em>}
            </li>
          ))}
        </ul>
        {dated.length === 0 && <p className="venue__tz venue__reveal">Timings in {weddingConfig.timezone.label}</p>}
        <p className="venue__city venue__reveal">
          <MapPin size={15} strokeWidth={1.6} aria-hidden="true" />
          {venue.city}
        </p>
      </div>

      <div className="venue__flora venue__flora--l">
        <FloralCluster className="is-flip-y" />
      </div>
      <div className="venue__flora venue__flora--r">
        <FloralCluster className="is-flip-xy" />
      </div>
      <Diya className="venue__diya venue__diya--l" />
      <Diya className="venue__diya venue__diya--r" />
    </section>
  );
}
