"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Btn, Field, Notice, TextInput } from "./ui";

function LoginInner({ denied = false }) {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const redirectTo =
    nextParam && nextParam.startsWith("/") ? nextParam : "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);
    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Identifiants invalides. Vérifiez votre e-mail et mot de passe."
          : signInError.message
      );
      return;
    }

    if (data.session) {
      router.replace(redirectTo);
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
      >
        <div className="text-center mb-8">
          <div
            className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg,#E0BE6F,#B68A2F)",
              color: "#000",
            }}
          >
            <LogIn size={24} />
          </div>
          <p className="eyebrow">Accès restreint</p>
          <h1 className="font-display text-3xl font-bold text-white mt-2">
            Espace personnel
          </h1>
          <p className="text-white/50 text-sm mt-2 font-body">
            Connectez-vous avec un compte membre de l&apos;équipe Velox.
          </p>
        </div>

        {denied && (
          <div className="mb-5">
            <Notice type="error">
              <span className="flex items-center gap-2">
                <ShieldAlert size={16} />
                Votre compte n&apos;a pas les privilèges requis.
              </span>
            </Notice>
          </div>
        )}
        {error && (
          <div className="mb-5">
            <Notice type="error">{error}</Notice>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="E-mail">
            <TextInput
              type="email"
              required
              autoComplete="username"
              placeholder="admin@velox.ci"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Mot de passe">
            <TextInput
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Btn type="submit" loading={loading} className="w-full">
            Se connecter
          </Btn>
        </form>
      </div>
    </div>
  );
}

export default function AdminLogin(props) {
  return (
    <Suspense fallback={null}>
      <LoginInner {...props} />
    </Suspense>
  );
}
