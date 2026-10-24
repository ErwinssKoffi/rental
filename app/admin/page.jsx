import AdminApp from "@/components/admin/AdminApp";

export const metadata = {
  title: "Administration | Velox Rentals",
};

// Back-office : l'authentification et le contrôle des rôles sont gérés
// côté client (navigateur, qui a accès à Supabase), doublés par le proxy
// et les politiques RLS is_staff() sur chaque écriture.
export default function AdminPage() {
  return <AdminApp />;
}
