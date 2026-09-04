import { useMemo, useState } from "react";
import { GroupStep } from "../components/GroupStep";
import { DanReview } from "../components/DanReview";
import { advanceDanStep, completeDanReview, loadDanProgress, loadProgress } from "../lib/storage";
import { normalizedFactKey } from "../lib/facts";
import { levelToVisualAid } from "../lib/mastery";
import { STEPS_PER_DAN, TOTAL_DANS } from "../lib/dan";
import "./DanPractice.css";

export function DanPractice() {
  const [danProgress, setDanProgress] = useState(() => loadDanProgress());
  const { currentDan, currentStep } = danProgress;

  const visualAid = useMemo(() => {
    if (currentStep > STEPS_PER_DAN) return "dots" as const;
    const progress = loadProgress();
    const p = progress[normalizedFactKey(currentDan, currentStep)];
    return p ? levelToVisualAid(p.level) : ("dots" as const);
  }, [currentDan, currentStep]);

  if (currentDan > TOTAL_DANS) {
    return (
      <div className="dpr-done">
        <p className="dpr-done-title">9のだんまで ぜんぶ たんけんした!</p>
        <p className="dpr-done-sub">「いろいろな見方」や「進み具合」も見てみよう</p>
      </div>
    );
  }

  if (currentStep > STEPS_PER_DAN) {
    return <DanReview dan={currentDan} onNext={() => setDanProgress(completeDanReview())} />;
  }

  return (
    <GroupStep
      key={`${currentDan}-${currentStep}`}
      dan={currentDan}
      step={currentStep}
      visualAid={visualAid}
      onAdvance={() => setDanProgress(advanceDanStep())}
    />
  );
}
