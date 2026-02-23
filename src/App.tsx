import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { GoogleMapsProvider } from "@/providers/GoogleMapsProvider";
import { Home } from "@/pages/Home";
import { Trajets } from "@/pages/Trajets";
import { MiseADisposition } from "@/pages/MiseADisposition";
import { Excursions } from "@/pages/Excursions";
import { Evenements } from "@/pages/Evenements";
import { Location } from "@/pages/Location";
import { Entreprise } from "@/pages/Entreprise";
import { Reservation } from "@/pages/Reservation";
import { ReservationExperience } from "@/pages/ReservationExperience";

function App() {
  return (
    <BrowserRouter>
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
        </Route>
      </Routes>
      </GoogleMapsProvider>
    </BrowserRouter>
  );
}

export default App;
