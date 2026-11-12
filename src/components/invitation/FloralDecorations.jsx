import { FloralCluster } from '../decor/Flowers';
import { Mandala, Toran } from '../decor/Ornaments';

const CLOUDS = [
  { x: 18, y: 30, s: 1 },
  { x: 78, y: 26, s: 0.9 },
  { x: 50, y: 70, s: 1.2 },
  { x: 12, y: 68, s: 0.8 },
  { x: 86, y: 64, s: 1 },
  { x: 48, y: 18, s: 0.7 },
];

/** Layered hero backdrop: ivory light, mandala, clouds, florals, toran. */
export default function HeroBackdrop() {
  return (
    <div className="io__backdrop" aria-hidden="true">
      <div className="io__bg" />
      <div className="io-glow" />
      <div className="io-mandala">
        <div className="spin-slow">
          <Mandala strokeWidth={0.45} />
        </div>
      </div>
      {CLOUDS.map((c, i) => (
        <div key={i} className="io-cloud" style={{ left: `${c.x}%`, top: `${c.y}%`, '--s': c.s }} />
      ))}
      <div className="io-toran">
        <Toran count={13} />
      </div>
      <div className="io-flora io-flora--tl">
        <FloralCluster />
      </div>
      <div className="io-flora io-flora--br">
        <FloralCluster className="is-mirrored" />
      </div>
    </div>
  );
}
