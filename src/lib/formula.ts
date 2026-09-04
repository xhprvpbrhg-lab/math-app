import type { Rect, Split, StrategyTag } from "../types";
import { deriveTerms, segmentsFromCuts } from "./grid";

export interface FormulaLines {
  original: string; // "7 × 8"
  terms: string; // "7 × 5 + 7 × 3"
  products: string; // "35 + 21"
  total: number; // 56
}

export function buildFormula(rect: Rect, split: Split): FormulaLines {
  const terms = deriveTerms(rect, split);
  const total = rect.rows * rect.cols;
  return {
    original: `${rect.rows} × ${rect.cols}`,
    terms: terms.map((t) => `${t.rows} × ${t.cols}`).join(" + "),
    products: terms.map((t) => `${t.rows * t.cols}`).join(" + "),
    total,
  };
}

export function detectStrategyTags(rect: Rect, split: Split, rotated: boolean): StrategyTag[] {
  const tags: StrategyTag[] = [];
  const rowSegments = segmentsFromCuts(rect.rows, split.rowCuts);
  const colSegments = segmentsFromCuts(rect.cols, split.colCuts);
  const hasRowCuts = split.rowCuts.length > 0;
  const hasColCuts = split.colCuts.length > 0;

  if (rotated) tags.push("commute");

  if (hasRowCuts && hasColCuts) {
    tags.push("distributive2d");
    return tags;
  }

  const segments = hasRowCuts ? rowSegments : colSegments;

  if (segments.length === 2 && segments[0] === segments[1]) {
    tags.push("halve");
  }
  if (segments.includes(5)) {
    tags.push("anchor5");
  }
  if (segments.includes(10)) {
    tags.push("anchor10");
  }
  if (segments.length >= 3 && segments.filter((s) => s === 1).length >= segments.length - 1) {
    tags.push("sequential");
  }
  if (tags.length === 0 && segments.length >= 2) {
    tags.push("simple-split");
  }
  return tags;
}
