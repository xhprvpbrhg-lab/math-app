import { useState } from "react";
import "./AnswerInput.css";

interface Props {
  onSubmit: (value: number) => void;
  disabled?: boolean;
}

export function AnswerInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    const n = Number(value);
    if (value.trim() === "" || Number.isNaN(n)) return;
    onSubmit(n);
  };

  return (
    <div className="ai-container">
      <input
        className="ai-input"
        type="number"
        inputMode="numeric"
        value={value}
        disabled={disabled}
        placeholder="?"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <button className="ai-submit" type="button" disabled={disabled} onClick={submit}>
        こたえる
      </button>
    </div>
  );
}
