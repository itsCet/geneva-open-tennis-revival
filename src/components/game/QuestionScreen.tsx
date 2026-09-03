import { useCallback, useEffect, useRef, useState } from "react";
import { FEEDBACK_DURATION_MS, QUESTION_DURATION_MS } from "@/config";
import { useCountdown } from "@/game/useCountdown";
import { useLang } from "@/i18n/LanguageContext";
import { format } from "@/i18n/strings";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import type { Question } from "@/types";
import { AnswerButton } from "./AnswerButton";
import type { AnswerState } from "./AnswerButton";
import { ProgressPips } from "./ProgressPips";
import { TimerBar } from "./TimerBar";

const LETTERS = ["A", "B", "C", "D"];

interface Props {
  question: Question;
  index: number;
  total: number;
  phase: "playing" | "feedback";
  selected: number | null;
  timedOut: boolean;
  results: boolean[];
  score: number;
  onAnswer: (selected: number | null) => void;
  onNext: () => void;
}

export function QuestionScreen({
  question,
  index,
  total,
  phase,
  selected,
  timedOut,
  results,
  score,
  onAnswer,
  onNext,
}: Props) {
  const { t, lang } = useLang();
  const reducedMotion = usePrefersReducedMotion();
  const fillRef = useRef<HTMLDivElement | null>(null);
  const secondsRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const answering = phase === "playing";
  const totalSeconds = Math.round(QUESTION_DURATION_MS / 1000);
  const isCorrect = selected !== null && selected === question.correctIndex;
  const [urgent, setUrgent] = useState(false);

  const handleTick = useCallback(
    (remaining: number) => {
      const value = reducedMotion
        ? Math.ceil(remaining * totalSeconds) / totalSeconds
        : remaining;
      const fill = fillRef.current;
      if (fill) fill.style.transform = `scaleX(${value})`;
      const secondsLeft = Math.ceil(remaining * totalSeconds);
      const label = secondsRef.current;
      if (label) {
        const seconds = String(secondsLeft);
        if (label.textContent !== seconds) label.textContent = seconds;
      }
      setUrgent(secondsLeft <= 3 && secondsLeft > 0);
    },
    [reducedMotion, totalSeconds],
  );

  const handleExpire = useCallback(() => onAnswer(null), [onAnswer]);

  useCountdown({
    durationMs: QUESTION_DURATION_MS,
    running: answering,
    onTick: handleTick,
    onExpire: handleExpire,
  });

  useEffect(() => {
    if (phase !== "feedback") return;
    const id = window.setTimeout(onNext, FEEDBACK_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [phase, index, onNext]);

  useEffect(() => {
    headingRef.current?.focus();
    setUrgent(false);
  }, [index]);

  useEffect(() => {
    if (!answering) setUrgent(false);
  }, [answering]);

  const stateFor = (i: number): AnswerState => {
    if (answering) return "idle";
    if (i === question.correctIndex) return "correct";
    if (i === selected) return "wrong";
    return "muted";
  };

  const verdict = timedOut ? t.timeUp : isCorrect ? t.answeredCorrect : t.answeredWrong;
  const correctText = question.options[question.correctIndex] ?? "";

  return (
    <div className="court-clay relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
        style={{ backgroundImage: "url(/images/menu-bg.webp)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/80"
      />
      <div aria-hidden className="court-lines pointer-events-none absolute inset-0 opacity-40" />

      {/* Scoreboard */}
      <header className="glass-panel relative z-10 mx-3 mt-[max(0.75rem,env(safe-area-inset-top))] rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <ProgressPips total={total} current={index} results={results} />
          <div className="flex items-baseline gap-3">
            <span className="label-caps text-muted-foreground">{t.yourScore}</span>
            <span className="font-display text-lg font-extrabold tabular-nums text-primary">
              {score}
              <span className="text-muted-foreground">/{total}</span>
            </span>
          </div>
        </div>
        <div className="mt-3">
          <TimerBar
            fillRef={fillRef}
            secondsRef={secondsRef}
            label={t.timerLabel}
            totalSeconds={totalSeconds}
            urgent={urgent && answering}
          />
        </div>
      </header>

      <main
        id="content"
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-6"
      >
        <p className="label-caps text-primary">
          {format(t.progress, { n: index + 1, total })}
        </p>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="animate-rise mt-3 text-[clamp(1.65rem,6vw,2.6rem)] leading-[1.12] font-extrabold text-balance outline-none"
        >
          {question.prompt}
        </h1>

        <div className="mt-7 flex flex-col gap-3">
          {question.options.map((option, i) => (
            <AnswerButton
              key={`${question.id}-${i}`}
              index={i}
              letter={LETTERS[i] ?? String(i + 1)}
              text={option}
              state={stateFor(i)}
              disabled={!answering}
              onClick={() => onAnswer(i)}
              ariaLabel={`${format(t.optionPrefix, { letter: LETTERS[i] ?? i + 1 })} : ${option}`}
            />
          ))}
        </div>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 min-h-[104px] rounded-2xl px-4 py-4 transition-colors duration-[var(--dur-base)]"
          style={{
            backgroundColor:
              phase === "feedback" ? "oklch(0.1487 0.0322 275.6 / 0.85)" : "transparent",
          }}
        >
          {phase === "feedback" && (
            <div className="animate-pop">
              <p
                className={`label-caps ${isCorrect ? "text-primary" : "text-destructive"}`}
              >
                {verdict}
              </p>
              {!isCorrect && (
                <p className="mt-1.5 text-[15px] font-bold">
                  {t.correctAnswerWas}{lang === "fr" ? " : " : ": "}{correctText}
                </p>
              )}
              <p className="mt-1.5 text-[14px] leading-snug text-muted-foreground">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      </main>

      <div className="pb-[max(1rem,env(safe-area-inset-bottom))]" />
    </div>
  );
}
