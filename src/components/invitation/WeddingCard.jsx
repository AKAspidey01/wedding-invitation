import { FloralCluster } from '../decor/Flowers';
import { Mandala, OrnamentRule, OrnateCorner, Toran } from '../decor/Ornaments';
import { weddingConfig, orderedNames, monogram, formatTime, formatDate } from '../../data/weddingConfig';
import { splitChars } from '../../lib/motion';
import './WeddingCard.scss';

/** The shared visual identity: ivory paper, gold borders, filigree corners, florals. */
export function CardFrame({ children, className = '', toran = true }) {
  return (
    <div className={`wcard ${className}`}>
      <div className="wcard__paper">
        <div className="wcard__watermark">
          <Mandala />
        </div>
        <div className="wcard__border" />
        {['tl', 'tr', 'bl', 'br'].map((c) => (
          <span key={c} className={`wcard__corner wcard__corner--${c}`}>
            <OrnateCorner />
          </span>
        ))}
        {toran && (
          <div className="wcard__toran">
            <Toran count={9} />
          </div>
        )}
        <FloralCluster className="wcard__flora wcard__flora--bl" />
        <FloralCluster className="wcard__flora wcard__flora--br" />
        <div className="wcard__content">{children}</div>
        <div className="wcard__sheen" aria-hidden="true" />
      </div>
    </div>
  );
}

/** Names as accessible text with per-character spans for the reveal. */
export function CoupleNames({ size = 'lg', as: Tag = 'h1' }) {
  const [first, second] = orderedNames();
  return (
    <Tag className={`couple-names couple-names--${size}`}>
      <span className="visually-hidden">
        {first} and {second}
      </span>
      <span className="couple-names__name r-name1">{splitChars(first)}</span>
      <span className="couple-names__amp r-amp" aria-hidden="true">
        <i className="couple-names__line" />
        <em>&amp;</em>
        <i className="couple-names__line" />
      </span>
      <span className="couple-names__name r-name2">{splitChars(second)}</span>
    </Tag>
  );
}

/** Front of the hero invitation card. */
export default function WeddingCard() {
  const { invitationCard, events, venue } = weddingConfig;
  const dates = events.filter((e) => e.date);
  return (
    <CardFrame className="wcard--hero">
      <p className="wcard__invocation r-invocation" lang="hi">
        {invitationCard.invocation}
      </p>
      <p className="wcard__preamble r-preamble">{invitationCard.preamble}</p>
      <CoupleNames />
      <p className="wcard__request r-request">{invitationCard.request}</p>
      <OrnamentRule className="wcard__rule r-rule" />
      <ul className="wcard__events">
        {events.map((e) => (
          <li key={e.id} className="r-detail">
            <span>{e.title}</span>
            <b>{formatTime(e.time)}</b>
          </li>
        ))}
      </ul>
      {dates.length > 0 && <p className="wcard__date r-detail">{formatDate(dates[0].date)}</p>}
      <p className="wcard__city r-detail">{venue.city}</p>
    </CardFrame>
  );
}

/** Gate-fold cover doors — the card opens like temple doors. */
export function CardDoors() {
  const [a = '', b = ''] = monogram();
  const medallion = (
    <div className="door__medallion">
      <Mandala strokeWidth={0.9} />
      <span className="door__monogram">
        {a}
        <small>&amp;</small>
        {b}
      </span>
    </div>
  );
  return (
    <div className="wcard-doors" aria-hidden="true">
      {['l', 'r'].map((side) => (
        <div key={side} className={`door door--${side}`}>
          <div className="door__face">
            <div className="door__frame" />
            <OrnateCorner className="door__corner door__corner--t" />
            <OrnateCorner className="door__corner door__corner--b" />
            {medallion}
            <span className="door__knob" />
            <p className="door__caption">{side === 'l' ? 'Shubh' : 'Vivah'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Choreographed reveal of a card's contents. `q` is a scoped selector,
 * `at` the timeline position to start from.
 */
export function addCardReveal(tl, q, at = 0) {
  tl.from(q('.wcard__corner'), { autoAlpha: 0, scale: 0.6, duration: 1.2, stagger: 0.08, ease: 'power3.out' }, at)
    .from(q('.wcard__toran'), { yPercent: -110, autoAlpha: 0, duration: 1.4, ease: 'power3.out' }, at + 0.1)
    .from(q('.wcard__watermark'), { autoAlpha: 0, scale: 0.8, rotation: -30, duration: 2.2, ease: 'power2.out' }, at)
    .from(q('.r-invocation'), { autoAlpha: 0, y: 12, letterSpacing: '0.4em', duration: 1.2, ease: 'power2.out' }, at + 0.35)
    .from(q('.r-preamble'), { autoAlpha: 0, y: 10, duration: 1 }, at + 0.7)
    .from(q('.r-name1 .ch'), { autoAlpha: 0, yPercent: 40, rotation: -8, duration: 0.9, stagger: 0.06, ease: 'power3.out' }, at + 1.0)
    .from(q('.r-amp em'), { autoAlpha: 0, scale: 0.4, rotation: -25, duration: 1.1, ease: 'power3.out' }, at + 1.45)
    .from(q('.r-amp .couple-names__line'), { scaleX: 0, duration: 1, ease: 'power2.out' }, at + 1.55)
    .from(q('.r-name2 .ch'), { autoAlpha: 0, yPercent: 40, rotation: -8, duration: 0.9, stagger: 0.06, ease: 'power3.out' }, at + 1.75)
    .from(q('.r-request'), { autoAlpha: 0, y: 10, duration: 1 }, at + 2.3)
    .from(q('.r-rule'), { autoAlpha: 0, scaleX: 0.2, duration: 1.1, ease: 'power2.out' }, at + 2.45)
    .from(q('.r-detail'), { autoAlpha: 0, y: 10, duration: 0.9, stagger: 0.14 }, at + 2.6)
    .from(q('.wcard__flora .cluster-leaves path'), { autoAlpha: 0, duration: 1, stagger: 0.02 }, at + 0.8)
    .from(q('.wcard__flora .bloom'), { scale: 0, rotation: -60, duration: 1.3, stagger: 0.05, ease: 'back.out(1.3)' }, at + 0.9)
    .fromTo(q('.wcard__sheen'), { xPercent: -130 }, { xPercent: 230, duration: 1.8, ease: 'power2.inOut' }, at + 3.1);
  return tl;
}
