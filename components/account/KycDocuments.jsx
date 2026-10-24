"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShieldCheck, Upload, Trash2, FileText, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  KYC_BUCKET,
  KYC_DOC_TYPES,
  KYC_DOC_LABELS,
  KYC_STATUS_LABELS,
  KYC_STATUS_TONES,
  safeFileName,
} from "@/lib/kyc";
import { Pill, Notice, Btn, Select } from "@/components/admin/ui";
import { formatDate } from "@/lib/bookings";

export default function KycDocuments({ user, kycVerified, onVerifiedChange }) {
  const supabase = useRef(createClient()).current;
  const fileRef = useRef(null);
  const [docs, setDocs] = useState([]);
  const [type, setType] = useState("id_card");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("customer_documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setDocs(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleFiles(e) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;

    setUploading(true);
    setError(null);
    setInfo(null);

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`« ${file.name} » dépasse la limite de 10 Mo.`);
        continue;
      }
      const path = `${user.id}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
      const { error: upErr } = await supabase.storage
        .from(KYC_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (upErr) {
        setError(upErr.message);
        continue;
      }

      const { error: insErr } = await supabase.from("customer_documents").insert({
        customer_id: user.id,
        type,
        file_name: file.name,
        storage_path: path,
        mime_type: file.type || null,
        size_bytes: file.size,
        status: "pending",
      });
      if (insErr) setError(insErr.message);
    }

    setInfo("Document envoyé. Notre équipe procédera à la vérification.");
    setUploading(false);
    await load();
  }

  async function removeDoc(doc) {
    const ok = window.confirm(`Retirer « ${doc.file_name} » ?`);
    if (!ok) return;
    const { error: stErr } = await supabase.storage
      .from(KYC_BUCKET)
      .remove([doc.storage_path]);
    if (stErr) {
      setError(stErr.message);
      return;
    }
    const { error: delErr } = await supabase
      .from("customer_documents")
      .delete()
      .eq("id", doc.id);
    if (delErr) setError(delErr.message);
    else await load();
  }

  async function preview(doc) {
    const { data, error: err } = await supabase.storage
      .from(KYC_BUCKET)
      .createSignedUrl(doc.storage_path, 300);
    if (err) setError(err.message);
    else window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/50 py-8 justify-center">
        <Loader2 size={16} className="animate-spin" /> Chargement...
      </div>
    );
  }

  return (
    <section className="mt-14">
      <h2 className="font-display text-xl font-bold flex items-center gap-2 mb-2">
        <ShieldCheck size={18} className="text-[#D4AF37]" />
        Vérification d&apos;identité (KYC)
      </h2>
      <p className="text-sm text-white/50 font-body mb-5">
        {kycVerified
          ? "Votre identité est vérifiée. Vous pouvez louer sans délai supplémentaire."
          : "Déposez votre pièce d'identité et votre permis pour débloquer la location. Les fichiers sont privés et réservés à notre équipe."}
      </p>

      {kycVerified && (
        <div className="mb-5">
          <Pill tone="green">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={12} /> KYC vérifié
            </span>
          </Pill>
        </div>
      )}

      {error && (
        <div className="mb-4">
          <Notice type="error">{error}</Notice>
        </div>
      )}
      {info && (
        <div className="mb-4">
          <Notice type="success">{info}</Notice>
        </div>
      )}

      {/* Dépôt */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/50 mb-1.5">
              Type de document
            </label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {KYC_DOC_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
          <Btn onClick={() => fileRef.current?.click()} loading={uploading}>
            <Upload size={14} />
            Envoyer un document
          </Btn>
        </div>
        <p className="text-[11px] text-white/35 mt-3">
          Formats : image ou PDF · 10 Mo max par fichier.
        </p>
      </div>

      {/* Liste */}
      {docs.length === 0 ? (
        <p className="text-sm text-white/40 italic">Aucun document déposé.</p>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-wrap items-center gap-4"
            >
              <FileText size={20} className="text-[#D4AF37] shrink-0" />
              <div className="flex-1 min-w-[200px]">
                <p className="font-semibold text-white text-sm">{doc.file_name}</p>
                <p className="text-[11px] text-white/45 mt-0.5">
                  {KYC_DOC_LABELS[doc.type] ?? doc.type} · {formatDate(doc.created_at)}
                  {doc.review_note ? ` · « ${doc.review_note} »` : ""}
                </p>
              </div>
              <Pill tone={KYC_STATUS_TONES[doc.status] ?? "neutral"}>
                {KYC_STATUS_LABELS[doc.status] ?? doc.status}
              </Pill>
              <div className="flex gap-2">
                <Btn variant="ghost" className="!px-3 !py-2" onClick={() => preview(doc)}>
                  Voir
                </Btn>
                {doc.status === "pending" && (
                  <Btn
                    variant="danger"
                    className="!px-3 !py-2"
                    onClick={() => removeDoc(doc)}
                  >
                    <Trash2 size={13} />
                  </Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
