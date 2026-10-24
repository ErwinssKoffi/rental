-- 0002_fleet_catalog.sql
-- Flotte et catalogue : catégories, agences (PostGIS), véhicules, médias,
-- bucket Storage public et politiques RLS.

-- ============ CATÉGORIES ============
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger categories_touch
before update on public.categories
for each row execute function public.touch_updated_at();

-- ============ AGENCES ============
create table public.agencies (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  address    text,
  city       text,
  phone      text,
  email      text,
  location   geography(Point, 4326),
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index agencies_location_idx
  on public.agencies using gist (location);

create trigger agencies_touch
before update on public.agencies
for each row execute function public.touch_updated_at();

-- ============ VÉHICULES ============
create table public.vehicles (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  brand           text not null,
  model           text not null,
  title           text,
  description     text,
  category_id     uuid references public.categories (id) on delete set null,
  business_line   public.business_line not null default 'both',
  status          public.vehicle_status not null default 'available',
  year            int,
  price_per_day   numeric(12, 2),
  sale_price      numeric(14, 2),
  deposit_amount  numeric(12, 2),
  transmission    text,
  fuel_type       text,
  seats           int,
  mileage         text,
  engine          text,
  top_speed       text,
  acceleration    text,
  features        jsonb not null default '[]'::jsonb,
  rating          numeric(2, 1),
  rating_count    int not null default 0,
  is_featured     boolean not null default false,
  is_published    boolean not null default true,
  badge           text,
  video_url       text,
  cover_image_url text,
  agency_id       uuid references public.agencies (id) on delete set null,
  last_location   geography(Point, 4326),
  vin             text,
  plate_number    text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint vehicles_prices_non_negative
    check (
      (price_per_day is null or price_per_day >= 0)
      and (sale_price is null or sale_price >= 0)
      and (deposit_amount is null or deposit_amount >= 0)
    )
);

create index vehicles_status_idx        on public.vehicles (status);
create index vehicles_business_line_idx on public.vehicles (business_line);
create index vehicles_category_idx      on public.vehicles (category_id);
create index vehicles_published_idx     on public.vehicles (is_published);
create index vehicles_featured_idx      on public.vehicles (is_featured);
create index vehicles_location_idx      on public.vehicles using gist (last_location);

create trigger vehicles_touch
before update on public.vehicles
for each row execute function public.touch_updated_at();

-- ============ MÉDIAS DES VÉHICULES ============
create table public.vehicle_media (
  id          uuid primary key default gen_random_uuid(),
  vehicle_id  uuid not null references public.vehicles (id) on delete cascade,
  url         text not null,
  storage_path text,
  alt         text,
  kind        text not null default 'image'
              check (kind in ('image', 'video')),
  color_name  text,
  color_hex   text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index vehicle_media_vehicle_idx
  on public.vehicle_media (vehicle_id, sort_order);

-- ============ ROW LEVEL SECURITY ============
alter table public.categories enable row level security;
alter table public.agencies enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_media enable row level security;

-- Lecture publique (en tenant compte du brouillon/publié pour les véhicules)
create policy "categories_public_read" on public.categories
  for select using (is_active = true or public.is_staff());

create policy "agencies_public_read" on public.agencies
  for select using (is_active = true or public.is_staff());

create policy "vehicles_public_read" on public.vehicles
  for select using (is_published = true or public.is_staff());

create policy "vehicle_media_public_read" on public.vehicle_media
  for select using (
    exists (
      select 1 from public.vehicles v
      where v.id = vehicle_media.vehicle_id
        and (v.is_published = true or public.is_staff())
    )
  );

-- Écriture réservée au personnel (toutes opérations)
create policy "categories_staff_write" on public.categories
  for all using (public.is_staff()) with check (public.is_staff());

create policy "agencies_staff_write" on public.agencies
  for all using (public.is_staff()) with check (public.is_staff());

create policy "vehicles_staff_write" on public.vehicles
  for all using (public.is_staff()) with check (public.is_staff());

create policy "vehicle_media_staff_write" on public.vehicle_media
  for all using (public.is_staff()) with check (public.is_staff());

-- ============ STOCKAGE DES PHOTOS ============
insert into storage.buckets (id, name, public)
values ('vehicle-media', 'vehicle-media', true)
on conflict (id) do nothing;

create policy "vehicle_media_bucket_public_read" on storage.objects
  for select using (bucket_id = 'vehicle-media');

create policy "vehicle_media_bucket_staff_insert" on storage.objects
  for insert with check (
    bucket_id = 'vehicle-media' and public.is_staff()
  );

create policy "vehicle_media_bucket_staff_update" on storage.objects
  for update using (
    bucket_id = 'vehicle-media' and public.is_staff()
  );

create policy "vehicle_media_bucket_staff_delete" on storage.objects
  for delete using (
    bucket_id = 'vehicle-media' and public.is_staff()
  );
