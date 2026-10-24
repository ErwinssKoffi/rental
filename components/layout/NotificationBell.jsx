"use client";

// Cloche de notifications in-app :
// - chargement des 20 dernières notifications du client connecté (RLS)
// - diffusion temps réel via Supabase Realtime (postgres_changes)
// - marque comme lu (une / toutes), navigation vers le lien associé
// - rendu null pour les visiteurs non connectés
// Tous les appels réseau sont isolés dans des try/catch : en cas de
// panne Supabase la barre de navigation reste pleinement fonctionnelle.

// useRef porte sur le conteneur du dropdown (détection du clic extérieur).
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  CalendarCheck,
  CreditCard,
  Wrench,
  MapPin,
  Info,
  ShieldCheck,
  BadgeDollarSign,
  FileText,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const GOLD = "#D6B25E";

const KIND_ICONS = {
  booking: CalendarCheck,
  payment: CreditCard,
  maintenance: Wrench,
  tracking: MapPin,
  system: Info,
  kyc: ShieldCheck,
  sales: BadgeDollarSign,
  contract: FileText,
};

const KIND_LABELS = {
  booking: "Réservation",
  payment: "Paiement",
  maintenance: "Entretien",
  tracking: "GPS",
  system: "Information",
  kyc: "KYC",
  sales: "Vente",
  contract: "Contrat",
};

function timeAgo(iso) {
  const date = new Date(iso);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (Number.isNaN(seconds)) return "";
  if (seconds < 60) return "à l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NotificationBell({ placement = "bottom" }) {
  // Convention du repo : le client navigateur est créé à chaque rendu
  // (cf. AccountApp) ; createBrowserComponent reste léger et réutilise
  // la session stockée dans les cookies.
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const wrapRef = useRef(null);

  const unreadCount = items.filter((n) => !n.is_read).length;

  const fetchItems = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, kind, title, body, link, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (!error) setItems(data ?? []);
    } catch (err) {
      console.warn("[NotificationBell] chargement impossible :", err?.message);
    }
  }, [supabase]);

  // Session utilisateur
  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        const {
          data: { user: u },
        } = await supabase.auth.getUser();
        if (active) setUser(u ?? null);
      } catch (err) {
        console.warn("[NotificationBell] session illisible :", err?.message);
      }
    };
    init();

    const { data: authSub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const nextUser = session?.user ?? null;
        setUser(nextUser);
        if (!nextUser) {
          setItems([]);
          setOpen(false);
        }
      }
    );

    return () => {
      active = false;
      authSub?.subscription?.unsubscribe();
    };
  }, [supabase]);

  // Chargement initial + abonnement Realtime
  useEffect(() => {
    if (!user) return;

    fetchItems();

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new;
          setItems((prev) => [row, ...prev].slice(0, 20));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new;
          setItems((prev) => prev.map((n) => (n.id === row.id ? row : n)));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, fetchItems]);

  // Fermeture au clic extérieur / Échap
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const markOne = useCallback(
    async (notification) => {
      if (!notification.is_read) {
        // Mise à jour optimiste
        setItems((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
        try {
          await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", notification.id);
        } catch (err) {
          console.warn("[NotificationBell] mise à jour impossible :", err?.message);
        }
      }
      setOpen(false);
      if (notification.link) router.push(notification.link);
    },
    [supabase, router]
  );

  const markAll = useCallback(async () => {
    if (syncing || unreadCount === 0) return;
    setSyncing(true);
    const unreadIds = items.filter((n) => !n.is_read).map((n) => n.id);
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .in("id", unreadIds);
    } catch (err) {
      console.warn("[NotificationBell] action groupée impossible :", err?.message);
    } finally {
      setSyncing(false);
    }
  }, [supabase, items, syncing, unreadCount]);

  if (!user) return null;

  const panelStyle = {
    position: "absolute",
    right: 0,
    width: "min(340px, calc(100vw - 32px))",
    maxHeight: "420px",
    display: "flex",
    flexDirection: "column",
    background: "rgba(12,12,12,0.97)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(214,178,94,0.22)",
    borderRadius: "16px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.75)",
    overflow: "hidden",
    zIndex: 1200,
    ...(placement === "top"
      ? { bottom: "calc(100% + 12px)" }
      : { top: "calc(100% + 12px)" }),
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} non lues` : ""}`}
        aria-expanded={open}
        style={{
          position: "relative",
          width: "46px",
          height: "46px",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.03)",
          color: "rgba(255,255,255,0.85)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(214,178,94,0.55)";
          e.currentTarget.style.color = GOLD;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
          e.currentTarget.style.color = "rgba(255,255,255,0.85)";
        }}
      >
        <Bell size={18} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              minWidth: "18px",
              height: "18px",
              padding: "0 5px",
              borderRadius: "999px",
              background: "linear-gradient(135deg,#E0BE6F,#B68A2F)",
              color: "#050505",
              fontSize: "10px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(214,178,94,0.45)",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={panelStyle} role="dialog" aria-label="Notifications">
          {/* En-tête */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <span
              className="font-body"
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#ffffff",
              }}
            >
              Notifications
            </span>
            <button
              type="button"
              onClick={markAll}
              disabled={syncing || unreadCount === 0}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "none",
                border: "none",
                cursor: unreadCount === 0 ? "default" : "pointer",
                color: unreadCount === 0 ? "rgba(255,255,255,0.30)" : GOLD,
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: 0,
              }}
            >
              <CheckCheck size={14} />
              Tout marquer lu
            </button>
          </div>

          {/* Liste */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {items.length === 0 ? (
              <div
                style={{
                  padding: "36px 20px",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                }}
              >
                <Bell
                  size={26}
                  strokeWidth={1.4}
                  style={{ color: "rgba(214,178,94,0.5)", marginBottom: 10 }}
                />
                <div>Aucune notification pour le moment.</div>
              </div>
            ) : (
              items.map((n) => {
                const Icon = KIND_ICONS[n.kind] ?? Info;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markOne(n)}
                    style={{
                      width: "100%",
                      display: "flex",
                      gap: "12px",
                      textAlign: "left",
                      padding: "14px 18px",
                      background: n.is_read
                        ? "transparent"
                        : "rgba(214,178,94,0.07)",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = n.is_read
                        ? "transparent"
                        : "rgba(214,178,94,0.07)")
                    }
                  >
                    <span
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: GOLD,
                        background: "rgba(214,178,94,0.10)",
                        border: "1px solid rgba(214,178,94,0.20)",
                      }}
                    >
                      <Icon size={16} strokeWidth={1.8} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "3px",
                        }}
                      >
                        <span
                          className="font-body"
                          style={{
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: n.is_read
                              ? "rgba(255,255,255,0.75)"
                              : "#ffffff",
                          }}
                        >
                          {n.title}
                        </span>
                        {!n.is_read && (
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "999px",
                              background: GOLD,
                              flexShrink: 0,
                              boxShadow: "0 0 8px rgba(214,178,94,0.7)",
                            }}
                          />
                        )}
                      </span>
                      {n.body && (
                        <span
                          style={{
                            display: "block",
                            fontSize: "12px",
                            lineHeight: 1.55,
                            color: "rgba(255,255,255,0.55)",
                            marginBottom: "5px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {n.body}
                        </span>
                      )}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "10.5px",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.38)",
                        }}
                      >
                        <span style={{ color: "rgba(214,178,94,0.75)" }}>
                          {KIND_LABELS[n.kind] ?? n.kind}
                        </span>
                        <span aria-hidden>•</span>
                        <span>{timeAgo(n.created_at)}</span>
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
