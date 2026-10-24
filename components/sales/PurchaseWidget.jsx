"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeDollarSign, CheckCircle2, UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatMoney } from "@/lib/sales";
import { Btn, Field, Notice, TextArea, TextInput } from "@/components/admin/ui";

export default function PurchaseWidget({ car }) {
  const supabase = useMemo(() => createClient(), []);
  const sellable = car.businessLine !== "rental" && car.salePrice != null;

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
    test_drive: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      setUser(u);
      if (u) {
        const { data: p } = await supabase
          .from("profiles")
          .select("first_name, last_name, phone")
          .eq("id", u.id)
          .single();
        setProfile(p);
        setForm((f) => ({
          ...f,
          first_name: p?.first_name ?? "",
          last_name: p?.last_name ?? "",
          email: u.email ?? "",
          phone: p?.phone ?? "",
        }));
      }
    })();
  }, [supabase]);

  if (!sellable) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: insErr } = await supabase.from("leads").insert({
      customer_id: user?.id ?? null,
      vehicle_id: car.id ?? null,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      source: form.test_drive ? "test_drive" : "list_car",
      status: "new",
      message:
        form.message.trim() +
        (form.test_drive ? "\n[Demande d'essai exprimée via le site]" : ""),
    });

    setSubmitting(false);
    if (insErr) {
      setError(insErr.message);
      return;
    }
    setDone(true);
  }

  return (
    <div
      className="rounded-[24px] p-8 mb-6 border border-[#D4AF37]/25 relative overflow-hidden"
      style={{
        background: "rgba(212,175,55,0.05)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <BadgeDollarSign size={18} className="text-[#D6B25E]" />
        <h3 className="font-display font-bold text-lg text-white">
          Intéressé par un achat ?
        </h3>
      </div>
      <p className="text-2xl font-display font-bold text-white mb-1">
        {formatMoney(car.salePrice)}
      </p>
      <p className="text-[12px] text-white/45 font-body mb-5">
        Prix de vente affiché · réponse de notre équipe sous 24 h
      </p>

      {done ? (
        <div className="space-y-4">
          <Notice type="success">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              Votre demande a bien été envoyée. Un conseiller vous recontactera.
            </span>
          </Notice>
          {user && (
            <Link
              href="/account"
              className="block text-center w-full rounded-full py-3 text-[12px] font-bold uppercase tracking-widest bg-gradient-to-br from-[#E0BE6F] to-[#B68A2F] text-black"
            >
              Suivre mes demandes
            </Link>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {user && (
            <p className="flex items-center gap-2 text-[11px] text-white/45">
              <UserCheck size={13} className="text-[#D6B25E]" />
              Connecté en tant que {user.email}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom">
              <TextInput
                required
                value={form.first_name}
                onChange={(e) => set("first_name", e.target.value)}
                placeholder="Aya"
                autoComplete="given-name"
              />
            </Field>
            <Field label="Nom">
              <TextInput
                required
                value={form.last_name}
                onChange={(e) => set("last_name", e.target.value)}
                placeholder="Koffi"
                autoComplete="family-name"
              />
            </Field>
          </div>
          <Field label="E-mail">
            <TextInput
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="vous@exemple.ci"
              autoComplete="email"
            />
          </Field>
          <Field label="Téléphone">
            <TextInput
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+225 ..."
              autoComplete="tel"
            />
          </Field>
          <Field label="Votre message">
            <TextArea
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="Question, financement, reprise, disponibilité..."
            />
          </Field>
          <label className="flex items-center gap-2.5 text-sm text-white/70 cursor-pointer">
            <input
              type="checkbox"
              checked={form.test_drive}
              onChange={(e) => set("test_drive", e.target.checked)}
              className="w-4 h-4 accent-[#D4AF37]"
            />
            Demander un essai routier
          </label>

          {error && <Notice type="error">{error}</Notice>}

          <Btn type="submit" loading={submitting} className="w-full">
            Envoyer ma demande d&apos;achat
          </Btn>
          {!user && (
            <p className="text-[11px] text-white/35 text-center font-body">
              Astuce :{" "}
              <Link href={`/login?next=/cars/${car.slug}`} className="underline underline-offset-2 hover:text-[#E0BE6F]">
                connectez-vous
              </Link>{" "}
              pour retrouver cette demande dans votre espace.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
