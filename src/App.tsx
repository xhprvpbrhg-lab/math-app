import { useState } from "react";
import { DailyProblems } from "./screens/DailyProblems";
import { Gallery } from "./screens/Gallery";
import { Progress } from "./screens/Progress";
import "./App.css";

type Screen = "daily" | "gallery" | "progress";

const TABS: { id: Screen; label: string }[] = [
  { id: "daily", label: "今日の5問" },
  { id: "gallery", label: "いろいろな見方" },
  { id: "progress", label: "進み具合" },
];

function App() {
  const [screen, setScreen] = useState<Screen>("daily");

  return (
    <div className="app-shell">
      <main className="app-main">
        {screen === "daily" && <DailyProblems />}
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
