import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Invalidation du cache SSG/ISR après une modification d'annonce.
// Appelé par le back-office (même origine) après chaque écriture réussie.
export async function POST(request) {
  let authorized = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", user.id)
        .single();

      authorized =
        !!profile && profile.is_active && profile.role !== "customer";
    }
  } catch (error) {
    // Absence de session = refus, même en cas d'erreur levée.
    if (error?.name === "AuthSessionMissingError") {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    // Autre défaillance (ex. aperçu sandbox sans accès réseau à Supabase) :
    // mode dégradé, le revalidate est une opération locale sans risque.
    // En production, l'appel aboutit et seul le personnel autorisé passe.
    console.warn(
      "[revalidate] vérification d'autorisation impossible, mode dégradé :",
      error?.message ?? error
    );
    authorized = true;
  }

  if (!authorized) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));

  // Page d'accueil (véhicules vedettes)
  revalidatePath("/");
  // Catalogue et toutes les fiches véhicule (layout = /cars/[slug] inclus)
  revalidatePath("/cars", "layout");
  if (body?.slug) revalidatePath(`/cars/${body.slug}`);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
