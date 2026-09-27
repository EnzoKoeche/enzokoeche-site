"use client";

import { education, experience, resume, type TimelineItem } from "@/lib/content";
import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function Timeline({ items }: { items: TimelineItem[] }) {
  const { lang, t } = useLang();

  return (
    <ol>
      {items.map((item, i) => (
        <Reveal as="li" key={i} delay={i * 100}>
          <div className="rule py-6">
            <div className="flex items-baseline justify-between gap-6">
              <h4 className="font-display text-lg font-light text-ink">{t(item.role)}</h4>
              <span className="label shrink-0">{t(item.period)}</span>
            </div>
            <p className="mt-1 font-mono text-[13px] text-accent">{t(item.org)}</p>
            <ul className="mt-4 space-y-2">
              {item.bullets[lang].map((b) => (
                <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                  <span className="text-faint">—</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

export default function Resume() {
  const { t } = useLang();

  return (
    <section id="curriculo" className="mx-auto max-w-5xl px-6 py-28 sm:px-8 sm:py-40">
      <SectionHeading index={resume.index} title={t(resume.heading)} />

      <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="label mb-2">{t(resume.experienceLabel)}</p>
          </Reveal>
          <Timeline items={experience} />
        </div>

        <div>
          <Reveal>
            <p className="label mb-2">{t(resume.educationLabel)}</p>
          </Reveal>
          <Timeline items={education} />

          <Reveal delay={160}>
            <button
              onClick={() => window.print()}
              className="underline-grow mt-8 font-mono text-sm text-muted transition-colors hover:text-accent"
            >
              {t(resume.print)}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
