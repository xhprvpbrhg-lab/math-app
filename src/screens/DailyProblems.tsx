import { useMemo, useState } from "react";
import { ProblemCard } from "../components/ProblemCard";
import { ensureTodaySet, loadProgress } from "../lib/storage";
import { parseFactKey } from "../lib/facts";
import { levelToVisualAid } from "../lib/mastery";
import "./DailyProblems.css";

export function DailyProblems() {
  const [todaySet] = useState(() => ensureTodaySet());
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const currentKey = todaySet.factKeys[index];
  const [factA, factB] = useMemo(() => (currentKey ? parseFactKey(currentKey) : [0, 0]), [currentKey]);

  const initialVisualAid = useMemo(() => {
    if (!currentKey) return "dots" as const;
    const progress = loadProgress();
    const [a, b] = parseFactKey(currentKey);
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    const p = progress[`${min}x${max}`];
    return p ? levelToVisualAid(p.level) : ("dots" as const);
  }, [currentKey]);

  if (index >= todaySet.factKeys.length) {
    return (
      <div className="dp-done">
        <p className="dp-done-title">今日はここまで!</p>
        <p className="dp-done-sub">
          {todaySet.factKeys.length}問中 {correctCount}問 せいかい
        </p>
      </div>
    );
  }

  return (
    <div className="dp-screen">
      <p className="dp-progress">
        {index + 1} / {todaySet.factKeys.length}
      </p>
      <ProblemCard
        key={`${currentKey}-${index}`}
        factA={factA}
        factB={factB}
        initialVisualAid={initialVisualAid}
        onRecorded={(log) => {
          if (log.correct) setCorrectCount((c) => c + 1);
        }}
        onNext={() => setIndex((i) => i + 1)}
      />
    </div>
  );
}
