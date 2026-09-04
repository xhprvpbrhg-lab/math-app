import type { Rect, Split } from "../types";
import { buildFormula } from "../lib/formula";
import { isSplitEmpty } from "../lib/grid";
import "./FormulaTrace.css";

interface Props {
  rect: Rect;
  split: Split;
}

export function FormulaTrace({ rect, split }: Props) {
  if (isSplitEmpty(split)) {
    return (
      <div className="ft-container ft-empty">
        <span className="ft-line ft-line--main">{rect.rows} × {rect.cols}</span>
      </div>
    );
  }

  const f = buildFormula(rect, split);

  return (
    <div className="ft-container">
      <span className="ft-line ft-line--main">{f.original}</span>
      <span className="ft-line">= {f.terms}</span>
      <span className="ft-line">= {f.products}</span>
      <span className="ft-line ft-line--total">= {f.total}</span>
    </div>
  );
}
