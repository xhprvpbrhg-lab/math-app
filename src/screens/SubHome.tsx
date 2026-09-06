import { useState } from "react";
import { SubtractionExplore } from "./SubtractionExplore";
import { SubtractionPractice } from "./SubtractionPractice";
import "./DomainHome.css";

type Tab = "explore" | "practice";

export function SubHome() {
  const [tab, setTab] = useState<Tab>("explore");

  return (
    <div className="dh-container">
      <div className="dh-tab-toggle">
        <button
          type="button"
          className={`dh-tab-btn ${tab === "explore" ? "is-active" : ""}`}
          onClick={() => setTab("explore")}
        >
          たんけん
        </button>
        <button
          type="button"
          className={`dh-tab-btn ${tab === "practice" ? "is-active" : ""}`}
          onClick={() => setTab("practice")}
        >
          れんしゅう
        </button>
      </div>

      {tab === "explore" ? <SubtractionExplore /> : <SubtractionPractice />}
    </div>
  );
}
