import { useLang } from "@/i18n/LanguageContext";

/** Bascule FR / EN, à la manière d'un tableau d'affichage. */
export function LanguageSwitch() {
  const { lang, t, setLang } = useLang();

  return (
    <div
      className="glass-panel flex shrink-0 items-center gap-0.5 rounded-full p-1"
      role="group"
      aria-label={t.switchTo}
    >
      {(["fr", "en"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={`label-caps rounded-full px-3 py-1.5 transition-colors duration-[var(--dur-fast)] ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
