import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { GoogleMapsProvider } from "@/providers/GoogleMapsProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Home } from "@/pages/Home";
import { Trajets } from "@/pages/Trajets";
import { MiseADisposition } from "@/pages/MiseADisposition";
import { Excursions } from "@/pages/Excursions";
import { Evenements } from "@/pages/Evenements";
import { Location } from "@/pages/Location";
import { Entreprise } from "@/pages/Entreprise";
import { Reservation } from "@/pages/Reservation";
import { ReservationExperience } from "@/pages/ReservationExperience";
import { DestinationTemplate } from "@/pages/DestinationTemplate";
import { CheckoutReturn } from "@/pages/CheckoutReturn";
import { StripeCheckout } from "@/components/checkout/StripeCheckout";
import { NotFound } from "@/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GoogleMapsProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/trajets" element={<Trajets />} />
          <Route path="/mise-a-disposition" element={<MiseADisposition />} />
          <Route path="/excursions" element={<Excursions />} />
          <Route path="/evenements" element={<Evenements />} />
          <Route path="/location" element={<Location />} />
          <Route path="/entreprise" element={<Entreprise />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/reservation-experience" element={<ReservationExperience />} />
          <Route path="/trajets/:slug" element={<DestinationTemplate />} />
          <Route path="/return" element={<CheckoutReturn />} />
          <Route path="/test-paiement" element={<StripeCheckout amount={15000} description="Trajet Test — Paris CDG" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </GoogleMapsProvider>
    </BrowserRouter>
  );
}

export default App;
