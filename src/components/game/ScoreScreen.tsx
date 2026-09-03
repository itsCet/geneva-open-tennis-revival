import { useCallback, useEffect, useState } from "react";
import { TOURNAMENT } from "@/config";
import { useLang } from "@/i18n/LanguageContext";
import { format } from "@/i18n/strings";
import { tierFor } from "@/lib/score";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { Shell } from "./Shell";

interface Props {
  score: number;
  total: number;
  onReplay: () => void;
  onMenu: () => void;
}

export function ScoreScreen({ score, total, onReplay, onMenu }: Props) {
  const { t } = useLang();
  const [shareNote, setShareNote] = useState<string | null>(null);
  const tier = t.tiers[tierFor(score, total)];
  const ratio = total > 0 ? score / total : 0;

  const handleShare = useCallback(async () => {
    const text = `${TOURNAMENT.name} — Quiz Game : ${score}/${total} · ${tier.label}. ${t.shareCta} → ${TOURNAMENT.url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${TOURNAMENT.name} — Quiz Game`, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setShareNote(t.shareDownloaded);
    } catch {
      setShareNote(t.shareFailed);
    }
    window.setTimeout(() => setShareNote(null), 2400);
  }, [score, total, tier.label, t]);

  return (
    <Shell backgroundUrl="/images/score-bg.webp">
      <main
        id="content"
        className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-8"
      >
        <section className="glass-panel animate-pop rounded-3xl px-6 py-8 text-center shadow-court">
          <p className="label-caps text-muted-foreground">{t.yourScore}</p>

          <p className="font-display mt-2 text-[clamp(4rem,22vw,7rem)] leading-none font-extrabold tabular-nums text-primary">
            {score}
            <span className="text-foreground/25">/{total}</span>
          </p>

          {/* Ligne de fond : progression du set */}
          <div className="mx-auto mt-5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-destructive to-primary transition-[width] duration-700 ease-out"
              style={{ width: `${Math.round(ratio * 100)}%` }}
            />
          </div>

          <p className="font-display mt-6 text-2xl font-extrabold uppercase">{tier.label}</p>
          <p className="mt-2 text-[15px] text-muted-foreground text-balance">{tier.line}</p>

          <p className="sr-only">{format(t.outOf, { score, total })}</p>
        </section>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onReplay}
            className="min-h-14 rounded-full bg-primary font-display text-lg font-extrabold uppercase tracking-wide text-primary-foreground shadow-ace transition-transform duration-[var(--dur-fast)] hover:scale-[1.01] active:scale-[0.99]"
          >
            {t.replay}
          </button>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleShare}
              className="min-h-12 flex-1 rounded-full border border-border bg-card/60 text-sm font-bold uppercase tracking-wide backdrop-blur-sm transition-colors duration-[var(--dur-fast)] hover:border-primary/70"
            >
              {t.share}
            </button>
            <button
              type="button"
              onClick={onMenu}
              className="min-h-12 flex-1 rounded-full border border-border bg-card/60 text-sm font-bold uppercase tracking-wide backdrop-blur-sm transition-colors duration-[var(--dur-fast)] hover:border-primary/70"
            >
              {t.menu}
            </button>
          </div>
          <p aria-live="polite" className="h-5 text-center text-xs text-muted-foreground">
            {shareNote}
          </p>
        </div>
      </main>
    </Shell>
  );
}
