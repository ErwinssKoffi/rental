import AdminLogin from "@/components/admin/AdminLogin";

export const metadata = {
  title: "Connexion | Velox Rentals",
};

// Page de connexion publique (hors matcher du proxy). Le formulaire gère
// la redirection post-connexion via le paramètre `next`.
export default function LoginPage() {
  return <AdminLogin />;
}
