-- 0003_rental_bookings.sql
-- Moteur de location : réservations, états des lieux (check-in/check-out),
-- contrôle de disponibilité, politiques RLS et bucket Storage des photos.

-- ============ RÉSERVATIONS ============
create table public.bookings (
  id             uuid primary key default gen_random_uuid(),
  reference      text not null unique,
  vehicle_id     uuid not null references public.vehicles (id) on delete restrict,
  customer_id    uuid not null references public.profiles (id) on delete restrict,
  agency_id      uuid references public.agencies (id) on delete set null,
  status         public.booking_status not null default 'pending',
  start_date     date not null,
  end_date       date not null,
  pickup_note    text,
  -- Clichés tarifaires au moment de la réservation
  daily_price    numeric(12, 2) not null,
  total_amount   numeric(14, 2) not null,
  deposit_amount numeric(12, 2) not null default 0,
  payment_status public.payment_status not null default 'pending',
  notes          text,
  created_by     uuid references public.profiles (id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint bookings_dates_valid
    check (end_date >= start_date),
  constraint bookings_amounts_non_negative
    check (
      daily_price >= 0
      and total_amount >= 0
      and deposit_amount >= 0
    )
);

create index bookings_vehicle_idx  on public.bookings (vehicle_id, start_date, end_date);
create index bookings_customer_idx on public.bookings (customer_id, created_at desc);
create index bookings_status_idx   on public.bookings (status);

create trigger bookings_touch
before update on public.bookings
for each row execute function public.touch_updated_at();

-- ============ ÉTATS DES LIEUX ============
create table public.booking_inspections (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid not null references public.bookings (id) on delete cascade,
  kind            public.inspection_kind not null,
  inspector_id    uuid references public.profiles (id) on delete set null,
  mileage         integer,
  fuel_level      integer check (fuel_level between 0 and 100),
  condition_notes text,
  damages         text,
  photo_urls      jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now(),
  constraint booking_inspections_one_per_kind unique (booking_id, kind)
);

create index booking_inspections_booking_idx
  on public.booking_inspections (booking_id);

-- ============ DISPONIBILITÉ ============
-- True si aucune réservation active (pending/confirmed/active) ne chevauche
-- la plage demandée. SECURITY DEFINER : la fonction lit les réservations
-- même sous RLS, elle est appelée en RPC avant insertion.
create or replace function public.is_vehicle_available(
  p_vehicle_id uuid,
  p_start     date,
  p_end       date,
  p_exclude   uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1
    from public.bookings b
    where b.vehicle_id = p_vehicle_id
      and b.id is distinct from p_exclude
      and b.status in ('pending', 'confirmed', 'active')
      and daterange(b.start_date, b.end_date, '[]')
          && daterange(p_start, p_end, '[]')
  );
$$;

-- ============ ROW LEVEL SECURITY ============
alter table public.bookings enable row level security;
alter table public.booking_inspections enable row level security;

-- Réservations : client (les siennes) + personnel (toutes)
create policy "bookings_owner_or_staff_read" on public.bookings
  for select using (
    auth.uid() = customer_id or public.is_staff()
  );

create policy "bookings_owner_or_staff_insert" on public.bookings
  for insert with check (
    public.is_staff() or customer_id = auth.uid()
  );

-- Le personnel pilote tout le cycle de vie
create policy "bookings_staff_update" on public.bookings
  for update using (public.is_staff()) with check (public.is_staff());

-- Le client ne peut qu'annuler sa propre réservation encore en attente
create policy "bookings_customer_cancel" on public.bookings
  for update using (
    auth.uid() = customer_id and status = 'pending'
  ) with check (
    auth.uid() = customer_id and status in ('pending', 'cancelled')
  );

create policy "bookings_staff_delete" on public.bookings
  for delete using (public.is_staff());

-- États des lieux : visibles par le client concerné et le personnel,
-- créés/modifiés uniquement par le personnel.
create policy "inspections_participant_read" on public.booking_inspections
  for select using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_inspections.booking_id
        and (b.customer_id = auth.uid() or public.is_staff())
    )
  );

create policy "inspections_staff_insert" on public.booking_inspections
  for insert with check (public.is_staff());

create policy "inspections_staff_update" on public.booking_inspections
  for update using (public.is_staff()) with check (public.is_staff());

create policy "inspections_staff_delete" on public.booking_inspections
  for delete using (public.is_staff());

-- ============ STORAGE : PHOTOS D'ÉTATS DES LIEUX ============
insert into storage.buckets (id, name, public)
values ('booking-media', 'booking-media', true)
on conflict (id) do nothing;

create policy "booking_media_bucket_public_read" on storage.objects
  for select using (bucket_id = 'booking-media');

create policy "booking_media_bucket_staff_insert" on storage.objects
  for insert with check (
    bucket_id = 'booking-media' and public.is_staff()
  );

create policy "booking_media_bucket_staff_update" on storage.objects
  for update using (
    bucket_id = 'booking-media' and public.is_staff()
  );

create policy "booking_media_bucket_staff_delete" on storage.objects
  for delete using (
    bucket_id = 'booking-media' and public.is_staff()
  );
