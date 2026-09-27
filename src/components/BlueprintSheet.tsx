/**
 * A prancha: malha milimetrada, moldura de folha e marcas de canto (mira de
 * registro), como numa prancha de desenho técnico. A página inteira passa a
 * ser lida como uma folha de projeto em escala.
 *
 * Server-rendered, zero JS — é tudo CSS e quatro SVGs inline.
 */

function Crosshair({ className }: { className: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      aria-hidden="true"
      className={`absolute ${className}`}
    >
      <line x1="8.5" y1="0" x2="8.5" y2="17" stroke="rgba(125,162,255,0.55)" strokeWidth="1" />
      <line x1="0" y1="8.5" x2="17" y2="8.5" stroke="rgba(125,162,255,0.55)" strokeWidth="1" />
      <circle cx="8.5" cy="8.5" r="4" fill="none" stroke="rgba(125,162,255,0.35)" strokeWidth="1" />
    </svg>
  );
}

export default function BlueprintSheet() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      {/* malha da prancha, sob tudo */}
      <div className="bp-grid absolute inset-0" />

      {/* moldura da folha — só onde há margem de sobra para ela */}
      <div className="absolute inset-2.5 hidden border border-[rgba(125,162,255,0.16)] sm:block" />

      {/* miras de registro nos quatro cantos */}
      <div className="hidden sm:block">
        <Crosshair className="top-[3px] left-[3px]" />
        <Crosshair className="top-[3px] right-[3px]" />
        <Crosshair className="bottom-[3px] left-[3px]" />
        <Crosshair className="bottom-[3px] right-[3px]" />
      </div>
    </div>
  );
}
