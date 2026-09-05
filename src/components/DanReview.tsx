import { STEPS_PER_DAN, TOTAL_DANS, danLabel } from "../lib/dan";
import { pickAlternative } from "../lib/representations";
import { NumberLine } from "./NumberLine";
import { FormulaTrace } from "./FormulaTrace";
import "./DanReview.css";

interface Props {
  dan: number;
  onNext: () => void;
}

const MAX_TOWER_PX = 200;
const ALT_STEP = STEPS_PER_DAN;

export function DanReview({ dan, onNext }: Props) {
  const unit = Math.min(22, Math.max(3, MAX_TOWER_PX / (dan * STEPS_PER_DAN)));
  const isLastDan = dan >= TOTAL_DANS;
  const lineValues = Array.from({ length: STEPS_PER_DAN + 1 }, (_, i) => dan * i);
  const alt = pickAlternative(dan, ALT_STEP, null);

  return (
    <div className="drv-container">
      <h2 className="drv-title">{danLabel(dan)}、はっけん!</h2>

      <div className="drv-towers">
        {Array.from({ length: STEPS_PER_DAN }, (_, i) => i + 1).map((b) => {
          const total = dan * b;
          return (
            <div key={b} className="drv-col">
              <div className="drv-bars" style={{ height: `${total * unit}px` }}>
                {Array.from({ length: b }, (_, m) => (
                  <div
                    key={m}
                    className="drv-band"
                    style={{
                      height: `${dan * unit}px`,
                      background: m % 2 === 0 ? "var(--block-1)" : "var(--block-3)",
                    }}
                  />
                ))}
              </div>
              <span className="drv-total">{total}</span>
            </div>
          );
        })}
      </div>

      <NumberLine values={lineValues} />

      {alt && (
        <div className="drv-alt">
          <p className="drv-alt-label">
            べつの見方も見てみよう: {dan} × {ALT_STEP} は {alt.label}
          </p>
          <FormulaTrace rect={alt.rect} split={alt.split} />
        </div>
      )}

      <button type="button" className="drv-next-btn" onClick={onNext}>
        {isLastDan ? "ぜんぶのだん クリア!" : `つぎは ${dan + 1}のだんへ!`}
      </button>
    </div>
  );
}
