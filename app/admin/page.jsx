export const metadata = {
  title: "Administration | Velox Rentals",
};

// Page protégée par middleware (Supabase Auth) + RLS côté base.
// Le back-office complet sera construit aux phases 1 à 6.
export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <section className="text-center max-w-2xl space-y-5" style={{ paddingTop: 120 }}>
        <p className="eyebrow">Accès restreint — personnel autorisé</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold">
          Dashboard administrateur
        </h1>
        <p className="text-white/60 text-lg leading-relaxed">
          Cette zone centralisera la flotte, les locations et leurs suivis GPS,
          les ventes, les clients, la finance et les rapports. Elle est déjà
          protégée par Supabase Auth et les politiques RLS de la base.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-4 text-sm font-body uppercase tracking-widest">
          {["Flotte", "Réservations", "Ventes", "Carte GPS", "Rapports"].map((m) => (
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
