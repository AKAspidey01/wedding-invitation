/**
 * Illustrated banquet hall — used as the venue background until a real
 * banquet hall PNG is configured. Split into depth layers for parallax.
 * All layers share one viewBox so they stay aligned at any aspect ratio.
 */

const VB = '0 0 400 860';
const PAR = 'xMidYMax slice';

function Chandelier({ cx, top = 0, drop = 70, scale = 1 }) {
  const y = top + drop;
  const tier = (w, dy) => {
    const pts = [];
    for (let k = -3; k <= 3; k++) {
      const t = k / 3;
      pts.push([cx + t * w, y + dy + (1 - t * t) * w * 0.38]);
    }
    return pts;
  };
  const t1 = tier(36 * scale, 22);
  const t2 = tier(24 * scale, 4);
  return (
    <g>
      {/* static halo — animating this large glow repainted the whole hall layer */}
      <circle cx={cx} cy={y + 24} r={62 * scale} fill="url(#g-glow-warm)" />
      <line x1={cx} y1={top} x2={cx} y2={y - 6} stroke="#c49a4a" strokeWidth="1.2" />
      <circle cx={cx} cy={y - 6} r="3" fill="url(#g-gold)" />
      <path d={`M${t1[0][0]} ${t1[0][1]}Q${cx} ${y + 22 + 36 * scale * 0.9} ${t1[6][0]} ${t1[6][1]}`} fill="none" stroke="url(#g-gold)" strokeWidth="2" />
      <path d={`M${t2[0][0]} ${t2[0][1]}Q${cx} ${y + 4 + 24 * scale * 0.9} ${t2[6][0]} ${t2[6][1]}`} fill="none" stroke="url(#g-gold)" strokeWidth="1.6" />
      <path d={`M${cx} ${y - 6}L${t1[0][0]} ${t1[0][1]}M${cx} ${y - 6}L${t1[6][0]} ${t1[6][1]}`} stroke="#c49a4a" strokeWidth="0.6" />
      {[...t1, ...t2].map(([x, yy], i) => (
        <g key={i}>
          <line x1={x} y1={yy} x2={x} y2={yy + 7 + (i % 3) * 3} stroke="#e8d3a4" strokeWidth="0.6" />
          <path d={`M${x} ${yy + 7 + (i % 3) * 3}l2 3.4-2 3.4-2-3.4z`} fill="#fffaf0" stroke="#e3c98f" strokeWidth="0.4" />
        </g>
      ))}
      {[t1[0], t1[6], t2[0], t2[6], [cx, y - 8]].map(([x, yy], i) => (
        <g key={`c${i}`}>
          <rect x={x - 1.6} y={yy - 9} width="3.2" height="9" rx="1" fill="#fffaf0" />
          <ellipse className="bh-twinkle" cx={x} cy={yy - 12} rx="1.8" ry="3" fill="#ffd56e" style={{ animationDelay: `${i * -0.7}s` }} />
        </g>
      ))}
    </g>
  );
}

function MarigoldString({ x, len, delay = 0 }) {
  const beads = Math.floor(len / 9);
  return (
    <g className="sway" style={{ animationDelay: `${delay}s`, animationDuration: '6s' }}>
      <line x1={x} y1="0" x2={x} y2={len} stroke="#b9873c" strokeWidth="0.5" />
      {Array.from({ length: beads }, (_, i) => (
        <circle key={i} cx={x} cy={8 + i * 9} r={i % 4 === 3 ? 3.2 : 4.2} fill={i % 4 === 3 ? '#fffaf0' : i % 2 ? '#f6b23c' : '#e8891e'} />
      ))}
      <path d={`M${x} ${len + 4}l-3 6h6z`} fill="#c0485c" />
    </g>
  );
}

export function HallBack() {
  const floorLines = Array.from({ length: 13 }, (_, i) => -400 + i * 100);
  return (
    <svg viewBox={VB} preserveAspectRatio={PAR} className="bh-layer" aria-hidden="true">
      <defs>
        <linearGradient id="bh-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf1e1" />
          <stop offset="1" stopColor="#f2dfc2" />
        </linearGradient>
        <radialGradient id="bh-arch" cx="50%" cy="38%" r="65%">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="0.55" stopColor="#fdf4e4" />
          <stop offset="1" stopColor="#f5e1c0" />
        </radialGradient>
        <linearGradient id="bh-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e0c4" />
          <stop offset="1" stopColor="#e6c79f" />
        </linearGradient>
        <pattern id="bh-jali" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M11 2C14 7 15 8 20 11C15 14 14 15 11 20C8 15 7 14 2 11C7 8 8 7 11 2Z" fill="none" stroke="#d9b877" strokeWidth="0.6" />
        </pattern>
        <linearGradient id="bh-pillar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e6cf9f" />
          <stop offset="0.5" stopColor="#fbf1dc" />
          <stop offset="1" stopColor="#d9bb83" />
        </linearGradient>
      </defs>
      <rect width="400" height="860" fill="url(#bh-wall)" />
      <rect width="400" height="680" fill="url(#bh-jali)" opacity="0.35" />
      {/* side alcoves */}
      <path d="M-30 680V420C-30 370 0 340 6 330C12 340 40 370 40 420V680Z" fill="#fbf0dd" stroke="#d9b877" strokeWidth="1.2" />
      <path d="M360 680V420C360 370 388 340 394 330C400 340 430 370 430 420V680Z" fill="#fbf0dd" stroke="#d9b877" strokeWidth="1.2" />
      {/* grand arch */}
      <path d="M44 680V300C44 188 128 126 200 70C272 126 356 188 356 300V680Z" fill="url(#bh-arch)" />
      <path d="M44 680V300C44 188 128 126 200 70C272 126 356 188 356 300V680" fill="none" stroke="url(#g-gold)" strokeWidth="3" />
      <path d="M58 680V304C58 200 136 142 200 92C264 142 342 200 342 304V680" fill="none" stroke="#d9b877" strokeWidth="1" />
      <path d="M200 70l-6 -14 6 -12 6 12z" fill="url(#g-gold)" />
      {/* pillars */}
      {[24, 356].map((x) => (
        <g key={x}>
          <rect x={x} y="290" width="20" height="390" fill="url(#bh-pillar)" />
          <rect x={x - 4} y="282" width="28" height="10" rx="2" fill="url(#g-gold)" />
          <rect x={x - 4} y="672" width="28" height="10" rx="2" fill="url(#g-gold)" />
          <path d={`M${x + 10} 300V670`} stroke="#c49a4a" strokeOpacity="0.4" strokeWidth="0.8" strokeDasharray="2 6" />
        </g>
      ))}
      {/* floor */}
      <rect y="680" width="400" height="180" fill="url(#bh-floor)" />
      <g stroke="#c49a4a" strokeOpacity="0.22" strokeWidth="0.8">
        {floorLines.map((x) => (
          <line key={x} x1="200" y1="680" x2={x} y2="860" />
        ))}
        {[700, 728, 764, 810].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} />
        ))}
      </g>
      {/* mandap */}
      <g>
        <ellipse cx="200" cy="650" rx="98" ry="98" fill="#fff9ef" opacity="0.8" />
        <polygon points="102,722 298,722 330,770 70,770" fill="#f4d9ad" stroke="#c49a4a" strokeWidth="1" />
        <rect x="70" y="770" width="260" height="16" fill="#e3bd85" />
        <path d="M70 778H330" stroke="#c0485c" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" />
        {[128, 272].map((x) => (
          <rect key={x} x={x - 3} y="592" width="6" height="130" fill="url(#bh-pillar)" />
        ))}
        {[98, 302].map((x) => (
          <g key={x}>
            <rect x={x - 4} y="574" width="8" height="196" fill="url(#bh-pillar)" />
            <path d={`M${x} 590V760`} stroke="#e8891e" strokeWidth="5" strokeDasharray="0 7" strokeLinecap="round" />
          </g>
        ))}
        <path d="M84 584Q200 512 316 584Z" fill="#f3c9c4" stroke="url(#g-gold)" strokeWidth="2" />
        {Array.from({ length: 16 }, (_, i) => (
          <circle key={i} cx={92 + i * 14.4} cy="588" r="4.5" fill={i % 2 ? '#f6b23c' : '#fffaf0'} />
        ))}
        <path d="M98 604Q200 664 302 604" fill="none" stroke="#e8891e" strokeWidth="7" strokeDasharray="0 8" strokeLinecap="round" />
        <path d="M98 604Q200 664 302 604" fill="none" stroke="#f6b23c" strokeWidth="5" strokeDasharray="0 8" strokeDashoffset="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function HallMid() {
  return (
    <svg viewBox={VB} preserveAspectRatio={PAR} className="bh-layer" aria-hidden="true">
      <path d="M0 40Q200 128 400 40" fill="none" stroke="#e3c98f" strokeWidth="0.6" />
      {Array.from({ length: 24 }, (_, i) => {
        const t = i / 23;
        const x = t * 400;
        const y = 40 + Math.sin(t * Math.PI) * 44;
        return <circle key={i} cx={x} cy={y + 1} r="2" fill="#ffe7a8" opacity={i % 3 ? 0.75 : 1} />;
      })}
      <Chandelier cx={70} drop={40} scale={0.9} />
      <Chandelier cx={330} drop={40} scale={0.9} />
      {[12, 30, 370, 388].map((x, i) => (
        <MarigoldString key={x} x={x} len={[260, 200, 200, 260][i]} delay={i * -1.3} />
      ))}
    </svg>
  );
}

export function HallFront({ curtains = true }) {
  return (
    <svg viewBox={VB} preserveAspectRatio={PAR} className="bh-layer" aria-hidden="true">
      <defs>
        <linearGradient id="bh-drape" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9b0ab" />
          <stop offset="0.5" stopColor="#f8dad3" />
          <stop offset="1" stopColor="#eab3ad" />
        </linearGradient>
      </defs>
      {curtains && (
        <g>
          <path d="M0 0H64C56 140 36 280 50 430C30 438 12 446 0 452Z" fill="url(#bh-drape)" />
          <path d="M0 452C18 470 34 540 28 860H0Z" fill="url(#bh-drape)" />
          <path d="M20 0C18 150 16 300 24 440M40 0C34 140 26 290 38 434" fill="none" stroke="#d99c9a" strokeOpacity="0.5" strokeWidth="1" />
          <ellipse cx="34" cy="440" rx="20" ry="7" fill="url(#g-gold)" />
          <path d="M400 0H336C344 140 364 280 350 430C370 438 388 446 400 452Z" fill="url(#bh-drape)" />
          <path d="M400 452C382 470 366 540 372 860H400Z" fill="url(#bh-drape)" />
          <path d="M380 0C382 150 384 300 376 440M360 0C366 140 374 290 362 434" fill="none" stroke="#d99c9a" strokeOpacity="0.5" strokeWidth="1" />
          <ellipse cx="366" cy="440" rx="20" ry="7" fill="url(#g-gold)" />
        </g>
      )}
      <path d="M0 0H400V22C340 72 266 72 200 30C134 72 60 72 0 22Z" fill="url(#bh-drape)" />
      <path d="M0 22C60 72 134 72 200 30C266 72 340 72 400 22" fill="none" stroke="url(#g-gold)" strokeWidth="2.4" />
      <path d="M0 28C60 78 134 78 200 36C266 78 340 78 400 28" fill="none" stroke="#e8891e" strokeWidth="4" strokeDasharray="0 7" strokeLinecap="round" />
      {[[0, 24], [200, 32], [400, 24]].map(([x, y]) => (
        <g key={x}>
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={x + Math.cos((i / 12) * Math.PI * 2) * 9} cy={y + Math.sin((i / 12) * Math.PI * 2) * 9} r="5" fill={i % 2 ? '#f6b23c' : '#e8891e'} />
          ))}
          <circle cx={x} cy={y} r="5" fill="#c0485c" />
        </g>
      ))}
    </svg>
  );
}
