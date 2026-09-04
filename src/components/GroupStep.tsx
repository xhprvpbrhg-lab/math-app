import { useRef, useState } from "react";
import type { AttemptLog, FactProgress, VisualAidLevel } from "../types";
import { GroupArray } from "./GroupArray";
import { AnswerInput } from "./AnswerInput";
import { FormulaTrace } from "./FormulaTrace";
import { pickAlternative } from "../lib/representations";
import { recordAttempt } from "../lib/storage";
import "./GroupStep.css";

interface Props {
  dan: number;
  step: number;
  visualAid: VisualAidLevel;
  onRecorded?: (log: AttemptLog, progress: FactProgress) => void;
  onAdvance: () => void;
}

export function GroupStep({ dan, step, visualAid, onRecorded, onAdvance }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState<"solving" | "answered">("solving");
  const [feedback, setFeedback] = useState<{ correct: boolean; total: number } | null>(null);
  const startTimeRef = useRef(Date.now());

  const prevTotal = dan * (step - 1);
  const total = dan * step;

  const reveal = () => setRevealed(true);

  const handleSubmit = (value: number) => {
    const correct = value === total;
    const responseTimeMs = Date.now() - startTimeRef.current;

    const log: AttemptLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      factA: dan,
      factB: step,
      correct,
      responseTimeMs,
      visualAidLevel: visualAid,
      usedGrid: true,
      split: null,
      splitSignature: null,
      rotated: false,
      strategyTags: ["skip-count"],
      instantAnswer: false,
    };

    const progress = recordAttempt(log);
    setFeedback({ correct, total });
    setPhase("answered");
    onRecorded?.(log, progress);
  };

  const alt = phase === "answered" ? pickAlternative(dan, step, null) : null;

  return (
    <div className="gs-container">
      <p className="gs-progress">
        {dan}のだん ・ {step} / 9問目
      </p>

      {!revealed && (
        <>
          {step > 1 && visualAid !== "none" && (
            <GroupArray dan={dan} visibleGroups={step - 1} highlightLastGroup={false} mode={visualAid} />
          )}
          {step > 1 && <p className="gs-running-total">{prevTotal}</p>}
          <button type="button" className="gs-add-btn" onClick={reveal}>
            {dan}のまとまりを もう1つ ふやす
          </button>
        </>
      )}

      {revealed && (
        <>
          {visualAid !== "none" && (
            <GroupArray dan={dan} visibleGroups={step} highlightLastGroup mode={visualAid} />
          )}

          {phase === "solving" && (
            <>
              <p className="gs-prompt">ぜんぶで いくつ?</p>
              <AnswerInput onSubmit={handleSubmit} />
            </>
          )}

          {phase === "answered" && feedback && (
            <div className={`gs-feedback ${feedback.correct ? "is-correct" : "is-wrong"}`}>
              <p className="gs-feedback-text">{feedback.correct ? "せいかい" : `こたえは ${feedback.total}`}</p>
              <p className="gs-equation">
                {prevTotal} + {dan} = {total}
              </p>
              <p className="gs-equation gs-equation--mul">
                {dan} × {step} = {total}
              </p>

              {alt && (
                <div className="gs-alt">
                  <p className="gs-alt-label">こんな見方もあるよ: {alt.label}</p>
                  <FormulaTrace rect={alt.rect} split={alt.split} />
                </div>
              )}

              <button type="button" className="gs-next-btn" onClick={onAdvance}>
                つぎへ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
