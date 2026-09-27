"use client";

import { useState } from "react";
import { contact, profile } from "@/lib/content";
import Carimbo from "./Carimbo";
import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const links = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
];

export default function Contact() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked (insecure context / permissions) — the mailto link still works
    }
  }

  return (
    <section id="contato" className="mx-auto max-w-5xl px-6 py-28 sm:px-8 sm:py-40">
      <SectionHeading index={contact.index} title={t(contact.heading)} />

      <Reveal className="mt-14">
        <h3 className="max-w-2xl font-display text-[clamp(1.9rem,5.5vw,3.4rem)] leading-[1.08] font-light tracking-[-0.03em] text-ink">
          {t(contact.title)}
        </h3>
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-muted">{t(contact.body)}</p>
      </Reveal>

      <Reveal delay={120} className="mt-12">
        <a
          href={`mailto:${profile.email}`}
          className="underline-grow font-display text-[clamp(1.1rem,3.2vw,1.9rem)] font-light text-ink transition-colors hover:text-accent"
        >
          {profile.email}
        </a>
        <button
          onClick={copyEmail}
          className="label ml-5 transition-colors hover:!text-accent"
          aria-label={t(contact.emailLabel)}
        >
          {copied ? `✓ ${t(contact.copied)}` : t(contact.copy)}
        </button>
      </Reveal>

      <Reveal delay={200} className="mt-14 flex flex-wrap gap-x-10 gap-y-3">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer noopener"
            className="underline-grow font-mono text-sm text-muted transition-colors hover:text-accent"
          >
            {l.label} ↗
          </a>
        ))}
      </Reveal>

      <footer>
        <Carimbo />
      </footer>
    </section>
  );
}
