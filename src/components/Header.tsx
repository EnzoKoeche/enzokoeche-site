"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, ui } from "@/lib/content";
import { useLang } from "./LangProvider";

export default function Header() {
  const { toggle, t } = useLang();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.3] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // A navegação é toda por âncora da home. Em outras rotas (ex.: /admin) esses
  // links não levam a lugar nenhum, então o header simplesmente não aparece.
  if (pathname !== "/") return null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? "border-b border-white/8 bg-bg/80 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 sm:px-8">
          <a href="#top" className="label !text-ink transition-opacity hover:opacity-60">
            EKC
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`label transition-colors ${
                  active === n.id ? "!text-accent" : "hover:!text-ink"
                }`}
              >
                {t(n.label)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button
              onClick={toggle}
              aria-label={t(ui.langAria)}
              className="label transition-colors hover:!text-accent"
            >
              {t(ui.langToggle)}
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t(ui.close) : t(ui.menu)}
              aria-expanded={open}
              className="flex h-8 w-6 flex-col items-end justify-center gap-[5px] md:hidden"
            >
              <span
                className={`h-px bg-ink transition-all duration-300 ${
                  open ? "w-5 translate-y-[3px] rotate-45" : "w-5"
                }`}
              />
              <span
                className={`h-px bg-ink transition-all duration-300 ${
                  open ? "w-5 -translate-y-[3px] -rotate-45" : "w-3.5"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-400 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-bg/95 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <nav className="relative flex h-full flex-col justify-center gap-2 px-10">
          {nav.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-5 py-3 font-display text-3xl font-light text-ink"
            >
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
              {t(n.label)}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
