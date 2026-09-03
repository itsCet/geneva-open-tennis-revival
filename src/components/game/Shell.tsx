import type { ReactNode } from "react";
import { LanguageSwitch } from "./LanguageSwitch";

interface Props {
  children: ReactNode;
  /** Image de fond optionnelle (photo du Parc des Eaux-Vives). */
  backgroundUrl?: string;
  /** Affiche le lockup officiel en tête. */
  lockup?: boolean;
  footer?: ReactNode;
}

/**
 * Cadre commun : terre battue en dégradé, lignes de court, lockup officiel
 * en tête et logos en pied. Le gabarit du studio est servi en deux WebP
 * transparents (lockup + logos), jamais étiré.
 */
export function Shell({ children, backgroundUrl, lockup = true, footer }: Props) {
  return (
    <div className="court-clay relative flex min-h-dvh flex-col overflow-hidden">
      {backgroundUrl && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      <div aria-hidden className="court-lines pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-clay-line/40"
      />

      <header className="relative z-10 flex items-start justify-between gap-4 px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        {lockup ? (
          <img
            src="/images/lockup.webp"
            alt="Quiz Game — Gonet Geneva Open"
            className="h-11 w-auto sm:h-14"
            width={826}
            height={202}
          />
        ) : (
          <span />
        )}
        <LanguageSwitch />
      </header>

      <div className="relative z-10 flex flex-1 flex-col">{children}</div>

      <footer className="relative z-10 flex items-center justify-between gap-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
        <img
          src="/images/logos.webp"
          alt="Gonet Geneva Open · ATP 250"
          className="h-9 w-auto opacity-90 sm:h-11"
          width={296}
          height={138}
        />
        {footer}
      </footer>
    </div>
  );
}
