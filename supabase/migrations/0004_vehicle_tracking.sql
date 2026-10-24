-- 0004_vehicle_tracking.sql
-- Suivi GPS temps réel : identifiant tracker, historique des positions
-- (PostGIS), RLS, diffusion Supabase Realtime et positions initiales.

-- ============ LIAISON TRACKER MATÉRIEL ============
alter table public.vehicles
  add column if not exists tracker_device_id text;

-- Un tracker ne peut être lié qu'à un seul véhicule
create unique index if not exists vehicles_tracker_device_idx
  on public.vehicles (tracker_device_id)
  where tracker_device_id is not null;

-- ============ HISTORIQUE DES POSITIONS ============
create table public.vehicle_locations (
  id            uuid primary key default gen_random_uuid(),
  vehicle_id    uuid not null references public.vehicles (id) on delete cascade,
  location      geography(Point, 4326) not null,
  speed         numeric(7, 2),          -- km/h
  heading       numeric(5, 2),          -- degrés 0-359
  accuracy      numeric(8, 2),          -- mètres
  engine_status text,                   -- 'on' | 'off' | null
  battery       numeric(5, 2),          -- %
  source        text not null default 'traccar',
  recorded_at   timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

-- Requête de la dernière position par véhicule
create index vehicle_locations_latest_idx
  on public.vehicle_locations (vehicle_id, recorded_at desc);

-- Requêtes géographiques (véhicules proches, zones)
create index vehicle_locations_spatial_idx
  on public.vehicle_locations using gist (location);

-- Purge automatique de l'historique au-delà de 90 jours (peut être retiré
-- ou ajusté selon les obligations légales de conservation).
create or replace function public.purge_old_vehicle_locations()
returns void
language sql
as $$
  delete from public.vehicle_locations
  where recorded_at < now() - interval '90 days';
$$;

-- ============ ROW LEVEL SECURITY ============
alter table public.vehicle_locations enable row level security;

-- Lecture : le personnel voit tout ; les visiteurs voient les véhicules
-- publiés (carte publique de la flotte).
create policy "vehicle_locations_staff_or_published_read"
  on public.vehicle_locations
  for select using (
    public.is_staff()
    or exists (
      select 1 from public.vehicles v
      where v.id = vehicle_locations.vehicle_id
        and v.is_published = true
    )
  );

-- Écriture navigateur réservée au personnel (simulateur de démo, corrections).
-- Les trackers matériels passent par l'Edge Function en clé service_role,
-- qui contourne la RLS : aucune politique d'insertion anonyme n'existe.
create policy "vehicle_locations_staff_insert"
  on public.vehicle_locations
  for insert with check (public.is_staff());

create policy "vehicle_locations_staff_update"
  on public.vehicle_locations
  for update using (public.is_staff()) with check (public.is_staff());

create policy "vehicle_locations_staff_delete"
  on public.vehicle_locations
  for delete using (public.is_staff());

-- ============ DIFFUSION TEMPS RÉEL ============
alter publication supabase_realtime add table public.vehicle_locations;

-- ============ POSITIONS INITIALES (déparquement agence) ============
insert into public.vehicle_locations (vehicle_id, location, source, recorded_at)
select v.id, v.last_location, 'seed', v.created_at
from public.vehicles v
where v.last_location is not null
  and not exists (
    select 1 from public.vehicle_locations l where l.vehicle_id = v.id
  );
