import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/features/ScrollToTop";
import { WhatsAppButton } from "@/components/features/WhatsAppButton";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header onMobileMenuChange={setMobileMenuOpen} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {!mobileMenuOpen && <WhatsAppButton />}

      {/* Toast notifications — style premium aligné dark mode */}
      <Toaster
        position="top-right"
        duration={4000}
        toastOptions={{
          style: {
            background: "var(--color-card)",
            border: "1px solid rgba(212, 170, 64, 0.2)",
            color: "var(--color-foreground)",
            fontFamily: "var(--font-sans)",
          },
        }}
      />
    </div>
  );
}
