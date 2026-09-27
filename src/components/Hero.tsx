"use client";

import { hero, profile } from "@/lib/content";
import Console from "./Console";
import { useLang } from "./LangProvider";
import { DecodeText, RotatingText } from "./TextFx";

export default function Hero() {
  const { lang, t } = useLang();

  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col justify-center px-6 pt-28 pb-20 sm:px-8"
    >
      <div className="enter label flex flex-wrap items-center gap-4">
        <span className="h-px w-8 bg-faint" />
        {t(profile.location)}
        <span className="hidden text-[10px] tracking-[0.18em] text-faint/80 sm:inline">
          25°26′S 49°16′W · ALT 934 M
        </span>
      </div>

      <h1 className="enter mt-8 font-display text-[clamp(2.6rem,9vw,6.5rem)] leading-[0.95] font-light tracking-[-0.03em]">
        <span className="block text-ink">
          <DecodeText text="Enzo Koeche" delay={200} speed={38} />
        </span>
        <span className="block text-muted">
          <DecodeText text="Castagna" delay={480} speed={38} />
        </span>
      </h1>

      <div
        className="enter mt-10 grid gap-x-12 gap-y-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
        style={{ animationDelay: "620ms" }}
      >
        <div>
          <p className="label mb-2">{lang === "pt" ? "Função" : "Role"}</p>
          <p className="font-mono text-sm text-ink">{t(profile.role)}</p>

          <p className="label mt-6 mb-2">{lang === "pt" ? "Foco" : "Focus"}</p>
          <p className="flex items-baseline gap-2 font-mono text-sm text-accent">
            <RotatingText key={lang} words={hero.rotating[lang]} />
          </p>
        </div>

        <p className="max-w-md text-[17px] leading-relaxed text-muted">{t(profile.tagline)}</p>
      </div>

      <div
        className="enter mt-14 flex flex-wrap items-center gap-x-8 gap-y-4"
        style={{ animationDelay: "780ms" }}
      >
        <a
          href="#projetos"
          className="underline-grow font-mono text-sm text-ink transition-colors hover:text-accent"
        >
          {t(hero.ctaWork)} ↓
        </a>
        <a
          href="#contato"
          className="underline-grow font-mono text-sm text-muted transition-colors hover:text-accent"
        >
          {t(hero.ctaContact)}
        </a>
        <span className="label flex items-center gap-2.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          {t(profile.available)}
        </span>
      </div>

      <div className="mt-14">
        <Console />
      </div>
    </section>
  );
}
