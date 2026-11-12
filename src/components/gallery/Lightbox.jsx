import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { lockScroll, unlockScroll } from '../../lib/smoothScroll';

const EASE = [0.22, 0.61, 0.36, 1];

/** Light-mode lightbox: swipe / arrow keys to browse, Esc or tap outside to close. */
export default function Lightbox({ photos, index, onIndex, onClose }) {
  const closeRef = useRef(null);
  const viewable = photos.map((p, i) => ({ ...p, i })).filter((p) => p.src);
  const pos = viewable.findIndex((p) => p.i === index);
  const photo = viewable[pos];

  const step = (dir) => {
    const next = viewable[pos + dir];
    if (next) onIndex(next.i);
  };

  useEffect(() => {
    lockScroll();
    closeRef.current?.focus();
    return () => unlockScroll();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!photo) return null;

  return createPortal(
    <motion.div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      onClick={onClose}
    >
      <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label="Close photo viewer">
        <X size={22} strokeWidth={1.5} />
      </button>

      <AnimatePresence mode="wait" initial={false}>
        <motion.figure
          key={photo.i}
          className="lightbox__figure"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92, rotateY: 12 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.96, rotateY: -12 }}
          transition={{ duration: 0.55, ease: EASE }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70) step(1);
            else if (info.offset.x > 70) step(-1);
          }}
        >
          <img src={photo.src} alt={photo.alt} draggable="false" />
          {photo.caption && <figcaption>{photo.caption}</figcaption>}
        </motion.figure>
      </AnimatePresence>

      {viewable.length > 1 && (
        <div className="lightbox__nav" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => step(-1)} disabled={pos === 0} aria-label="Previous photo">
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <span>
            {pos + 1} / {viewable.length}
          </span>
          <button type="button" onClick={() => step(1)} disabled={pos === viewable.length - 1} aria-label="Next photo">
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </motion.div>,
    document.body,
  );
}
