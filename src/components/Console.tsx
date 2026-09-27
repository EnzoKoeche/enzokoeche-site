"use client";

import { useEffect, useRef, useState } from "react";
import { console_, profile } from "@/lib/content";
import { useLang } from "./LangProvider";

type Line = { text: string; tone: "dim" | "ink" | "accent" | "warn" };

type GhEvent = {
  type: string;
  repo: { name: string };
  created_at: string;
  payload: { action?: string; size?: number; ref_type?: string; pull_request?: { merged?: boolean } };
};

/**
 * O console do hero. As quatro primeiras linhas são o boot; o resto é
 * atividade pública real do GitHub, lida no navegador do visitante, sem
 * chave e sem backend. Falhou a leitura? A falha é impressa como falha.
 */
export default function Console() {
  const { lang, t } = useLang();
  const [lines, setLines] = useState<Line[]>([]);
  const events = useRef<Line[] | null | undefined>(undefined); // undefined = carregando, null = falhou

  useEffect(() => {
    const ac = new AbortController();

    const rel = (iso: string) => {
      const mins = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
      if (mins < 1) return t(console_.ago.now);
      if (mins < 60) return `${mins} ${t(console_.ago.m)}`;
      if (mins < 48 * 60) return `${Math.round(mins / 60)} ${t(console_.ago.h)}`;
      return `${Math.round(mins / 1440)} ${t(console_.ago.d)}`;
    };

    const describe = (e: GhEvent): Line | null => {
      const repo = e.repo.name.replace(`${profile.handle}/`, "");
      const when = rel(e.created_at);
      const ev = console_.events;
      switch (e.type) {
        case "PushEvent": {
          const n = e.payload.size ?? 1;
          const word = n === 1 ? t(console_.commit) : t(console_.commits);
          return { text: `[${when}] ${t(ev.push)} → ${repo} · ${n} ${word}`, tone: "ink" };
        }
        case "PullRequestEvent":
          if (e.payload.action === "closed" && e.payload.pull_request?.merged)
            return { text: `[${when}] ${t(ev.prMerged)} → ${repo}`, tone: "accent" };
          if (e.payload.action === "opened")
            return { text: `[${when}] ${t(ev.prOpened)} → ${repo}`, tone: "ink" };
          return null;
        case "CreateEvent":
          if (e.payload.ref_type === "repository")
            return { text: `[${when}] ${t(ev.created)} → ${repo}`, tone: "ink" };
          return null;
        case "IssuesEvent":
          return { text: `[${when}] ${t(ev.issue)} → ${repo}`, tone: "dim" };
        default:
          return null;
      }
    };

    fetch(`https://api.github.com/users/${profile.handle}/events/public?per_page=30`, {
      signal: ac.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: GhEvent[]) => {
        const seen = new Set<string>();
        const out: Line[] = [];
        for (const e of data) {
          const line = describe(e);
          if (!line || seen.has(line.text)) continue;
          seen.add(line.text);
          out.push(line);
          if (out.length >= 5) break;
        }
        events.current = out.length ? out : null;
      })
      .catch(() => {
        if (!ac.signal.aborted) events.current = null;
      });

    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refaz junto com o idioma
  }, [lang]);

  // O boot digita linha a linha; a telemetria entra quando as duas coisas
  // estiverem prontas: a fila do boot esvaziou e o fetch respondeu.
  useEffect(() => {
    const boot = console_.boot[lang];
    let i = 0;
    let alive = true;

    const step = () => {
      if (!alive) return;
      if (i < boot.length) {
        const text = boot[i];
        setLines((prev) => [
          ...prev,
          { text, tone: text.startsWith("$") ? "accent" : text.startsWith("[··]") ? "dim" : "ink" },
        ]);
        i += 1;
        setTimeout(step, 280);
        return;
      }
      if (events.current === undefined) {
        setTimeout(step, 200);
        return;
      }
      const tail: Line[] =
        events.current === null
          ? [{ text: t(console_.offline), tone: "warn" }]
          : events.current;
      // a linha [··] de "lendo…" é substituída pelo resultado
      setLines((prev) => [...prev.slice(0, -1), ...tail]);
    };

    const kick = setTimeout(() => {
      setLines([]);
      step();
    }, 900);
    return () => {
      alive = false;
      clearTimeout(kick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const tones: Record<Line["tone"], string> = {
    dim: "text-faint",
    ink: "text-muted",
    accent: "text-accent",
    warn: "text-ink italic",
  };

  return (
    <div
      className="enter carimbo w-full max-w-2xl"
      style={{ animationDelay: "940ms" }}
      aria-label={t(console_.title)}
    >
      <div className="carimbo-cell flex items-center justify-between border-b px-4 py-2">
        <span className="carimbo-label">{t(console_.title)}</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          <span className="carimbo-label !text-accent">github</span>
        </span>
      </div>
      <div className="min-h-[176px] px-4 py-3 font-mono text-[12px] leading-[1.9]">
        {lines.map((l, i) => (
          <p key={i} className={tones[l.tone]}>
            {l.text}
          </p>
        ))}
        <p className="text-accent">
          <span className="animate-pulse">▌</span>
        </p>
      </div>
    </div>
  );
}
