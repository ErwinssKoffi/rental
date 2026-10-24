"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  Trash2,
  Star,
  Link as LinkIcon,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Btn, Field, Notice, TextInput } from "../ui";

function safeFileName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export default function MediaManager({ vehicle, onCoverChange, onChanged }) {
  const supabase = createClient();
  const fileInputRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [externalAlt, setExternalAlt] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("vehicle_media")
      .select("*")
      .eq("vehicle_id", vehicle.id)
      .order("sort_order", { ascending: true });

    if (err) setError(err.message);
    else setMedia(data ?? []);
    setLoading(false);
  }, [supabase, vehicle.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleFiles(e) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;

    setUploading(true);
    setError(null);
    let nextOrder = media.reduce((m, x) => Math.max(m, x.sort_order), -1) + 1;

    for (const file of fileIterator(files)) {
      const path = `${vehicle.slug}/${Date.now()}-${safeFileName(file.name)}`;
      const { error: upErr } = await supabase.storage
        .from("vehicle-media")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (upErr) {
        setError(`Échec de l'upload (${file.name}) : ${upErr.message}`);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("vehicle-media").getPublicUrl(path);

      const { error: insErr } = await supabase.from("vehicle_media").insert({
        vehicle_id: vehicle.id,
        url: publicUrl,
        storage_path: path,
        alt: `${vehicle.brand} ${vehicle.model}`.trim(),
        kind: "image",
        sort_order: nextOrder++,
      });
      if (insErr) setError(insErr.message);
    }

    await load();
    // Première photo = couverture par défaut
    const { data: fresh } = await supabase
      .from("vehicle_media")
      .select("url")
      .eq("vehicle_id", vehicle.id)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (fresh && !vehicle.cover_image_url) {
      await supabase
        .from("vehicles")
        .update({ cover_image_url: fresh.url })
        .eq("id", vehicle.id);
      onCoverChange?.(fresh.url);
    }
    setUploading(false);
    onChanged?.();
  }

  // Permet la compilation même si FileList est itérable nativement
  function* fileIterator(files) {
    for (const f of files) yield f;
  }

  async function addExternalUrl(e) {
    e.preventDefault();
    const url = externalUrl.trim();
    if (!url) return;
    setError(null);

    const nextOrder = media.reduce((m, x) => Math.max(m, x.sort_order), -1) + 1;
    const { error: insErr } = await supabase.from("vehicle_media").insert({
      vehicle_id: vehicle.id,
      url,
      storage_path: null,
      alt: externalAlt.trim() || null,
      kind: "image",
      sort_order: nextOrder,
    });

    if (insErr) {
      setError(insErr.message);
      return;
    }
    setExternalUrl("");
    setExternalAlt("");
    await load();
    onChanged?.();
  }

  async function patchMedia(id, patch) {
    setBusyId(id);
    const { error: err } = await supabase
      .from("vehicle_media")
      .update(patch)
      .eq("id", id);
    if (err) setError(err.message);
    else setMedia((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    setBusyId(null);
  }

  async function setAsCover(m) {
    setBusyId(m.id);
    const { error: err } = await supabase
      .from("vehicles")
      .update({ cover_image_url: m.url })
      .eq("id", vehicle.id);
    if (err) setError(err.message);
    else onCoverChange?.(m.url);
    setBusyId(null);
    onChanged?.();
  }

  async function removeMedia(m) {
    const ok = window.confirm("Supprimer cette photo ?");
    if (!ok) return;
    setBusyId(m.id);
    setError(null);

    if (m.storage_path) {
      const { error: stErr } = await supabase.storage
        .from("vehicle-media")
        .remove([m.storage_path]);
      if (stErr) setError(stErr.message);
    }
    const { error: delErr } = await supabase
      .from("vehicle_media")
      .delete()
      .eq("id", m.id);
    if (delErr) {
      setError(delErr.message);
    } else {
      setMedia((prev) => prev.filter((x) => x.id !== m.id));
      if (vehicle.cover_image_url === m.url) {
        await supabase
          .from("vehicles")
          .update({ cover_image_url: null })
          .eq("id", vehicle.id);
        onCoverChange?.("");
      }
    }
    setBusyId(null);
    onChanged?.();
  }

  const isCover = (m) => (vehicle.cover_image_url ?? null) === m.url;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F] flex items-center gap-2">
          <ImageIcon size={14} />
          Photos & médias ({media.length})
        </h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
        <Btn
          type="button"
          onClick={() => fileInputRef.current?.click()}
          loading={uploading}
        >
          <Upload size={14} />
          Envoyer des photos
        </Btn>
      </div>

      {error && <Notice type="error">{error}</Notice>}

      {/* URL externe */}
      <form
        onSubmit={addExternalUrl}
        className="flex flex-wrap gap-3 items-end rounded-xl border border-white/10 bg-white/[0.02] p-4"
      >
        <div className="flex-1 min-w-[220px]">
          <Field label="Ajouter une URL externe (Unsplash, etc.)">
            <TextInput
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </Field>
        </div>
        <div className="w-full md:w-48">
          <Field label="Texte alternatif">
            <TextInput
              value={externalAlt}
              onChange={(e) => setExternalAlt(e.target.value)}
              placeholder="Description"
            />
          </Field>
        </div>
        <Btn type="submit" variant="ghost">
          <LinkIcon size={14} />
          Ajouter
        </Btn>
      </form>

      {loading ? (
        <div className="flex items-center gap-2 text-white/50 py-8 justify-center">
          <Loader2 size={16} className="animate-spin" /> Chargement...
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 py-12 text-center text-white/40 text-sm">
          Aucune photo. Envoyez des fichiers ou collez une URL externe.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {media.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              <div className="relative h-40 bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.url}
                  alt={m.alt ?? ""}
                  className="w-full h-full object-cover"
                />
                {isCover(m) && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#D4AF37] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                    <Star size={11} fill="currentColor" />
                    Couverture
                  </span>
                )}
                {!m.storage_path && (
                  <span className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-[9px] uppercase tracking-wider text-white/70">
                    URL externe
                  </span>
                )}
              </div>

              <div className="p-3 space-y-2.5">
                <TextInput
                  value={m.alt ?? ""}
                  placeholder="Texte alternatif"
                  onBlur={(e) =>
                    e.target.value !== (m.alt ?? "") &&
                    patchMedia(m.id, { alt: e.target.value || null })
                  }
                />
                <div className="grid grid-cols-[1fr_1fr_70px] gap-2">
                  <TextInput
                    value={m.color_name ?? ""}
                    placeholder="Couleur"
                    onBlur={(e) =>
                      e.target.value !== (m.color_name ?? "") &&
                      patchMedia(m.id, { color_name: e.target.value || null })
                    }
                  />
                  <TextInput
                    value={m.color_hex ?? ""}
                    placeholder="#hex"
                    onBlur={(e) =>
                      e.target.value !== (m.color_hex ?? "") &&
                      patchMedia(m.id, { color_hex: e.target.value || null })
                    }
                  />
                  <TextInput
                    type="number"
                    value={m.sort_order}
                    title="Ordre d'affichage"
                    onBlur={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isFinite(n) && n !== m.sort_order) {
                        patchMedia(m.id, { sort_order: n });
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Btn
                    type="button"
                    variant="ghost"
                    className="flex-1 !px-3 !py-2 !text-[10px]"
                    disabled={busyId === m.id || isCover(m)}
                    onClick={() => setAsCover(m)}
                  >
                    <Star size={12} />
                    Couverture
                  </Btn>
                  <Btn
                    type="button"
                    variant="danger"
                    className="!px-3 !py-2"
                    disabled={busyId === m.id}
                    onClick={() => removeMedia(m)}
                  >
                    <Trash2 size={13} />
                  </Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
