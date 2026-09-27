/**
 * Formato do traçado de assinatura.
 *
 * Um traço é um array plano de coordenadas alternadas [x,y,x,y,…] em inteiros,
 * normalizadas para uma caixa BOX_W x BOX_H. Plano em vez de pares aninhados
 * porque `[12,40,13,41]` custa metade de `[[12,40],[13,41]]` em JSON, e uma
 * assinatura tem centenas de pontos.
 */

export const BOX_W = 600;
export const BOX_H = 200;

export type Strokes = number[][];

/** Teto espelhado do CHECK constraint da coluna. */
export const MAX_SERIALIZED = 24000;

export function serialize(strokes: Strokes): string {
  return JSON.stringify(strokes);
}

export function parse(raw: string | null): Strokes | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    // Confia, mas verifica: isto vem do banco, onde qualquer visitante escreveu.
    const clean = data
      .filter((s): s is number[] => Array.isArray(s) && s.length >= 2 && s.length % 2 === 0)
      .map((s) => s.filter((n) => typeof n === "number" && Number.isFinite(n)))
      .filter((s) => s.length >= 2 && s.length % 2 === 0);
    return clean.length ? clean : null;
  } catch {
    return null;
  }
}

/**
 * Converte um traço em path SVG suavizado.
 *
 * Liga os pontos por curvas quadráticas cujos extremos são os pontos médios
 * entre amostras consecutivas — o traço passa "por dentro" das amostras em vez
 * de fazer bico em cada uma, que é o que faz o desenho parecer caneta e não
 * polilinha de mouse.
 */
export function toPath(flat: number[]): string {
  const n = flat.length / 2;
  if (n === 0) return "";

  const x = (i: number) => flat[i * 2];
  const y = (i: number) => flat[i * 2 + 1];

  // Um ponto só: um pingo. Sem isso, tocar sem arrastar não deixa marca.
  if (n === 1) return `M${x(0)} ${y(0)}l0.1 0`;
  if (n === 2) return `M${x(0)} ${y(0)}L${x(1)} ${y(1)}`;

  let d = `M${x(0)} ${y(0)}`;
  for (let i = 1; i < n - 1; i++) {
    const mx = (x(i) + x(i + 1)) / 2;
    const my = (y(i) + y(i + 1)) / 2;
    d += `Q${x(i)} ${y(i)} ${round(mx)} ${round(my)}`;
  }
  d += `L${x(n - 1)} ${y(n - 1)}`;
  return d;
}

function round(v: number) {
  return Math.round(v * 10) / 10;
}

/**
 * Caixa que contém a tinta, com folga.
 *
 * Cada pessoa assina num canto diferente do pad, então exibir sempre a caixa
 * cheia 600x200 deixaria assinaturas pequenas e desalinhadas entre si. Recortar
 * pela tinta faz todas ocuparem o mesmo espaço visual.
 */
export function inkBox(strokes: Strokes, pad = 12) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const s of strokes) {
    for (let i = 0; i < s.length; i += 2) {
      if (s[i] < minX) minX = s[i];
      if (s[i] > maxX) maxX = s[i];
      if (s[i + 1] < minY) minY = s[i + 1];
      if (s[i + 1] > maxY) maxY = s[i + 1];
    }
  }

  if (!Number.isFinite(minX)) return { x: 0, y: 0, w: BOX_W, h: BOX_H };

  const x = Math.max(0, minX - pad);
  const y = Math.max(0, minY - pad);
  return {
    x,
    y,
    // largura/altura mínimas evitam divisão por zero num traço perfeitamente
    // reto (uma linha horizontal tem altura 0)
    w: Math.max(20, Math.min(BOX_W, maxX + pad) - x),
    h: Math.max(20, Math.min(BOX_H, maxY + pad) - y),
  };
}

/** Comprimento total do traço — usado para cronometrar a animação de escrita. */
export function inkLength(strokes: Strokes): number {
  let total = 0;
  for (const s of strokes) {
    for (let i = 2; i < s.length; i += 2) {
      total += Math.hypot(s[i] - s[i - 2], s[i + 1] - s[i - 1]);
    }
  }
  return total;
}
