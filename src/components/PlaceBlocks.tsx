import "./PlaceBlocks.css";

interface Props {
  tens: number; // 10の倍数の値(例: 30) -> 3本のバーになる
  ones: number; // ドットの個数。くり上がり/くり下がりの途中表示では9を超えることもある
  highlight?: boolean;
}

export function PlaceBlocks({ tens, ones, highlight }: Props) {
  const tensCount = Math.round(tens / 10);

  return (
    <div className={`pb-row ${highlight ? "is-highlight" : ""}`}>
      {tensCount > 0 && (
        <div className="pb-group">
          {Array.from({ length: tensCount }, (_, i) => (
            <div key={i} className="pb-tenbar">
              {Array.from({ length: 10 }, (_, j) => (
                <span key={j} className="pb-tick" />
              ))}
            </div>
          ))}
        </div>
      )}
      {ones > 0 && (
        <div className="pb-group pb-ones">
          {Array.from({ length: ones }, (_, i) => (
            <span key={i} className="pb-dot" />
          ))}
        </div>
      )}
    </div>
  );
}
