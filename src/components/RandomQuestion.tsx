import { useRef, useState } from "react";
import type { AttemptLog } from "../types";
import { AnswerInput } from "./AnswerInput";
import { GroupArray } from "./GroupArray";
import { NumberLine } from "./NumberLine";
import { recordAttempt } from "../lib/storage";
import "./RandomQuestion.css";

interface Props {
  a: number;
  b: number;
  onNext: () => void;
}

export function RandomQuestion({ a, b, onNext }: Props) {
  const [hintLevel, setHintLevel] = useState(0);
  const [phase, setPhase] = useState<"solving" | "answered">("solving");
  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(null);
  const startTimeRef = useRef(Date.now());
  const total = a * b;

  const showHint = () => setHintLevel((h) => Math.min(h + 1, 3));

  const handleSubmit = (value: number) => {
    const correct = value === total;
    const responseTimeMs = Date.now() - startTimeRef.current;

    const log: AttemptLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      factA: a,
      factB: b,
      correct,
      responseTimeMs,
      visualAidLevel: hintLevel >= 2 ? "dots" : "none",
      usedGrid: hintLevel >= 2,
      split: null,
      splitSignature: null,
      rotated: false,
      strategyTags: [],
      instantAnswer: false,
    };

    recordAttempt(log);
    setFeedback({ correct });
    setPhase("answered");
  };

  return (
    <div className="rq-container">
      <p className="rq-question">
        {a} × {b} = ?
      </p>

      {phase === "solving" && (
        <>
          <AnswerInput onSubmit={handleSubmit} />

          {hintLevel >= 1 && (
            <p className="rq-hint-text">
              {a}のまとまりが{b}こ
            </p>
          )}
          {hintLevel >= 2 && <GroupArray dan={a} visibleGroups={b} highlightLastGroup={false} mode="dots" />}
          {hintLevel >= 3 && (
            <NumberLine values={Array.from({ length: b + 1 }, (_, i) => a * i)} hideLastValue />
          )}

          {hintLevel < 3 && (
            <button type="button" className="rq-hint-btn" onClick={showHint}>
              ヒントをみる
            </button>
          )}
        </>
      )}

      {phase === "answered" && feedback && (
        <div className={`rq-feedback ${feedback.correct ? "is-correct" : "is-wrong"}`}>
          <p className="rq-feedback-text">{feedback.correct ? "せいかい!" : "おしい"}</p>
          <p className="rq-equation">
            {a} × {b} = {total}
          </p>
          <GroupArray dan={a} visibleGroups={b} highlightLastGroup={false} mode="dots" />
          <NumberLine values={Array.from({ length: b + 1 }, (_, i) => a * i)} />
          <button type="button" className="rq-next-btn" onClick={onNext}>
            つぎのもんだいへ
          </button>
        </div>
      )}
    </div>
  );
}
