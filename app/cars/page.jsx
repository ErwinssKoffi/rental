import CarsClient from "./CarsClient";
import { getAllVehicles } from "@/lib/server/vehicles-repo";

// ISR : les affiches mises à jour depuis l'admin deviennent visibles
// au revalidate (on passera en revalidation à la demande dès l'édition admin).
export const revalidate = 60;

export const metadata = {
  title: "Inventory | Velox Rentals",
};

export default async function CarsPage() {
  const vehicles = await getAllVehicles();
  return <CarsClient initialCars={vehicles} />;
}
