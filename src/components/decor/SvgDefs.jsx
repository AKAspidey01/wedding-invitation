/** Shared gradients for every decorative SVG on the page (rendered once). */
export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="g-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a77a2f" />
          <stop offset="0.45" stopColor="#e6c987" />
          <stop offset="0.6" stopColor="#f3e0ab" />
          <stop offset="1" stopColor="#b08234" />
        </linearGradient>
        <linearGradient id="g-gold-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c49a4a" stopOpacity="0" />
          <stop offset="0.25" stopColor="#c49a4a" />
          <stop offset="0.5" stopColor="#ecd49a" />
          <stop offset="0.75" stopColor="#c49a4a" />
          <stop offset="1" stopColor="#c49a4a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="g-rose-petal" cx="50%" cy="80%" r="75%">
          <stop offset="0" stopColor="#e9a3aa" />
          <stop offset="1" stopColor="#fbdcd8" />
        </radialGradient>
        <radialGradient id="g-rose-inner" cx="50%" cy="85%" r="80%">
          <stop offset="0" stopColor="#c66d7d" />
          <stop offset="1" stopColor="#efb2b6" />
        </radialGradient>
        <radialGradient id="g-jasmine" cx="50%" cy="90%" r="90%">
          <stop offset="0" stopColor="#f3ead2" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#fffdf6" />
        </radialGradient>
        <linearGradient id="g-lotus" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fdeef0" />
          <stop offset="0.6" stopColor="#f2b6c2" />
          <stop offset="1" stopColor="#dc8196" />
        </linearGradient>
        <linearGradient id="g-leaf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#6d8e5c" />
          <stop offset="1" stopColor="#b5c99f" />
        </linearGradient>
        <linearGradient id="g-leaf-deep" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#58784a" />
          <stop offset="1" stopColor="#97b283" />
        </linearGradient>
        <linearGradient id="g-brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8f6424" />
          <stop offset="0.35" stopColor="#e3c27a" />
          <stop offset="0.55" stopColor="#f6e2ad" />
          <stop offset="1" stopColor="#9c6e2b" />
        </linearGradient>
        <radialGradient id="g-flame" cx="50%" cy="75%" r="65%">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset="0.45" stopColor="#ffd56e" />
          <stop offset="1" stopColor="#f08a24" />
        </radialGradient>
        <radialGradient id="g-flame-glow">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g-wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#dc8b97" />
          <stop offset="0.45" stopColor="#ad4b5e" />
          <stop offset="1" stopColor="#7a2c3f" />
        </radialGradient>
        <radialGradient id="g-glow-warm">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.6" stopColor="#fbefd9" stopOpacity="0.7" />
          <stop offset="1" stopColor="#f6e3c4" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
