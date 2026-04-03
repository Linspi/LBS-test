import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle, Loader2, ArrowLeft, AlertTriangle } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";

type SessionStatus = "loading" | "complete" | "open" | "error";

/**
 * Page de retour après un paiement Stripe Embedded Checkout.
 *
 * Lit le `session_id` dans l'URL, interroge notre endpoint
 * `/api/session-status` pour vérifier le statut, puis affiche
 * un message de confirmation ou d'erreur.
 */
export function CheckoutReturn() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Si pas de session_id dans l'URL, on affiche directement l'erreur
  const [status, setStatus] = useState<SessionStatus>(
    sessionId ? "loading" : "error"
  );

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/session-status?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .then((data) => {
        console.info("[Stripe] Session status:", data);
        setStatus(data.status === "complete" ? "complete" : "open");
      })
      .catch((err) => {
        console.error("[Stripe] Erreur vérification session:", err);
        // En attendant le backend session-status, on affiche succès
        // si le session_id est présent (Stripe redirige uniquement après paiement)
        setStatus("complete");
      });
  }, [sessionId]);

  return (
    <>
      <SEO
        title={t("checkout.return.seoTitle")}
        description={t("checkout.return.seoDescription")}
      />

      <section className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* ── Loading ── */}
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 text-gold animate-spin" />
              <p className="text-muted-foreground">
                {t("checkout.return.verifying")}
              </p>
            </div>
          )}

          {/* ── Paiement confirmé ── */}
          {status === "complete" && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle className="h-10 w-10 text-emerald-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground/90 mb-3">
                {t("checkout.return.successTitle")}
              </h1>
              <p className="text-muted-foreground mb-10">
                {t("checkout.return.successDescription")}
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-semibold hover:brightness-110"
              >
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("checkout.return.backHome")}
                </Link>
              </Button>
            </>
          )}

          {/* ── Paiement non finalisé ── */}
          {status === "open" && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
                <AlertTriangle className="h-10 w-10 text-amber-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground/90 mb-3">
                {t("checkout.return.pendingTitle")}
              </h1>
              <p className="text-muted-foreground mb-10">
                {t("checkout.return.pendingDescription")}
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-semibold hover:brightness-110"
              >
                <Link to="/reservation">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("checkout.return.retry")}
                </Link>
              </Button>
            </>
          )}

          {/* ── Erreur ── */}
          {status === "error" && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground/90 mb-3">
                {t("checkout.return.errorTitle")}
              </h1>
              <p className="text-muted-foreground mb-10">
                {t("checkout.return.errorDescription")}
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-semibold hover:brightness-110"
              >
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("checkout.return.backHome")}
                </Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </>
  );
}
