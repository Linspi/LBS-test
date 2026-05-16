import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/features/ScrollToTop";
import { WhatsAppButton } from "@/components/features/WhatsAppButton";
import { ReservationFAB } from "@/components/features/ReservationFAB";
import { EstimationSheet } from "@/components/features/EstimationSheet";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header onMobileMenuChange={setMobileMenuOpen} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* WhatsApp — desktop uniquement (le FAB mobile remplace sur mobile) */}
      {!mobileMenuOpen && (
        <div className="hidden lg:block">
          <WhatsAppButton />
        </div>
      )}

      {/* FAB + EstimationSheet — mobile uniquement */}
      {!mobileMenuOpen && (
        <ReservationFAB onClick={() => setSheetOpen(true)} />
      )}
      <EstimationSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        duration={4000}
        toastOptions={{
          style: {
            background: "#1f1f1f",
            border: "1px solid rgba(90,122,156,0.2)",
            color: "#f5f5f5",
            fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
          },
        }}
      />
    </div>
  );
}
