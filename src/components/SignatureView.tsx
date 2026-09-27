"use client";

import { inkBox, toPath, type Strokes } from "@/lib/signature";

/**
 * Exibe uma assinatura desenhada.
 *
 * Quando `animate` está ligado, cada traço se escreve na ordem em que foi feito.
 * O truque é `pathLength="1"`: o SVG normaliza o comprimento do path, então
 * dasharray/dashoffset funcionam sem eu precisar medir a geometria real.
 */
export default function SignatureView({
  strokes,
  animate = false,
  className = "",
}: {
  strokes: Strokes;
  animate?: boolean;
  className?: string;
}) {
  // Cronograma calculado antes de renderizar: cada traço começa quando o
  // anterior está quase terminando, então a escrita flui em vez de engasgar.
  const timeline = strokes.reduce<{ d: string; dur: number; delay: number }[]>((acc, s) => {
    const dur = Math.min(1.1, 0.18 + (s.length / 2) * 0.012);
    const prev = acc[acc.length - 1];
    const delay = prev ? prev.delay + prev.dur * 0.85 : 0;
    return [...acc, { d: toPath(s), dur, delay }];
  }, []);

  const box = inkBox(strokes);
  // A espessura acompanha o recorte: sem isso, uma assinatura pequena ampliada
  // sairia com traço grosso demais e outra larga, fina demais.
  const width = 2.2 * (box.w / 380);

  return (
    <svg
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      // encostada à esquerda, como assinatura em papel
      preserveAspectRatio="xMinYMid meet"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={Math.max(1.4, Math.min(3.4, width))}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="assinatura"
    >
      {timeline.map((s, i) => (
        <path
          key={i}
          d={s.d}
          pathLength={1}
          style={
            animate
              ? {
                  strokeDasharray: 1,
                  // repouso visível; `backwards` mantém o traço escondido
                  // apenas durante o atraso, antes da animação começar
                  strokeDashoffset: 0,
                  animation: `sig-draw ${s.dur}s ease-out ${s.delay}s backwards`,
                }
              : undefined
          }
        />
      ))}
    </svg>
  );
}
