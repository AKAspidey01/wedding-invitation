import { useRef } from 'react';
import { Clock } from 'lucide-react';
import { weddingConfig, formatTime, formatDate } from '../../data/weddingConfig';
import { useSectionReveal, useScrollScene } from '../../hooks/useScrollAnimation';
import { gsap } from '../../lib/gsap';
import SectionHeading from '../shared/SectionHeading';
import { FloralCluster } from '../decor/Flowers';
import { Diya, Kalash, OrnamentRule, Toran } from '../decor/Ornaments';
import './WeddingEvents.scss';

/** SECTION 4 — exactly two event cards: Marriage and Reception. */
export default function WeddingEvents() {
  const ref = useRef(null);
  const events = weddingConfig.events.slice(0, 2);

  useSectionReveal(ref, (tl, q) => {
    tl.from(q('.r-head'), { autoAlpha: 0, y: 26, stagger: 0.12 }, 0)
      .from(q('.r-head-rule'), { autoAlpha: 0, scaleX: 0.3, duration: 1 }, 0.2);
    q('.event-card').forEach((card, i) => {
      const at = 0.4 + i * 0.45;
      tl.from(card, { autoAlpha: 0, y: 90, rotationX: 22, transformPerspective: 1100, transformOrigin: '50% 100%', duration: 1.5 }, at)
        .from(card.querySelectorAll('.event-card__toran'), { yPercent: -100, autoAlpha: 0, duration: 1.2 }, at + 0.45)
        .from(card.querySelectorAll('.ev-reveal'), { autoAlpha: 0, y: 18, stagger: 0.1, duration: 0.9 }, at + 0.55)
        .from(card.querySelectorAll('.bloom'), { scale: 0, rotation: -40, stagger: 0.03, duration: 1.1, ease: 'back.out(1.2)' }, at + 0.7);
    });
  }, { start: 'top 70%' });

  // Subtle depth while scrolling: cards tilt gently as they pass.
  useScrollScene(ref, (q) => {
    q('.event-card__inner').forEach((el, i) => {
      gsap.fromTo(
        el,
        { rotationX: 6, rotationY: i ? -3 : 3 },
        {
          rotationX: -6,
          rotationY: i ? 3 : -3,
          transformPerspective: 1200,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
        },
      );
    });
  });

  return (
    <section ref={ref} className="events" aria-labelledby="events-title">
      <SectionHeading id="events-title" script="Wedding Celebrations" eyebrow="Two days of togetherness" />

      <div className="events__list">
        {events.map((e, i) => (
          <article key={e.id} className={`event-card event-card--${i === 0 ? 'one' : 'two'}`}>
            <div className="event-card__inner">
              <div className="event-card__toran">
                <Toran count={7} />
              </div>
              <div className="event-card__day ev-reveal">
                <small>Day</small>
                <span>{String(e.day).padStart(2, '0')}</span>
              </div>
              <div className="event-card__motif ev-reveal">{e.motif === 'diya' ? <Diya /> : <Kalash />}</div>
              <h3 className="event-card__title ev-reveal">{e.title}</h3>
              {e.tagline && <p className="event-card__tagline ev-reveal">{e.tagline}</p>}
              <OrnamentRule className="event-card__rule ev-reveal" />
              <p className="event-card__time ev-reveal">
                <Clock size={18} strokeWidth={1.5} aria-hidden="true" />
                <time>{formatTime(e.time)}</time>
              </p>
              {e.date && <p className="event-card__date ev-reveal">{formatDate(e.date)}</p>}
              <p className="event-card__venue ev-reveal">{weddingConfig.venue.name}</p>
              <div className="event-card__flora event-card__flora--l" aria-hidden="true">
                <FloralCluster />
              </div>
              <div className="event-card__flora event-card__flora--r" aria-hidden="true">
                <FloralCluster />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
