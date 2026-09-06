import { useMemo, useState } from "react";
import { planAddition, randomAddPair } from "../lib/arithmetic";
import { PlaceBlocks } from "../components/PlaceBlocks";
import { VerticalProblem } from "../components/VerticalProblem";
import "./ArithmeticExplore.css";

type Phase = "decompose" | "addParts" | "regroup" | "combine" | "written";

export function AdditionExplore() {
  const [pair, setPair] = useState<[number, number]>([38, 27]);
  const [phase, setPhase] = useState<Phase>("decompose");
  const plan = useMemo(() => planAddition(pair[0], pair[1]), [pair]);

  const goNext = () => {
    if (phase === "decompose") setPhase("addParts");
    else if (phase === "addParts") setPhase(plan.carries ? "regroup" : "combine");
    else if (phase === "regroup") setPhase("combine");
    else if (phase === "combine") setPhase("written");
  };

  const newProblem = () => {
    setPair(randomAddPair());
    setPhase("decompose");
  };

  return (
    <div className="ae-container">
      <h2 className="ae-title">
        {pair[0]} + {pair[1]}
      </h2>

      {phase === "decompose" && (
        <>
          <div className="ae-pair">
            <div className="ae-item">
              <p className="ae-line">
                {pair[0]} = {plan.aTensValue} + {plan.aOnes}
              </p>
              <PlaceBlocks tens={plan.aTensValue} ones={plan.aOnes} />
            </div>
            <div className="ae-item">
              <p className="ae-line">
                {pair[1]} = {plan.bTensValue} + {plan.bOnes}
              </p>
              <PlaceBlocks tens={plan.bTensValue} ones={plan.bOnes} />
            </div>
          </div>
          <button type="button" className="ae-next-btn" onClick={goNext}>
            すすむ
          </button>
        </>
      )}

      {phase === "addParts" && (
        <>
          <p className="ae-line ae-line--big">
            {plan.aTensValue} + {plan.bTensValue} = {plan.tensSumValue}
          </p>
          <p className="ae-line ae-line--big">
            {plan.aOnes} + {plan.bOnes} = {plan.onesSum}
          </p>
          <button type="button" className="ae-next-btn" onClick={goNext}>
            すすむ
          </button>
        </>
      )}

      {phase === "regroup" && (
        <>
          <p className="ae-line ae-line--big">
            {plan.onesSum} = 10 + {plan.onesFinal}
          </p>
          <p className="ae-caption">10を 十のまとまり1つに かえる</p>
          <div className="ae-before-after">
            <PlaceBlocks tens={0} ones={plan.onesSum} />
            <span className="ae-arrow">↓</span>
            <PlaceBlocks tens={10} ones={plan.onesFinal} highlight />
          </div>
          <p className="ae-line ae-line--big">
            {plan.tensSumValue} + 10 = {plan.tensFinalValue}
          </p>
          <button type="button" className="ae-next-btn" onClick={goNext}>
            すすむ
          </button>
        </>
      )}

      {phase === "combine" && (
        <>
          <p className="ae-line ae-line--total">
            {plan.tensFinalValue} + {plan.onesFinal} = {plan.total}
          </p>
          <button type="button" className="ae-next-btn" onClick={goNext}>
            すすむ
          </button>
        </>
      )}

      {phase === "written" && (
        <>
          <VerticalProblem a={pair[0]} b={pair[1]} op="+" total={plan.total} showCarry={plan.carries} />
          {plan.carries && <p className="ae-caption">この1は、さっき十のまとまりにした10だよ</p>}
          <button type="button" className="ae-next-btn" onClick={newProblem}>
            べつの もんだいで ためす
          </button>
        </>
      )}
    </div>
  );
}
