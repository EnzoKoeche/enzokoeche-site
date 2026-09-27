import { plates } from "@/lib/content";

/**
 * The background: generated instrument plates drifting sideways behind everything.
 * Three tracks at different speeds and directions give depth without asking for
 * attention — they sit under a vignette and read as texture until you look.
 *
 * Server-rendered, animated purely in CSS. No JS runs for this at all.
 */

// Line art carries far less ink than a screenshot, so these run much hotter
// than a photographic layer would to land at the same perceived presence.
const TRACKS = [
  { rows: 0, anim: "animate-drift-a", top: "3%", opacity: 1, scale: 1.05 },
  { rows: 1, anim: "animate-drift-b", top: "36%", opacity: 0.72, scale: 0.8 },
  { rows: 2, anim: "animate-drift-c", top: "66%", opacity: 0.92, scale: 0.95 },
];

function Track({
  images,
  anim,
  top,
  opacity,
  scale,
}: {
  images: string[];
  anim: string;
  top: string;
  opacity: number;
  scale: number;
}) {
  // duplicated once so the -50% translation lands on identical content
  const doubled = [...images, ...images];

  return (
    <div className="absolute left-0 w-full" style={{ top }}>
      <div className={`flex w-max gap-8 ${anim}`} style={{ opacity }}>
        {doubled.map((src, i) => (
          /* Vector art: the image optimizer has nothing to do for an SVG, and
             routing through it would reintroduce IntersectionObserver-based lazy
             loading on a layer that is on screen at every scroll position. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="block shrink-0 rounded-sm ring-1 ring-white/12"
            style={{ width: `${430 * scale}px`, height: `${248 * scale}px` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function PlateDrift() {
  const per = Math.ceil(plates.length / 3);
  const groups = [plates.slice(0, per), plates.slice(per, per * 2), plates.slice(per * 2)];

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* tilted plane: the drift reads as motion through space, not a slideshow */}
      <div className="absolute inset-[-14%]" style={{ transform: "rotate(-6deg)" }}>
        {TRACKS.map((t) => (
          <Track
            key={t.top}
            images={groups[t.rows].length ? groups[t.rows] : plates}
            anim={t.anim}
            top={t.top}
            opacity={t.opacity}
            scale={t.scale}
          />
        ))}
      </div>

      {/* Legibility stack. The wash is lighter than the vignette: plates stay
          visible near the edges, text stays readable in the middle where the
          copy actually sits. */}
      <div className="absolute inset-0 bg-bg/20" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 72% 58% at 44% 48%, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.72) 48%, rgba(10,10,10,0.1) 100%)",
        }}
      />
      <div className="grain absolute inset-0 opacity-[0.16]" />
    </div>
  );
}
