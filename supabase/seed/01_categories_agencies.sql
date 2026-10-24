-- 01 — Catégories et agence (idempotent)
begin;
insert into public.categories (name, slug, description, sort_order, is_active) values
  ('Economy', 'economy', 'Véhicules de catégorie Economy', 1, true),
  ('Luxury', 'luxury', 'Véhicules de catégorie Luxury', 2, true),
  ('Sports', 'sports', 'Véhicules de catégorie Sports', 3, true),
  ('SUV', 'suv', 'Véhicules de catégorie SUV', 4, true)
on conflict (slug) do update set
  name = excluded.name, description = excluded.description,
  sort_order = excluded.sort_order, is_active = true;

insert into public.agencies (name, address, city, phone, email, location, is_active)
values (
  'Velox Rentals — Abidjan Plateau', 'Boulevard Roume, Le Plateau', 'Abidjan',
  '+225 27 20 00 00 00', 'contact@velox.ci',
  ST_SetSRID(ST_MakePoint(-4.0197, 5.3204), 4326)::geography, true
)
on conflict (name) do nothing;
commit;
