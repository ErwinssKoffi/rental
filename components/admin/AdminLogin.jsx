"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, UserPlus, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Btn, Field, Notice, TextInput } from "./ui";

function LoginInner({ denied = false }) {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const redirectTo =
    nextParam && nextParam.startsWith("/") ? nextParam : "/admin";

  const [mode, setMode] = useState("signin"); // signin | signup
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      });

      setLoading(false);
      if (signUpError) {
        setError(
          signUpError.message === "User already registered"
            ? "Un compte existe déjà avec cet e-mail."
            : signUpError.message
        );
        return;
      }
      if (data.session) {
        router.replace(redirectTo);
        router.refresh();
      } else {
        setInfo(
          "Compte créé. Vérifiez votre e-mail pour confirmer l'inscription, puis connectez-vous."
        );
        setMode("signin");
      }
      return;
    }

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

  const isSignup = mode === "signup";

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
            {isSignup ? <UserPlus size={24} /> : <LogIn size={24} />}
          </div>
          <p className="eyebrow">Accès restreint</p>
          <h1 className="font-display text-3xl font-bold text-white mt-2">
            {isSignup ? "Créer mon compte" : "Espace personnel"}
          </h1>
          <p className="text-white/50 text-sm mt-2 font-body">
            {isSignup
              ? "Réservez et suivez vos locations en quelques clics."
              : "Connectez-vous avec votre compte Velox."}
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
        {info && (
          <div className="mb-5">
            <Notice type="success">{info}</Notice>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Prénom">
                <TextInput
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Aya"
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Nom">
                <TextInput
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Koffi"
                  autoComplete="family-name"
                />
              </Field>
            </div>
          )}
          <Field label="E-mail">
            <TextInput
              type="email"
              required
              autoComplete="username"
              placeholder="vous@exemple.ci"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Mot de passe">
            <TextInput
              type="password"
              required
              minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Btn type="submit" loading={loading} className="w-full">
            {isSignup ? "Créer mon compte" : "Se connecter"}
          </Btn>
        </form>

        <button
          onClick={() => {
            setMode(isSignup ? "signin" : "signup");
            setError(null);
          }}
          className="w-full mt-5 text-center text-sm text-white/50 hover:text-[#E0BE6F] transition-colors font-body"
        >
          {isSignup
            ? "Déjà inscrit ? Se connecter"
            : "Pas encore de compte ? Créer un compte client"}
        </button>
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
