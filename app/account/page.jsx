import AccountApp from "@/components/account/AccountApp";

export const metadata = {
  title: "Mon espace | Velox Rentals",
};

// Espace client : session et données chargées côté navigateur (RLS limite
// chaque client à ses propres réservations et à son profil).
export default function AccountPage() {
  return <AccountApp />;
}
