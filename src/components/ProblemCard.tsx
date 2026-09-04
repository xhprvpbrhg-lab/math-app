import { useRef, useState } from "react";
import type { AttemptLog, FactProgress, Split, VisualAidLevel } from "../types";
import { RectangleGrid } from "./RectangleGrid";
import { FormulaTrace } from "./FormulaTrace";
import { AnswerInput } from "./AnswerInput";
import { isSplitEmpty, splitSignature, toggleCut } from "../lib/grid";
import { detectStrategyTags } from "../lib/formula";
import { pickAlternative } from "../lib/representations";
import { recordAttempt } from "../lib/storage";
import "./ProblemCard.css";

interface Props {
  factA: number;
  factB: number;
  initialVisualAid: VisualAidLevel;
  onRecorded?: (log: AttemptLog, progress: FactProgress) => void;
  onNext?: () => void;
}

const EMPTY_SPLIT: Split = { rowCuts: [], colCuts: [] };

export function ProblemCard({ factA, factB, initialVisualAid, onRecorded, onNext }: Props) {
  const [aidLevel, setAidLevel] = useState<VisualAidLevel>(initialVisualAid);
  const [rotated, setRotated] = useState(false);
  const [split, setSplit] = useState<Split>(EMPTY_SPLIT);
  const [usedGrid, setUsedGrid] = useState(false);
  const [phase, setPhase] = useState<"solving" | "answered">("solving");
  const [feedback, setFeedback] = useState<{ correct: boolean; correctAnswer: number } | null>(null);
  const [usedSignature, setUsedSignature] = useState<string | null>(null);

  const startTimeRef = useRef(Date.now());
  const rect = rotated ? { rows: factB, cols: factA } : { rows: factA, cols: factB };

  const toggleRowCut = (pos: number) => {
    setSplit((s) => ({ ...s, rowCuts: toggleCut(s.rowCuts, pos) }));
    setUsedGrid(true);
  };
  const toggleColCut = (pos: number) => {
    setSplit((s) => ({ ...s, colCuts: toggleCut(s.colCuts, pos) }));
    setUsedGrid(true);
  };
  const toggleRotate = () => {
    setRotated((r) => !r);
    setSplit(EMPTY_SPLIT);
    setUsedGrid(true);
  };
  const resetSplit = () => {
    setSplit(EMPTY_SPLIT);
    setRotated(false);
  };
  const revealMore = () => {
    setAidLevel((a) => (a === "none" ? "outline" : "dots"));
  };

  const handleAnswerSubmit = (value: number) => {
    const correctAnswer = factA * factB;
    const correct = value === correctAnswer;
    const responseTimeMs = Date.now() - startTimeRef.current;
    const splitUsed = usedGrid && !isSplitEmpty(split);
    const strategyTags = splitUsed ? detectStrategyTags(rect, split, rotated) : rotated ? ["commute" as const] : [];
    const sig = usedGrid ? splitSignature(rect, split, rotated) : null;

    const log: AttemptLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      factA,
      factB,
      correct,
      responseTimeMs,
      visualAidLevel: aidLevel,
      usedGrid,
      split: splitUsed ? split : null,
      splitSignature: sig,
      rotated,
      strategyTags: [...strategyTags],
      instantAnswer: false,
    };

    const progress = recordAttempt(log);
    setUsedSignature(sig);
    setFeedback({ correct, correctAnswer });
    setPhase("answered");
    onRecorded?.(log, progress);
  };

  const alt = phase === "answered" ? pickAlternative(factA, factB, usedSignature) : null;

  return (
    <div className="pc-container">
      <h2 className="pc-problem">
        {factA} × {factB}
      </h2>

      {aidLevel !== "none" && (
        <>
          <RectangleGrid
            rect={rect}
            split={split}
            visualAid={aidLevel}
            onToggleRowCut={toggleRowCut}
            onToggleColCut={toggleColCut}
          />
          <div className="pc-controls">
            <button type="button" className="pc-btn-secondary" onClick={toggleRotate}>
              入れかえる
            </button>
            {!isSplitEmpty(split) && (
              <button type="button" className="pc-btn-secondary" onClick={resetSplit}>
                別の分け方を試す
              </button>
            )}
          </div>
          <FormulaTrace rect={rect} split={split} />
        </>
      )}

      {aidLevel === "none" && phase === "solving" && (
        <div className="pc-controls">
          <button type="button" className="pc-btn-secondary" onClick={revealMore}>
            ヒントを見る
          </button>
        </div>
      )}

      {phase === "solving" && <AnswerInput onSubmit={handleAnswerSubmit} />}

      {phase === "answered" && feedback && (
        <div className={`pc-feedback ${feedback.correct ? "is-correct" : "is-wrong"}`}>
          <p className="pc-feedback-text">
            {feedback.correct ? "せいかい" : `こたえは ${feedback.correctAnswer}`}
          </p>

          {alt && (
            <div className="pc-alt">
              <p className="pc-alt-label">こんな見方もあるよ: {alt.label}</p>
              <FormulaTrace rect={alt.rect} split={alt.split} />
            </div>
          )}

          <div className="pc-controls">
            {aidLevel !== "none" && (
              <button type="button" className="pc-btn-secondary" onClick={resetSplit}>
                もう一度分けてみる
              </button>
            )}
            {onNext && (
              <button type="button" className="pc-btn-primary" onClick={onNext}>
                つぎの問題へ
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
