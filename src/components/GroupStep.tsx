import { useRef, useState } from "react";
import type { AttemptLog, FactProgress, VisualAidLevel } from "../types";
import { GroupArray } from "./GroupArray";
import { SkipCountTrack } from "./SkipCountTrack";
import { AnswerInput } from "./AnswerInput";
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

  return (
    <div className="gs-container">
      <p className="gs-dan-label">{dan}のだん</p>
      <SkipCountTrack dan={dan} step={step} answered={phase === "answered"} />

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
