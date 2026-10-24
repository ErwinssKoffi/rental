"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  ImageIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { revalidateCatalog } from "@/lib/admin/revalidate";
import { formatPrice } from "@/lib/utils";
import { Btn, Pill, Spinner, Notice, TextInput } from "../ui";
import VehicleForm from "./VehicleForm";

const STATUS_TONE = {
  available: "green",
  reserved: "gold",
  rented: "blue",
  maintenance: "red",
  sold: "neutral",
  archived: "neutral",
};

export default function VehicleList() {
  const supabase = createClient();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // véhicule édité ou {} pour création
  const [formOpen, setFormOpen] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("vehicles")
      .select(
        "*, category:categories(name, slug), media:vehicle_media(id, url, sort_order)"
      )
      .order("created_at", { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setVehicles(data ?? []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    return {
      total: vehicles.length,
      available: vehicles.filter((v) => v.status === "available").length,
      featured: vehicles.filter((v) => v.is_featured).length,
      published: vehicles.filter((v) => v.is_published).length,
    };
  }, [vehicles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) =>
      `${v.brand} ${v.model} ${v.slug} ${v.category?.name ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [vehicles, search]);

  function coverOf(v) {
    if (v.cover_image_url) return v.cover_image_url;
    const sorted = [...(v.media ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    return sorted[0]?.url ?? null;
  }

  async function toggleField(id, field, value, slug) {
    setBusyId(id);
    const { error: err } = await supabase
      .from("vehicles")
      .update({ [field]: value })
      .eq("id", id);
    if (err) {
      setError(err.message);
    } else {
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
      );
      await revalidateCatalog(slug);
    }
    setBusyId(null);
  }

  async function removeVehicle(v) {
    const ok = window.confirm(
      `Supprimer définitivement « ${v.brand} ${v.model} » ?\n\n` +
        "La fiche, ses médias et ses photos stockées seront supprimés (action irréversible)."
    );
    if (!ok) return;

    setBusyId(v.id);
    setError(null);

    // Suppression des objets Storage (les lignes vehicle_media sont casscadées)
    const { data: media } = await supabase
      .from("vehicle_media")
      .select("storage_path")
      .eq("vehicle_id", v.id)
      .not("storage_path", "is", null);

    const paths = (media ?? []).map((m) => m.storage_path).filter(Boolean);
    if (paths.length) {
      await supabase.storage.from("vehicle-media").remove(paths);
    }

    const { error: err } = await supabase.from("vehicles").delete().eq("id", v.id);
    if (err) {
      setError(err.message);
    } else {
      setVehicles((prev) => prev.filter((x) => x.id !== v.id));
      await revalidateCatalog(v.slug);
    }
    setBusyId(null);
  }

  function openCreate() {
    setEditing({});
    setFormOpen(true);
  }

  function openEdit(v) {
    setEditing(v);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Véhicules", value: stats.total },
          { label: "Disponibles", value: stats.available },
          { label: "En vedette", value: stats.featured },
          { label: "Publiés", value: stats.published },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
              {s.label}
            </p>
            <p className="font-display text-3xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <TextInput
            placeholder="Rechercher marque, modèle, catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Btn onClick={openCreate}>
          <Plus size={15} />
          Nouveau véhicule
        </Btn>
      </div>

      {error && <Notice type="error">{error}</Notice>}

      {loading ? (
        <Spinner label="Chargement de la flotte..." />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-14 text-center text-white/50">
          Aucun véhicule{search && " ne correspond à votre recherche"}.
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[920px]">
              <thead>
                <tr className="bg-white/[0.04] text-left text-[10px] uppercase tracking-widest text-white/45">
                  <th className="px-4 py-3 font-bold">Véhicule</th>
                  <th className="px-4 py-3 font-bold">Catégorie</th>
                  <th className="px-4 py-3 font-bold">Activité</th>
                  <th className="px-4 py-3 font-bold">Statut</th>
                  <th className="px-4 py-3 font-bold text-right">Tarifs</th>
                  <th className="px-4 py-3 font-bold text-center">Médias</th>
                  <th className="px-4 py-3 font-bold text-center">Réglages</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => {
                  const cover = coverOf(v);
                  return (
                    <tr
                      key={v.id}
                      className="border-t border-white/[0.07] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-white/[0.06] shrink-0 flex items-center justify-center">
                            {cover ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={cover}
                                alt={`${v.brand} ${v.model}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon size={16} className="text-white/30" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-white whitespace-nowrap">
                              {v.brand} {v.model}
                            </p>
                            <p className="text-[11px] text-white/40">{v.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/70">
                        {v.category?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Pill tone={v.business_line === "sale" ? "gold" : "blue"}>
                          {v.business_line === "both"
                            ? "Vente + loc."
                            : v.business_line === "sale"
                              ? "Vente"
                              : "Location"}
                        </Pill>
                      </td>
                      <td className="px-4 py-3">
                        <Pill tone={STATUS_TONE[v.status] ?? "neutral"}>
                          {v.status}
                        </Pill>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <p className="font-semibold">
                          {v.price_per_day != null
                            ? `${formatPrice(v.price_per_day)}/j`
                            : "—"}
                        </p>
                        {v.sale_price != null && (
                          <p className="text-[11px] text-[#E0BE6F]">
                            {formatPrice(v.sale_price)}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-white/60">
                        {(v.media ?? []).length}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title={v.is_featured ? "Retirer des vedettes" : "Mettre en vedette"}
                            disabled={busyId === v.id}
                            onClick={() =>
                              toggleField(v.id, "is_featured", !v.is_featured, v.slug)
                            }
                            className={`p-2 rounded-lg border transition-colors ${
                              v.is_featured
                                ? "border-[#D4AF37]/50 text-[#E0BE6F] bg-[#D4AF37]/10"
                                : "border-white/10 text-white/40 hover:text-white"
                            }`}
                          >
                            <Star size={15} fill={v.is_featured ? "currentColor" : "none"} />
                          </button>
                          <button
                            title={v.is_published ? "Dépublier" : "Publier"}
                            disabled={busyId === v.id}
                            onClick={() =>
                              toggleField(v.id, "is_published", !v.is_published, v.slug)
                            }
                            className={`p-2 rounded-lg border transition-colors ${
                              v.is_published
                                ? "border-emerald-500/40 text-emerald-300"
                                : "border-white/10 text-white/40 hover:text-white"
                            }`}
                          >
                            {v.is_published ? <Eye size={15} /> : <EyeOff size={15} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Modifier"
                            disabled={busyId === v.id}
                            onClick={() => openEdit(v)}
                            className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-[#E0BE6F] hover:border-[#D4AF37]/40 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            title="Supprimer"
                            disabled={busyId === v.id}
                            onClick={() => removeVehicle(v)}
                            className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-300 hover:border-red-500/40 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {formOpen && (
        <VehicleForm
          vehicle={editing}
          onClose={() => setFormOpen(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
