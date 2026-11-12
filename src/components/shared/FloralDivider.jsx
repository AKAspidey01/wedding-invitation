import { useRef } from 'react';
import { GarlandSwag } from '../decor/Ornaments';
import { Lotus } from '../decor/Flowers';
import { useScrollScene } from '../../hooks/useScrollAnimation';
import { gsap } from '../../lib/gsap';
import './FloralDivider.scss';

/**
 * Seam between two sections: a marigold garland swag with a lotus,
 * blending the colour of the section above into the one below.
 */
export default function FloralDivider({ from = '#fdf8ef', to = '#fdf8ef' }) {
  const ref = useRef(null);
  useScrollScene(ref, (q) => {
    gsap.fromTo(
      q('.floral-divider__swag'),
      { scaleX: 0.75, autoAlpha: 0, y: -14 },
      {
        scaleX: 1,
        autoAlpha: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 95%', end: 'top 55%', scrub: 1 },
      },
    );
  });
  return (
    <div ref={ref} className="floral-divider" style={{ '--from': from, '--to': to }} aria-hidden="true">
      <div className="floral-divider__swag">
        <GarlandSwag />
      </div>
      <svg className="floral-divider__lotus" viewBox="-30 -32 60 40">
        <Lotus bloom="" />
      </svg>
    </div>
  );
}
