"use client";

import { useMemo, useRef, useState } from "react";
import { ask } from "@/lib/content";
import { dossier } from "@/lib/dossier";
import { buildIndex, search, type Hit } from "@/lib/retrieval";
import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type Entry = { query: string; hits: Hit[] };

/**
 * O agente local: pergunta entra, BM25 recupera do dossiê, resposta sai com
 * fonte e score — ou com a recusa honesta. Tudo no navegador do visitante.
 */
export default function Ask() {
  const { lang, t } = useLang();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const logRef = useRef<HTMLDivElement | null>(null);

  const index = useMemo(() => buildIndex(dossier), []);

  function run(q: string) {
    const query = q.trim();
    if (!query) return;
    setEntries((prev) => [...prev.slice(-4), { query, hits: search(index, query) }]);
    setValue("");
    // o log cresce para baixo; mantém a última resposta à vista
    requestAnimationFrame(() => {
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  return (
    <section id="perguntar" className="mx-auto max-w-5xl px-6 py-28 sm:px-8 sm:py-40">
      <SectionHeading index={ask.index} title={t(ask.heading)} note={t(ask.note)} />

      <Reveal delay={100} className="mt-12">
        <div className="carimbo">
          <div className="carimbo-cell flex items-center justify-between border-b px-4 py-2">
            <span className="carimbo-label">{t(ask.heading)}</span>
            <span className="carimbo-label">bm25 · in-browser</span>
          </div>

          <div
            ref={logRef}
            className="max-h-[420px] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed"
          >
            {entries.length === 0 && (
              <p className="text-faint">{`// ${t(ask.how)}`}</p>
            )}

            {entries.map((e, i) => (
              <div key={i} className={i > 0 ? "carimbo-cell mt-5 border-t pt-5" : ""}>
                <p className="text-ink">
                  <span className="text-accent">{"> "}</span>
                  {e.query}
                </p>

                {e.hits.length === 0 ? (
                  <p className="mt-2 text-ink italic">{t(ask.notFound)}</p>
                ) : (
                  <div className="mt-2 space-y-3">
                    <p className="text-muted">{e.hits[0].chunk.text[lang]}</p>
                    <p className="text-faint">
                      {t(ask.sourceLabel)}:{" "}
                      <a
                        href={e.hits[0].chunk.href}
                        target={e.hits[0].chunk.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer noopener"
                        className="underline-grow text-accent"
                      >
                        {e.hits[0].chunk.source[lang]}
                      </a>{" "}
                      · {t(ask.scoreLabel)} {e.hits[0].score.toFixed(2)}
                      {e.hits.length > 1 && (
                        <>
                          {"  ·  "}
                          {t(ask.relatedLabel)}:{" "}
                          {e.hits.slice(1).map((h, j) => (
                            <span key={h.chunk.id}>
                              {j > 0 && ", "}
                              <a
                                href={h.chunk.href}
                                target={h.chunk.href.startsWith("http") ? "_blank" : undefined}
                                rel="noreferrer noopener"
                                className="underline-grow"
                              >
                                {h.chunk.source[lang]}
                              </a>
                            </span>
                          ))}
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(value);
            }}
            className="carimbo-cell flex items-center gap-3 border-t px-4 py-3"
          >
            <span className="font-mono text-accent">{">"}</span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t(ask.placeholder)}
              aria-label={t(ask.heading)}
              className="w-full bg-transparent font-mono text-[14px] text-ink outline-none placeholder:text-faint"
            />
          </form>
        </div>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="label">{t(ask.suggestionsLabel)}:</span>
          {ask.suggestions[lang].map((s) => (
            <button
              key={s}
              onClick={() => run(s)}
              className="folha cursor-pointer !normal-case !tracking-[0.04em] transition-colors hover:!text-accent hover:!border-accent/40"
            >
              {s}
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
