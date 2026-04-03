import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

// ── Chargement unique de Stripe (singleton recommandé par la doc) ──
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeCheckoutProps {
  /** Montant en centimes (ex: 8500 = 85,00 EUR) */
  amount: number;
  /** Libellé affiché sur le reçu Stripe */
  description: string;
}

/**
 * Composant de paiement Stripe Embedded Checkout.
 *
 * Appelle notre API serverless pour créer une session, puis affiche
 * le formulaire de paiement sécurisé dans une iframe Stripe.
 * Aucune donnée bancaire ne transite par notre code (PCI-DSS SAQ A).
 */
export function StripeCheckout({ amount, description }: StripeCheckoutProps) {
  const { t } = useTranslation();

  // ── Callback passé à EmbeddedCheckoutProvider pour obtenir le clientSecret ──
  // Les erreurs de fetch sont propagées au provider qui les gère nativement.
  const fetchClientSecret = useCallback(async () => {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error ?? t("checkout.error"));
    }

    const { clientSecret } = await response.json();
    return clientSecret as string;
  }, [amount, description, t]);

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground/90 text-center mb-8">
          {t("checkout.title")}
        </h2>

        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ fetchClientSecret }}
        >
          <CheckoutLoader />
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </section>
  );
}

/** Spinner élégant pendant le chargement de la session Stripe */
function CheckoutLoader() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Loader2 className="h-8 w-8 text-gold animate-spin" />
      <p className="text-muted-foreground text-sm">
        {t("checkout.loading")}
      </p>
    </div>
  );
}
