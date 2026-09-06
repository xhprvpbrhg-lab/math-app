import { useState } from "react";
import { SubtractionQuestion } from "../components/SubtractionQuestion";
import { randomSubPair } from "../lib/arithmetic";
import "./ArithmeticPractice.css";

const SET_SIZE = 6;

export function SubtractionPractice() {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [pair, setPair] = useState<[number, number]>(() => randomSubPair());
  const [seed, setSeed] = useState(0);
  const [done, setDone] = useState(false);

  const next = () => {
    if (index + 1 >= SET_SIZE) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setPair(randomSubPair());
    setSeed((s) => s + 1);
  };

  const restart = () => {
    setIndex(0);
    setCorrectCount(0);
    setDone(false);
    setPair(randomSubPair());
    setSeed((s) => s + 1);
  };

  if (done) {
    return (
      <div className="ap-done">
        <p className="ap-done-title">れんしゅう かんりょう!</p>
        <p className="ap-done-sub">
          {SET_SIZE}問中 {correctCount}問 せいかいできたね
        </p>
        <button type="button" className="ap-restart-btn" onClick={restart}>
          もう1セット
        </button>
      </div>
    );
  }

  return (
    <div className="ap-container">
      <p className="ap-progress">
        {index + 1} / {SET_SIZE}問目
      </p>
      <SubtractionQuestion
        key={seed}
        a={pair[0]}
        b={pair[1]}
        onNext={next}
        onResult={(correct) => correct && setCorrectCount((c) => c + 1)}
      />
    </div>
  );
}
