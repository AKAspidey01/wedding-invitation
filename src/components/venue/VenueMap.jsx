import { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { weddingConfig, venueMapUrls } from '../../data/weddingConfig';
import { useSectionReveal } from '../../hooks/useScrollAnimation';
import SectionHeading from '../shared/SectionHeading';
import { Mandala, OrnateCorner } from '../decor/Ornaments';
import { FloralSprig } from '../decor/Flowers';
import './VenueMap.scss';

/** Google Map of the real venue — lazy-loaded as it approaches the viewport. */
export default function VenueMap() {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const urls = useMemo(venueMapUrls, []);
  const { venue } = weddingConfig;

  useEffect(() => {
    if (!urls || !frameRef.current) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(frameRef.current);
    return () => io.disconnect();
  }, [urls]);

  useSectionReveal(ref, (tl, q) => {
    tl.from(q('.r-head'), { autoAlpha: 0, y: 26, stagger: 0.12 }, 0)
      .from(q('.r-head-rule'), { autoAlpha: 0, scaleX: 0.3, duration: 1 }, 0.2)
      .from(q('.vmap__frame'), { autoAlpha: 0, y: 70, rotationX: 14, transformPerspective: 1000, duration: 1.4 }, 0.25)
      .from(q('.vmap__reveal'), { autoAlpha: 0, y: 24, stagger: 0.12 }, 0.6);
  });

  return (
    <section ref={ref} className="vmap" aria-labelledby="map-title">
      <div className="vmap__mandala" aria-hidden="true">
        <Mandala />
      </div>
      <FloralSprig className="vmap__sprig vmap__sprig--l" />
      <FloralSprig className="vmap__sprig vmap__sprig--r" />

      <SectionHeading id="map-title" script="Find Your Way" eyebrow="Venue location" />

      <div className="vmap__frame" ref={frameRef}>
        <div className="vmap__window">
          {urls ? (
            <>
              <div className={`vmap__skeleton ${loaded ? 'is-hidden' : ''}`} aria-hidden="true">
                <Mandala />
                <span>Loading map…</span>
              </div>
              {shouldLoad && (
                <iframe
                  className={loaded ? 'is-loaded' : ''}
                  title={`Map showing ${venue.name}`}
                  src={urls.embed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  onLoad={() => setLoaded(true)}
                />
              )}
            </>
          ) : (
            <div className="vmap__placeholder">
              <MapPin size={28} strokeWidth={1.3} aria-hidden="true" />
              <p>The map will appear here once the venue location is added.</p>
              <small>Set venue.coordinates or venue.address in weddingConfig.js</small>
            </div>
          )}
        </div>
        <span className="vmap__corner vmap__corner--bl">
          <OrnateCorner />
        </span>
        <span className="vmap__corner vmap__corner--br">
          <OrnateCorner />
        </span>
      </div>

      <address className="vmap__address vmap__reveal">
        <strong>{venue.name}</strong>
        {venue.address && <span>{venue.address}</span>}
        <span>{venue.city}</span>
      </address>

      {urls?.directions && (
        <div className="vmap__actions vmap__reveal">
          <a className="gold-btn" href={urls.directions} target="_blank" rel="noopener noreferrer">
            <Navigation size={16} strokeWidth={1.8} aria-hidden="true" />
            Get directions
          </a>
          <a className="gold-btn gold-btn--ghost" href={urls.open} target="_blank" rel="noopener noreferrer">
            <MapPin size={16} strokeWidth={1.8} aria-hidden="true" />
            Open in Maps
          </a>
        </div>
      )}
    </section>
  );
}
