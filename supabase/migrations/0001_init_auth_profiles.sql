-- 0001_init_auth_profiles.sql
-- Socle : extensions, énumérations métier, profils liés à auth.users, RLS, admin de démo
-- Ordre de création important : les tables avant les fonctions SQL qui les référencent.

-- ============ EXTENSIONS ============
create extension if not exists postgis;
create extension if not exists pgcrypto;

-- ============ ENUMS MÉTIER ============
create type public.user_role as enum
  ('super_admin','manager','agent','accountant','mechanic','customer');

create type public.vehicle_status as enum
  ('available','reserved','rented','maintenance','sold','archived');

create type public.business_line as enum
  ('rental','sale','both');

create type public.booking_status as enum
  ('pending','confirmed','active','completed','cancelled');

create type public.sale_status as enum
  ('lead','negotiation','ordered','invoiced','paid','delivered','cancelled');

create type public.lead_status as enum
  ('new','contacted','qualified','converted','lost');

create type public.lead_source as enum
  ('contact_form','list_car','test_drive','callback','phone','other');

create type public.payment_status as enum
  ('pending','partial','paid','refunded','failed');

create type public.inspection_kind as enum
  ('checkin','checkout');

create type public.maintenance_status as enum
  ('scheduled','in_progress','done');

create type public.notification_kind as enum
  ('booking','payment','maintenance','tracking','system');

-- ============ TABLE PROFILES ============
create table public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  first_name      text,
  last_name       text,
  phone           text,
  role            public.user_role not null default 'customer',
  is_active       boolean not null default true,
  avatar_url      text,
  -- KYC (pièces d'identité / permis, vérifiées par l'admin)
  id_document_url text,
  license_url     text,
  kyc_verified    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============ FONCTIONS UTILITAIRES ============
-- Mise à jour automatique de updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Rôle de l'utilisateur courant (SECURITY DEFINER pour éviter la récursion RLS)
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Vrai si l'utilisateur est un membre du personnel (tout sauf client)
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role <> 'customer' and is_active
       from public.profiles
      where id = auth.uid()),
    false
  );
$$;

-- Vrai si administrateur (super_admin ou manager)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role in ('super_admin','manager') and is_active
       from public.profiles
      where id = auth.uid()),
    false
  );
$$;

-- ============ TRIGGERS ============
create trigger profiles_touch
before update on public.profiles
for each row execute function public.touch_updated_at();

-- Création automatique du profil à l'inscription Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Empêche l'élévation de privilèges : seul un admin peut changer role / is_active
create or replace function public.guard_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.role is distinct from old.role
       or new.is_active is distinct from old.is_active then
      raise exception 'Seuls les administrateurs peuvent modifier le rôle ou le statut actif';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_guard
before update on public.profiles
for each row execute function public.guard_profile_privileges();

-- ============ ROW LEVEL SECURITY ============
alter table public.profiles enable row level security;

create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id or public.is_staff());

create policy "profiles_insert" on public.profiles
  for insert with check (auth.uid() = id or public.is_admin());

create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

create policy "profiles_delete" on public.profiles
  for delete using (public.is_admin());

-- ============ COMPTE ADMIN DE DÉMO ============
do $$
declare
  uid uuid;
begin
  select id into uid from auth.users where email = 'admin@velox.ci';

  if not found then
    uid := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change,
      email_change_token_new, email_change_token_current,
      phone_change, phone_change_token,
      confirmation_sent_at, recovery_sent_at,
      email_change_confirm_status, banned_until,
      reauthentication_token, reauthentication_sent_at,
      is_sso_user, is_anonymous
    ) values (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      'admin@velox.ci', crypt('Admin123!', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}',
      '{"first_name":"Admin","last_name":"Velox"}',
      '', '', '', '', '', '', '', now(), now(),
      0, null, '', now(), false, false
    );
  end if;

  insert into public.profiles (id, first_name, last_name, role, is_active)
  values (uid, 'Admin', 'Velox', 'super_admin', true)
  on conflict (id) do update
    set role = 'super_admin', is_active = true;
end;
$$;
