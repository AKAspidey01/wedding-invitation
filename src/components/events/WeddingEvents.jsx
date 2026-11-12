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
  }, { start: 'top 75%' });

  useScrollScene(ref, (q) => {
    q('.event-card').forEach((card, i) => {
      // Each card reveals when *it* scrolls into view (on phones the cards are
      // stacked, so a single section trigger played card two while off-screen).
      gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        })
        .from(card, { autoAlpha: 0, y: 70, rotationX: 16, transformPerspective: 1100, transformOrigin: '50% 100%', duration: 1.2 }, 0)
        .from(card.querySelectorAll('.event-card__toran'), { yPercent: -100, autoAlpha: 0, duration: 1 }, 0.35)
        .from(card.querySelectorAll('.ev-reveal'), { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.8 }, 0.4)
        // bouquets bloom in as a whole (GPU) rather than flower-by-flower (repaint)
        .from(card.querySelectorAll('.event-card__flora'), { autoAlpha: 0, scale: 0.55, rotation: (k) => (k ? 14 : -14), stagger: 0.08, duration: 1, ease: 'back.out(1.3)' }, 0.5);

      // Subtle depth while scrolling: the card tilts gently as it passes.
      gsap.fromTo(
        card.querySelector('.event-card__inner'),
        { rotationX: 4, rotationY: i ? -2 : 2 },
        {
          rotationX: -4,
          rotationY: i ? 2 : -2,
          transformPerspective: 1200,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
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
