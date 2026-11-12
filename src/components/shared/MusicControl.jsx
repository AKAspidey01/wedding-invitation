import { useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../../lib/audioEngine';
import './MusicControl.scss';

/** Discreet floating music toggle — appears once the music has started. */
export default function MusicControl() {
  const { started, playing, available } = useSyncExternalStore(audioEngine.subscribe, audioEngine.getState);
  const show = started && available;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          className={`music-control ${playing ? 'is-playing' : ''}`}
          onClick={() => audioEngine.toggle()}
          aria-pressed={!playing}
          aria-label={playing ? 'Mute background music' : 'Play background music'}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="music-control__ring" aria-hidden="true" />
          <span className="music-control__bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={playing ? 'on' : 'off'}
              className="music-control__icon"
              initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.6 }}
              transition={{ duration: 0.25 }}
            >
              {playing ? <Volume2 size={18} strokeWidth={1.6} /> : <VolumeX size={18} strokeWidth={1.6} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
