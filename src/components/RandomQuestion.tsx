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

type Phase = "solving" | "missed" | "correct" | "revealed";

export function RandomQuestion({ a, b, onNext }: Props) {
  const [hintLevel, setHintLevel] = useState(0);
  const [phase, setPhase] = useState<Phase>("solving");
  const startTimeRef = useRef(Date.now());
  const total = a * b;
  const prevTotal = a * (b - 1);

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
    setPhase(correct ? "correct" : "missed");
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

      {phase === "missed" && (
        <div className="rq-feedback is-missed">
          <p className="rq-feedback-text">おしい!</p>
          <p className="rq-retry-prompt">ヒントを見ながら もういちど?</p>
          <div className="rq-choice-row">
            <button type="button" className="rq-retry-btn" onClick={() => setPhase("solving")}>
              もういちど
            </button>
            <button type="button" className="rq-reveal-btn" onClick={() => setPhase("revealed")}>
              こたえをみる
            </button>
          </div>
        </div>
      )}

      {phase === "correct" && (
        <div className="rq-feedback is-correct">
          <p className="rq-feedback-text">せいかい!</p>
          <p className="rq-equation">
            {a} × {b} = {total}
          </p>
          <p className="rq-recap-line">
            {a}ずつ {b}こで {total}
          </p>
          <GroupArray dan={a} visibleGroups={b} highlightLastGroup={false} mode="dots" />
          <NumberLine values={Array.from({ length: b + 1 }, (_, i) => a * i)} />
          <button type="button" className="rq-next-btn" onClick={onNext}>
            つぎのもんだいへ
          </button>
        </div>
      )}

      {phase === "revealed" && (
        <div className="rq-feedback is-revealed">
          <p className="rq-equation">
            {a} × {b} = {total}
          </p>
          <p className="rq-recap-line">
            {prevTotal}に {a}をたすと {total}
          </p>
          <p className="rq-recap-line">
            {a}のまとまりが{b}こで {total}
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
