import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
] as const;

/**
 * Sélecteur de langue compact, style pill dorée.
 * Bascule instantanément entre FR et EN sans rechargement.
 */
export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-0.5 gap-0.5">
      {LANGUAGES.map(({ code, label }) => {
        const isActive = i18n.resolvedLanguage === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => i18n.changeLanguage(code)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200 cursor-pointer",
              isActive
                ? "bg-gold/15 text-gold shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={`Switch to ${label}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
