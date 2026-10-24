"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileSignature, Download, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CONTRACTS_BUCKET } from "@/lib/kyc";
import { formatDateTime } from "@/lib/sales";
import { Pill } from "@/components/admin/ui";

const TYPE_LABELS = { rental: "Contrat de location", sale: "Contrat de vente" };

export default function CustomerContracts({ user }) {
  const supabase = useRef(createClient()).current;
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("contracts")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setContracts(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function download(c) {
    setBusyId(c.id);
    const { data, error: err } = await supabase.storage
      .from(CONTRACTS_BUCKET)
      .createSignedUrl(c.storage_path, 300);
    setBusyId(null);
    if (err) {
      setError(err.message);
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  if (loading) {
    return (
      <section className="mt-14">
        <div className="flex items-center gap-2 text-white/50 py-6">
          <Loader2 size={16} className="animate-spin" /> Chargement des contrats...
        </div>
      </section>
    );
  }

  return (
    <section className="mt-14">
      <h2 className="font-display text-xl font-bold flex items-center gap-2 mb-5">
        <FileSignature size={18} className="text-[#D4AF37]" />
        Mes contrats ({contracts.length})
      </h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {contracts.length === 0 ? (
        <p className="text-sm text-white/40 italic">
          Aucun contrat généré pour le moment.
        </p>
      ) : (
        <div className="space-y-3">
          {contracts.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-wrap items-center gap-4"
            >
              <FileSignature size={20} className="text-[#D4AF37] shrink-0" />
              <div className="flex-1 min-w-[200px]">
                <p className="font-semibold text-white text-sm">{c.reference}</p>
                <p className="text-[11px] text-white/45 mt-0.5">
                  {TYPE_LABELS[c.type] ?? c.type} · {formatDateTime(c.created_at)}
                </p>
              </div>
              <Pill tone="neutral">PDF</Pill>
              <button
                onClick={() => download(c)}
                disabled={busyId === c.id}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white/70 hover:border-[#D4AF37]/50 hover:text-[#E0BE6F] transition-colors"
              >
                {busyId === c.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Download size={13} />
                )}
                Télécharger
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
