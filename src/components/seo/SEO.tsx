import { Helmet } from "react-helmet-async";

interface SEOProps {
  /** Titre de la page (balise <title> + og:title) */
  title: string;
  /** Meta description (150-160 caractères recommandés) */
  description: string;
  /** Nom du site pour og:site_name (défaut : "BLS") */
  name?: string;
  /** Type Open Graph (défaut : "website") */
  type?: string;
}

/**
 * Composant SEO réutilisable — génère les balises <title>,
 * <meta description>, Open Graph et robots pour chaque page.
 */
export function SEO({
  title,
  description,
  name = "BLS — Bedadi Limousine Services",
  type = "website",
}: SEOProps) {
  return (
    <Helmet>
      {/* Balises standard */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph — partage réseaux sociaux & WhatsApp */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={name} />
    </Helmet>
  );
}
