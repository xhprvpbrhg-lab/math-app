import { useState } from "react";
import { AddHome } from "./screens/AddHome";
import { SubHome } from "./screens/SubHome";
import { MulHome } from "./screens/MulHome";
import "./App.css";

type Domain = "add" | "sub" | "mul";

const DOMAINS: { id: Domain; label: string }[] = [
  { id: "add", label: "たしざん" },
  { id: "sub", label: "ひきざん" },
  { id: "mul", label: "かけざん" },
];

function App() {
  const [domain, setDomain] = useState<Domain>("mul");

  return (
    <div className="app-shell">
      <nav className="app-domain-bar">
        {DOMAINS.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`app-domain-btn ${domain === d.id ? "is-active" : ""}`}
            onClick={() => setDomain(d.id)}
          >
            {d.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {domain === "add" && <AddHome />}
        {domain === "sub" && <SubHome />}
        {domain === "mul" && <MulHome />}
      </main>
    </div>
  );
}

export default App;
