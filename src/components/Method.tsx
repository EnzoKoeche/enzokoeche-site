"use client";

import { method } from "@/lib/content";
import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Method() {
  const { t } = useLang();

  return (
    <section id="metodo" className="mx-auto max-w-5xl px-6 py-28 sm:px-8 sm:py-40">
      <SectionHeading index={method.index} title={t(method.heading)} note={t(method.note)} />

      <ol className="mt-14">
        {method.principles.map((p, i) => (
          <Reveal as="li" key={i} delay={Math.min(i, 3) * 80}>
            <div className="rule grid gap-3 py-8 sm:grid-cols-[minmax(0,3rem)_1fr] sm:gap-8">
              <span className="label pt-1.5 tabular-nums">{String(i + 1).padStart(2, "0")}</span>

              <div>
                <h3 className="max-w-2xl font-display text-[clamp(1.15rem,2.6vw,1.6rem)] leading-snug font-light tracking-[-0.01em] text-ink">
                  {t(p.title)}
                </h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{t(p.body)}</p>

                {/* o princípio só vale se houver código atrás dele */}
                <a
                  href={`#${p.slug}`}
                  className="underline-grow mt-4 inline-block font-mono text-[12px] tracking-wide text-accent"
                >
                  {t(p.proof)} ↓
                </a>
              </div>
            </div>
          </Reveal>
        ))}
        <li className="rule" />
      </ol>
    </section>
  );
}
