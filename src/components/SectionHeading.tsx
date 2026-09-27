"use client";

import Reveal from "./Reveal";

export default function SectionHeading({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note?: string;
}) {
  return (
    <Reveal className="rule pt-6">
      <div className="flex items-baseline justify-between gap-6">
        <h2 className="font-display text-[clamp(1.5rem,3.4vw,2.1rem)] font-light tracking-[-0.02em] text-ink">
          {title}
        </h2>
        <span className="label shrink-0">{index}</span>
      </div>
      {note && <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">{note}</p>}
    </Reveal>
  );
}
