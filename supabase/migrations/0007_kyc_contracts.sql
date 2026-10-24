-- 0007_kyc_contracts.sql
-- KYC client (pièces d'identité en stockage privé) et contrats PDF.
-- Données sensibles : buckets PRIVÉS, accès par URL signée, RLS stricte.

-- ============ ÉNUMÉRATIONS ============
create type public.kyc_document_type as enum
  ('id_card', 'driver_license', 'proof_of_address', 'other');

create type public.document_review_status as enum
  ('pending', 'approved', 'rejected');

create type public.contract_type as enum
  ('rental', 'sale');

-- ============ DOCUMENTS KYC DES CLIENTS ============
create table public.customer_documents (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.profiles (id) on delete cascade,
  type         public.kyc_document_type not null,
  file_name    text not null,
  storage_path text not null,
  mime_type    text,
  size_bytes   bigint,
  status       public.document_review_status not null default 'pending',
  review_note  text,
  reviewed_by  uuid references public.profiles (id) on delete set null,
  reviewed_at  timestamptz,
  created_at   timestamptz not null default now()
);

create index customer_documents_customer_idx
  on public.customer_documents (customer_id, created_at desc);
create index customer_documents_status_idx
  on public.customer_documents (status);

alter table public.customer_documents enable row level security;

-- Le client voit ses propres pièces ; le personnel voit tout
create policy "customer_documents_owner_or_staff_read"
  on public.customer_documents
  for select using (
    auth.uid() = customer_id or public.is_staff()
  );

-- Le client dépose ses pièces (uniquement pour lui-même, en attente)
create policy "customer_documents_owner_insert"
  on public.customer_documents
  for insert with check (
    auth.uid() = customer_id and status = 'pending'
  );

-- Le client peut supprimer une pièce encore en attente
create policy "customer_documents_owner_pending_delete"
  on public.customer_documents
  for delete using (
    auth.uid() = customer_id and status = 'pending'
  );

-- La validation passe par la fonction SECURITY DEFINER review_kyc_document :
-- aucun UPDATE direct n'est accordé aux clients.

-- ============ CONTRATS PDF ============
create table public.contracts (
  id           uuid primary key default gen_random_uuid(),
  reference    text not null unique,
  type         public.contract_type not null,
  booking_id   uuid references public.bookings (id) on delete set null,
  sale_id      uuid references public.vehicle_sales (id) on delete set null,
  customer_id  uuid references public.profiles (id) on delete set null,
  file_name    text not null,
  storage_path text not null,
  generated_by uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now()
);

create index contracts_booking_idx on public.contracts (booking_id);
create index contracts_sale_idx    on public.contracts (sale_id);
create index contracts_customer_idx on public.contracts (customer_id);

alter table public.contracts enable row level security;

create policy "contracts_owner_or_staff_read"
  on public.contracts
  for select using (
    auth.uid() = customer_id or public.is_staff()
  );

-- Création/suppression réservées au personnel (génération côté back-office)
create policy "contracts_staff_insert"
  on public.contracts
  for insert with check (public.is_staff());

create policy "contracts_staff_delete"
  on public.contracts
  for delete using (public.is_staff());

-- ============ FONCTION DE VALIDATION KYC ============
-- SECURITY DEFINER car seul un admin peut modifier profiles, alors que la
-- vérification KYC est ouverte à tout le personnel (is_staff).
create or replace function public.review_kyc_document(
  p_doc_id   uuid,
  p_approve  boolean,
  p_note     text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  doc public.customer_documents;
begin
  if not public.is_staff() then
    raise exception 'Accès réservé au personnel' using errcode = '42501';
  end if;

  select * into doc from public.customer_documents where id = p_doc_id;
  if not found then
    raise exception 'Document introuvable' using errcode = 'P0002';
  end if;

  update public.customer_documents
  set status = case when p_approve then 'approved' else 'rejected' end,
      review_note = p_note,
      reviewed_by = auth.uid(),
      reviewed_at = now()
  where id = p_doc_id;

  -- Une pièce approuvée vérifie le profil et miroite les URLs officielles
  if p_approve then
    update public.profiles
    set kyc_verified = true,
        id_document_url = case
          when doc.type = 'id_card' then doc.storage_path
          else id_document_url
        end,
        license_url = case
          when doc.type = 'driver_license' then doc.storage_path
          else license_url
        end
    where id = doc.customer_id;
  end if;
end;
$$;

revoke all on function public.review_kyc_document(uuid, boolean, text) from public, anon;
grant execute on function public.review_kyc_document(uuid, boolean, text) to authenticated;

-- ============ STOCKAGE PRIVÉ ============
insert into storage.buckets (id, name, public)
values ('customer-documents', 'customer-documents', false)
on conflict (id) do update set public = false;

insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', false)
on conflict (id) do update set public = false;

-- Plan de nommage : customer-documents/{user_id}/{uuid}-{fichier}
--                  contracts/{user_id}/{reference}.pdf
-- storage.foldername(name)[1] = premier segment = propriétaire

create policy "customer_documents_owner_read_storage" on storage.objects
  for select using (
    bucket_id = 'customer-documents'
    and (
      public.is_staff()
      or auth.uid()::text = (storage.foldername(name))[1]
    )
  );

create policy "customer_documents_owner_insert_storage" on storage.objects
  for insert with check (
    bucket_id = 'customer-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "customer_documents_owner_or_staff_delete_storage" on storage.objects
  for delete using (
    bucket_id = 'customer-documents'
    and (
      public.is_staff()
      or auth.uid()::text = (storage.foldername(name))[1]
    )
  );

-- Contrats : lecteur propriétaire ou personnel, écriture personnel seulement
create policy "contracts_owner_or_staff_read_storage" on storage.objects
  for select using (
    bucket_id = 'contracts'
    and (
      public.is_staff()
      or auth.uid()::text = (storage.foldername(name))[1]
    )
  );

create policy "contracts_staff_insert_storage" on storage.objects
  for insert with check (
    bucket_id = 'contracts' and public.is_staff()
  );

create policy "contracts_staff_delete_storage" on storage.objects
  for delete using (
    bucket_id = 'contracts' and public.is_staff()
  );
