import { memo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { weddingConfig, getEvent, eventTimestamp, formatDate, formatTime } from '../../data/weddingConfig';
import { useCountdown } from '../../hooks/useCountdown';
import { useSectionReveal } from '../../hooks/useScrollAnimation';
import SectionHeading from '../shared/SectionHeading';
import { Lotus, FloralCluster } from '../decor/Flowers';
import { Mandala } from '../decor/Ornaments';
import './WeddingCountdown.scss';

const EASE = [0.22, 0.61, 0.36, 1];

/** A single digit that rolls softly in 3D when it changes. */
const Digit = memo(function Digit({ d }) {
  return (
    <span className="cd-digit">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={d}
          className="cd-digit__v"
          initial={{ rotateX: 80, y: '-35%', opacity: 0 }}
          animate={{ rotateX: 0, y: '0%', opacity: 1 }}
          exit={{ rotateX: -80, y: '35%', opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {d}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

const Unit = memo(function Unit({ value, label, unset }) {
  const text = unset ? '--' : String(value).padStart(2, '0');
  return (
    <div className="cd-unit">
      <div className="cd-unit__tile">
        <svg className="cd-unit__lotus" viewBox="-30 -30 60 36" aria-hidden="true">
          <Lotus bloom="" />
        </svg>
        <span className="cd-unit__num" aria-hidden="true">
          {text.split('').map((d, i) => (
            <Digit key={text.length - i} d={d} />
          ))}
        </span>
      </div>
      <span className="cd-unit__label">{label}</span>
    </div>
  );
});

/** SECTION 3 — live countdown (days / hours / minutes) in IST. */
export default function WeddingCountdown() {
  const ref = useRef(null);
  const event = getEvent(weddingConfig.countdownEventId);
  const target = eventTimestamp(event);
  const { status, days, hours, minutes } = useCountdown(target);
  const unset = status === 'unset';

  useSectionReveal(ref, (tl, q) => {
    tl.from(q('.r-head'), { autoAlpha: 0, y: 26, stagger: 0.12 }, 0)
      .from(q('.r-head-rule'), { autoAlpha: 0, scaleX: 0.3, duration: 1 }, 0.2)
      .from(q('.cd-unit'), { autoAlpha: 0, y: 60, rotationX: -55, transformPerspective: 800, transformOrigin: '50% 100%', duration: 1.3, stagger: 0.15 }, 0.3)
      .from(q('.countdown__note'), { autoAlpha: 0, y: 16 }, 0.9)
      .from(q('.countdown__flora .bloom'), { scale: 0, rotation: -40, duration: 1.2, stagger: 0.03, ease: 'back.out(1.2)' }, 0.5);
  });

  const tz = weddingConfig.timezone.label;
  let note;
  if (unset) note = 'The auspicious date will be announced soon';
  else if (status === 'arrived') note = 'The auspicious moment has arrived — thank you for your blessings';
  else note = `${event.title} · ${formatDate(event.date)} · ${formatTime(event.time)} ${tz}`;

  return (
    <section ref={ref} className="countdown" aria-labelledby="countdown-title">
      <div className="countdown__mandala" aria-hidden="true">
        <div className="spin-slow">
          <Mandala />
        </div>
      </div>
      <div className="countdown__flora countdown__flora--tl" aria-hidden="true">
        <FloralCluster />
      </div>
      <div className="countdown__flora countdown__flora--br" aria-hidden="true">
        <FloralCluster className="is-mirrored" />
      </div>

      <SectionHeading id="countdown-title" script="Counting the Moments" eyebrow="Until the auspicious hour" />

      <div
        className="countdown__units"
        role="timer"
        aria-live="off"
        aria-label={unset ? 'Countdown awaiting the wedding date' : `${days} days, ${hours} hours and ${minutes} minutes to go`}
      >
        <Unit value={days} label="Days" unset={unset} />
        <span className="countdown__sep" aria-hidden="true" />
        <Unit value={hours} label="Hours" unset={unset} />
        <span className="countdown__sep" aria-hidden="true" />
        <Unit value={minutes} label="Minutes" unset={unset} />
      </div>

      <p className={`countdown__note ${status === 'arrived' ? 'is-arrived' : ''}`}>{note}</p>
    </section>
  );
}
