import { WaxSeal } from '../decor/Ornaments';
import { orderedNames } from '../../data/weddingConfig';
import grainUrl from '../../assets/paper-grain.png';
import './SealedEnvelope.scss';

/**
 * Envelope layers. They're rendered as separate siblings (not one wrapper)
 * so the card can sit *between* the back panel and the front pocket,
 * then be pulled out in front of it.
 *
 * Every non-rectangular piece (flap, pocket, side flaps, lining) is drawn as
 * an SVG shape rather than a CSS `clip-path`-ed box. Some phones (iOS Safari,
 * certain Android GPUs) render clip-paths incorrectly while an element is
 * animating — especially the flap's 3D swing — which briefly exposed or hid
 * parts of the envelope and card. SVG shapes render the same everywhere.
 */

// shape outlines, in a 0–100 box stretched to each element
const FLAP = '0,0 100,0 53.5,96 50,100 46.5,96';
const POCKET = '0,30 50,60 100,30 100,100 0,100';
const LINER = '0,0 100,0 100,40 50,92 0,40';
const SIDE_L = '0,0 44.5,56.6 0,30';
const SIDE_R = '100,0 55.5,56.6 100,30';

const svgProps = { viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': true, focusable: 'false' };

/** Paper: base gradient + bitmap grain (+ optional soft highlight). */
function Paper({ points, fill, glow = false }) {
  return (
    <>
      <polygon points={points} fill={`url(#${fill})`} />
      {glow && <polygon points={points} fill="url(#env-g-glow)" />}
      <polygon points={points} fill="url(#env-grain)" />
    </>
  );
}

/** Rose lining: gradient + diagonal sheen stripes + gold/white dots. */
function Liner({ points }) {
  return (
    <>
      <polygon points={points} fill="url(#env-g-liner)" />
      <polygon points={points} fill="url(#env-liner-stripes)" />
      <polygon points={points} fill="url(#env-liner-dots)" />
    </>
  );
}

/** Shared gradients/patterns for the envelope (rendered once). */
function EnvelopeDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="env-grain" patternUnits="userSpaceOnUse" width="34" height="30">
          <image href={grainUrl} width="34" height="30" preserveAspectRatio="none" />
        </pattern>
        <linearGradient id="env-g-flap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf1" />
          <stop offset="1" stopColor="#f7ead4" />
        </linearGradient>
        <linearGradient id="env-g-pocket" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdf6ea" />
          <stop offset="1" stopColor="#f8eddb" />
        </linearGradient>
        <radialGradient id="env-g-glow" cx="30%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="env-g-side-l" x1="0" y1="0.4" x2="1" y2="0.6">
          <stop offset="0" stopColor="#f5e8d2" />
          <stop offset="1" stopColor="#faf1e2" />
        </linearGradient>
        <linearGradient id="env-g-side-r" x1="1" y1="0.4" x2="0" y2="0.6">
          <stop offset="0" stopColor="#f3e5ce" />
          <stop offset="1" stopColor="#f9efdf" />
        </linearGradient>
        <linearGradient id="env-g-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor="#6e4822" stopOpacity="0" />
          <stop offset="0.7" stopColor="#6e4822" stopOpacity="0.14" />
          <stop offset="1" stopColor="#6e4822" stopOpacity="0.26" />
        </linearGradient>
        <linearGradient id="env-g-liner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d9d3" />
          <stop offset="1" stopColor="#eab9b5" />
        </linearGradient>
        <pattern id="env-liner-stripes" patternUnits="userSpaceOnUse" width="4.4" height="4.4" patternTransform="rotate(45)">
          <rect width="2.2" height="4.4" fill="#fff" fillOpacity="0.16" />
        </pattern>
        <pattern id="env-liner-dots" patternUnits="userSpaceOnUse" width="5" height="5">
          <circle cx="0" cy="0" r="0.42" fill="#c49a4a" fillOpacity="0.6" />
          <circle cx="5" cy="0" r="0.42" fill="#c49a4a" fillOpacity="0.6" />
          <circle cx="0" cy="5" r="0.42" fill="#c49a4a" fillOpacity="0.6" />
          <circle cx="5" cy="5" r="0.42" fill="#c49a4a" fillOpacity="0.6" />
          <circle cx="2.5" cy="2.5" r="0.32" fill="#fff" fillOpacity="0.55" />
        </pattern>
      </defs>
    </svg>
  );
}

export function EnvelopeBack() {
  return (
    <div className="env-back">
      <EnvelopeDefs />
      <svg className="env-back__liner" {...svgProps}>
        <Liner points={LINER} />
      </svg>
    </div>
  );
}

export function EnvelopePocket() {
  const [a, b] = orderedNames();
  return (
    <div className="env-pocket">
      <svg className="env-pocket__paper" {...svgProps}>
        <Paper points={POCKET} fill="env-g-pocket" glow />
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
    </div>
  );
}

export function EnvelopeFlap() {
  return (
    <>
      {/* side flaps — hide the card while sealed, dissolve as the flap lifts */}
      <svg className="env-sides" {...svgProps}>
        <Paper points={SIDE_L} fill="env-g-side-l" />
        <Paper points={SIDE_R} fill="env-g-side-r" />
      </svg>
      <svg className="env-flap-shadow" {...svgProps}>
        <polygon points="0,0 100,0 50,100" fill="url(#env-g-shadow)" />
      </svg>
      <div className="env-flap">
        <svg className="env-flap__front" {...svgProps}>
          <Paper points={FLAP} fill="env-g-flap" glow />
          <path d="M3 1.5L50 94L97 1.5" fill="none" stroke="#c49a4a" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
          <path d="M8 1.5L50 85L92 1.5" fill="none" stroke="#d9b877" strokeOpacity="0.6" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
        </svg>
        <svg className="env-flap__back" {...svgProps}>
          <Liner points={FLAP} />
        </svg>
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
      {/* soft shadow as a plain gradient — a CSS drop-shadow filter inside the
          rotating flap rendered inconsistently on some phones */}
      <span className="env-seal__shadow" />
      <div className="env-seal__wax">
        <WaxSeal />
      </div>
    </div>
  );
}
