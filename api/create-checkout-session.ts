import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

// ── Initialisation Stripe (clé secrète, côté serveur uniquement) ──
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// ── URL de retour après paiement ──
const RETURN_URL =
  process.env.VERCEL_ENV === "production"
    ? "https://www.VOTRE-DOMAINE-ICI.com/return?session_id={CHECKOUT_SESSION_ID}"
    : "http://localhost:5173/return?session_id={CHECKOUT_SESSION_ID}";

/**
 * POST /api/create-checkout-session
 *
 * Crée une session Stripe Embedded Checkout et renvoie le clientSecret
 * au front-end pour initialiser le composant de paiement sécurisé.
 *
 * Body attendu :
 *  - amount      : montant en centimes (ex: 8500 = 85,00 EUR)
 *  - currency    : devise ISO (défaut: "eur")
 *  - description : libellé du trajet affiché sur le reçu Stripe
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Seules les requêtes POST sont acceptées
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { amount, currency = "eur", description } = req.body;

    // ── Validation des entrées ──
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        error: "Le montant (amount) doit être un nombre positif en centimes.",
      });
    }

    if (!description || typeof description !== "string") {
      return res.status(400).json({
        error: "La description du trajet est requise.",
      });
    }

    // ── Création de la session Stripe Embedded Checkout ──
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      return_url: RETURN_URL,
    });

    return res.status(200).json({ clientSecret: session.client_secret });
  } catch (err) {
    // Log serveur pour le debugging (visible dans les logs Vercel)
    console.error("[Stripe] Erreur création session:", err);

    // Message générique côté client (ne jamais exposer les détails internes)
    return res.status(500).json({
      error: "Erreur lors de la création de la session de paiement.",
    });
  }
}
