import { Lotus, Marigold, MangoLeaf } from './Flowers';
import { monogram } from '../../data/weddingConfig';

const range = (n) => Array.from({ length: n }, (_, i) => i);

const petal = (r0, len, w) =>
  `M0 ${-r0}C${w} ${-r0 - len * 0.4} ${w * 0.5} ${-r0 - len * 0.9} 0 ${-r0 - len}C${-w * 0.5} ${-r0 - len * 0.9} ${-w} ${-r0 - len * 0.4} 0 ${-r0}Z`;

/** Procedural gold line mandala. */
export function Mandala({ className = '', strokeWidth = 0.6 }) {
  return (
    <svg viewBox="-100 -100 200 200" className={`mandala ${className}`} aria-hidden="true">
      <g fill="none" stroke="url(#g-gold)" strokeWidth={strokeWidth}>
        <circle r="97" />
        <circle r="93" strokeDasharray="1 3" />
        {range(32).map((i) => (
          <path key={`a${i}`} d={petal(70, 22, 6)} transform={`rotate(${i * 11.25})`} />
        ))}
        {range(32).map((i) => (
          <path key={`a2${i}`} d={petal(72, 12, 2.6)} transform={`rotate(${i * 11.25 + 5.6})`} />
        ))}
        <circle r="70" />
        <circle r="66" />
        {range(24).map((i) => (
          <circle key={`d${i}`} cx="0" cy="-58" r="1.3" transform={`rotate(${i * 15})`} fill="url(#g-gold)" />
        ))}
        {range(16).map((i) => (
          <path key={`b${i}`} d={petal(26, 26, 11)} transform={`rotate(${i * 22.5})`} />
        ))}
        {range(16).map((i) => (
          <path key={`b2${i}`} d={petal(26, 16, 5)} transform={`rotate(${i * 22.5})`} />
        ))}
        <circle r="26" />
        {range(8).map((i) => (
          <path key={`c${i}`} d={petal(4, 18, 7)} transform={`rotate(${i * 45})`} />
        ))}
        <circle r="4" />
      </g>
    </svg>
  );
}

/** Mango-leaf toran with marigold strings. Leaves sway gently. */
export function Toran({ className = '', count = 13 }) {
  const W = count * 30;
  return (
    <svg viewBox={`0 0 ${W} 74`} className={`toran ${className}`} preserveAspectRatio="xMidYMin meet" aria-hidden="true">
      <path d={`M0 5H${W}`} stroke="url(#g-gold)" strokeWidth="2.4" />
      <path d={`M0 8.5H${W}`} stroke="#c0485c" strokeOpacity="0.55" strokeWidth="1" />
      {range(count).map((i) => {
        const x = 15 + i * 30;
        return (
          <g key={i}>
            <g transform={`translate(${x} 6)`}>
              <g className="sway" style={{ animationDelay: `${(i % 5) * -0.9}s` }}>
                <MangoLeaf r={180} s={1.05} deep={i % 2 === 1} />
              </g>
            </g>
            {i < count - 1 && (
              <g transform={`translate(${x + 15} 6)`}>
                <g className="sway" style={{ animationDelay: `${(i % 4) * -1.1}s`, animationDuration: '5.6s' }}>
                  <path d="M0 0V30" stroke="#b9873c" strokeWidth="0.6" />
                  <Marigold y={9} s={0.36} bloom="" lite />
                  <Marigold y={20} s={0.3} yellow bloom="" lite />
                  <Marigold y={29} s={0.26} bloom="" lite />
                </g>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Brass diya with a flickering flame. */
export function Diya({ className = '' }) {
  return (
    <svg viewBox="0 0 60 70" className={`diya ${className}`} aria-hidden="true">
      <circle className="diya__glow" cx="30" cy="22" r="20" fill="url(#g-flame-glow)" />
      <g className="diya__flame">
        <path d="M30 4C36 15 37 22 30 31C23 22 24 15 30 4Z" fill="url(#g-flame)" />
        <path d="M30 16C32.5 21 32.5 25 30 29C27.5 25 27.5 21 30 16Z" fill="#fffbe9" opacity="0.85" />
      </g>
      <path d="M29.2 31H30.8V35H29.2Z" fill="#6b4a22" />
      <path d="M5 35Q30 32 55 35Q51 55 30 57Q9 55 5 35Z" fill="url(#g-brass)" />
      <ellipse cx="30" cy="35" rx="25" ry="3.6" fill="#f0d695" stroke="#b48535" strokeWidth="0.6" />
      <path d="M12 44Q30 49 48 44" fill="none" stroke="#9c6e2b" strokeWidth="0.7" strokeDasharray="1.2 2.2" />
      <path d="M22 57H38L42 65H18Z" fill="url(#g-brass)" />
      <ellipse cx="30" cy="65" rx="13" ry="2.4" fill="#b48535" />
    </svg>
  );
}

/** Kalash — brass pot with mango leaves and coconut. */
export function Kalash({ className = '' }) {
  return (
    <svg viewBox="0 0 80 100" className={`kalash ${className}`} aria-hidden="true">
      {[-62, -32, 0, 32, 62].map((a, i) => (
        <MangoLeaf key={a} x={40} y={38} s={0.62} r={a} deep={i % 2 === 1} />
      ))}
      <ellipse cx="40" cy="26" rx="11" ry="12.5" fill="#c99a63" />
      <path d="M33 20C36 15 44 15 47 20" fill="none" stroke="#a87a45" strokeWidth="1" />
      <path d="M37 14C39 9 41 9 43 14" fill="#8aa577" />
      <path d="M28 38H52L49 46H31Z" fill="url(#g-brass)" />
      <path d="M31 46C16 50 12 62 16 72C21 86 32 92 40 92C48 92 59 86 64 72C68 62 64 50 49 46Z" fill="url(#g-brass)" />
      <path d="M17 62Q40 70 63 62" fill="none" stroke="#c0485c" strokeWidth="1.6" />
      <path d="M17 66Q40 74 63 66" fill="none" stroke="#e8c77c" strokeWidth="0.8" />
      {range(5).map((i) => (
        <circle key={i} cx={24 + i * 8} cy={79 - Math.abs(2 - i) * 1.4} r="1.3" fill="#9c6e2b" />
      ))}
      <ellipse cx="40" cy="94" rx="14" ry="3" fill="#b48535" />
    </svg>
  );
}

/** Gold filigree corner — rotate/mirror via CSS. */
export function OrnateCorner({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={`ornate-corner ${className}`} aria-hidden="true">
      <g fill="none" stroke="url(#g-gold)" strokeLinecap="round">
        <path d="M4 4H66M4 4V66" strokeWidth="1.6" />
        <path d="M10 10H46M10 10V46" strokeWidth="0.8" />
        <path d="M10 10C30 10 39 21 33 31C28 39 17 35 19 28C21 22 28 23 27.5 27.5" strokeWidth="1.1" />
        <path d="M10 10C10 30 21 39 31 33C39 28 35 17 28 19C22 21 23 28 27.5 27.5" strokeWidth="1.1" />
        <path d="M44 16C54 13 61 22 56 29C52 34 45 31 47 26C48.5 23 52 24 51.5 27" strokeWidth="0.9" />
        <path d="M16 44C13 54 22 61 29 56C34 52 31 45 26 47C23 48.5 24 52 27 51.5" strokeWidth="0.9" />
      </g>
      <g fill="url(#g-gold)">
        <circle cx="72" cy="4" r="1.6" />
        <circle cx="79" cy="4" r="1.1" />
        <circle cx="85" cy="4" r="0.7" />
        <circle cx="4" cy="72" r="1.6" />
        <circle cx="4" cy="79" r="1.1" />
        <circle cx="4" cy="85" r="0.7" />
        {range(4).map((i) => (
          <path key={i} d="M10 10l2.6-5.4L10 2.4 7.4 4.6z" transform={`rotate(${i * 90} 10 10)`} />
        ))}
      </g>
    </svg>
  );
}

/** Thin gold rule with lotus centre — the shared section divider motif. */
export function OrnamentRule({ className = '' }) {
  return (
    <svg viewBox="0 0 240 34" className={`ornament-rule ${className}`} aria-hidden="true">
      <path d="M0 22H92M148 22H240" stroke="url(#g-gold-h)" strokeWidth="1" />
      <path d="M40 26H96M144 26H200" stroke="url(#g-gold-h)" strokeWidth="0.5" />
      <circle cx="98" cy="22" r="1.6" fill="#c49a4a" />
      <circle cx="142" cy="22" r="1.6" fill="#c49a4a" />
      <Lotus x={120} y={28} s={0.78} bloom="" />
    </svg>
  );
}

function sealPath() {
  const pts = [];
  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2;
    const r = 44 + 2.2 * Math.sin(5 * a) + 1.5 * Math.sin(9 * a + 1) + 1.1 * Math.sin(14 * a + 2);
    pts.push(`${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}
const SEAL_PATH = sealPath();

/** Wax seal with the couple's monogram. */
export function WaxSeal({ className = '' }) {
  const [a = '', b = ''] = monogram();
  return (
    <svg viewBox="-50 -50 100 100" className={`wax-seal ${className}`} aria-hidden="true">
      <path d={SEAL_PATH} fill="url(#g-wax)" />
      <path d={SEAL_PATH} fill="none" stroke="#5f1f30" strokeOpacity="0.25" strokeWidth="1.5" />
      <circle r="33" fill="none" stroke="#6d2235" strokeOpacity="0.45" strokeWidth="2.4" />
      <circle r="31.2" fill="none" stroke="#f3c2c6" strokeOpacity="0.4" strokeWidth="1" />
      {range(16).map((i) => (
        <path key={i} d={petal(33.5, 6, 2.2)} transform={`rotate(${i * 22.5})`} fill="#6d2235" fillOpacity="0.3" />
      ))}
      <path d="M-30-22A38 38 0 0 1 12-37" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="2.5" strokeLinecap="round" />
      <g fontFamily="'Great Vibes', cursive" textAnchor="middle">
        <text x="0.8" y="9.8" fontSize="30" fill="#5f1f30" fillOpacity="0.55">
          {a}
          <tspan fontSize="17" dy="-3">&amp;</tspan>
          <tspan dy="3">{b}</tspan>
        </text>
        <text x="0" y="9" fontSize="30" fill="#f6d3cf">
          {a}
          <tspan fontSize="17" dy="-3">&amp;</tspan>
          <tspan dy="3">{b}</tspan>
        </text>
      </g>
    </svg>
  );
}

/** Marigold garland swag used at section seams. */
export function GarlandSwag({ className = '' }) {
  const beads = range(23).map((i) => {
    const t = i / 22;
    const x = 6 + t * 388;
    const y = 8 + Math.sin(t * Math.PI) * 34;
    return { x, y, i };
  });
  return (
    <svg viewBox="0 0 400 60" className={`garland-swag ${className}`} preserveAspectRatio="xMidYMin meet" aria-hidden="true">
      {beads.map(({ x, y, i }) =>
        i % 6 === 3 ? (
          <MangoLeaf key={i} x={x} y={y} s={0.42} r={i < 11 ? -150 : 150} />
        ) : (
          <Marigold key={i} x={x} y={y} s={0.36} yellow={i % 3 === 1} bloom="" lite />
        ),
      )}
    </svg>
  );
}
