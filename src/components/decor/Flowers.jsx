/**
 * Procedural flower primitives (SVG <g> elements) + composed clusters.
 * Each flower wraps its art in an inner `.bloom` group so GSAP can
 * scale/rotate it from its own centre for "blooming" reveals.
 */

const T = (x, y, s, r) => `translate(${x} ${y}) rotate(${r}) scale(${s})`;
const range = (n) => Array.from({ length: n }, (_, i) => i);

export function Rose({ x = 0, y = 0, s = 1, r = 0, bloom = 'bloom' }) {
  return (
    <g transform={T(x, y, s, r)}>
      <g className={bloom}>
        {range(5).map((i) => (
          <ellipse key={`o${i}`} cx="0" cy="-10" rx="11" ry="10.5" transform={`rotate(${i * 72})`} fill="url(#g-rose-petal)" stroke="#dc9aa0" strokeWidth="0.6" />
        ))}
        {range(5).map((i) => (
          <ellipse key={`m${i}`} cx="0" cy="-6" rx="7.8" ry="7.4" transform={`rotate(${i * 72 + 36})`} fill="url(#g-rose-inner)" stroke="#c97d88" strokeWidth="0.5" />
        ))}
        <circle r="5.2" fill="#c76f80" />
        <path d="M-0.5 -0.8C2.6 -2.8 4.2 1.6 .6 3C-3.6 4.4-4.6-2.4-.8-4C3.8-5.6 6.4 .4 3.4 4.2" fill="none" stroke="#9e4d5e" strokeWidth="0.9" strokeLinecap="round" />
      </g>
    </g>
  );
}

const MARIGOLD_RINGS = [
  [18, 15, 6.2, '#e2861d'],
  [16, 11.5, 5.6, '#ee9b26'],
  [13, 7.6, 5, '#f6b23c'],
  [8, 3.6, 4, '#fbc75a'],
];
const MARIGOLD_YELLOW = ['#e9a91f', '#f3bf32', '#fbd352', '#ffe07a'];
// Lightweight version for tiny marigolds (garlands, toran strings): 16 circles
// instead of 55 — identical at that size, far cheaper to paint.
const MARIGOLD_RINGS_LITE = [
  [10, 13, 7, '#e2861d'],
  [6, 6, 6, '#f6b23c'],
];
const MARIGOLD_YELLOW_LITE = ['#e9a91f', '#fbd352'];

export function Marigold({ x = 0, y = 0, s = 1, r = 0, yellow = false, bloom = 'bloom', lite = false }) {
  const rings = lite ? MARIGOLD_RINGS_LITE : MARIGOLD_RINGS;
  const yellows = lite ? MARIGOLD_YELLOW_LITE : MARIGOLD_YELLOW;
  return (
    <g transform={T(x, y, s, r)}>
      <g className={bloom}>
        {rings.map(([n, rad, size, color], ri) =>
          range(n).map((i) => (
            <circle
              key={`${ri}-${i}`}
              cx={rad}
              cy="0"
              r={size}
              transform={`rotate(${(i * 360) / n + ri * 7})`}
              fill={yellow ? yellows[ri] : color}
              stroke={yellow ? '#c98f12' : '#c46a10'}
              strokeOpacity="0.45"
              strokeWidth="0.5"
            />
          )),
        )}
        <circle r="2.6" fill={yellow ? '#e3a21c' : '#e0821a'} />
      </g>
    </g>
  );
}

export function Jasmine({ x = 0, y = 0, s = 1, r = 0, bloom = 'bloom' }) {
  return (
    <g transform={T(x, y, s, r)}>
      <g className={bloom}>
        {range(5).map((i) => (
          <path key={i} d="M0 0C-3.4-4-3.8-10 0-12.8C3.8-10 3.4-4 0 0Z" transform={`rotate(${i * 72})`} fill="url(#g-jasmine)" stroke="#e6d8bd" strokeWidth="0.5" />
        ))}
        <circle r="1.7" fill="#e7cf7d" />
      </g>
    </g>
  );
}

export function JasmineBud({ x = 0, y = 0, s = 1, r = 0 }) {
  return (
    <g transform={T(x, y, s, r)}>
      <path d="M0 0C-2.4-3-2.6-8 0-11C2.6-8 2.4-3 0 0Z" fill="#fffaf0" stroke="#e3d3b4" strokeWidth="0.5" />
      <path d="M0 0V6" stroke="#8aa577" strokeWidth="1" />
    </g>
  );
}

const lotusPetal = (h, w) =>
  `M0 0C${-w} ${-h * 0.35} ${-w * 0.6} ${-h * 0.85} 0 ${-h}C${w * 0.6} ${-h * 0.85} ${w} ${-h * 0.35} 0 0Z`;

export function Lotus({ x = 0, y = 0, s = 1, r = 0, bloom = 'bloom' }) {
  const petals = [
    [-62, 18, 6.5],
    [62, 18, 6.5],
    [-34, 23, 8],
    [34, 23, 8],
    [0, 27, 9],
  ];
  return (
    <g transform={T(x, y, s, r)}>
      <g className={bloom}>
        <path d="M-22 2C-12 6 12 6 22 2C14 9-14 9-22 2Z" fill="url(#g-leaf)" />
        {petals.map(([a, h, w]) => (
          <path key={a} d={lotusPetal(h, w)} transform={`rotate(${a})`} fill="url(#g-lotus)" stroke="#d98196" strokeWidth="0.6" />
        ))}
      </g>
    </g>
  );
}

export function MangoLeaf({ x = 0, y = 0, s = 1, r = 0, deep = false, className }) {
  return (
    <g transform={T(x, y, s, r)} className={className}>
      <path d="M0 0C5-8 6.2-26 0-40C-6.2-26-5-8 0 0Z" fill={deep ? 'url(#g-leaf-deep)' : 'url(#g-leaf)'} />
      <path d="M0-1.5V-37" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.7" />
    </g>
  );
}

export function RoseBud({ x = 0, y = 0, s = 1, r = 0 }) {
  return (
    <g transform={T(x, y, s, r)}>
      <path d="M0 2V12" stroke="#7e9a6b" strokeWidth="1.2" />
      <path d="M-5 3C-6-3-3-9 0-11C3-9 6-3 5 3C3 5-3 5-5 3Z" fill="url(#g-rose-inner)" stroke="#c07080" strokeWidth="0.5" />
      <path d="M-5 3C-3 0-1 2 0 5C1 2 3 0 5 3" fill="url(#g-leaf)" />
    </g>
  );
}

/**
 * Corner bouquet — roses, marigolds, jasmine and mango leaves.
 * Anchored at the top-left of its 200×200 box; mirror with CSS for other corners.
 */
export function FloralCluster({ className = '', style }) {
  return (
    <svg viewBox="0 0 200 200" className={`floral-cluster ${className}`} style={style} aria-hidden="true">
      <g className="cluster-leaves">
        <MangoLeaf x={18} y={16} s={1.35} r={128} />
        <MangoLeaf x={16} y={18} s={1.25} r={158} deep />
        <MangoLeaf x={20} y={16} s={1.2} r={100} deep />
        <MangoLeaf x={40} y={30} s={1.1} r={140} />
        <MangoLeaf x={70} y={20} s={0.95} r={112} />
        <MangoLeaf x={22} y={70} s={0.95} r={170} />
      </g>
      <JasmineBud x={150} y={36} s={1.1} r={100} />
      <JasmineBud x={40} y={146} s={1.1} r={168} />
      <RoseBud x={128} y={70} s={1.1} r={118} />
      <Marigold x={94} y={34} s={0.95} />
      <Marigold x={34} y={98} s={0.8} yellow />
      <Rose x={56} y={58} s={1.3} r={12} />
      <Jasmine x={118} y={56} s={0.85} r={20} />
      <Jasmine x={78} y={96} s={0.95} r={-10} />
      <Jasmine x={136} y={18} s={0.65} />
      <Jasmine x={18} y={130} s={0.7} r={30} />
    </svg>
  );
}

/** A slim horizontal floral sprig for dividers and card edges. */
export function FloralSprig({ className = '' }) {
  return (
    <svg viewBox="0 0 160 60" className={`floral-sprig ${className}`} aria-hidden="true">
      <path d="M8 34C40 30 60 40 80 34C100 28 122 38 152 32" fill="none" stroke="#8aa577" strokeWidth="1.2" />
      <MangoLeaf x={34} y={32} s={0.55} r={-70} />
      <MangoLeaf x={58} y={37} s={0.5} r={-115} deep />
      <MangoLeaf x={104} y={31} s={0.5} r={65} deep />
      <MangoLeaf x={126} y={34} s={0.55} r={115} />
      <Jasmine x={24} y={32} s={0.55} />
      <Jasmine x={136} y={33} s={0.55} r={20} />
      <Marigold x={56} y={30} s={0.42} yellow />
      <Marigold x={104} y={34} s={0.42} />
      <Rose x={80} y={33} s={0.7} />
    </svg>
  );
}
