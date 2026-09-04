import type { MasteryLevel, VisualAidLevel } from "../types";

export function levelToVisualAid(level: MasteryLevel): VisualAidLevel {
  switch (level) {
    case "concrete":
      return "dots";
    case "outline":
      return "outline";
    case "mental":
    case "fluent":
      return "none";
  }
}

export const LEVEL_LABEL: Record<MasteryLevel, string> = {
  concrete: "具体物が必要",
  outline: "枠があれば考えられる",
  mental: "頭の中で分解できる",
  fluent: "即答できる",
};
