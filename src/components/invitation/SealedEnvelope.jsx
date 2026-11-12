import { WaxSeal } from '../decor/Ornaments';
import { orderedNames } from '../../data/weddingConfig';
import './SealedEnvelope.scss';

/**
 * Envelope layers. They're rendered as separate siblings (not one wrapper)
 * so the card can sit *between* the back panel and the front pocket,
 * then be pulled out in front of it.
 */

export function EnvelopeBack() {
  return (
    <div className="env-back">
      <div className="env-back__liner" />
    </div>
  );
}

export function EnvelopePocket() {
  const [a, b] = orderedNames();
  return (
    <div className="env-pocket">
      <svg className="env-pocket__folds" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="0,100 50,62 100,100" fill="rgba(255,255,255,0.22)" />
        <polygon points="0,30 50,60 0,100" fill="rgba(170,128,80,0.07)" />
        <polygon points="100,30 50,60 100,100" fill="rgba(170,128,80,0.1)" />
        <path d="M0 30L50 60L100 30" fill="none" stroke="#c49a4a" strokeOpacity="0.85" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <path d="M0 100L47 63M100 100L53 63" fill="none" stroke="#b98d55" strokeOpacity="0.25" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="env-pocket__address">
        <span>An invitation from</span>
        <strong>
          {a} &amp; {b}
        </strong>
      </div>
      <div className="paper-sheen" />
    </div>
  );
}

export function EnvelopeFlap() {
  return (
    <>
      {/* side flaps — hide the card while sealed, dissolve as the flap lifts */}
      <div className="env-sides env-sides--l" />
      <div className="env-sides env-sides--r" />
      <div className="env-flap-shadow" />
      <div className="env-flap">
        <div className="env-flap__front">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M3 1.5L50 94L97 1.5" fill="none" stroke="#c49a4a" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
            <path d="M8 1.5L50 85L92 1.5" fill="none" stroke="#d9b877" strokeOpacity="0.6" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="paper-sheen" />
        </div>
        <div className="env-flap__back" />
        {/* stuck to the flap's tip: lifts and folds back with the flap */}
        <EnvelopeSeal />
      </div>
    </>
  );
}

/** The wax seal — one whole piece with the couple's monogram. */
export function EnvelopeSeal() {
  return (
    <div className="env-seal">
      <span className="env-seal__ring" />
      <span className="env-seal__ring env-seal__ring--2" />
      <div className="env-seal__wax">
        <WaxSeal />
      </div>
    </div>
  );
}
