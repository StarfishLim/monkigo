type ProgressBarProps = {
  completed: number;
  total: number;
  showMonkeyIcons?: boolean;
};

export const ProgressBar = ({ completed, total, showMonkeyIcons = false }: ProgressBarProps) => {
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  if (showMonkeyIcons && total <= 10) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className="text-2xl transition-transform duration-300"
            style={{
              opacity: i < completed ? 1 : 0.35,
              transform: i < completed ? "scale(1)" : "scale(0.9)"
            }}
            aria-hidden
          >
            {i < completed ? "🐵" : "🐒"}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between text-sm font-bold text-slate-600">
        <span>
          <span className="text-jungle-dark">{completed}</span>
          <span className="font-semibold"> / {total}</span>
        </span>
        <span className="text-jungle-dark">{progress}%</span>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white shadow-soft">
        <div
          key={progress}
          className="mh-progress-fill h-3 rounded-full bg-jungle"
          style={{ width: `${progress}%`, maxWidth: "100%" }}
        />
      </div>
    </div>
  );
};
