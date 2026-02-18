import { MessageCircle } from "lucide-react";

/**
 * Bouton WhatsApp flottant — lien direct vers le chat BLS.
 */
export function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/33652868946"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nous contacter sur WhatsApp"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
            style={{ backgroundColor: "#25D366" }}
        >
            <MessageCircle className="h-7 w-7 text-white fill-white" />
        </a>
    );
}
