import "./NumberLine.css";

interface Props {
  values: number[];
  hideLastValue?: boolean;
}

// 0, 4, 8, 12... のように等間隔の目盛りで「同じ数ずつ進む」ことを見せる数直線
export function NumberLine({ values, hideLastValue }: Props) {
  return (
    <div className="nl-scroll">
      <div className="nl-container">
        <div className="nl-baseline" />
        <div className="nl-ticks">
          {values.map((v, i) => {
            const hidden = hideLastValue && i === values.length - 1;
            return (
              <div key={i} className="nl-tick">
                <span className={`nl-dot ${hidden ? "is-hidden" : ""}`} />
                <span className={`nl-label ${hidden ? "is-hidden" : ""}`}>{hidden ? "?" : v}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
