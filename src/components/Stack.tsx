"use client";

import { stack } from "@/lib/content";
import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Stack() {
  const { t } = useLang();

  return (
    <section id="stack" className="mx-auto max-w-5xl px-6 py-28 sm:px-8 sm:py-40">
      <SectionHeading index={stack.index} title={t(stack.heading)} note={t(stack.note)} />

      <dl className="mt-14">
        {stack.groups.map((g, i) => (
          <Reveal key={i} delay={i * 70}>
            <div className="rule grid gap-3 py-6 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-10">
              <dt className="label pt-1">{t(g.label)}</dt>
              <dd className="flex flex-wrap gap-x-5 gap-y-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-[15px] text-muted transition-colors duration-300 hover:text-accent"
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
