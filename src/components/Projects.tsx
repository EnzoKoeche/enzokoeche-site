"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile, projects, work, type Project } from "@/lib/content";
import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * A floating plate that trails the cursor showing whatever row is hovered.
 * Position is written straight to the node on each pointer event — putting
 * coordinates in state would re-render the whole list on every mouse move.
 */
function HoverPlate({ project }: { project: Project | null }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.13;
      pos.current.y += (target.current.y - pos.current.y) * 0.13;
      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      raf.current = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX + 28;
      target.current.y = e.clientY - 96;
      if (!started.current) {
        // jump to the cursor the first time so the plate doesn't fly in from 0,0
        started.current = true;
        pos.current = { ...target.current };
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30 hidden [@media(pointer:fine)]:block"
    >
      <div
        className={`relative h-[192px] w-[332px] overflow-hidden rounded-sm ring-1 ring-white/12 transition-all duration-500 ${
          project?.image ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {projects
          .filter((p) => p.image)
          .map((p) => (
            // eslint-disable-next-line @next/next/no-img-element -- vector art
            <img
              key={p.slug}
              src={p.image as string}
              alt=""
              aria-hidden="true"
              loading="eager"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                project?.slug === p.slug ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
      </div>
    </div>
  );
}

function Row({
  p,
  index,
  onEnter,
  onLeave,
}: {
  p: Project;
  index: number;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rule group"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-baseline gap-5 py-7 text-left sm:gap-8"
      >
        <span className="label w-6 shrink-0 pt-1">{String(index + 1).padStart(2, "0")}</span>

        <span className="min-w-0 flex-1">
          <span className="block font-display text-[clamp(1.35rem,3.4vw,2.2rem)] leading-tight font-light tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-accent">
            {p.name}
          </span>
          <span className="mt-2 block font-mono text-[12px] tracking-wide text-faint">
            {p.tags.join("  ·  ")}
          </span>
        </span>

        <span className="label shrink-0 pt-1 tabular-nums">{p.year}</span>
        <span
          className={`shrink-0 pt-1 font-mono text-sm text-faint transition-transform duration-300 ${
            open ? "rotate-45" : "group-hover:translate-x-1"
          }`}
        >
          +
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ${
          open ? "grid-rows-[1fr] pb-9 opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-8 pl-11 sm:pl-14 lg:grid-cols-[1.35fr_1fr]">
            <div>
              <p className="text-[16px] leading-relaxed text-muted">{t(p.detail)}</p>

              <ul className="mt-5 space-y-1.5">
                {p.highlights[lang].map((h) => (
                  <li key={h} className="flex gap-3 font-mono text-[13px] text-faint">
                    <span className="text-accent">—</span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2">
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline-grow font-mono text-[13px] text-ink transition-colors hover:text-accent"
                  >
                    {p.demoLabel ? t(p.demoLabel) : "Demo"} ↗
                  </a>
                )}
                {p.repo && (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline-grow font-mono text-[13px] text-muted transition-colors hover:text-accent"
                  >
                    {t(work.repoLabel)} ↗
                  </a>
                )}
              </div>
            </div>

            {/* on touch there is no hover plate, so the screenshot lives here */}
            {p.image && (
              <div className="relative overflow-hidden rounded-sm ring-1 ring-white/10 [@media(pointer:fine)]:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- vector art */}
                <img src={p.image} alt="" aria-hidden="true" className="block h-auto w-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { t } = useLang();
  const [hovered, setHovered] = useState<Project | null>(null);

  const clear = useCallback(() => setHovered(null), []);

  return (
    <section id="projetos" className="mx-auto max-w-5xl px-6 py-28 sm:px-8 sm:py-40">
      <SectionHeading index={work.index} title={t(work.heading)} note={t(work.note)} />

      <div className="mt-12">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={Math.min(i, 4) * 60}>
            <Row p={p} index={i} onEnter={() => setHovered(p)} onLeave={clear} />
          </Reveal>
        ))}
        <div className="rule" />
      </div>

      <Reveal delay={80} className="mt-10">
        <a
          href={`${profile.github}?tab=repositories`}
          target="_blank"
          rel="noreferrer noopener"
          className="underline-grow font-mono text-sm text-muted transition-colors hover:text-accent"
        >
          {t(work.moreLabel)} ↗
        </a>
      </Reveal>

      <HoverPlate project={hovered} />
    </section>
  );
}
