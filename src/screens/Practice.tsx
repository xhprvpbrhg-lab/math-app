import { useState } from "react";
import { DanPractice } from "./DanPractice";
import { RandomPractice } from "./RandomPractice";
import "./Practice.css";

type Mode = "sequential" | "random";

export function Practice() {
  const [mode, setMode] = useState<Mode>("sequential");

  return (
    <div className="prc-container">
      <div className="prc-mode-toggle">
        <button
          type="button"
          className={`prc-mode-btn ${mode === "sequential" ? "is-active" : ""}`}
          onClick={() => setMode("sequential")}
        >
          じゅんばんに たんけん
        </button>
        <button
          type="button"
          className={`prc-mode-btn ${mode === "random" ? "is-active" : ""}`}
          onClick={() => setMode("random")}
        >
          ランダムで ためす
        </button>
      </div>

      {mode === "sequential" ? (
        <DanPractice />
      ) : (
        <RandomPractice onSwitchToSequential={() => setMode("sequential")} />
      )}
    </div>
  );
}
