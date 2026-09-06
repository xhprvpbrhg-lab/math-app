import { useState } from "react";
import { Practice } from "./Practice";
import { Gallery } from "./Gallery";
import { Progress } from "./Progress";
import "./MulHome.css";

type Tab = "practice" | "gallery" | "progress";

const TABS: { id: Tab; label: string }[] = [
  { id: "practice", label: "れんしゅう" },
  { id: "gallery", label: "いろいろな見方" },
  { id: "progress", label: "進み具合" },
];

export function MulHome() {
  const [tab, setTab] = useState<Tab>("practice");

  return (
    <div className="mh-container">
      <main className="mh-main">
        {tab === "practice" && <Practice />}
        {tab === "gallery" && <Gallery />}
        {tab === "progress" && <Progress />}
      </main>

      <nav className="mh-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`mh-nav-btn ${tab === t.id ? "is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
