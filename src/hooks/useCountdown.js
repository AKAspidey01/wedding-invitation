import { useEffect, useMemo, useState } from 'react';

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/**
 * Days / hours / minutes until `target` (epoch ms).
 * Re-renders only once per minute, aligned to the wall-clock minute,
 * and re-syncs when the tab becomes visible again.
 */
export function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (target == null) return undefined;
    let id;
    const schedule = () => {
      const t = Date.now();
      id = window.setTimeout(() => {
        setNow(Date.now());
        schedule();
      }, MIN - (t % MIN) + 30);
    };
    schedule();
    const onVisible = () => {
      if (!document.hidden) setNow(Date.now());
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [target]);

  return useMemo(() => {
    if (target == null) return { status: 'unset', days: 0, hours: 0, minutes: 0 };
    const diff = target - now;
    if (diff <= 0) return { status: 'arrived', days: 0, hours: 0, minutes: 0 };
    // ceil to whole minutes so the display reaches 0 exactly at the moment
    const totalMin = Math.ceil(diff / MIN);
    return {
      status: 'counting',
      days: Math.floor(totalMin / (DAY / MIN)),
      hours: Math.floor((totalMin % (DAY / MIN)) / 60),
      minutes: totalMin % 60,
    };
  }, [target, now]);
}
