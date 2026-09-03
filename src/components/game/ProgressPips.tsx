interface Props {
  total: number;
  current: number;
  results: boolean[];
}

/** Tableau de marche : un point par question, façon feuille de match. */
export function ProgressPips({ total, current, results }: Props) {
  return (
    <ol className="flex items-center gap-1.5" aria-hidden>
      {Array.from({ length: total }, (_, i) => {
        const done = i < results.length;
        const tone = done
          ? results[i]
            ? "bg-primary"
            : "bg-destructive/70"
          : i === current
            ? "bg-chalk"
            : "bg-net";
        return (
          <li
            key={i}
            className={`h-1.5 rounded-full transition-all duration-[var(--dur-base)] ${tone} ${
              i === current ? "w-6" : "w-3"
            }`}
          />
        );
      })}
    </ol>
  );
}
