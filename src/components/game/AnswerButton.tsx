export type AnswerState = "idle" | "correct" | "wrong" | "muted";

interface Props {
  letter: string;
  text: string;
  state: AnswerState;
  disabled: boolean;
  onClick: () => void;
  ariaLabel: string;
  index: number;
}

/**
 * Réponse. Jamais la couleur seule : chaque état porte aussi un glyphe.
 * Le repère de lettre reprend le marquage de couloir d'un court.
 */
export function AnswerButton({
  letter,
  text,
  state,
  disabled,
  onClick,
  ariaLabel,
  index,
}: Props) {
  const shell =
    state === "correct"
      ? "border-primary bg-primary/20 text-foreground shadow-ace"
      : state === "wrong"
        ? "border-destructive/70 bg-destructive/15 text-foreground"
        : state === "muted"
          ? "border-border/60 bg-card/40 text-muted-foreground"
          : "border-border bg-card/70 text-foreground hover:border-primary/70 hover:bg-card active:scale-[0.99]";

  const chip =
    state === "correct"
      ? "bg-primary text-primary-foreground"
      : state === "wrong"
        ? "bg-destructive text-destructive-foreground"
        : state === "muted"
          ? "bg-secondary text-muted-foreground"
          : "bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{ animationDelay: `${index * 45}ms` }}
      className={`group animate-rise flex min-h-[var(--tap,56px)] w-full items-center gap-3 rounded-xl border px-3 py-3 text-left backdrop-blur-sm transition-all duration-[var(--dur-fast)] disabled:cursor-default ${shell}`}
    >
      <span
        className={`font-display grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold transition-colors duration-[var(--dur-fast)] ${chip}`}
        aria-hidden
      >
        {state === "correct" ? "✓" : state === "wrong" ? "✕" : letter}
      </span>
      <span className="text-[15px] leading-snug font-medium text-balance">{text}</span>
    </button>
  );
}
