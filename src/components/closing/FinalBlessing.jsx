import { useRef } from 'react';
import { weddingConfig, orderedNames } from '../../data/weddingConfig';
import { useSectionReveal, useScrollScene } from '../../hooks/useScrollAnimation';
import { gsap } from '../../lib/gsap';
import { CardFrame, CoupleNames, addCardReveal } from '../invitation/WeddingCard';
import { Diya, Kalash, Mandala, OrnamentRule, Toran } from '../decor/Ornaments';
import { FloralCluster } from '../decor/Flowers';
import FloatingPetals from '../animations/FloatingPetals';
import './FinalBlessing.scss';

/**
 * SECTION 6 — the invitation card returns from the distance it flew into,
 * carrying the blessing and the couple's gratitude.
 */
export default function FinalBlessing() {
  const ref = useRef(null);
  const { closing } = weddingConfig;
  const [a, b] = orderedNames();
  const families = [closing.families.bride, closing.families.groom].filter(Boolean);

  // The card travels back toward the viewer as the section scrolls in (scrubbed, reversible).
  useScrollScene(ref, (q) => {
    gsap.fromTo(
      q('.closing__flight'),
      { z: -1700, rotationX: 24, rotationY: -18, rotation: 4, y: 60, autoAlpha: 0 },
      {
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotation: 0,
        y: 0,
        autoAlpha: 1,
        transformPerspective: 900,
        ease: 'power2.out',
        scrollTrigger: { trigger: q('.closing__stage')[0], start: 'top 105%', end: 'top 20%', scrub: 0.5 },
      },
    );
    // rotation only — it's a large GPU layer, and changing its scale every
    // scroll frame measurably slowed this section
    gsap.fromTo(q('.closing__mandala'), { rotation: -20 }, {
      rotation: 20,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
    });
  });

  // Once it arrives: names, blessing and florals bloom.
  useSectionReveal(
    ref,
    (tl, q) => {
      addCardReveal(tl, (s) => q(`.closing__card ${s}`), 0);
      tl.from(q('.closing__kalash'), { autoAlpha: 0, scale: 0.6, y: 10, duration: 1.2 }, 0.4)
        .from(q('.closing__blessing'), { autoAlpha: 0, y: 14, duration: 1.2 }, 2.6);
      // family names are optional in the config — only animate them if shown
      const familyLines = q('.closing__families p');
      if (familyLines.length) tl.from(familyLines, { autoAlpha: 0, y: 12, stagger: 0.15 }, 2.9);
    },
    { trigger: '.closing__stage', start: 'top 40%' },
  );

  useSectionReveal(
    ref,
    (tl, q) => {
      tl.from(q('.closing__thanks p'), { autoAlpha: 0, y: 26, stagger: 0.25, duration: 1.3 }, 0)
        .from(q('.closing__diyas .diya'), { autoAlpha: 0, y: 20, scale: 0.7, stagger: 0.18, duration: 1 }, 0.4)
        .from(q('.closing__signoff, .closing__sign'), { autoAlpha: 0, y: 18, stagger: 0.2, duration: 1.2 }, 0.9)
        // bouquets bloom in as a whole (GPU) rather than flower-by-flower (repaint)
        .from(q('.closing__end-flora'), { autoAlpha: 0, scale: 0.6, rotation: (i) => (i ? 12 : -12), stagger: 0.12, duration: 1.3, ease: 'back.out(1.3)' }, 0.6);
    },
    { trigger: '.closing__thanks', start: 'top 82%' },
  );

  return (
    <section ref={ref} className="closing" aria-labelledby="closing-title">
      <div className="closing__toran">
        <Toran count={13} />
      </div>
      <div className="closing__mandala" aria-hidden="true">
        <Mandala strokeWidth={0.5} />
      </div>
      {/* screen-sized petal canvas that stays in view through the section —
          a canvas covering the whole (tall) section was a huge per-frame cost */}
      <div className="closing__petals" aria-hidden="true">
        <div className="closing__petals-view">
          <FloatingPetals density={0.75} />
        </div>
      </div>

      <div className="closing__stage">
        <div className="closing__flight">
          <CardFrame className="wcard--closing closing__card" toran={false}>
            <p className="wcard__invocation r-invocation" lang="hi">
              {closing.invocation}
            </p>
            <div className="closing__kalash" aria-hidden="true">
              <Kalash />
            </div>
            <p id="closing-title" className="wcard__preamble r-preamble">
              {closing.title}
            </p>
            <CoupleNames size="xl" as="div" />
            <OrnamentRule className="wcard__rule r-rule" />
            <p className="closing__blessing">{closing.blessing}</p>
            {families.length > 0 && (
              <div className="closing__families">
                {closing.families.bride && <p>{closing.families.bride}</p>}
                {closing.families.groom && <p>{closing.families.groom}</p>}
              </div>
            )}
          </CardFrame>
        </div>
      </div>

      <div className="closing__thanks">
        {closing.thankYou.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>

      <div className="closing__diyas" aria-hidden="true">
        <Diya />
        <Diya />
        <Diya />
      </div>

      <p className="closing__signoff">{closing.signOff}</p>
      <p className="closing__sign">
        {a} <span>&amp;</span> {b}
      </p>

      <div className="closing__end-flora closing__end-flora--l" aria-hidden="true">
        <FloralCluster />
      </div>
      <div className="closing__end-flora closing__end-flora--r" aria-hidden="true">
        <FloralCluster />
      </div>
    </section>
  );
}
