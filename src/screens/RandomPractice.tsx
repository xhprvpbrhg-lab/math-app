import { useState } from "react";
import { RandomQuestion } from "../components/RandomQuestion";
import { loadDanProgress } from "../lib/storage";
import { TOTAL_DANS } from "../lib/dan";
import "./RandomPractice.css";

type RangeMode = "learned" | "all";

function randomPair(maxDan: number): [number, number] {
  const a = 1 + Math.floor(Math.random() * maxDan);
  const b = 1 + Math.floor(Math.random() * 9);
  return [a, b];
}

export function RandomPractice() {
  const learnedMaxDan = Math.min(Math.max(loadDanProgress().currentDan, 1), TOTAL_DANS);

  const [range, setRange] = useState<RangeMode>("learned");
  const [pair, setPair] = useState<[number, number]>(() => randomPair(learnedMaxDan));
  const [seed, setSeed] = useState(0);

  const maxDan = range === "learned" ? learnedMaxDan : TOTAL_DANS;

  const nextQuestion = (nextMaxDan: number) => {
    setPair(randomPair(nextMaxDan));
    setSeed((s) => s + 1);
  };

  const handleRangeChange = (r: RangeMode) => {
    setRange(r);
    nextQuestion(r === "learned" ? learnedMaxDan : TOTAL_DANS);
  };

  return (
    <div className="rp-container">
      <div className="rp-range-toggle">
        <button
          type="button"
          className={`rp-range-btn ${range === "learned" ? "is-active" : ""}`}
          onClick={() => handleRangeChange("learned")}
        >
          ならった だんから
        </button>
        <button
          type="button"
          className={`rp-range-btn ${range === "all" ? "is-active" : ""}`}
          onClick={() => handleRangeChange("all")}
        >
          ぜんぶから
        </button>
      </div>

      <RandomQuestion key={seed} a={pair[0]} b={pair[1]} onNext={() => nextQuestion(maxDan)} />
    </div>
  );
}
