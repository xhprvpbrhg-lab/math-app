import { useMemo, useRef } from "react";
import type { Rect, Split, VisualAidLevel } from "../types";
import { blockIndexForPosition, boundsFromCuts } from "../lib/grid";
import "./RectangleGrid.css";

interface Props {
  rect: Rect;
  split: Split;
  visualAid: VisualAidLevel;
  onToggleRowCut: (pos: number) => void;
  onToggleColCut: (pos: number) => void;
}

const BLOCK_COLORS = [
  "var(--block-1)",
  "var(--block-2)",
  "var(--block-3)",
  "var(--block-4)",
  "var(--block-5)",
  "var(--block-6)",
];

const SNAP_PX = 22;

export function RectangleGrid({ rect, split, visualAid, onToggleRowCut, onToggleColCut }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowBounds = useMemo(() => boundsFromCuts(rect.rows, split.rowCuts), [rect.rows, split.rowCuts]);
  const colBounds = useMemo(() => boundsFromCuts(rect.cols, split.colCuts), [rect.cols, split.colCuts]);
  const colSegCount = colBounds.length - 1;

  const rowBoundaryPositions = Array.from({ length: rect.rows - 1 }, (_, i) => i + 1);
  const colBoundaryPositions = Array.from({ length: rect.cols - 1 }, (_, i) => i + 1);

  const cells = [];
  for (let r = 0; r < rect.rows; r++) {
    for (let c = 0; c < rect.cols; c++) {
      const rBlock = blockIndexForPosition(rowBounds, r);
      const cBlock = blockIndexForPosition(colBounds, c);
      const colorIndex = (rBlock * colSegCount + cBlock) % BLOCK_COLORS.length;
      cells.push(
        <div
          key={`${r}-${c}`}
          className={`rg-cell rg-cell--${visualAid}`}
          style={{ background: BLOCK_COLORS[colorIndex] }}
        >
          {visualAid === "dots" && <span className="rg-dot" />}
        </div>
      );
    }
  }

  const handlePick = (clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const relX = clientX - box.left;
    const relY = clientY - box.top;
    const gx = (relX / box.width) * rect.cols;
    const gy = (relY / box.height) * rect.rows;

    const nearestCol = Math.min(Math.max(Math.round(gx), 1), rect.cols - 1);
    const nearestRow = Math.min(Math.max(Math.round(gy), 1), rect.rows - 1);
    const colDistPx = Math.abs(gx - nearestCol) * (box.width / rect.cols);
    const rowDistPx = Math.abs(gy - nearestRow) * (box.height / rect.rows);

    if (rect.cols < 2 && rect.rows < 2) return;

    if (rect.cols >= 2 && (rect.rows < 2 || colDistPx <= rowDistPx)) {
      if (colDistPx <= SNAP_PX) onToggleColCut(nearestCol);
      else if (rect.rows >= 2 && rowDistPx <= SNAP_PX) onToggleRowCut(nearestRow);
    } else if (rect.rows >= 2) {
      if (rowDistPx <= SNAP_PX) onToggleRowCut(nearestRow);
      else if (rect.cols >= 2 && colDistPx <= SNAP_PX) onToggleColCut(nearestCol);
    }
  };

  return (
    <div
      ref={containerRef}
      className="rg-container"
      style={{ aspectRatio: `${rect.cols} / ${rect.rows}` }}
      onClick={(e) => handlePick(e.clientX, e.clientY)}
    >
      <div
        className="rg-grid"
        style={{
          gridTemplateRows: `repeat(${rect.rows}, 1fr)`,
          gridTemplateColumns: `repeat(${rect.cols}, 1fr)`,
        }}
      >
        {cells}
      </div>

      {colBoundaryPositions.map((pos) => (
        <div
          key={`col-${pos}`}
          className={`rg-boundary rg-boundary--col ${split.colCuts.includes(pos) ? "is-active" : ""}`}
          style={{ left: `${(pos / rect.cols) * 100}%` }}
        />
      ))}

      {rowBoundaryPositions.map((pos) => (
        <div
          key={`row-${pos}`}
          className={`rg-boundary rg-boundary--row ${split.rowCuts.includes(pos) ? "is-active" : ""}`}
          style={{ top: `${(pos / rect.rows) * 100}%` }}
        />
      ))}
    </div>
  );
}
