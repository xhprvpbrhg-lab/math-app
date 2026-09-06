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
  | "simple-split" // その他の単純な1回分割
  | "skip-count"; // まとまりを1個ずつ積み上げて数えた(段の練習)

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

// 段の進み具合。1つの段(dan)は factA=dan, factB=1..9 の9問で構成される
export interface DanProgress {
  currentDan: number; // 1-9。9を終えてレビューも終わると10になり「全段クリア」
  currentStep: number; // 1-9が出題中の問題番号。10になったらその段のレビュー画面
  completedDans: number[];
}

// たし算・ひき算は九九ほど細かい習熟度を追わず、種類ごとの練習回数だけを覚えておく
export type ArithmeticCategory = "add-no-carry" | "add-carry" | "sub-no-borrow" | "sub-borrow";

export interface ArithmeticCategoryStat {
  attempts: number;
  correct: number;
}

export type ArithmeticProgress = Record<ArithmeticCategory, ArithmeticCategoryStat>;
