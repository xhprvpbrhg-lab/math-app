import type { Rect, Split, Term } from "../types";

// 境界位置の配列から、0とnを含む境界点の並びを作る
// 例: n=8, cuts=[5] -> [0, 5, 8]
export function boundsFromCuts(n: number, cuts: number[]): number[] {
  const sorted = [...new Set(cuts)].filter((c) => c > 0 && c < n).sort((a, b) => a - b);
  return [0, ...sorted, n];
}

// 境界位置の配列から、連続する区間長の配列を作る
// 例: n=8, cuts=[5] -> [5, 3]
export function segmentsFromCuts(n: number, cuts: number[]): number[] {
  const bounds = boundsFromCuts(n, cuts);
  const segments: number[] = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    segments.push(bounds[i + 1] - bounds[i]);
  }
  return segments;
}

// 座標 index (0始まり) がどのブロックに属するかを返す
export function blockIndexForPosition(bounds: number[], index: number): number {
  for (let i = 0; i < bounds.length - 1; i++) {
    if (index >= bounds[i] && index < bounds[i + 1]) return i;
  }
  return bounds.length - 2;
}

// 分割から部分長方形(数式の項)を行優先順で導出する
export function deriveTerms(rect: Rect, split: Split): Term[] {
  const rowSegments = segmentsFromCuts(rect.rows, split.rowCuts);
  const colSegments = segmentsFromCuts(rect.cols, split.colCuts);
  const terms: Term[] = [];
  rowSegments.forEach((r, ri) => {
    colSegments.forEach((c, ci) => {
      terms.push({ rows: r, cols: c, rowIndex: ri, colIndex: ci });
    });
  });
  return terms;
}

export function isSplitEmpty(split: Split): boolean {
  return split.rowCuts.length === 0 && split.colCuts.length === 0;
}

export function toggleCut(cuts: number[], pos: number): number[] {
  return cuts.includes(pos) ? cuts.filter((c) => c !== pos) : [...cuts, pos].sort((a, b) => a - b);
}

// Gallery で「使ったことのある分割」を識別するための正規化署名
export function splitSignature(rect: Rect, split: Split, rotated: boolean): string {
  const rowSegments = segmentsFromCuts(rect.rows, split.rowCuts).sort((a, b) => a - b);
  const colSegments = segmentsFromCuts(rect.cols, split.colCuts).sort((a, b) => a - b);
  return `${rotated ? "R" : "N"}:${rowSegments.join(",")}|${colSegments.join(",")}`;
}
