import { useMemo, useState } from "react";
import { planSubtraction, randomSubPair } from "../lib/arithmetic";
import { PlaceBlocks } from "../components/PlaceBlocks";
import { VerticalProblem } from "../components/VerticalProblem";
import "./ArithmeticExplore.css";

type Phase = "decompose" | "checkOnes" | "regroup" | "subtractParts" | "combine" | "written";

export function SubtractionExplore() {
  const [pair, setPair] = useState<[number, number]>([52, 28]);
  const [phase, setPhase] = useState<Phase>("decompose");
  const plan = useMemo(() => planSubtraction(pair[0], pair[1]), [pair]);

  const goNext = () => {
    if (phase === "decompose") setPhase("checkOnes");
    else if (phase === "checkOnes") setPhase(plan.needsRegroup ? "regroup" : "subtractParts");
    else if (phase === "regroup") setPhase("subtractParts");
    else if (phase === "subtractParts") setPhase("combine");
    else if (phase === "combine") setPhase("written");
  };

  const newProblem = () => {
    setPair(randomSubPair());
    setPhase("decompose");
  };

  return (
    <div className="ae-container">
      <h2 className="ae-title">
        {pair[0]} − {pair[1]}
      </h2>

      {phase === "decompose" && (
        <>
          <div className="ae-item">
            <p className="ae-line">
              {pair[0]} = {plan.aTensValue} + {plan.aOnes}
            </p>
            <PlaceBlocks tens={plan.aTensValue} ones={plan.aOnes} />
          </div>
          <p className="ae-line">
            {pair[1]} = {plan.bTensValue} + {plan.bOnes}
          </p>
          <button type="button" className="ae-next-btn" onClick={goNext}>
            すすむ
          </button>
        </>
      )}

      {phase === "checkOnes" && (
        <>
          <p className="ae-line ae-line--big">
            {plan.aOnes}から{plan.bOnes}は {plan.needsRegroup ? "そのまま引けない" : "引ける"}
          </p>
          <button type="button" className="ae-next-btn" onClick={goNext}>
            すすむ
          </button>
        </>
      )}

      {phase === "regroup" && (
        <>
          <p className="ae-line ae-line--big">
            {plan.aTensValue} + {plan.aOnes}
          </p>
          <p className="ae-caption">十のまとまり1つを 一が10こに かえる</p>
          <div className="ae-before-after">
            <PlaceBlocks tens={plan.aTensValue} ones={plan.aOnes} />
            <span className="ae-arrow">↓</span>
            <PlaceBlocks tens={plan.regroupedTensValue} ones={plan.regroupedOnes} highlight />
          </div>
          <p className="ae-line ae-line--big">
            {plan.regroupedTensValue} + {plan.regroupedOnes}
          </p>
          <button type="button" className="ae-next-btn" onClick={goNext}>
            すすむ
          </button>
        </>
      )}

      {phase === "subtractParts" && (
        <>
          <p className="ae-line ae-line--big">
            {plan.regroupedOnes} − {plan.bOnes} = {plan.onesResult}
          </p>
          <p className="ae-line ae-line--big">
            {plan.regroupedTensValue} − {plan.bTensValue} = {plan.tensResultValue}
          </p>
          <button type="button" className="ae-next-btn" onClick={goNext}>
            すすむ
          </button>
        </>
      )}

      {phase === "combine" && (
        <>
          <p className="ae-line ae-line--total">
            {plan.tensResultValue} + {plan.onesResult} = {plan.total}
          </p>
          <button type="button" className="ae-next-btn" onClick={goNext}>
            すすむ
          </button>
        </>
      )}

      {phase === "written" && (
        <>
          <VerticalProblem a={pair[0]} b={pair[1]} op="-" total={plan.total} />
          {plan.needsRegroup && (
            <p className="ae-caption">
              {plan.aTensValue} + {plan.aOnes} を {plan.regroupedTensValue} + {plan.regroupedOnes} に組みかえて計算したね
            </p>
          )}
          <button type="button" className="ae-next-btn" onClick={newProblem}>
            べつの もんだいで ためす
          </button>
        </>
      )}
    </div>
  );
}
