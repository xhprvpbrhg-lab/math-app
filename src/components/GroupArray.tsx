import "./GroupArray.css";

interface Props {
  dan: number;
  visibleGroups: number;
  highlightLastGroup: boolean;
  mode: "dots" | "outline";
}

export function GroupArray({ dan, visibleGroups, highlightLastGroup, mode }: Props) {
  const groups = Array.from({ length: visibleGroups }, (_, i) => i);
  const units = Array.from({ length: dan }, (_, i) => i);

  return (
    <div className="ga-row">
      {groups.map((g) => {
        const isNew = highlightLastGroup && g === visibleGroups - 1;
        return (
          <div key={g} className={`ga-col ${isNew ? "is-new" : ""}`}>
            {units.map((u) => (
              <div key={u} className={`ga-unit ga-unit--${mode}`}>
                {mode === "dots" && <span className="ga-dot" />}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
