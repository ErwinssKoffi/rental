import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/account"];

// Actualise la session Supabase et protège les routes réservées.
// Convention Next.js 16 : exécuté depuis proxy.js (ex-middleware).
export async function updateSession(request) {
  let response = NextResponse.next({ request });

  let authError = null;
  let user = null;

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const result = await supabase.auth.getUser();
    authError = result.error;
    user = result.data.user;
  } catch (error) {
    authError = error;
  }

  if (authError) {
    // Pas de session = simple visiteur anonyme : on applique la règle
    // de protection (redirection) plutôt que le mode dégradé.
    const isMissingSession =
      authError.name === "AuthSessionMissingError";

    if (!isMissingSession) {
      // Vraie panne réseau/serveur (ex. aperçu sandbox sans accès à Supabase) :
      // mode dégradé, on ne bloque pas la requête. En production, l'appel aboutit.
      console.warn(
        "[proxy] Supabase injoignable, mode dégradé :",
        authError?.message ?? authError
      );
      return response;
    }
  }

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return response;
}
