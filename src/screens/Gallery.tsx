import { useMemo, useState } from "react";
import { RectangleGrid } from "../components/RectangleGrid";
import { FormulaTrace } from "../components/FormulaTrace";
import { canonicalRepresentations, representationSignature } from "../lib/representations";
import { addDiscoveredSignature, loadProgress } from "../lib/storage";
import { normalizedFactKey } from "../lib/facts";
import "./Gallery.css";

const NOOP = () => {};

function lastPracticedFact(): [number, number] {
  const progress = loadProgress();
  const entries = Object.values(progress).sort((a, b) => b.lastPracticed - a.lastPracticed);
  if (entries.length === 0) return [7, 8];
  const [a, b] = entries[0].key.split("x").map(Number);
  return [a, b];
}

export function Gallery() {
  const [fact, setFact] = useState<[number, number]>(() => lastPracticedFact());
  const [tick, setTick] = useState(0);
  const [factA, factB] = fact;

  const discovered = useMemo(() => {
    const progress = loadProgress();
    const p = progress[normalizedFactKey(factA, factB)];
    return new Set(p?.discoveredSplitSignatures ?? []);
  }, [factA, factB, tick]);

  const allReps = useMemo(() => canonicalRepresentations(factA, factB), [factA, factB]);
  const shown = allReps.filter((r) => r.id === "plain" || discovered.has(representationSignature(r)));
  const nextHidden = allReps.find((r) => r.id !== "plain" && !discovered.has(representationSignature(r)));

  const reveal = () => {
    if (!nextHidden) return;
    addDiscoveredSignature(factA, factB, representationSignature(nextHidden));
    setTick((t) => t + 1);
  };

  return (
    <div className="gal-screen">
      <div className="gal-picker">
        <select value={factA} onChange={(e) => setFact([Number(e.target.value), factB])}>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span>×</span>
        <select value={factB} onChange={(e) => setFact([factA, Number(e.target.value)])}>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="gal-list">
        {shown.map((rep) => (
          <div className="gal-card" key={rep.id}>
            <p className="gal-card-label">{rep.label}</p>
            <RectangleGrid
              rect={rep.rect}
              split={rep.split}
              visualAid="dots"
              onToggleRowCut={NOOP}
              onToggleColCut={NOOP}
            />
            <FormulaTrace rect={rep.rect} split={rep.split} />
          </div>
        ))}
      </div>

      {nextHidden && (
        <button type="button" className="gal-more" onClick={reveal}>
          別の見方を見る
        </button>
      )}
    </div>
  );
}
