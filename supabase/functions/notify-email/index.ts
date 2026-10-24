// Edge Function : envoi des emails transactionnels.
// Déclenchée par un trigger Postgres (pg_net) après insertion dans
// public.notifications. Authentification par secret partagé (x-notify-secret).
// Fournisseur : API compatible Resend. Sans EMAIL_API_KEY, l'email est ignoré.
// Zéro dépendance externe : seules les API natives Deno sont utilisées
// (les modules distants ne sont pas bundlés lors d'un déploiement via l'API).

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

interface NotificationRow {
  id: string;
  user_id: string;
  kind: string;
  title: string;
  body: string | null;
  link: string | null;
}

function renderHtml(n: NotificationRow, appUrl: string): string {
  const href = `${appUrl}${n.link ?? "/account"}`;
  return `
  <div style="margin:0;padding:32px;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#141414;border:1px solid rgba(212,175,55,0.35);border-radius:20px;overflow:hidden;">
      <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
        <span style="font-size:20px;font-weight:bold;letter-spacing:0.18em;color:#D4AF37;">VELOX RENTALS</span>
      </div>
      <div style="padding:32px;color:#e8e8e8;">
        <h1 style="margin:0 0 14px;font-size:22px;color:#ffffff;">${n.title}</h1>
        <p style="margin:0 0 24px;line-height:1.7;font-size:15px;color:#b8b8b8;">${n.body ?? ""}</p>
        <a href="${href}"
           style="display:inline-block;padding:13px 28px;border-radius:999px;background:linear-gradient(135deg,#E0BE6F,#B68A2F);color:#050505;text-decoration:none;font-weight:bold;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;">
          Ouvrir mon espace
        </a>
      </div>
      <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:#737373;">
        Velox Rentals — Abidjan, Plateau. Cet email concerne votre compte Velox.
      </div>
    </div>
  </div>`;
}

// Récupère l'email d'un utilisateur via l'API Admin (GoTrue) en REST pur.
async function getUserEmail(userId: string): Promise<string | null> {
  const baseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const res = await fetch(
    `${baseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.user?.email ?? data?.email ?? null;
}

async function sendViaResend(
  apiKey: string,
  from: string,
  to: string,
  n: NotificationRow,
  html: string
) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Velox Rentals — ${n.title}`,
      html,
      text: `${n.title}\n\n${n.body ?? ""}\n`,
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`resend ${res.status}: ${detail}`);
  }
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const expected = Deno.env.get("NOTIFY_WEBHOOK_SECRET");
  if (!expected || req.headers.get("x-notify-secret") !== expected) {
    return json({ error: "unauthorized" }, 401);
  }

  let payload: { notification?: NotificationRow };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const n = payload.notification;
  if (!n?.user_id || !n?.title) {
    return json({ error: "invalid_notification" }, 422);
  }

  const email = await getUserEmail(n.user_id);
  if (!email) {
    return json({ error: "user_email_unavailable" }, 422);
  }

  const apiKey = Deno.env.get("EMAIL_API_KEY");
  const from =
    Deno.env.get("EMAIL_FROM") ?? "Velox Rentals <no-reply@veloxrentals.app>";
  const appUrl = Deno.env.get("APP_PUBLIC_URL") ?? "http://localhost:3000";

  if (!apiKey) {
    return json({
      status: "skipped",
      reason: "EMAIL_API_KEY non configuré",
      to: email,
    });
  }

  try {
    const result = await sendViaResend(
      apiKey,
      from,
      email,
      n,
      renderHtml(n, appUrl)
    );
    return json({ status: "sent", provider: "resend", id: result?.id ?? null });
  } catch (e) {
    return json(
      { error: "send_failed", detail: String(e?.message ?? e) },
      502
    );
  }
});
