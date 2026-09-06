import { useMemo, useRef, useState } from "react";
import { planSubtraction } from "../lib/arithmetic";
import { recordArithmeticAttempt } from "../lib/arithmeticStorage";
import { VerticalAnswerInput } from "./VerticalAnswerInput";
import { PlaceBlocks } from "./PlaceBlocks";
import "./ArithmeticQuestion.css";

interface Props {
  a: number;
  b: number;
  onNext: () => void;
  onResult?: (correct: boolean) => void;
}

type Phase = "solving" | "missed" | "correct" | "revealed";

export function SubtractionQuestion({ a, b, onNext, onResult }: Props) {
  const plan = useMemo(() => planSubtraction(a, b), [a, b]);
  const [hintLevel, setHintLevel] = useState(0);
  const [phase, setPhase] = useState<Phase>("solving");
  const reportedRef = useRef(false);

  const showHint = () => setHintLevel((h) => Math.min(h + 1, 3));

  const handleSubmit = (tens: number, ones: number) => {
    const correct = tens * 10 + ones === plan.total;
    recordArithmeticAttempt(plan.needsRegroup ? "sub-borrow" : "sub-no-borrow", correct);
    if (!reportedRef.current) {
      reportedRef.current = true;
      onResult?.(correct);
    }
    setPhase(correct ? "correct" : "missed");
  };

  return (
    <div className="aq-container">
      <p className="aq-question">
        {a} − {b} = ?
      </p>

      {phase === "solving" && (
        <>
          <VerticalAnswerInput a={a} b={b} op="-" onSubmit={handleSubmit} />

          {hintLevel >= 1 && (
            <p className="aq-hint-text">
              {plan.aOnes}から{plan.bOnes}は ひけるかな?
            </p>
          )}
          {hintLevel >= 2 && (
            <p className="aq-hint-text">
              {a} = {plan.aTensValue} + {plan.aOnes}
            </p>
          )}
          {hintLevel >= 3 && (
            <p className="aq-hint-text">
              {plan.needsRegroup
                ? `${plan.aTensValue} + ${plan.aOnes} → ${plan.regroupedTensValue} + ${plan.regroupedOnes}`
                : `${plan.aOnes} − ${plan.bOnes} = ${plan.onesResult}`}
            </p>
          )}

          {hintLevel < 3 && (
            <button type="button" className="aq-hint-btn" onClick={showHint}>
              ヒントをみる
            </button>
          )}
        </>
      )}

      {phase === "missed" && (
        <div className="aq-feedback is-missed">
          <p className="aq-feedback-text">おしい!</p>
          <p className="aq-retry-prompt">見ながら もういちど?</p>
          <div className="aq-choice-row">
            <button type="button" className="aq-retry-btn" onClick={() => setPhase("solving")}>
              もういちど
            </button>
            <button type="button" className="aq-reveal-btn" onClick={() => setPhase("revealed")}>
              こたえをみる
            </button>
          </div>
        </div>
      )}

      {phase === "correct" && (
        <div className="aq-feedback is-correct">
          <p className="aq-feedback-text">せいかい!</p>
          <p className="aq-equation">
            {a} − {b} = {plan.total}
          </p>
          <p className="aq-recap-line">
            {plan.needsRegroup
              ? `${plan.aTensValue} + ${plan.aOnes} を ${plan.regroupedTensValue} + ${plan.regroupedOnes} に組みかえたね`
              : `${plan.aOnes} − ${plan.bOnes} = ${plan.onesResult}`}
          </p>
          <button type="button" className="aq-next-btn" onClick={onNext}>
            つぎのもんだいへ
          </button>
        </div>
      )}

      {phase === "revealed" && (
        <div className="aq-feedback is-revealed">
          <p className="aq-equation">
            {a} − {b} = {plan.total}
          </p>
          {plan.needsRegroup && (
            <>
              <p className="aq-recap-line">
                {plan.aTensValue} + {plan.aOnes} → {plan.regroupedTensValue} + {plan.regroupedOnes}
              </p>
              <PlaceBlocks tens={plan.regroupedTensValue} ones={plan.regroupedOnes} highlight />
            </>
          )}
          <p className="aq-recap-line">
            {plan.regroupedOnes} − {plan.bOnes} = {plan.onesResult}
          </p>
          <p className="aq-recap-line">
            {plan.tensResultValue} + {plan.onesResult} = {plan.total}
          </p>
          <button type="button" className="aq-next-btn" onClick={onNext}>
            つぎのもんだいへ
          </button>
        </div>
      )}
    </div>
  );
}
