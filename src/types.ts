// 九九の1事実を rows × cols の長方形として表す
export interface Rect {
  rows: number;
  cols: number;
}

// 境界タップによる分割: rowCuts/colCuts は 1..(n-1) の境界位置の集合
export interface Split {
  rowCuts: number[];
  colCuts: number[];
}

// 分割によって導出された部分長方形1つ分(数式の1項に対応)
export interface Term {
  rows: number;
  cols: number;
  rowIndex: number; // 行方向の何番目のブロックか(0始まり)
  colIndex: number; // 列方向の何番目のブロックか(0始まり)
}

export type VisualAidLevel = "dots" | "outline" | "none";

export type MasteryLevel = "concrete" | "outline" | "mental" | "fluent";

export type StrategyTag =
  | "commute" // 回転(交換法則)を使った
  | "halve" // ちょうど半分に分けた
  | "anchor5" // 5を基準に分けた
  | "anchor10" // 10を基準に分けた
  | "sequential" // 1ずつのような細かい逐次分割
  | "distributive2d" // 縦横同時に分割(2次元展開)
  | "simple-split"; // その他の単純な1回分割

export interface AttemptLog {
  id: string;
  timestamp: number;
  factA: number; // 表示された問題の第1因数
  factB: number; // 表示された問題の第2因数
  correct: boolean;
  responseTimeMs: number;
  visualAidLevel: VisualAidLevel;
  usedGrid: boolean; // 分割操作を1回でも行ったか
  split: Split | null;
  splitSignature: string | null;
  rotated: boolean;
  strategyTags: StrategyTag[];
  instantAnswer: boolean; // 視覚補助なしかつ短時間で正答
}

export interface FactProgress {
  key: string; // `${min}x${max}` に正規化
  level: MasteryLevel;
  attempts: number;
  correctStreak: number;
  lastPracticed: number;
  discoveredStrategies: StrategyTag[];
  discoveredSplitSignatures: string[]; // Gallery用: 使ったことのある分割の署名
}

export interface TodaySet {
  date: string; // YYYY-MM-DD
  factKeys: string[]; // `${a}x${b}` 表示順そのまま
}
