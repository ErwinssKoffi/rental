"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { revalidateCatalog } from "@/lib/admin/revalidate";
import { slugify } from "@/lib/utils";
import { Btn, Field, Notice, Spinner, TextArea, TextInput, Toggle } from "../ui";

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  sort_order: 0,
  is_active: true,
};

export default function CategoryManager() {
  const supabase = createClient();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (err) setError(err.message);
    else setCategories(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setSlugTouched(true);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      sort_order: cat.sort_order,
      is_active: cat.is_active,
    });
    setSuccess(null);
  }

  function resetForm() {
    setEditingId(null);
    setSlugTouched(false);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) return;
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    };

    const result = editingId
      ? await supabase.from("categories").update(payload).eq("id", editingId)
      : await supabase.from("categories").insert(payload);

    setSaving(false);
    if (result.error) {
      setError(
        result.error.code === "23505"
          ? "Ce slug de catégorie existe déjà."
          : result.error.message
      );
      return;
    }

    setSuccess(
      editingId ? "Catégorie mise à jour." : "Catégorie créée."
    );
    resetForm();
    await load();
    await revalidateCatalog();
  }

  async function remove(cat) {
    const ok = window.confirm(
      `Supprimer la catégorie « ${cat.name} » ?\nLes véhicules associés seront simplement dissociés (aucune suppression de véhicule).`
    );
    if (!ok) return;
    const { error: err } = await supabase
      .from("categories")
      .delete()
      .eq("id", cat.id);
    if (err) setError(err.message);
    else {
      await load();
      await revalidateCatalog();
      if (editingId === cat.id) resetForm();
    }
  }

  if (loading) return <Spinner label="Chargement des catégories..." />;

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
      {/* Liste */}
      <div className="space-y-3">
        {error && <Notice type="error">{error}</Notice>}
        {success && <Notice type="success">{success}</Notice>}

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-white/50">
            Aucune catégorie pour le moment.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-semibold text-white">{cat.name}</p>
                  <span className="text-[11px] text-white/40">/{cat.slug}</span>
                  {!cat.is_active && (
                    <span className="rounded-full bg-red-500/10 border border-red-500/30 text-red-300 px-2 py-0.5 text-[10px] font-bold uppercase">
                      Inactive
                    </span>
                  )}
                </div>
                {cat.description && (
                  <p className="text-sm text-white/50 mt-1 truncate">
                    {cat.description}
                  </p>
                )}
                <p className="text-[11px] text-white/35 mt-1">
                  Ordre : {cat.sort_order}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEdit(cat)}
                  className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-[#E0BE6F] hover:border-[#D4AF37]/40 transition-colors"
                  title="Modifier"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => remove(cat)}
                  className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-300 hover:border-red-500/40 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4 lg:sticky lg:top-32"
      >
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          {editingId ? <Pencil size={16} /> : <Plus size={16} />}
          {editingId ? "Modifier la catégorie" : "Nouvelle catégorie"}
        </h3>

        <Field label="Nom *">
          <TextInput
            required
            value={form.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            placeholder="SUV"
          />
        </Field>
        <Field label="Slug (URL) *">
          <TextInput
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
            placeholder="suv"
          />
        </Field>
        <Field label="Description">
          <TextArea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Véhicules familiaux surélevés..."
          />
        </Field>
        <Field label="Ordre d'affichage">
          <TextInput
            type="number"
            value={form.sort_order}
            onChange={(e) => set("sort_order", e.target.value)}
          />
        </Field>
        <Toggle
          checked={form.is_active}
          onChange={(v) => set("is_active", v)}
          label="Active (visible au public)"
        />

        <div className="flex gap-3 pt-2">
          {editingId && (
            <Btn type="button" variant="ghost" onClick={resetForm} className="flex-1">
              Annuler
            </Btn>
          )}
          <Btn type="submit" loading={saving} className="flex-1">
            <Check size={14} />
            {editingId ? "Enregistrer" : "Créer"}
          </Btn>
        </div>
      </form>
    </div>
  );
}
