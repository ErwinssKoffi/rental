"use client";

import { useCallback, useEffect, useState } from "react";
import { LogOut, Car, Tags, ShieldCheck, CalendarClock, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AdminLogin from "./AdminLogin";
import VehicleList from "./fleet/VehicleList";
import CategoryManager from "./categories/CategoryManager";
import BookingsManager from "./bookings/BookingsManager";
import AdminMapPanel from "./map/AdminMapPanel";
import { Spinner } from "./ui";

const TABS = [
  { id: "fleet", label: "Flotte & annonces", icon: Car },
  { id: "bookings", label: "Réservations", icon: CalendarClock },
  { id: "map", label: "Carte GPS", icon: MapPin },
  { id: "categories", label: "Catégories", icon: Tags },
];

export default function AdminApp() {
  const supabase = createClient();
  const [status, setStatus] = useState("loading"); // loading | anon | denied | ready
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState(null);
  const [tab, setTab] = useState("fleet");

  const checkSession = useCallback(async () => {
    setStatus("loading");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setEmail(null);
      setStatus("anon");
      return;
    }

    const { data: prof, error } = await supabase
      .from("profiles")
      .select("role, is_active, first_name, last_name")
      .eq("id", user.id)
      .single();

    if (error || !prof) {
      setProfile(null);
      setEmail(user.email);
      setStatus("denied");
      return;
    }

    if (!prof.is_active || prof.role === "customer") {
      setProfile(prof);
      setEmail(user.email);
      setStatus("denied");
      return;
    }

    setProfile(prof);
    setEmail(user.email);
    setStatus("ready");
  }, [supabase]);

  useEffect(() => {
    checkSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        checkSession();
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase, checkSession]);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black">
        <Spinner label="Vérification de la session..." />
      </div>
    );
  }

  if (status === "anon") {
    return <AdminLogin />;
  }

  if (status === "denied") {
    return (
      <>
        <AdminLogin denied />
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
          <button
            onClick={handleSignOut}
            className="text-xs text-white/40 hover:text-white underline underline-offset-4"
          >
            Se déconnecter
          </button>
        </div>
      </>
    );
  }

  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    email;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Liseré doré */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#E0BE6F,#B68A2F)",
                color: "#000",
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="font-display font-bold text-lg leading-none">
                Velox <span style={{ color: "#D4AF37" }}>Admin</span>
              </p>
              <p className="text-[11px] text-white/45 font-body mt-1">
                Gestion de la flotte
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{fullName}</p>
              <p className="text-[11px] text-white/45 capitalize">
                {profile?.role?.replace("_", " ")} · {email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white/70 hover:border-red-500/50 hover:text-red-300 transition-colors"
            >
              <LogOut size={14} />
              Sortir
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 text-[12px] font-bold uppercase tracking-widest border-b-2 transition-colors ${
                  active
                    ? "border-[#D4AF37] text-[#E0BE6F]"
                    : "border-transparent text-white/45 hover:text-white"
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {tab === "fleet" && <VehicleList />}
        {tab === "bookings" && <BookingsManager />}
        {tab === "map" && <AdminMapPanel />}
        {tab === "categories" && <CategoryManager />}
      </main>
    </div>
  );
}
