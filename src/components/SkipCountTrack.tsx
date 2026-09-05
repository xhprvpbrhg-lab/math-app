import "./SkipCountTrack.css";

interface Props {
  dan: number;
  step: number;
  answered: boolean;
  totalSteps?: number;
}

// その段の数列(3,6,9,12...)を、解けたところまで数字で見せる進捗表示
export function SkipCountTrack({ dan, step, answered, totalSteps = 9 }: Props) {
  const cells = Array.from({ length: totalSteps }, (_, idx) => {
    const i = idx + 1;
    const isDone = i < step || (i === step && answered);
    return { value: dan * i, isDone };
  });

  return (
    <div className="sct-row">
      {cells.map((c, i) => (
        <span key={i} className={`sct-cell ${c.isDone ? "is-done" : "is-future"}`}>
          {c.isDone ? c.value : "○"}
        </span>
      ))}
    </div>
  );
}
