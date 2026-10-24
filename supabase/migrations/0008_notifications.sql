-- 0008_notifications.sql
-- Centre de notifications in-app (diffusé en temps réel) et déclenchement
-- des emails transactionnels via l'Edge Function notify-email (pg_net).

create extension if not exists pg_net;

-- Nouvelles natures de notification (les labels existants viennent de 0001)
alter type public.notification_kind add value if not exists 'kyc';
alter type public.notification_kind add value if not exists 'sales';
alter type public.notification_kind add value if not exists 'contract';

-- ============ TABLE NOTIFICATIONS ============
create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  kind        public.notification_kind not null default 'system',
  title       text not null,
  body        text,
  link        text,
  metadata    jsonb not null default '{}'::jsonb,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index notifications_user_idx
  on public.notifications (user_id, is_read, created_at desc);

alter table public.notifications enable row level security;

-- Chaque utilisateur ne lit et ne marque que ses notifications ;
-- le personnel peut tout voir. Les insertions système passent par les
-- triggers SECURITY DEFINER (ou la clé service_role), aucune insertion
-- directe n'est accordée aux clients.
create policy "notifications_owner_or_staff_read"
  on public.notifications
  for select using (auth.uid() = user_id or public.is_staff());

create policy "notifications_owner_update"
  on public.notifications
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "notifications_staff_insert"
  on public.notifications
  for insert with check (public.is_staff());

create policy "notifications_staff_delete"
  on public.notifications
  for delete using (public.is_staff());

-- Diffusion temps réel
alter publication supabase_realtime add table public.notifications;

-- ============ DÉCLENCHEURS MÉTIER ============

-- 1) Nouvelle réservation -> tout le personnel
create or replace function public.tfn_notify_staff_new_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, kind, title, body, link, metadata)
  select p.id, 'booking',
         'Nouvelle réservation ' || new.reference,
         'Une demande de location vient d''être déposée.',
         '/admin',
         jsonb_build_object('booking_id', new.id, 'reference', new.reference)
  from public.profiles p
  where p.is_active and p.role <> 'customer';
  return new;
end;
$$;

create trigger trg_notify_staff_new_booking
after insert on public.bookings
for each row execute function public.tfn_notify_staff_new_booking();

-- 2) Changement de statut d'une réservation -> le client
create or replace function public.tfn_notify_customer_booking_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare libelle text;
begin
  if new.status is not distinct from old.status then
    return new;
  end if;

  libelle := case new.status
    when 'pending' then 'en attente de confirmation'
    when 'confirmed' then 'confirmée'
    when 'active' then 'en cours'
    when 'completed' then 'terminée'
    when 'cancelled' then 'annulée'
    else new.status::text
  end;

  insert into public.notifications (user_id, kind, title, body, link, metadata)
  values (
    new.customer_id, 'booking',
    'Réservation ' || new.reference,
    'Votre réservation est maintenant ' || libelle || '.',
    '/account',
    jsonb_build_object('booking_id', new.id, 'status', new.status)
  );
  return new;
end;
$$;

create trigger trg_notify_customer_booking_status
after update on public.bookings
for each row execute function public.tfn_notify_customer_booking_status();

-- 3) Nouveau prospect -> le personnel
create or replace function public.tfn_notify_staff_new_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, kind, title, body, link, metadata)
  select p.id, 'sales',
         'Nouveau prospect : ' || new.first_name || ' ' || new.last_name,
         coalesce('Demande reçue' || case when new.vehicle_id is not null
                    then ' pour un véhicule' else '' end, 'Demande reçue'),
         '/admin',
         jsonb_build_object('lead_id', new.id)
  from public.profiles p
  where p.is_active and p.role <> 'customer';
  return new;
end;
$$;

create trigger trg_notify_staff_new_lead
after insert on public.leads
for each row execute function public.tfn_notify_staff_new_lead();

-- 4) Changement d'étape d'une vente -> le client (si compte lié)
create or replace function public.tfn_notify_customer_sale_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare libelle text;
begin
  if new.customer_id is null or new.status is not distinct from old.status then
    return new;
  end if;

  libelle := case new.status
    when 'lead' then 'à l''état de prospect'
    when 'negotiation' then 'en négociation'
    when 'ordered' then 'commandée'
    when 'invoiced' then 'facturée'
    when 'paid' then 'payée'
    when 'delivered' then 'livrée'
    when 'cancelled' then 'annulée'
    else new.status::text
  end;

  insert into public.notifications (user_id, kind, title, body, link, metadata)
  values (
    new.customer_id, 'sales',
    'Vente ' || new.reference,
    'Votre dossier d''achat est maintenant ' || libelle || '.',
    '/account',
    jsonb_build_object('sale_id', new.id, 'status', new.status)
  );
  return new;
end;
$$;

create trigger trg_notify_customer_sale_status
after update on public.vehicle_sales
for each row execute function public.tfn_notify_customer_sale_status();

-- 5) Résultat de la vérification KYC -> le client
create or replace function public.tfn_notify_customer_kyc()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is not distinct from old.status then
    return new;
  end if;

  insert into public.notifications (user_id, kind, title, body, link, metadata)
  values (
    new.customer_id, 'kyc',
    case when new.status = 'approved'
      then 'Identité vérifiée'
      else 'Document d''identité rejeté'
    end,
    case when new.status = 'approved'
      then 'Votre pièce a été validée, votre profil est maintenant vérifié.'
      else coalesce('Motif : ' || nullif(new.review_note, ''),
                    'Merci de déposer une nouvelle pièce conforme.')
    end,
    '/account',
    jsonb_build_object('document_id', new.id, 'status', new.status)
  );
  return new;
end;
$$;

create trigger trg_notify_customer_kyc
after update on public.customer_documents
for each row execute function public.tfn_notify_customer_kyc();

-- 6) Contrat généré -> le client (si compte lié)
create or replace function public.tfn_notify_customer_contract()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.customer_id is null then
    return new;
  end if;

  insert into public.notifications (user_id, kind, title, body, link, metadata)
  values (
    new.customer_id, 'contract',
    'Contrat disponible : ' || new.reference,
    'Votre contrat PDF est disponible dans votre espace.',
    '/account',
    jsonb_build_object('contract_id', new.id)
  );
  return new;
end;
$$;

create trigger trg_notify_customer_contract
after insert on public.contracts
for each row execute function public.tfn_notify_customer_contract();

-- ============ DISPATCH EMAIL (pg_net -> Edge Function) ============
-- Tout échec réseau est capturé : une notification in-app ne doit jamais
-- être bloquée par l'indisponibilité du service email.
create or replace function public.dispatch_notification_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_secret text;
begin
  select decrypted_secret into v_secret
  from vault.decrypted_secrets
  where name = 'NOTIFY_WEBHOOK_SECRET';

  if v_secret is null then
    raise warning 'NOTIFY_WEBHOOK_SECRET absent du Vault, email non envoyé';
    return new;
  end if;

  perform net.http_post(
    url := 'https://fbnnlgchburfcqhkbgxl.supabase.co/functions/v1/notify-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-notify-secret', v_secret
    ),
    body := jsonb_build_object('notification', to_jsonb(new))
  );
  return new;
exception
  when others then
    raise warning 'dispatch_notification_email : %', sqlerrm;
    return new;
end;
$$;

create trigger trg_notifications_email_dispatch
after insert on public.notifications
for each row execute function public.dispatch_notification_email();
