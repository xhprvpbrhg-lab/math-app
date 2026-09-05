import { useRef, useState } from "react";
import { RandomQuestion } from "../components/RandomQuestion";
import { loadDanProgress } from "../lib/storage";
import { TOTAL_DANS } from "../lib/dan";
import "./RandomPractice.css";

type RangeMode = "learned" | "all";
type Pair = [number, number];

function buildDeck(maxDan: number): Pair[] {
  const deck: Pair[] = [];
  for (let a = 1; a <= maxDan; a++) {
    for (let b = 1; b <= 9; b++) deck.push([a, b]);
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// 直前と同じ組み合わせ、または入れかえただけの組み合わせを連続させない
function isSamePair(p1: Pair, p2: Pair): boolean {
  return (p1[0] === p2[0] && p1[1] === p2[1]) || (p1[0] === p2[1] && p1[1] === p2[0]);
}

interface Props {
  onSwitchToSequential?: () => void;
}

export function RandomPractice({ onSwitchToSequential }: Props) {
  const learnedMaxDan = Math.max(0, ...loadDanProgress().completedDans);

  const [range, setRange] = useState<RangeMode>(learnedMaxDan > 0 ? "learned" : "all");
  const maxDan = range === "learned" ? learnedMaxDan : TOTAL_DANS;

  const deckRef = useRef<{ maxDan: number; cards: Pair[] }>({ maxDan, cards: buildDeck(maxDan) });
  const lastPairRef = useRef<Pair | null>(null);

  const draw = (forMaxDan: number): Pair => {
    if (deckRef.current.maxDan !== forMaxDan || deckRef.current.cards.length === 0) {
      deckRef.current = { maxDan: forMaxDan, cards: buildDeck(forMaxDan) };
    }
    const cards = deckRef.current.cards;
    let candidate = cards.shift()!;
    if (lastPairRef.current && isSamePair(candidate, lastPairRef.current) && cards.length > 0) {
      cards.push(candidate);
      candidate = cards.shift()!;
    }
    lastPairRef.current = candidate;
    return candidate;
  };

  const [pair, setPair] = useState<Pair>(() => draw(maxDan));
  const [seed, setSeed] = useState(0);

  const nextQuestion = (forMaxDan: number) => {
    setPair(draw(forMaxDan));
    setSeed((s) => s + 1);
  };

  const handleRangeChange = (r: RangeMode) => {
    if (r === "learned" && learnedMaxDan === 0) return;
    setRange(r);
    nextQuestion(r === "learned" ? learnedMaxDan : TOTAL_DANS);
  };

  return (
    <div className="rp-container">
      <div className="rp-range-toggle">
        <button
          type="button"
          className={`rp-range-btn ${range === "learned" ? "is-active" : ""}`}
          disabled={learnedMaxDan === 0}
          onClick={() => handleRangeChange("learned")}
        >
          ならった だんから
        </button>
        <button
          type="button"
          className={`rp-range-btn ${range === "all" ? "is-active" : ""}`}
          onClick={() => handleRangeChange("all")}
        >
          ぜんぶから
        </button>
      </div>

      {learnedMaxDan === 0 && (
        <div className="rp-guidance">
          <span>まず 1のだんを たんけんしよう!</span>
          {onSwitchToSequential && (
            <button type="button" className="rp-guidance-link" onClick={onSwitchToSequential}>
              じゅんばんに たんけんへ
            </button>
          )}
        </div>
      )}

      <RandomQuestion key={seed} a={pair[0]} b={pair[1]} onNext={() => nextQuestion(maxDan)} />
    </div>
  );
}
