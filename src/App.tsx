import { useState } from "react";
import { DanPractice } from "./screens/DanPractice";
import { Gallery } from "./screens/Gallery";
import { Progress } from "./screens/Progress";
import "./App.css";

type Screen = "practice" | "gallery" | "progress";

const TABS: { id: Screen; label: string }[] = [
  { id: "practice", label: "れんしゅう" },
  { id: "gallery", label: "いろいろな見方" },
  { id: "progress", label: "進み具合" },
];

function App() {
  const [screen, setScreen] = useState<Screen>("practice");

  return (
    <div className="app-shell">
      <main className="app-main">
        {screen === "practice" && <DanPractice />}
        {screen === "gallery" && <Gallery />}
        {screen === "progress" && <Progress />}
      </main>

      <nav className="app-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`app-nav-btn ${screen === tab.id ? "is-active" : ""}`}
            onClick={() => setScreen(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
