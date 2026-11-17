# Wedding Invitation — cinematic 3D experience

Mobile-first, light-mode Indian Hindu wedding invitation built with React + Vite, GSAP/ScrollTrigger, Lenis, Framer Motion and CSS 3D.

## Run

```bash
npm install
npm run dev      # http://localhost:5173  (also exposed on your LAN for phone testing)
npm run build    # production build in /dist
npm run preview
```

## Personalise — everything lives in `src/data/weddingConfig.js`

| What | Key |
| --- | --- |
| Names | `couple.bride.name`, `couple.groom.name`, `couple.displayOrder` |
| Events | `events[]` — `date` `'YYYY-MM-DD'`, `time` `'HH:mm'` IST, optional `onwards` and `nightOf` (Reception is commented out there) |
| Countdown target | `countdownEventId` (the Muhurtham: 3 Dec 2026, 4:45 AM IST) |
| Venue | `venue.name`, `venue.city`, `venue.address`, `venue.coordinates` `{ lat, lng }` |
| Banquet hall photo | put the file in `public/images/venue/`, set `venue.backgroundImage` (+ optional `backgroundImageWebp`) |
| Music | MP3 in `public/audio/`, listed in `music.tracks` (the first one plays); its `credit` is printed at the end of the page. Now: Bach's "Jesu, Joy" by Kevin MacLeod, CC BY 4.0 |
| Gallery | put photos in `public/images/gallery/`, set each `gallery[].src` |
| Blessing / thank-you / families | `invitationCard`, `closing` (Telugu invocation alternative is in a comment) |

Nothing personal is invented. Placeholders show until the real details are filled in.

## Structure

```
src/
  data/weddingConfig.js          single source of truth
  lib/                           gsap setup, Lenis↔ScrollTrigger, audio engine, motion helpers
  hooks/                         useCountdown, useScrollAnimation (section reveals / scrubbed scenes)
  components/
    invitation/                  envelope, gate-fold card, opening timeline, scroll flight
    venue/                       illustrated banquet hall (parallax layers) + lazy Google Map
    countdown/ events/ gallery/ closing/
    animations/FloatingPetals    canvas petal/leaf fall
    decor/                       procedural SVG flowers, mandala, toran, diya, kalash, wax seal
    shared/                      music toggle, section heading, floral divider
```

## Notes

- `fall` (npm) was evaluated and skipped: it is a Node control-flow library, not a falling-leaf effect. Petals come from a lightweight canvas system instead.
- `@studio-freight/lenis` is deprecated; the maintained `lenis` package is used.
- Three.js was not added: CSS 3D transforms + GSAP give the envelope, card and flight their depth at a fraction of the mobile cost.
- Reduced-motion users get the same content with motion minimised; scrolling is never locked for longer than the opening animation.
