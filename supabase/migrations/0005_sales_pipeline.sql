-- 0005_sales_pipeline.sql
-- Moteur de vente : prospects (leads) et pipeline commercial des véhicules,
-- avec politiques RLS. Les énumérations sale_status / lead_status /
-- lead_source / payment_status sont définies dans la migration 0001.

-- ============ PROSPECTS / LEADS ============
create table public.leads (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid references public.profiles (id) on delete set null,
  vehicle_id   uuid references public.vehicles (id) on delete set null,
  first_name   text not null,
  last_name    text not null,
  email        text not null,
  phone        text,
  source       public.lead_source not null default 'list_car',
  status       public.lead_status not null default 'new',
  message      text,
  assigned_to  uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index leads_status_idx   on public.leads (status, created_at desc);
create index leads_vehicle_idx  on public.leads (vehicle_id);
create index leads_customer_idx on public.leads (customer_id);

create trigger leads_touch
before update on public.leads
for each row execute function public.touch_updated_at();

-- ============ VENTES (PIPELINE) ============
create table public.vehicle_sales (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,
  vehicle_id    uuid not null references public.vehicles (id) on delete restrict,
  -- Nullable : un acheteur peut être un prospect sans compte (walk-in).
  -- Ses coordonnées sont alors snapshotées dans customer_*.
  customer_id   uuid references public.profiles (id) on delete set null,
  customer_name text,
  customer_email text,
  customer_phone text,
  lead_id       uuid references public.leads (id) on delete set null,
  agent_id      uuid references public.profiles (id) on delete set null,
  agency_id     uuid references public.agencies (id) on delete set null,
  status        public.sale_status not null default 'lead',
  -- Clichés tarifaires
  asking_price  numeric(14, 2),
  agreed_price  numeric(14, 2),
  deposit       numeric(12, 2) not null default 0,
  payment_status public.payment_status not null default 'pending',
  test_drive_at timestamptz,
  notes         text,
  sold_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint vehicle_sales_prices_non_negative
    check (
      (asking_price is null or asking_price >= 0)
      and (agreed_price is null or agreed_price >= 0)
      and deposit >= 0
    )
);

create index vehicle_sales_status_idx   on public.vehicle_sales (status, created_at desc);
create index vehicle_sales_customer_idx on public.vehicle_sales (customer_id);
create index vehicle_sales_agent_idx    on public.vehicle_sales (agent_id);

-- Un seul dossier de vente actif par véhicule (les annulations restent historiques)
create unique index vehicle_sales_one_active_idx
  on public.vehicle_sales (vehicle_id)
  where status <> 'cancelled';

create trigger vehicle_sales_touch
before update on public.vehicle_sales
for each row execute function public.touch_updated_at();

-- ============ ROW LEVEL SECURITY ============
alter table public.leads enable row level security;
alter table public.vehicle_sales enable row level security;

-- Leads : tout visiteur peut déposer une demande (formulaire public),
-- un client connecté voit les siennes, le personnel voit/gère tout.
create policy "leads_public_insert" on public.leads
  for insert with check (true);

create policy "leads_owner_or_staff_read" on public.leads
  for select using (
    auth.uid() = customer_id or public.is_staff()
  );

create policy "leads_staff_update" on public.leads
  for update using (public.is_staff()) with check (public.is_staff());

create policy "leads_staff_delete" on public.leads
  for delete using (public.is_staff());

-- Ventes : visibles par le client concerné et le personnel.
-- La création et le pilotage du pipeline sont réservés au personnel :
-- le point d'entrée public est la table leads.
create policy "vehicle_sales_owner_or_staff_read" on public.vehicle_sales
  for select using (
    auth.uid() = customer_id or public.is_staff()
  );

create policy "vehicle_sales_staff_insert" on public.vehicle_sales
  for insert with check (public.is_staff());

create policy "vehicle_sales_staff_update" on public.vehicle_sales
  for update using (public.is_staff()) with check (public.is_staff());

create policy "vehicle_sales_staff_delete" on public.vehicle_sales
  for delete using (public.is_staff());

-- ============ LEADS DE DÉMONSTRATION ============
insert into public.leads (first_name, last_name, email, phone, vehicle_id, source, status, message)
select 'Aya', 'Koffi', 'aya.koffi@exemple.ci', '+225 07 12 34 56 78',
       v.id, 'list_car', 'new',
       'Bonjour, je souhaite acquérir ce véhicule. Un essai est-il possible cette semaine ?'
from public.vehicles v where v.slug = 'range-rover-autobiography'
on conflict do nothing;

insert into public.leads (first_name, last_name, email, phone, vehicle_id, source, status, message)
select 'Kouadio', 'Mensah', 'k.mensah@exemple.ci', '+225 05 98 76 54 32',
       v.id, 'test_drive', 'contacted',
       'Client rencontré au showroom, intéressé par une reprise et un financement.'
from public.vehicles v where v.slug = 'mercedes-amg-gt63'
on conflict do nothing;
