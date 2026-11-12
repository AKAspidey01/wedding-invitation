import { OrnamentRule } from '../decor/Ornaments';

export default function SectionHeading({ script, eyebrow, id }) {
  return (
    <header className="section-heading">
      <h2 id={id} className="section-heading__script r-head">
        {script}
      </h2>
      {eyebrow && <span className="section-heading__eyebrow r-head">{eyebrow}</span>}
      <OrnamentRule className="section-heading__ornament r-head-rule" />
    </header>
  );
}
