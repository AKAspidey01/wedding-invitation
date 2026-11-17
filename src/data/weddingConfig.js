/**
 * ─────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION — the single source of truth.
 *  Every section of the invitation reads from this file.
 *
 *  Values marked  ⟵ PLACEHOLDER  must be replaced with the
 *  real details. Nothing here has been invented: names, dates
 *  and the venue location are intentionally left as placeholders.
 * ─────────────────────────────────────────────────────────────
 */

export const weddingConfig = {
  couple: {
    bride: {
      name: 'Asha', // ⟵ PLACEHOLDER  short display name (shown in script type)
      fullName: '', // optional, e.g. "Chi. La. Sow. …"
    },
    groom: {
      name: 'Anil', // ⟵ PLACEHOLDER
      fullName: '',
    },
    /** Order in which the names appear on the cards. */
    displayOrder: ['bride', 'groom'],
  },

  /** All event times are interpreted in this timezone. */
  timezone: {
    iana: 'Asia/Kolkata',
    offset: '+05:30',
    label: 'IST',
  },

  /**
   * The events, in the order they happen. Times are 24h "HH:mm" in the
   * timezone above; `date` is the real calendar date "YYYY-MM-DD".
   *   onwards  — show the time as "7:00 PM onwards"
   *   nightOf  — the event falls in the small hours after this evening, so
   *              it is shown as "early morning" (the night of that date)
   */
  events: [
    {
      id: 'dinner',
      title: 'Wedding Dinner',
      tagline: 'Feast & Festivities',
      date: '2026-12-02', // Wednesday night
      time: '19:00', // 7:00 PM onwards
      onwards: true,
      motif: 'diya',
    },
    {
      id: 'marriage',
      title: 'Marriage',
      tagline: 'Sumuhurtham',
      // Muhurtham: the night of 2 December, i.e. 4:45 AM on 3 December.
      // date + time are the exact moment (the countdown counts down to it).
      date: '2026-12-03',
      time: '04:45',
      nightOf: '2026-12-02',
      motif: 'kalash',
    },
    /* Reception — hidden for now. Uncomment (and set its date) to show it
       again on the card, venue, and event sections.
    {
      id: 'reception',
      title: 'Reception',
      tagline: 'Blessings & Celebration',
      date: null,
      time: '22:30', // 10:30 PM
      motif: 'diya',
    },
    */
  ],

  /** The countdown counts down to this event's date + time. */
  countdownEventId: 'marriage',

  venue: {
    // From the Google Maps link https://maps.app.goo.gl/dW8NhW2FWvGFcV156
    name: 'Sreerastu Convention',
    city: 'Kakinada',
    address: '10-5-29, Nageswara Rao St, Rama Rao Peta, Kakinada, Andhra Pradesh 533004',
    /** Exact pin of the place on Google Maps — used for directions. */
    coordinates: { lat: 16.9615672, lng: 82.22812 },
    /**
     * Optional: a full Google Maps embed URL ("Share → Embed a map → src").
     * If empty, the embed is built from coordinates or address.
     * Set to the named place so the map shows "Sreerastu convention" with its
     * address card, rather than an unlabelled coordinate pin.
     */
    mapEmbedUrl:
      'https://www.google.com/maps?q=Sreerastu+Convention,+10-5-29,+Nageswara+Rao+St,+Rama+Rao+Peta,+Kakinada,+Andhra+Pradesh+533004&z=17&output=embed',
    /**
     * Banquet hall photograph used as the venue background.
     * Drop the file into /public/images/venue/ and set the paths, e.g.
     *   backgroundImage: '/images/venue/banquet-hall.png'
     *   backgroundImageWebp: '/images/venue/banquet-hall.webp'
     * While null, an illustrated banquet hall is rendered instead.
     */
    backgroundImage: null,
    backgroundImageWebp: null,
  },

  music: {
    /**
     * Background music (file in /public/audio/). Starts on the first tap.
     * The FIRST track in the list is the one that plays.
     * `credit` is shown in small print at the end of the page (the
     * Creative Commons licence asks for it).
     */
    tracks: [
      // Bach's "Jesu, Joy" — piano, bells & harp (chosen 17 Nov 2026)
      { src: '/audio/wedding-music.mp3', credit: '“Jesu, Joy of Man’s Desiring” by Kevin MacLeod (incompetech.com) · CC BY 4.0' },
    ],
    volume: 0.45,
    /**
     * Play the old synthesised Raga Mohanam melody when no track is listed
     * or a file fails to load. Off: silence is better than a dull fallback.
     */
    synthFallback: false,
  },

  /**
   * Gallery photographs — put files in /public/images/gallery/
   * and set `src`. Entries with `src: null` show an elegant placeholder.
   */
  gallery: [
    { src: null, alt: 'The couple — photograph 1', caption: '' },
    { src: null, alt: 'The couple — photograph 2', caption: '' },
    { src: null, alt: 'The couple — photograph 3', caption: '' },
    { src: null, alt: 'The couple — photograph 4', caption: '' },
    { src: null, alt: 'The couple — photograph 5', caption: '' },
    { src: null, alt: 'The couple — photograph 6', caption: '' },
  ],

  invitationCard: {
    invocation: '॥ श्री गणेशाय नमः ॥',
    // Telugu alternative: '॥ శ్రీ గణేశాయ నమః ॥'
    preamble: 'Together with their families',
    request: 'joyfully invite you to celebrate their wedding',
  },

  closing: {
    invocation: '॥ श्री गणेशाय नमः ॥',
    title: 'Shubh Vivah',
    blessing: 'With the blessings of the Almighty and our families, we begin a beautiful new chapter together.',
    thankYou: [
      'Your love, blessings and presence will make our celebration even more special.',
      'We look forward to celebrating this beautiful occasion with you.',
    ],
    /** Optional family names — leave empty strings to hide. */
    families: {
      bride: '', // e.g. 'Smt. & Sri …'
      groom: '',
    },
    signOff: 'With love and gratitude',
  },
};

/* ───────────────── derived helpers ───────────────── */

/** Music tracks that have a file set (comment-outs and nulls skipped). */
export const musicTracks = () => (weddingConfig.music.tracks || []).filter((t) => t && t.src);

export const orderedNames = () =>
  weddingConfig.couple.displayOrder.map((k) => weddingConfig.couple[k].name);

export const monogram = () =>
  orderedNames()
    .map((n) => (n || '').trim().charAt(0).toUpperCase())
    .filter(Boolean);

/** "22:20" → "10:20 PM" */
export function formatTime(hhmm) {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** "2027-02-14" → "Sunday, 14 February 2027" (rendered in the event timezone) */
export function formatDate(date, opts = {}) {
  if (!date) return '';
  const d = new Date(`${date}T12:00:00${weddingConfig.timezone.offset}`);
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: weddingConfig.timezone.iana,
    ...opts,
  }).format(d);
}

/** Pieces for a calendar badge: "2026-12-02" → { month: 'Dec', day: '02' }. */
export function dateBadge(date) {
  if (!date) return null;
  const d = new Date(`${date}T12:00:00${weddingConfig.timezone.offset}`);
  const fmt = (o) => new Intl.DateTimeFormat('en-IN', { ...o, timeZone: weddingConfig.timezone.iana }).format(d);
  return { month: fmt({ month: 'short' }), day: fmt({ day: '2-digit' }) };
}

/** Machine-readable moment for <time dateTime>, e.g. "2026-12-03T04:45+05:30". */
export function eventDateTime(event) {
  if (!event?.date || !event?.time) return undefined;
  return `${event.date}T${event.time}${weddingConfig.timezone.offset}`;
}

/** Absolute epoch ms for an event, or null if its date is not set. */
export function eventTimestamp(event) {
  if (!event?.date || !event?.time) return null;
  const t = Date.parse(`${event.date}T${event.time}:00${weddingConfig.timezone.offset}`);
  return Number.isNaN(t) ? null : t;
}

export function getEvent(id) {
  return weddingConfig.events.find((e) => e.id === id);
}

/** Map URLs derived from the venue config — null when no location is configured. */
export function venueMapUrls() {
  const { coordinates, address, name, city, mapEmbedUrl } = weddingConfig.venue;
  const hasCoords = coordinates && Number.isFinite(coordinates.lat) && Number.isFinite(coordinates.lng);
  const query = hasCoords
    ? `${coordinates.lat},${coordinates.lng}`
    : address
      ? [name, address, city].filter(Boolean).join(', ')
      : '';
  if (!query && !mapEmbedUrl) return null;
  const q = encodeURIComponent(query);
  // With only an embed URL configured, point the buttons at the venue name + city.
  const linkQuery = query || [name, city].filter(Boolean).join(', ');
  const lq = encodeURIComponent(linkQuery);
  return {
    embed: mapEmbedUrl || `https://www.google.com/maps?q=${q}&z=16&output=embed`,
    directions: linkQuery ? `https://www.google.com/maps/dir/?api=1&destination=${lq}` : null,
    open: linkQuery ? `https://www.google.com/maps/search/?api=1&query=${lq}` : null,
  };
}
