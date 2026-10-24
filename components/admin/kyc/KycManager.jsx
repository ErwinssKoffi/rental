"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShieldCheck, Eye, Check, X, FileText, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  KYC_BUCKET,
  KYC_DOC_LABELS,
  KYC_STATUS_LABELS,
  KYC_STATUS_TONES,
} from "@/lib/kyc";
import { formatDate } from "@/lib/bookings";
import { Pill, Spinner, Notice, Btn, TextInput } from "../ui";

const FILTERS = ["all", "pending", "approved", "rejected"];

export default function KycManager() {
  const supabase = useRef(createClient()).current;
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("customer_documents")
      .select(
        `*, customer:profiles!customer_documents_customer_id_fkey(first_name, last_name, email, phone, kyc_verified)`
      )
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setDocs(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = docs.reduce(
    (acc, d) => {
      acc[d.status] = (acc[d.status] ?? 0) + 1;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0 }
  );

  const filtered = docs.filter((d) => {
    if (filter !== "all" && d.status !== filter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const c = d.customer;
    return [c?.first_name, c?.last_name, c?.email, d.file_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  async function openPreview(doc) {
    setBusyId(doc.id);
    const { data, error: err } = await supabase.storage
      .from(KYC_BUCKET)
      .createSignedUrl(doc.storage_path, 600);
    setBusyId(null);
    if (err) {
      setError(err.message);
      return;
    }
    setPreview({ url: data.signedUrl, doc, isPdf: doc.mime_type?.includes("pdf") });
  }

  async function review(doc, approve) {
    setBusyId(doc.id);
    setError(null);
    const note = notes[doc.id]?.trim() || null;
    const { error: err } = await supabase.rpc("review_kyc_document", {
      p_doc_id: doc.id,
      p_approve: approve,
      p_note: note,
    });
    if (err) {
      setError(
        err.code === "42501"
          ? "Accès refusé : votre rôle ne permet pas la validation KYC."
          : err.message
      );
    } else {
      setInfo(
        approve
          ? `Document validé — le profil de ${doc.customer?.first_name ?? "client"} est désormais vérifié.`
          : "Document rejeté. Le client peut déposer une nouvelle pièce."
      );
      await load();
    }
    setBusyId(null);
  }

  if (loading) return <Spinner label="Chargement des documents KYC..." />;

  return (
    <div className="space-y-6">
      {error && <Notice type="error">{error}</Notice>}
      {info && <Notice type="success">{info}</Notice>}

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl">
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.06] p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E0BE6F]">En attente</p>
          <p className="font-display text-3xl font-bold mt-2">{counts.pending}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Validés</p>
          <p className="font-display text-3xl font-bold mt-2">{counts.approved}</p>
        </div>
        <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.06] p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-300">Rejetés</p>
          <p className="font-display text-3xl font-bold mt-2">{counts.rejected}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-colors ${
                filter === f
                  ? "border-[#D4AF37] text-[#E0BE6F] bg-[#D4AF37]/10"
                  : "border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {KYC_STATUS_LABELS[f] ?? "Tous"}
              {f !== "all" && ` (${counts[f] ?? 0})`}
              {f === "all" && ` (${docs.length})`}
            </button>
          ))}
        </div>
        <TextInput
          placeholder="Rechercher client, fichier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-14 text-center text-white/50">
          <ShieldCheck size={28} className="mx-auto mb-3 text-white/30" />
          Aucun document{filter !== "all" && " pour ce filtre"}.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => {
            const c = doc.customer;
            return (
              <div
                key={doc.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 flex flex-wrap items-center gap-4"
              >
                <FileText size={22} className="text-[#D4AF37] shrink-0" />
                <div className="flex-1 min-w-[240px]">
                  <p className="font-semibold text-white">
                    {c
                      ? [c.first_name, c.last_name].filter(Boolean).join(" ")
                      : "Profil supprimé"}
                  </p>
                  <p className="text-[12px] text-white/50">
                    {c?.email ?? "—"} · {c?.phone ?? "pas de téléphone"}
                  </p>
                  <p className="text-[12px] text-[#E0BE6F] mt-1">
                    {KYC_DOC_LABELS[doc.type] ?? doc.type} · {doc.file_name}
                  </p>
                  <p className="text-[11px] text-white/35 mt-0.5">
                    Déposé le {formatDate(doc.created_at)}
                    {doc.review_note ? ` · Note : « ${doc.review_note} »` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {c?.kyc_verified && (
                    <Pill tone="green">
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck size={11} /> Profil vérifié
                      </span>
                    </Pill>
                  )}
                  <Pill tone={KYC_STATUS_TONES[doc.status] ?? "neutral"}>
                    {KYC_STATUS_LABELS[doc.status] ?? doc.status}
                  </Pill>
                </div>

                <div className="w-full md:w-64">
                  <TextInput
                    placeholder="Note de validation (optionnel)"
                    value={notes[doc.id] ?? ""}
                    onChange={(e) =>
                      setNotes((n) => ({ ...n, [doc.id]: e.target.value }))
                    }
                    disabled={doc.status !== "pending"}
                  />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <Btn
                    variant="ghost"
                    className="!px-3 !py-2"
                    onClick={() => openPreview(doc)}
                    loading={busyId === doc.id && !preview}
                  >
                    <Eye size={14} />
                    Aperçu
                  </Btn>
                  {doc.status === "pending" && (
                    <>
                      <Btn
                        className="!px-3 !py-2"
                        loading={busyId === doc.id}
                        onClick={() => review(doc, true)}
                      >
                        <Check size={14} />
                        Valider
                      </Btn>
                      <Btn
                        variant="danger"
                        className="!px-3 !py-2"
                        loading={busyId === doc.id}
                        onClick={() => review(doc, false)}
                      >
                        <X size={14} />
                        Rejeter
                      </Btn>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Aperçu en URL signée */}
      {preview && (
        <div
          className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative w-full max-w-4xl h-[85vh] rounded-2xl border border-white/10 bg-[#0d0d0d] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <p className="text-sm font-semibold truncate">
                {preview.doc.file_name}
              </p>
              <button
                onClick={() => setPreview(null)}
                className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
            {preview.isPdf ? (
              <iframe src={preview.url} className="flex-1 w-full bg-white" title="Aperçu PDF" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.url}
                alt={preview.doc.file_name}
                className="flex-1 w-full object-contain bg-black/40"
              />
            )}
            <div className="border-t border-white/10 px-5 py-3 flex items-center gap-2 text-white/50 text-[11px]">
              <Loader2 size={12} className="hidden" />
              Lien signé valable 10 minutes · document privé, jamais exposé publiquement.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
