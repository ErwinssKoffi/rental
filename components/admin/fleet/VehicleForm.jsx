"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { revalidateCatalog } from "@/lib/admin/revalidate";
import { slugify } from "@/lib/utils";
import {
  Btn,
  Field,
  Modal,
  Notice,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "../ui";
import MediaManager from "./MediaManager";

const BUSINESS_LINES = [
  { value: "both", label: "Vente + location" },
  { value: "rental", label: "Location uniquement" },
  { value: "sale", label: "Vente uniquement" },
];

const STATUSES = [
  "available",
  "reserved",
  "rented",
  "maintenance",
  "sold",
  "archived",
];

const TRANSMISSIONS = ["automatic", "manual", "other"];
const FUELS = ["petrol", "diesel", "electric", "hybrid"];

function emptyForm() {
  return {
    slug: "",
    brand: "",
    model: "",
    title: "",
    description: "",
    category_id: "",
    agency_id: "",
    business_line: "both",
    status: "available",
    year: "",
    price_per_day: "",
    sale_price: "",
    deposit_amount: "",
    transmission: "automatic",
    fuel_type: "petrol",
    seats: "",
    mileage: "",
    engine: "",
    top_speed: "",
    acceleration: "",
    features: [],
    rating: "",
    badge: "",
    video_url: "",
    cover_image_url: "",
    vin: "",
    plate_number: "",
    is_featured: false,
    is_published: true,
  };
}

function toForm(v) {
  const base = emptyForm();
  if (!v || !v.id) return base;
  for (const key of Object.keys(base)) {
    if (key === "features") {
      base.features = Array.isArray(v.features) ? v.features : [];
    } else if (v[key] != null) {
      base[key] = v[key];
    }
  }
  return base;
}

const numOrNull = (v) => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export default function VehicleForm({ vehicle, onClose, onSaved }) {
  const supabase = createClient();
  const isEdit = !!vehicle?.id;
  const [form, setForm] = useState(() => toForm(vehicle));
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [featureInput, setFeatureInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [savedVehicle, setSavedVehicle] = useState(isEdit ? vehicle : null);

  useEffect(() => {
    (async () => {
      const [{ data: cats }, { data: ags }] = await Promise.all([
        supabase
          .from("categories")
          .select("id, name, slug")
          .order("sort_order"),
        supabase.from("agencies").select("id, name").eq("is_active", true),
      ]);
      setCategories(cats ?? []);
      setAgencies(ags ?? []);
    })();
  }, [supabase]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function autoSlug(brand, model) {
    if (slugTouched) return;
    set("slug", slugify(`${brand} ${model}`));
  }

  function addFeature(raw) {
    const value = raw.trim();
    if (!value) return;
    if (!form.features.includes(value)) {
      set("features", [...form.features, value]);
    }
    setFeatureInput("");
  }

  function removeFeature(f) {
    set(
      "features",
      form.features.filter((x) => x !== f)
    );
  }

  const canSubmit = useMemo(
    () => form.brand.trim() && form.model.trim() && form.slug.trim(),
    [form.brand, form.model, form.slug]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError(null);

    const payload = {
      slug: form.slug.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      title: form.title || null,
      description: form.description || null,
      category_id: form.category_id || null,
      agency_id: form.agency_id || null,
      business_line: form.business_line,
      status: form.status,
      year: numOrNull(form.year),
      price_per_day: numOrNull(form.price_per_day),
      sale_price: numOrNull(form.sale_price),
      deposit_amount: numOrNull(form.deposit_amount),
      transmission: form.transmission,
      fuel_type: form.fuel_type,
      seats: numOrNull(form.seats),
      mileage: form.mileage || null,
      engine: form.engine || null,
      top_speed: form.top_speed || null,
      acceleration: form.acceleration || null,
      features: form.features,
      rating: numOrNull(form.rating),
      badge: form.badge || null,
      video_url: form.video_url || null,
      cover_image_url: form.cover_image_url || null,
      vin: form.vin || null,
      plate_number: form.plate_number || null,
      is_featured: form.is_featured,
      is_published: form.is_published,
    };

    let result;
    if (isEdit || savedVehicle?.id) {
      const id = savedVehicle?.id ?? vehicle.id;
      result = await supabase.from("vehicles").update(payload).eq("id", id).select().single();
    } else {
      result = await supabase.from("vehicles").insert(payload).select().single();
    }

    setSaving(false);
    if (result.error) {
      setError(
        result.error.code === "23505"
          ? "Ce slug est déjà utilisé par un autre véhicule."
          : result.error.message
      );
      return;
    }

    setSavedVehicle(result.data);
    await revalidateCatalog(result.data.slug);
    onSaved?.();
  }

  const activeVehicle = savedVehicle ?? (isEdit ? vehicle : null);

  return (
    <Modal
      title={isEdit ? `Modifier : ${vehicle.brand} ${vehicle.model}` : "Nouveau véhicule"}
      onClose={onClose}
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Notice type="error">{error}</Notice>}
        {activeVehicle?.id && (
          <Notice type="success">
            <span className="flex items-center gap-2">
              <Check size={15} />
              Annonce enregistrée. Vous pouvez maintenant gérer ses photos
              ci-dessous.
            </span>
          </Notice>
        )}

        {/* Identité */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F]">
            Identité
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Marque *">
              <TextInput
                required
                value={form.brand}
                onChange={(e) => {
                  set("brand", e.target.value);
                  autoSlug(e.target.value, form.model);
                }}
                placeholder="Porsche"
              />
            </Field>
            <Field label="Modèle *">
              <TextInput
                required
                value={form.model}
                onChange={(e) => {
                  set("model", e.target.value);
                  autoSlug(form.brand, e.target.value);
                }}
                placeholder="911 Carrera"
              />
            </Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Slug (URL) *" hint="Auto-généré, modifiable si besoin">
              <TextInput
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
                placeholder="porsche-911-carrera"
              />
            </Field>
            <Field label="Titre d'affichage" hint="Sinon « marque modèle » est utilisé">
              <TextInput
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Porsche 911 Carrera — Édition Or"
              />
            </Field>
          </div>
          <Field label="Description">
            <TextArea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Description commerciale complète du véhicule..."
            />
          </Field>
        </section>

        {/* Classement & disponibilité */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F]">
            Classement & disponibilité
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Catégorie">
              <Select
                value={form.category_id}
                onChange={(e) => set("category_id", e.target.value)}
              >
                <option value="">— Aucune —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Agence">
              <Select
                value={form.agency_id}
                onChange={(e) => set("agency_id", e.target.value)}
              >
                <option value="">— Aucune —</option>
                {agencies.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Activité">
              <Select
                value={form.business_line}
                onChange={(e) => set("business_line", e.target.value)}
              >
                {BUSINESS_LINES.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Statut">
              <Select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="flex flex-wrap gap-8 pt-1">
            <Toggle
              checked={form.is_published}
              onChange={(v) => set("is_published", v)}
              label="Publié sur le site"
            />
            <Toggle
              checked={form.is_featured}
              onChange={(v) => set("is_featured", v)}
              label="Mettre en vedette (page d'accueil)"
            />
          </div>
        </section>

        {/* Tarifs */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F]">
            Tarifs (USD)
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Prix location / jour">
              <TextInput
                type="number"
                min="0"
                step="0.01"
                value={form.price_per_day}
                onChange={(e) => set("price_per_day", e.target.value)}
              />
            </Field>
            <Field label="Prix de vente">
              <TextInput
                type="number"
                min="0"
                step="0.01"
                value={form.sale_price}
                onChange={(e) => set("sale_price", e.target.value)}
              />
            </Field>
            <Field label="Caution">
              <TextInput
                type="number"
                min="0"
                step="0.01"
                value={form.deposit_amount}
                onChange={(e) => set("deposit_amount", e.target.value)}
              />
            </Field>
          </div>
        </section>

        {/* Caractéristiques */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F]">
            Caractéristiques
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Field label="Année">
              <TextInput
                type="number"
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
              />
            </Field>
            <Field label="Transmission">
              <Select
                value={form.transmission}
                onChange={(e) => set("transmission", e.target.value)}
              >
                {TRANSMISSIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Carburant">
              <Select
                value={form.fuel_type}
                onChange={(e) => set("fuel_type", e.target.value)}
              >
                {FUELS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Places">
              <TextInput
                type="number"
                min="1"
                value={form.seats}
                onChange={(e) => set("seats", e.target.value)}
              />
            </Field>
            <Field label="Kilométrage">
              <TextInput
                value={form.mileage}
                onChange={(e) => set("mileage", e.target.value)}
                placeholder="12 500 km"
              />
            </Field>
            <Field label="Moteur">
              <TextInput
                value={form.engine}
                onChange={(e) => set("engine", e.target.value)}
                placeholder="3.0L twin-turbo"
              />
            </Field>
            <Field label="Vitesse max">
              <TextInput
                value={form.top_speed}
                onChange={(e) => set("top_speed", e.target.value)}
                placeholder="308 km/h"
              />
            </Field>
            <Field label="0-100 km/h">
              <TextInput
                value={form.acceleration}
                onChange={(e) => set("acceleration", e.target.value)}
                placeholder="3.5 s"
              />
            </Field>
          </div>

          <Field label="Équipements" hint="Tapez Entrée ou une virgule pour ajouter">
            <div className="rounded-lg border border-white/10 bg-black/40 p-2.5 flex flex-wrap gap-2">
              {form.features.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-3 py-1 text-xs text-[#E0BE6F]"
                >
                  {f}
                  <button
                    type="button"
                    onClick={() => removeFeature(f)}
                    className="hover:text-white"
                    aria-label={`Retirer ${f}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                className="flex-1 min-w-[160px] bg-transparent outline-none text-sm text-white placeholder:text-white/30 px-1 py-1"
                value={featureInput}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v.includes(",")) {
                    v.split(",").forEach(addFeature);
                  } else {
                    setFeatureInput(v);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature(featureInput);
                  }
                }}
                placeholder={form.features.length ? "" : "Ex : caméra de recul, toit ouvrant..."}
              />
            </div>
          </Field>
        </section>

        {/* Divers */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F]">
            Informations complémentaires
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Badge">
              <TextInput
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
                placeholder="Nouveau / Promo..."
              />
            </Field>
            <Field label="Note (0-5)">
              <TextInput
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
              />
            </Field>
            <Field label="URL vidéo">
              <TextInput
                value={form.video_url}
                onChange={(e) => set("video_url", e.target.value)}
                placeholder="https://..."
              />
            </Field>
            <Field label="Image de couverture (URL)">
              <TextInput
                value={form.cover_image_url}
                onChange={(e) => set("cover_image_url", e.target.value)}
                placeholder="Auto si photos gérées ci-dessous"
              />
            </Field>
            <Field label="VIN">
              <TextInput
                value={form.vin}
                onChange={(e) => set("vin", e.target.value)}
              />
            </Field>
            <Field label="Immatriculation">
              <TextInput
                value={form.plate_number}
                onChange={(e) => set("plate_number", e.target.value)}
              />
            </Field>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <Btn type="button" variant="ghost" onClick={onClose}>
            Fermer
          </Btn>
          <Btn type="submit" loading={saving} disabled={!canSubmit}>
            {isEdit || savedVehicle?.id ? "Enregistrer les modifications" : "Créer le véhicule"}
          </Btn>
        </div>
      </form>

      {/* Médias : uniquement une fois le véhicule existant */}
      {activeVehicle?.id && (
        <div className="mt-8 pt-8 border-t border-white/10">
          <MediaManager
            vehicle={activeVehicle}
            onCoverChange={(url) => set("cover_image_url", url)}
            onChanged={() => revalidateCatalog(activeVehicle.slug)}
          />
        </div>
      )}

      {!activeVehicle?.id && (
        <div className="mt-8 pt-8 border-t border-white/10">
          <Notice>
            <span className="flex items-center gap-2">
              <Plus size={15} />
              Enregistrez d&apos;abord le véhicule pour ajouter ses photos.
            </span>
          </Notice>
        </div>
      )}
    </Modal>
  );
}
