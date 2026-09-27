"use client";

import { ticker } from "@/lib/content";
import { useLang } from "./LangProvider";

/**
 * A fita técnica: um letreiro contínuo que corre sob o hero, como a fita de
 * identificação de uma prancha. Duplicado uma vez para o loop de -50% fechar
 * nos mesmos pixels.
 */
export default function Ticker() {
  const { lang } = useLang();
  const items = ticker[lang];

  return (
    <div
      aria-hidden="true"
      className="absolute right-0 bottom-0 left-0 overflow-hidden border-y border-[rgba(140,185,255,0.25)] bg-bg/60 py-2.5 backdrop-blur-sm"
    >
      <div className="ticker flex w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {items.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-6 pr-6 font-mono text-[11px] tracking-[0.28em] whitespace-nowrap text-muted uppercase"
              >
                {item}
                <span className="text-accent">✚</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
