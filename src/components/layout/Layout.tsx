import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/features/ScrollToTop";
import { WhatsAppButton } from "@/components/features/WhatsAppButton";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />

      {/* Toast notifications — style premium aligné dark mode */}
      <Toaster
        position="top-right"
        duration={4000}
        toastOptions={{
          style: {
            background: "#1f1f1f",
            border: "1px solid rgba(200, 168, 78, 0.2)",
            color: "#f5f5f5",
            fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
          },
        }}
      />
    </div>
  );
}
