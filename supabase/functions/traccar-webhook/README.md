# Edge Function `traccar-webhook`

Reçoit les positions des trackers matériels Traccar et les écrit dans la table
`vehicle_locations` (PostGIS), puis met à jour le miroir `vehicles.last_location`.
La table est publiée dans `supabase_realtime` : les cartes Leaflet bougent sans
rechargement.

## Sécurité

- `verify_jwt = false` : Traccar ne peut pas présenter de JWT Supabase.
- Authentification par secret partagé, en-tête **`x-traccar-secret`**, comparé au
  secret Supabase `TRACCAR_WEBHOOK_SECRET` (coffre de secrets du projet, jamais
  dans le code).
- Les écritures utilisent la clé `service_role` (variables auto-injectées
  `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`) : aucune politique RLS d'insertion
  anonyme n'existe sur `vehicle_locations`.

## URL

```
POST https://fbnnlgchburfcqhkbgxl.supabase.co/functions/v1/traccar-webhook
Header : x-traccar-secret: <TRACCAR_WEBHOOK_SECRET>
```

## Liaison d'un tracker

Renseigner `vehicles.tracker_device_id` avec l'`uniqueId` de l'équipement dans
le back-office (onglet **Carte GPS**). Les positions d'un device non lié sont
ignorées et comptabilisées dans `unmapped_devices`.

## Formats acceptés

```jsonc
// 1. Évènement Traccar (device + position)
{ "device": { "uniqueId": "velox-porsche-01" },
  "position": { "latitude": 5.32, "longitude": -4.02, "speed": 42.5,
                "course": 180, "accuracy": 5, "ignition": true,
                "deviceTime": "2026-10-24T10:00:00Z" } }

// 2. Lot de positions
{ "device": { "uniqueId": "velox-porsche-01" }, "positions": [ /* ... */ ] }

// 3. Position aplatie
{ "uniqueId": "velox-porsche-01", "latitude": 5.32, "longitude": -4.02 }

// 4. Un tableau des formes ci-dessus
```

## Réponse

```json
{ "received": 1, "inserted": 1, "unmapped_devices": 0, "errors": [] }
```

## Configuration Traccar (rappel)

Côté serveur Traccar : **Server Settings → Forwarding** (ou une règle
d'évènement webhook) pointée vers l'URL ci-dessus, avec l'en-tête
`x-traccar-secret`.
