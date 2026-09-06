import { useRef, useState } from "react";
import { digits2 } from "../lib/arithmetic";
import "./VerticalAlgorithm.css";

interface Props {
  a: number;
  b: number;
  op: "+" | "-";
  onSubmit: (tens: number, ones: number) => void;
}

// 筆算の形の中で、一の位→十の位の順に答えの桁を入力する
export function VerticalAnswerInput({ a, b, op, onSubmit }: Props) {
  const [onesVal, setOnesVal] = useState("");
  const [tensVal, setTensVal] = useState("");
  const tensRef = useRef<HTMLInputElement>(null);

  const [aTensValue, aOnes] = digits2(a);
  const [bTensValue, bOnes] = digits2(b);

  const handleOnesChange = (raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setOnesVal(digit);
    if (digit) tensRef.current?.focus();
  };

  const submit = () => {
    if (onesVal === "" || tensVal === "") return;
    onSubmit(Number(tensVal), Number(onesVal));
  };

  return (
    <div className="va-wrap">
      <div className="va-grid">
        <span className="va-cell va-op"></span>
        <span className="va-cell">{aTensValue / 10}</span>
        <span className="va-cell">{aOnes}</span>

        <span className="va-cell va-op">{op}</span>
        <span className="va-cell">{bTensValue / 10}</span>
        <span className="va-cell">{bOnes}</span>

        <div className="va-hr" />

        <span className="va-cell va-op"></span>
        <input
          ref={tensRef}
          className="va-input"
          inputMode="numeric"
          value={tensVal}
          onChange={(e) => setTensVal(e.target.value.replace(/\D/g, "").slice(-1))}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          aria-label="十の位のこたえ"
        />
        <input
          className="va-input"
          inputMode="numeric"
          value={onesVal}
          onChange={(e) => handleOnesChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          aria-label="一の位のこたえ"
          autoFocus
        />
      </div>
      <button type="button" className="va-submit" onClick={submit} disabled={onesVal === "" || tensVal === ""}>
        こたえる
      </button>
    </div>
  );
}
