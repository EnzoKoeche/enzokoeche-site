"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** stagger in ms */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span";
};

/**
 * Reveals on scroll by toggling a class on the node directly. Keeping this out
 * of React state means zero re-renders while scrolling a page full of them.
 */
export default function Reveal({ children, delay = 0, className = "", as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    io.observe(el);

    // Dead-man switch: if the observer never reports (throttled frames, an
    // engine quirk, a tab restored from bfcache), show the content anyway.
    // Nothing on this page is worth hiding behind a scroll effect.
    const failsafe = setTimeout(() => el.classList.add("is-in"), 2500);

    return () => {
      clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
