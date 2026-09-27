"use client";

import { about, journey } from "@/lib/content";
import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function About() {
  const { lang, t } = useLang();

  return (
    <section id="sobre" className="mx-auto max-w-5xl px-6 py-28 sm:px-8 sm:py-40">
      <SectionHeading index={about.index} title={t(about.heading)} />

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div className="space-y-6">
          {about.body[lang].map((p, i) => (
            <Reveal key={i} delay={i * 120}>
              <p className="text-[17px] leading-[1.75] text-muted">{p}</p>
            </Reveal>
          ))}
        </div>

        <dl className="space-y-0 self-start">
          {about.stats.map((s, i) => (
            <Reveal key={s.value} delay={200 + i * 120}>
              <div className="rule flex items-baseline justify-between gap-6 py-4">
                <dt className="label max-w-[10rem] leading-snug">{t(s.label)}</dt>
                <dd className="font-display text-2xl font-light text-ink tabular-nums">
                  {s.value}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>

      {/* trajetória: a mesma história, contada pelo que foi construído */}
      <div className="mt-24 sm:mt-32">
        <Reveal>
          <p className="label mb-10">{t(journey.label)}</p>
        </Reveal>

        <ol>
          {journey.steps.map((step, i) => (
            <Reveal as="li" key={i} delay={Math.min(i, 3) * 70}>
              <div className="rule grid gap-2 py-7 sm:grid-cols-[minmax(0,5rem)_1fr] sm:gap-10">
                <span className="label pt-1 tabular-nums">{step.year}</span>
                <div>
                  <h3 className="font-display text-lg font-light text-ink sm:text-xl">
                    {t(step.title)}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
                    {t(step.body)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
          <li className="rule" />
        </ol>
      </div>
    </section>
  );
}
