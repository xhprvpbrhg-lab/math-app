import type { Rect, Split } from "../types";
import { splitSignature } from "./grid";

export interface Representation {
  id: string;
  label: string;
  rect: Rect;
  split: Split;
  rotated: boolean;
}

// 九九の1事実に対する定番の見方を並べる。先頭ほど基本、徐々に開示していく前提の順序
export function canonicalRepresentations(a: number, b: number): Representation[] {
  const rows = a;
  const cols = b;
  const bigger = Math.max(a, b);
  const biggerIsCols = cols === bigger;

  const reps: Representation[] = [
    { id: "plain", label: `${rows} 個が ${cols} 組`, rect: { rows, cols }, split: { rowCuts: [], colCuts: [] }, rotated: false },
    { id: "rotate", label: `${cols} 個が ${rows} 組(入れかえ)`, rect: { rows: cols, cols: rows }, split: { rowCuts: [], colCuts: [] }, rotated: true },
  ];

  const half1 = Math.floor(bigger / 2);
  reps.push({
    id: "halve",
    label: "半分に分ける",
    rect: { rows, cols },
    split: biggerIsCols ? { rowCuts: [], colCuts: [half1] } : { rowCuts: [half1], colCuts: [] },
    rotated: false,
  });

  if (bigger > 5) {
    reps.push({
      id: "anchor5",
      label: "5のまとまりを作る",
      rect: { rows, cols },
      split: biggerIsCols ? { rowCuts: [], colCuts: [5] } : { rowCuts: [5], colCuts: [] },
      rotated: false,
    });
  }

  return reps;
}

export function representationSignature(rep: Representation): string {
  return splitSignature(rep.rect, rep.split, rep.rotated);
}

// 今使った見方とは違うものを1つだけ提案する
export function pickAlternative(a: number, b: number, usedSignature: string | null): Representation | null {
  const candidates = canonicalRepresentations(a, b).filter((r) => r.id !== "plain");
  const alt = candidates.find((r) => representationSignature(r) !== usedSignature);
  return alt ?? null;
}
