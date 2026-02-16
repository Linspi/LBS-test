# VTC Premium - Plateforme de Réservation Haut de Gamme

Application de réservation de VTC (Véhicule de Tourisme avec Chauffeur) ciblant une clientèle premium parisienne. Le nom de l'entreprise et du site est "LBS"

## 🎨 Vision Produit & Design (Vibe)

- **Thème & UI :** Design luxueux, épuré, inspirant la confiance. Privilégier un mode sombre (Dark mode) ou des contrastes forts (Noir, anthracite, blanc cassé, touches dorées/beiges).
- **Responsive (Mobile-First) :** 80% des clients VTC réservent sur mobile. L'interface doit être parfaite et fluide sur petit écran.
- **Visuels :** Utilise toujours des URL d'images HD (ex: Unsplash) pour illustrer les véhicules (Classe E, Classe S, Classe V) et les paysages parisiens afin que le rendu soit immédiatement professionnel.

## 🛠 Stack technique

- **Framework** : React 19 + TypeScript
- **Build** : Vite 7
- **Style** : Tailwind CSS 4
- **Routing** : React Router DOM 7
- **UI** : Radix UI (dialog, select, popover) + shadcn/ui (button, card, input, label, date-picker)
- **Icônes** : Lucide React
- **Utilitaires** : clsx, tailwind-merge, class-variance-authority, date-fns

## 💻 Commandes

- `npm run dev` : Serveur de développement
- `npm run build` : Build de production (tsc + vite build)
- `npm run lint` : Linting avec ESLint
- `npm run preview` : Prévisualisation du build

## 📁 Structure du projet

```text
src/
├── App.tsx                  # Routes et layout principal
├── main.tsx                 # Point d'entrée
├── index.css                # Styles globaux (Tailwind)
├── components/
│   ├── features/            # Composants métier (BookingForm, Hero, VehicleCard)
│   ├── layout/              # Header, Footer
│   └── ui/                  # Composants UI réutilisables (shadcn/ui)
├── data/
│   └── vehicles.ts          # Données des véhicules
├── lib/
│   ├── pricing.ts           # Logique de tarification
│   └── utils.ts             # Utilitaires (cn helper)
├── pages/
│   └── Home.tsx             # Page d'accueil
└── types/
    └── index.ts             # Types TypeScript partagés