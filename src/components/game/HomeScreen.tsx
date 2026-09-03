import { QUESTIONS_PER_GAME, QUESTION_DURATION_MS, TOURNAMENT } from "@/config";
import { useLang } from "@/i18n/LanguageContext";
import { format } from "@/i18n/strings";
import { Shell } from "./Shell";

export function HomeScreen({ onStart }: { onStart: () => void }) {
  const { t } = useLang();
  const seconds = Math.round(QUESTION_DURATION_MS / 1000);

  return (
    <Shell backgroundUrl="/images/menu-bg.webp">
      <main
        id="content"
        className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-10"
      >
        <p className="label-caps animate-rise text-primary">{t.eyebrow}</p>

        <h1 className="animate-rise mt-4 text-[clamp(2.25rem,9vw,3.75rem)] leading-[0.95] font-extrabold uppercase text-balance">
          {t.homeTitle}
        </h1>

        <p className="animate-rise mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          {format(t.rules, { s: seconds })}
        </p>

        <div className="animate-rise mt-8 grid grid-cols-3 gap-2">
          {[
            { k: QUESTIONS_PER_GAME, v: "Questions" },
            { k: `${seconds}s`, v: "Chrono" },
            { k: TOURNAMENT.category, v: TOURNAMENT.city },
          ].map((stat) => (
            <div
              key={stat.v}
              className="glass-panel rounded-xl px-3 py-3 text-center"
            >
              <p className="font-display text-2xl font-extrabold tabular-nums text-primary">
                {stat.k}
              </p>
              <p className="label-caps mt-1 text-muted-foreground">{stat.v}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="group animate-pop mt-8 flex min-h-14 w-full items-center justify-between gap-4 rounded-full bg-primary px-6 text-primary-foreground shadow-ace transition-transform duration-[var(--dur-fast)] hover:scale-[1.01] active:scale-[0.99]"
        >
          <span className="font-display text-lg font-extrabold uppercase tracking-wide">
            {t.play}
          </span>
          <span
            aria-hidden
            className="animate-serve grid size-9 place-items-center rounded-full bg-ink/90 text-base text-chalk"
          >
            →
          </span>
        </button>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          {TOURNAMENT.venue} · {TOURNAMENT.url}
        </p>
      </main>
    </Shell>
  );
}
