import type { RefObject } from "react";

interface Props {
  fillRef: RefObject<HTMLDivElement | null>;
  secondsRef: RefObject<HTMLSpanElement | null>;
  label: string;
  totalSeconds: number;
}

/** Chrono : bande de service qui se referme, plus le compte en clair. */
export function TimerBar({ fillRef, secondsRef, label, totalSeconds }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary"
        role="timer"
        aria-label={label}
      >
        <div
          ref={fillRef}
          className="h-full origin-left rounded-full bg-gradient-to-r from-destructive to-primary"
          style={{ transform: "scaleX(1)" }}
        />
        <div
          aria-hidden
          className="animate-sweep pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-chalk/25 to-transparent"
        />
      </div>
      <span className="font-display w-8 text-right text-lg font-bold tabular-nums text-foreground">
        <span ref={secondsRef}>{totalSeconds}</span>
      </span>
    </div>
  );
}
