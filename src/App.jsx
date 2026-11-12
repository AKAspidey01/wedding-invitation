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
    return () => {
      window.removeEventListener('load', onLoad);
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
