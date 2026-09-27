"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "⟟⟊⟠⌭⍟⏃⌰⋔⟒⌇⏁⋏⍜⌿⟁⎐⌁⟒⍀⏚▚▞◈◉▓▒░";

function scrambleChar() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * Alien glyphs that resolve, left to right, into the real string.
 * The scramble is written straight to the DOM node — a per-frame setState on
 * every headline would be a lot of React work for something purely visual.
 * The readable text stays in the accessibility tree the whole time.
 */
export function DecodeText({
  text,
  className = "",
  delay = 0,
  speed = 34,
  play = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  play?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!play || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = text;
      return;
    }

    const chars = Array.from(text);
    let settled = 0;
    let raf = 0;
    let last = 0;

    const scrambled = () =>
      chars.map((c, i) => (c === " " ? " " : i < settled ? c : scrambleChar())).join("");

    node.textContent = chars.map((c) => (c === " " ? " " : scrambleChar())).join("");

    const step = (now: number) => {
      if (now - last >= speed) {
        last = now;
        settled += 1;
        node.textContent = scrambled();
        if (settled >= chars.length) return;
      }
      raf = requestAnimationFrame(step);
    };

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, delay);

    // rAF can stall (background tab, throttled frames, headless). Never leave
    // a name rendered as alien glyphs — guarantee the real text lands.
    const settle = setTimeout(
      () => {
        node.textContent = text;
        cancelAnimationFrame(raf);
      },
      delay + chars.length * speed + 900,
    );

    return () => {
      clearTimeout(timer);
      clearTimeout(settle);
      cancelAnimationFrame(raf);
    };
  }, [text, delay, speed, play]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {/* server-rendered as the real text, then taken over by the effect */}
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

/** Cycles through phrases with a decode transition between them. */
export function RotatingText({
  words,
  className = "",
  interval = 2600,
}: {
  words: string[];
  className?: string;
  interval?: number;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => setTick((k) => k + 1), interval);
    return () => clearInterval(id);
  }, [words, interval]);

  // longest word reserves the width so the layout never jumps
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const wordIndex = tick % words.length;

  return (
    <span className={`relative inline-grid ${className}`}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {longest}
      </span>
      <DecodeText
        key={tick}
        text={words[wordIndex]}
        speed={26}
        className="col-start-1 row-start-1 whitespace-nowrap text-left"
      />
    </span>
  );
}
