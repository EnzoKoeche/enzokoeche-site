"use client";

import { carimbo, footer, nav, profile } from "@/lib/content";
import { useLang } from "./LangProvider";

/**
 * O carimbo da prancha: o quadro de título que fecha todo desenho técnico,
 * aqui fechando o site. A revisão é o commit real do build — o rodapé conta
 * a verdade sobre qual versão está no ar.
 */
export default function Carimbo() {
  const { t } = useLang();
  const total = String(nav.length).padStart(2, "0");

  const rev = process.env.NEXT_PUBLIC_REV ?? "rascunho";
  const date = process.env.NEXT_PUBLIC_BUILD_DATE ?? "";

  return (
    <div className="carimbo mt-24">
      <div className="carimbo-cell grid border-b sm:grid-cols-[1fr_auto]">
        <div className="px-4 py-3">
          <p className="carimbo-label">{t(carimbo.projeto)}</p>
          <p className="carimbo-value mt-1 !text-ink">{t(carimbo.projetoValue)}</p>
        </div>
        <div className="carimbo-cell border-t px-4 py-3 sm:border-t-0 sm:border-l">
          <p className="carimbo-label">{t(carimbo.folha)}</p>
          <p className="carimbo-value mt-1 tabular-nums">
            {total}/{total}
          </p>
        </div>
      </div>

      <div className="carimbo-cell grid grid-cols-2 border-b sm:grid-cols-4">
        <div className="px-4 py-3">
          <p className="carimbo-label">{t(carimbo.conteudo)}</p>
          <p className="carimbo-value mt-1">{t(carimbo.conteudoValue)}</p>
        </div>
        <div className="carimbo-cell border-l px-4 py-3">
          <p className="carimbo-label">{t(carimbo.local)}</p>
          <p className="carimbo-value mt-1">{carimbo.localValue}</p>
        </div>
        <div className="carimbo-cell px-4 py-3 sm:border-l">
          <p className="carimbo-label">{t(carimbo.data)}</p>
          <p className="carimbo-value mt-1 tabular-nums">{date}</p>
        </div>
        <div className="carimbo-cell border-l px-4 py-3">
          <p className="carimbo-label">
            {t(carimbo.rev)} · {t(carimbo.escala)}
          </p>
          <p className="carimbo-value mt-1">
            <span className="text-accent">{rev}</span> · {carimbo.escalaValue}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="carimbo-label !normal-case !tracking-[0.08em]">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="carimbo-label !normal-case !tracking-[0.08em]">{t(footer.built)}</p>
      </div>
    </div>
  );
}
