export const metadata = {
  title: "Mon espace | Velox Rentals",
};

// Page protégée par middleware (Supabase Auth). L'espace client complet
// (réservations, suivi GPS, factures, KYC) arrive en phase 2.
export default function AccountPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <section className="text-center max-w-2xl space-y-5" style={{ paddingTop: 120 }}>
        <p className="eyebrow">Espace client</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold">
          Mon compte
        </h1>
        <p className="text-white/60 text-lg leading-relaxed">
          Vos réservations et leur suivi en temps réel, vos commandes d&apos;achat,
          vos documents et factures, ainsi que vos pièces KYC seront regroupés ici.
          L&apos;accès est réservé aux utilisateurs connectés.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-4 text-sm font-body uppercase tracking-widest">
          {["Mes locations", "Mes achats", "Suivi GPS", "Documents", "Profil"].map((m) => (
            <span
              key={m}
              className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-white/50"
            >
              {m}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
