import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches;
}

function subscribe(cb) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener?.('change', cb);
  return () => mq.removeEventListener?.('change', cb);
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}

/** Split text into per-character spans for elegant text reveals. */
export function splitChars(text, className = 'ch') {
  return Array.from(text || '').map((c, i) => (
    <span key={i} className={className} aria-hidden="true">
      {c === ' ' ? ' ' : c}
    </span>
  ));
}
