#!/usr/bin/env python3
"""
Gera as placas SVG que derivam no fundo do site e aparecem no hover dos projetos.

Cada placa é um diagrama abstrato desenhado para o projeto que representa — grafo de
recuperação para o RAG, fluxo com decisão para o agente de crédito, série temporal para
o Soulstone, e assim por diante. Tudo na paleta do site, traço fino, sem preenchimento
pesado: elas precisam funcionar tanto a 430px derivando no fundo quanto a 332px no hover.

Uso:  python3 scripts/gen-plates.py
Saída: public/plates/*.svg
"""

import math
import pathlib
import random

W, H = 860, 496
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "plates"

BG = "#0c0e13"
DIM = "rgba(255,255,255,0.12)"
MID = "rgba(255,255,255,0.26)"
BRIGHT = "rgba(255,255,255,0.5)"
ACC = "#00e5c0"
ACC_DIM = "rgba(0,229,192,0.32)"


def head(extra=""):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
        f'<rect width="{W}" height="{H}" fill="{BG}"/>{extra}'
    )


def frame():
    """Thin inner rule + corner ticks — gives every plate the same 'instrument' chrome."""
    p = [f'<rect x="18.5" y="18.5" width="{W-37}" height="{H-37}" fill="none" stroke="{DIM}"/>']
    for cx, cy, dx, dy in ((18, 18, 1, 1), (W - 18, 18, -1, 1), (18, H - 18, 1, -1), (W - 18, H - 18, -1, -1)):
        p.append(f'<path d="M{cx} {cy+14*dy}V{cy}H{cx+14*dx}" fill="none" stroke="{ACC_DIM}" stroke-width="1.5"/>')
    return "".join(p)


def grid(step=43, opacity=0.05):
    p = [f'<g stroke="#ffffff" stroke-width="1" opacity="{opacity}">']
    x = step
    while x < W:
        p.append(f'<line x1="{x}" y1="0" x2="{x}" y2="{H}"/>')
        x += step
    y = step
    while y < H:
        p.append(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}"/>')
        y += step
    p.append("</g>")
    return "".join(p)


def tail():
    return "</svg>"


def label(text):
    return (
        f'<text x="34" y="{H-34}" font-family="ui-monospace,monospace" font-size="13" '
        f'letter-spacing="3" fill="{ACC_DIM}">{text}</text>'
    )


# ── plates ────────────────────────────────────────────────────────────────────


def retrieval_graph(rng):
    """RAG: documents on the left feeding a ranked node cluster on the right."""
    p = [head(), grid()]
    # document stack
    for i in range(5):
        y = 110 + i * 58
        p.append(f'<rect x="70" y="{y}" width="118" height="44" fill="none" stroke="{DIM}"/>')
        for l in range(3):
            w = rng.randint(40, 96)
            p.append(f'<line x1="80" y1="{y+12+l*11}" x2="{80+w}" y2="{y+12+l*11}" stroke="{DIM}"/>')
    # cluster
    nodes = [(430 + rng.randint(-70, 70), 120 + i * 52 + rng.randint(-14, 14)) for i in range(6)]
    hub = (690, 248)
    for i, (x, y) in enumerate(nodes):
        p.append(f'<line x1="188" y1="{160+i*46}" x2="{x}" y2="{y}" stroke="{DIM}"/>')
        col = ACC if i in (1, 4) else MID
        p.append(f'<line x1="{x}" y1="{y}" x2="{hub[0]}" y2="{hub[1]}" stroke="{col}" opacity="0.7"/>')
        r = 7 if i in (1, 4) else 4.5
        p.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{BG}" stroke="{ACC if i in (1,4) else MID}" stroke-width="1.5"/>')
    p.append(f'<circle cx="{hub[0]}" cy="{hub[1]}" r="26" fill="none" stroke="{ACC}" stroke-width="1.5"/>')
    p.append(f'<circle cx="{hub[0]}" cy="{hub[1]}" r="40" fill="none" stroke="{ACC_DIM}"/>')
    p += [frame(), label("RETRIEVAL"), tail()]
    return "".join(p)


def decision_flow(rng):
    """Credit agent: a typed graph with a human-in-the-loop branch."""
    p = [head(), grid()]
    boxes = [(90, 210), (270, 130), (270, 290), (470, 210), (660, 130), (660, 290)]
    for i, (x, y) in enumerate(boxes):
        col = ACC if i == 3 else MID
        p.append(f'<rect x="{x}" y="{y}" width="112" height="62" fill="{BG}" stroke="{col}" stroke-width="{1.5 if i==3 else 1}"/>')
        p.append(f'<line x1="{x+16}" y1="{y+24}" x2="{x+70}" y2="{y+24}" stroke="{DIM}"/>')
        p.append(f'<line x1="{x+16}" y1="{y+38}" x2="{x+52}" y2="{y+38}" stroke="{DIM}"/>')
    edges = [(0, 1), (0, 2), (1, 3), (2, 3), (3, 4), (3, 5)]
    for a, b in edges:
        ax, ay = boxes[a][0] + 112, boxes[a][1] + 31
        bx, by = boxes[b][0], boxes[b][1] + 31
        mx = (ax + bx) / 2
        p.append(f'<path d="M{ax} {ay}H{mx}V{by}H{bx}" fill="none" stroke="{MID}" opacity="0.75"/>')
        p.append(f'<circle cx="{bx}" cy="{by}" r="2.5" fill="{ACC_DIM}"/>')
    # interrupt marker
    p.append(f'<circle cx="526" cy="196" r="13" fill="{BG}" stroke="{ACC}" stroke-width="1.5"/>')
    p.append(f'<line x1="526" y1="190" x2="526" y2="198" stroke="{ACC}" stroke-width="2"/>')
    p.append(f'<circle cx="526" cy="203" r="1.6" fill="{ACC}"/>')
    p += [frame(), label("HUMAN-IN-THE-LOOP"), tail()]
    return "".join(p)


def time_series(rng):
    """Soulstone: a price track with a highlighted window."""
    p = [head(), grid()]
    pts, y = [], 300
    for i in range(64):
        y += rng.randint(-26, 24)
        y = max(110, min(390, y))
        pts.append((60 + i * 11.6, y))
    path = "M" + " L".join(f"{x:.1f} {v:.1f}" for x, v in pts)
    p.append(f'<path d="{path}" fill="none" stroke="{MID}" stroke-width="1.5"/>')
    area = path + f" L{pts[-1][0]:.1f} 430 L60 430 Z"
    p.append(f'<path d="{area}" fill="{ACC}" opacity="0.05"/>')
    # highlighted window
    p.append(f'<rect x="430" y="90" width="150" height="340" fill="{ACC}" opacity="0.05"/>')
    p.append(f'<line x1="430" y1="90" x2="430" y2="430" stroke="{ACC_DIM}"/>')
    p.append(f'<line x1="580" y1="90" x2="580" y2="430" stroke="{ACC_DIM}"/>')
    for x, v in pts[32:46:4]:
        p.append(f'<circle cx="{x:.1f}" cy="{v:.1f}" r="3.5" fill="{BG}" stroke="{ACC}" stroke-width="1.5"/>')
    p += [frame(), label("MARKET FEED"), tail()]
    return "".join(p)


def mesh_shield(rng):
    """ShadowMesh: a lattice with an enforcement boundary through it."""
    p = [head()]
    cols, rows = 11, 7
    pts = []
    for r in range(rows):
        for c in range(cols):
            pts.append((78 + c * 70 + (35 if r % 2 else 0), 78 + r * 57))
    for x, y in pts:
        for x2, y2 in pts:
            d = math.hypot(x - x2, y - y2)
            if 0 < d < 76:
                p.append(f'<line x1="{x}" y1="{y}" x2="{x2}" y2="{y2}" stroke="{DIM}"/>')
    for i, (x, y) in enumerate(pts):
        if i % 9 == 3:
            p.append(f'<circle cx="{x}" cy="{y}" r="5" fill="{BG}" stroke="{ACC}" stroke-width="1.5"/>')
        else:
            p.append(f'<circle cx="{x}" cy="{y}" r="2.2" fill="{MID}"/>')
    p.append(f'<path d="M300 40 Q430 248 300 456" fill="none" stroke="{ACC}" stroke-width="1.5" stroke-dasharray="7 6"/>')
    p.append(f'<rect x="0" y="0" width="300" height="{H}" fill="{ACC}" opacity="0.035"/>')
    p += [frame(), label("POLICY BOUNDARY"), tail()]
    return "".join(p)


def hierarchy(rng):
    """Orkestree: a branching tree."""
    p = [head(), grid()]

    def branch(x, y, dx, depth):
        if depth == 0:
            return
        for sign in (-1, 1):
            nx, ny = x + dx, y + sign * (depth * 34)
            col = ACC if depth == 1 and sign > 0 else MID
            p.append(f'<path d="M{x} {y}H{x+dx/2}V{ny}H{nx}" fill="none" stroke="{col}" opacity="0.8"/>')
            p.append(f'<circle cx="{nx}" cy="{ny}" r="{3 if depth>1 else 5}" fill="{BG}" stroke="{col}" stroke-width="1.4"/>')
            branch(nx, ny, dx * 0.82, depth - 1)

    p.append(f'<circle cx="90" cy="248" r="9" fill="{BG}" stroke="{ACC}" stroke-width="1.6"/>')
    branch(90, 248, 150, 3)
    p += [frame(), label("ORCHESTRATION"), tail()]
    return "".join(p)


def spread_bars(rng):
    """RocketzArb: two order books with a spread band between them."""
    p = [head(), grid()]
    for i in range(26):
        x = 70 + i * 28
        h1 = rng.randint(30, 150)
        h2 = rng.randint(30, 150)
        p.append(f'<rect x="{x}" y="{210-h1}" width="15" height="{h1}" fill="{MID}" opacity="0.5"/>')
        p.append(f'<rect x="{x}" y="286" width="15" height="{h2}" fill="{ACC}" opacity="0.22"/>')
    p.append(f'<rect x="60" y="216" width="{W-120}" height="64" fill="{ACC}" opacity="0.06"/>')
    p.append(f'<line x1="60" y1="248" x2="{W-60}" y2="248" stroke="{ACC}" stroke-dasharray="5 5"/>')
    for x in (230, 470, 690):
        p.append(f'<circle cx="{x}" cy="248" r="6" fill="{BG}" stroke="{ACC}" stroke-width="1.6"/>')
    p += [frame(), label("SPREAD"), tail()]
    return "".join(p)


def contours(rng):
    """Auriculo: nested organic contours, like a reference map."""
    p = [head()]
    cx, cy = 430, 248
    for ring in range(9):
        r = 34 + ring * 24
        pts = []
        for a in range(0, 361, 12):
            rad = math.radians(a)
            wob = 1 + 0.16 * math.sin(rad * 3 + ring * 0.7) + 0.08 * math.sin(rad * 5)
            pts.append(f"{cx + math.cos(rad)*r*wob*1.5:.1f} {cy + math.sin(rad)*r*wob:.1f}")
        col = ACC if ring == 4 else DIM
        p.append(f'<polygon points="{" ".join(pts)}" fill="none" stroke="{col}" opacity="{0.9 if ring==4 else 1}"/>')
    for i in range(7):
        a = math.radians(i * 51)
        r = 60 + i * 26
        p.append(f'<circle cx="{cx + math.cos(a)*r*1.5:.1f}" cy="{cy + math.sin(a)*r:.1f}" r="3.5" fill="{BG}" stroke="{ACC}" stroke-width="1.3"/>')
    p += [frame(), label("REFERENCE MAP"), tail()]
    return "".join(p)


def gauges(rng):
    """FPSBooster: telemetry dials and a frame-time trace."""
    p = [head(), grid()]
    for i, cx in enumerate((190, 430, 670)):
        cy = 190
        p.append(f'<circle cx="{cx}" cy="{cy}" r="76" fill="none" stroke="{DIM}"/>')
        p.append(f'<circle cx="{cx}" cy="{cy}" r="60" fill="none" stroke="{DIM}"/>')
        for t in range(0, 271, 15):
            a = math.radians(135 + t)
            p.append(
                f'<line x1="{cx+math.cos(a)*62:.1f}" y1="{cy+math.sin(a)*62:.1f}" '
                f'x2="{cx+math.cos(a)*74:.1f}" y2="{cy+math.sin(a)*74:.1f}" stroke="{MID}"/>'
            )
        end = math.radians(135 + rng.randint(80, 250))
        p.append(f'<line x1="{cx}" y1="{cy}" x2="{cx+math.cos(end)*54:.1f}" y2="{cy+math.sin(end)*54:.1f}" stroke="{ACC}" stroke-width="2"/>')
        p.append(f'<circle cx="{cx}" cy="{cy}" r="4" fill="{ACC}"/>')
    pts, y = [], 370
    for i in range(60):
        y += rng.randint(-14, 14)
        y = max(320, min(420, y))
        pts.append(f"{60 + i*12.3:.1f} {y}")
    p.append(f'<polyline points="{" ".join(pts)}" fill="none" stroke="{MID}" stroke-width="1.4"/>')
    p += [frame(), label("TELEMETRY"), tail()]
    return "".join(p)


def ledger(rng):
    """Agente Bancário: a validated ledger — rows, checks, one flagged."""
    p = [head()]
    p.append(f'<line x1="60" y1="96" x2="{W-60}" y2="96" stroke="{MID}"/>')
    for i in range(7):
        y = 130 + i * 44
        p.append(f'<line x1="60" y1="{y+28}" x2="{W-60}" y2="{y+28}" stroke="{DIM}"/>')
        for c, x in enumerate((78, 250, 430, 600)):
            w = rng.randint(60, 130) if c < 3 else 70
            p.append(f'<rect x="{x}" y="{y+8}" width="{w}" height="9" fill="{MID}" opacity="0.32"/>')
        if i == 3:
            p.append(f'<rect x="60" y="{y-2}" width="{W-120}" height="34" fill="{ACC}" opacity="0.07"/>')
            p.append(f'<circle cx="{W-84}" cy="{y+14}" r="10" fill="{BG}" stroke="{ACC}" stroke-width="1.6"/>')
            p.append(f'<line x1="{W-84}" y1="{y+8}" x2="{W-84}" y2="{y+16}" stroke="{ACC}" stroke-width="1.8"/>')
        else:
            p.append(
                f'<path d="M{W-90} {y+14}l5 6 9-11" fill="none" stroke="{ACC_DIM}" stroke-width="1.8" '
                f'stroke-linecap="round" stroke-linejoin="round"/>'
            )
    p += [frame(), label("SCHEMA-VALIDATED"), tail()]
    return "".join(p)


PLATES = {
    "retrieval": retrieval_graph,
    "flow": decision_flow,
    "series": time_series,
    "mesh": mesh_shield,
    "tree": hierarchy,
    "spread": spread_bars,
    "contours": contours,
    "gauges": gauges,
    "ledger": ledger,
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for i, (name, fn) in enumerate(PLATES.items()):
        svg = fn(random.Random(1000 + i))  # seeded: same output every run
        path = OUT / f"{name}.svg"
        path.write_text(svg, encoding="utf-8")
        print(f"{path.name:16} {len(svg):>6} bytes")


if __name__ == "__main__":
    main()
