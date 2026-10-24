import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 : le fichier middleware.js est renommé proxy.js.
export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  // Routes nécessitant une session Supabase Auth
  matcher: ["/admin/:path*", "/account/:path*"],
};
