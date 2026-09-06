import { digits2 } from "../lib/arithmetic";
import "./VerticalAlgorithm.css";

interface Props {
  a: number;
  b: number;
  op: "+" | "-";
  total: number;
  showCarry?: boolean; // 足し算でくり上がりがあったことを、十の位の上に小さく示す
}

// 筆算の形で a op b = total を表示する(2桁専用)
export function VerticalProblem({ a, b, op, total, showCarry }: Props) {
  const [aTensValue, aOnes] = digits2(a);
  const [bTensValue, bOnes] = digits2(b);
  const [totalTensValue, totalOnes] = digits2(total);

  return (
    <div className="va-wrap">
      <div className="va-grid">
        <span className="va-cell va-op">{showCarry ? <span className="va-carry">1</span> : ""}</span>
        <span className="va-cell">{aTensValue / 10 || ""}</span>
        <span className="va-cell">{aOnes}</span>

        <span className="va-cell va-op">{op}</span>
        <span className="va-cell">{bTensValue / 10 || ""}</span>
        <span className="va-cell">{bOnes}</span>

        <div className="va-hr" />

        <span className="va-cell va-op"></span>
        <span className="va-cell">{totalTensValue / 10 || 0}</span>
        <span className="va-cell">{totalOnes}</span>
      </div>
    </div>
  );
}
