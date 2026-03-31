import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={`404 — ${t("notFound.title")} | BLS`}
        description={t("notFound.description")}
      />

      <section className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-8xl md:text-9xl font-display font-bold text-gradient-gold mb-4">
            404
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground/90 mb-3">
            {t("notFound.title")}
          </h1>
          <p className="text-muted-foreground mb-10">
            {t("notFound.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-semibold hover:brightness-110"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("notFound.backHome")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-white/10 hover:border-gold/20">
              <Link to="/trajets">
                <MapPin className="mr-2 h-4 w-4" />
                {t("notFound.backTrips")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
