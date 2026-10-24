// Demande au serveur Next de réinvalider les pages du catalogue.
// Route même origine : aucun accès externe direct à Supabase requis.
export async function revalidateCatalog(slug) {
  try {
    const res = await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slug ? { slug } : {}),
    });
    if (!res.ok) {
      console.warn("[revalidate] réponse non OK :", res.status);
    }
  } catch (error) {
    console.warn("[revalidate] échec de l'invalidation :", error);
  }
}
