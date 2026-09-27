"use client";

import { useEffect, useRef } from "react";

/**
 * Um facho quente que segue o cursor sobre a prancha fria — o holofote de
 * inspeção. Escreve transform direto no nó via rAF; nada de re-render.
 * Sem ponteiro fino (touch) o componente não faz nada e fica invisível.
 */
export default function MouseGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const target = { x: -900, y: -900 };
    const pos = { x: -900, y: -900 };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.09;
      pos.y += (target.y - pos.y) * 0.09;
      el.style.transform = `translate3d(${pos.x - 450}px, ${pos.y - 450}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      el.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 -z-10 h-[900px] w-[900px] opacity-0 transition-opacity duration-700"
      style={{
        background:
          "radial-gradient(circle closest-side, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 45%, transparent 70%)",
      }}
    />
  );
}
