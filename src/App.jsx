import { useEffect } from 'react';
import { initSmoothScroll } from './lib/smoothScroll';
import { ScrollTrigger } from './lib/gsap';
import SvgDefs from './components/decor/SvgDefs';
import InvitationOpening from './components/invitation/InvitationOpening';
import VenueSection from './components/venue/VenueSection';
import VenueMap from './components/venue/VenueMap';
import WeddingCountdown from './components/countdown/WeddingCountdown';
import WeddingEvents from './components/events/WeddingEvents';
import WeddingGallery from './components/gallery/WeddingGallery';
import FinalBlessing from './components/closing/FinalBlessing';
import FloralDivider from './components/shared/FloralDivider';
import MusicControl from './components/shared/MusicControl';

export default function App() {
  useEffect(() => {
    const destroy = initSmoothScroll();
    // Re-measure once web fonts and late layout have settled.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    // Pause the looping decorative CSS animations (garland sway, twinkles,
    // diya flames, mandala spin…) in every section that is off-screen —
    // otherwise the browser keeps working on them and the visible part stutters.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('is-offscreen', !e.isIntersecting)),
      { rootMargin: '15% 0px' },
    );
    document.querySelectorAll('.experience section').forEach((s) => io.observe(s));

    return () => {
      window.removeEventListener('load', onLoad);
      io.disconnect();
      destroy();
    };
  }, []);

  return (
    <>
      <SvgDefs />
      <main className="experience">
        <InvitationOpening />
        <VenueSection />
        <VenueMap />
        <FloralDivider from="#f6f1e3" to="#fbf1e2" />
        <WeddingCountdown />
        <FloralDivider from="#f8e9d8" to="#fdf7ee" />
        <WeddingEvents />
        <FloralDivider from="#fbf2ea" to="#fdf9f3" />
        <WeddingGallery />
        <FinalBlessing />
      </main>
      <MusicControl />
    </>
  );
}
