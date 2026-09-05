import { useMemo, useState } from "react";
import { loadProgress } from "../lib/storage";
import { normalizedFactKey } from "../lib/facts";
import { LEVEL_LABEL } from "../lib/mastery";
import type { FactProgress, MasteryLevel } from "../types";
import "./Progress.css";

const LEVELS: MasteryLevel[] = ["concrete", "outline", "mental", "fluent"];
const NUMS = Array.from({ length: 9 }, (_, i) => i + 1);

export function Progress() {
  const [progress] = useState(() => loadProgress());
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const counts = useMemo(() => {
    const c: Record<MasteryLevel, number> = { concrete: 0, outline: 0, mental: 0, fluent: 0 };
    let unseen = 0;
    NUMS.forEach((a) =>
      NUMS.forEach((b) => {
        if (a > b) return;
        const p = progress[normalizedFactKey(a, b)];
        if (p && p.attempts > 0) c[p.level]++;
        else unseen++;
      })
    );
    return { ...c, unseen };
  }, [progress]);

  const isDiagonal = selected ? selected[0] === selected[1] : false;
  const mirror: [number, number] | null = selected ? [selected[1], selected[0]] : null;
  const selectedProgress: FactProgress | undefined = selected ? progress[normalizedFactKey(...selected)] : undefined;

  return (
    <div className="pr-screen">
      <div className="pr-summary">
        <div className="pr-summary-chip pr-lv-unseen">
          <span className="pr-summary-count">{counts.unseen}</span>
          <span className="pr-summary-label">まだ</span>
        </div>
        {LEVELS.map((lv) => (
          <div key={lv} className={`pr-summary-chip pr-lv-${lv}`}>
            <span className="pr-summary-count">{counts[lv]}</span>
            <span className="pr-summary-label">{LEVEL_LABEL[lv]}</span>
          </div>
        ))}
      </div>

      <div className="pr-table" style={{ gridTemplateColumns: `repeat(${NUMS.length}, 1fr)` }}>
        {NUMS.map((a) =>
          NUMS.map((b) => {
            const p = progress[normalizedFactKey(a, b)];
            const level = p?.level ?? "concrete";
            const known = Boolean(p && p.attempts > 0);
            const isSelected = Boolean(selected && selected[0] === a && selected[1] === b);
            const isMirror = Boolean(mirror && !isDiagonal && mirror[0] === a && mirror[1] === b);
            return (
              <button
                key={`${a}-${b}`}
                type="button"
                className={[
                  "pr-cell",
                  `pr-lv-${known ? level : "unseen"}`,
                  a === b ? "is-diag" : "",
                  isSelected ? "is-selected" : "",
                  isMirror ? "is-mirror" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setSelected([a, b])}
              >
                {a * b}
              </button>
            );
          })
        )}
      </div>

      {selected && (
        <div className="pr-detail">
          <p className="pr-detail-eq">
            {selected[0]} × {selected[1]} = {selected[0] * selected[1]}
          </p>
          {!isDiagonal && mirror && (
            <p className="pr-detail-eq">
              {mirror[0]} × {mirror[1]} = {mirror[0] * mirror[1]}
            </p>
          )}
          <p className="pr-detail-discovery">{isDiagonal ? "おなじ数どうし" : "ぎゃくにしても おなじ!"}</p>

          {selectedProgress ? (
            <>
              <p>状態: {LEVEL_LABEL[selectedProgress.level]}</p>
              <p>これまでの回数: {selectedProgress.attempts}</p>
              <p>
                使った見方:{" "}
                {selectedProgress.discoveredStrategies.length > 0
                  ? selectedProgress.discoveredStrategies.join(", ")
                  : "まだなし"}
              </p>
            </>
          ) : (
            <p>まだ練習していません</p>
          )}
        </div>
      )}
    </div>
  );
}
