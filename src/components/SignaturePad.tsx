"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOX_H, BOX_W, type Strokes } from "@/lib/signature";

/**
 * Pad de assinatura. Desenha com mouse, caneta ou dedo.
 *
 * O canvas trabalha em pixels de tela para o traço sair suave, mas o que sai
 * daqui são coordenadas normalizadas para a caixa BOX_W x BOX_H — assim a
 * assinatura vale em qualquer largura de tela, tanto ao assinar quanto ao exibir.
 */
export default function SignaturePad({
  onChange,
  clearLabel,
  undoLabel,
  hint,
}: {
  onChange: (strokes: Strokes) => void;
  clearLabel: string;
  undoLabel: string;
  hint: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Strokes>([]);
  const currentRef = useRef<number[] | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const [hasInk, setHasInk] = useState(false);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { w, h } = sizeRef.current;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "#f2f3f5";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const all = currentRef.current
      ? [...strokesRef.current, currentRef.current]
      : strokesRef.current;

    for (const s of all) {
      const n = s.length / 2;
      if (n === 0) continue;

      const px = (i: number) => (s[i * 2] / BOX_W) * w;
      const py = (i: number) => (s[i * 2 + 1] / BOX_H) * h;

      ctx.beginPath();
      if (n === 1) {
        ctx.arc(px(0), py(0), 1, 0, Math.PI * 2);
        ctx.fillStyle = "#f2f3f5";
        ctx.fill();
        continue;
      }

      ctx.moveTo(px(0), py(0));
      for (let i = 1; i < n - 1; i++) {
        ctx.quadraticCurveTo(px(i), py(i), (px(i) + px(i + 1)) / 2, (py(i) + py(i + 1)) / 2);
      }
      ctx.lineTo(px(n - 1), py(n - 1));
      ctx.stroke();
    }
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    sizeRef.current = { w: rect.width, h: rect.height };
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }, [redraw]);

  useEffect(() => {
    resize();
    const ro = new ResizeObserver(resize);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [resize]);

  function toBox(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * BOX_W;
    const y = ((e.clientY - rect.top) / rect.height) * BOX_H;
    return [
      Math.round(Math.max(0, Math.min(BOX_W, x))),
      Math.round(Math.max(0, Math.min(BOX_H, y))),
    ];
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    const [x, y] = toBox(e);
    currentRef.current = [x, y];
    redraw();
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const cur = currentRef.current;
    if (!cur) return;

    const [x, y] = toBox(e);
    const lastX = cur[cur.length - 2];
    const lastY = cur[cur.length - 1];

    // Descarta micro-movimentos: menos pontos, traço igual, payload menor.
    if (Math.hypot(x - lastX, y - lastY) < 2) return;

    cur.push(x, y);
    redraw();
  }

  function onUp() {
    const cur = currentRef.current;
    currentRef.current = null;
    if (!cur) return;

    strokesRef.current = [...strokesRef.current, cur];
    setHasInk(true);
    onChange(strokesRef.current);
    redraw();
  }

  function clear() {
    strokesRef.current = [];
    currentRef.current = null;
    setHasInk(false);
    onChange([]);
    redraw();
  }

  function undo() {
    strokesRef.current = strokesRef.current.slice(0, -1);
    const still = strokesRef.current.length > 0;
    setHasInk(still);
    onChange(strokesRef.current);
    redraw();
  }

  return (
    <div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={onUp}
          // touch-action:none impede o navegador de rolar a página enquanto
          // o dedo desenha — sem isso, assinar no celular é impossível.
          className="block h-[168px] w-full cursor-crosshair touch-none rounded-sm border border-white/12 bg-white/[0.02] transition-colors hover:border-white/20"
        />

        {/* linha de assinatura, como num documento */}
        <div className="pointer-events-none absolute inset-x-6 bottom-9 border-b border-dashed border-white/12" />

        {!hasInk && (
          <p className="label pointer-events-none absolute inset-x-0 bottom-3.5 text-center">
            {hint}
          </p>
        )}
      </div>

      <div className="mt-2 flex gap-5">
        <button
          type="button"
          onClick={undo}
          disabled={!hasInk}
          className="label transition-colors hover:!text-accent disabled:!text-white/15"
        >
          {undoLabel}
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={!hasInk}
          className="label transition-colors hover:!text-accent disabled:!text-white/15"
        >
          {clearLabel}
        </button>
      </div>
    </div>
  );
}
