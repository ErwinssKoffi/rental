-- 04_demo_reports.sql
-- Jeu de démonstration pour le tableau de bord (phase 4-D).
-- Idempotent : ON CONFLICT (reference) DO NOTHING.
-- À n'exécuter que sur un environnement de démo.

do $$
declare
  cust uuid;
  v_porsche uuid;
  v_bmw uuid;
  v_audi uuid;
  v_rover uuid;
begin
  select id into cust from public.profiles order by created_at limit 1;
  select id into v_porsche from public.vehicles where slug = 'porsche-911-carrera';
  select id into v_bmw     from public.vehicles where slug = 'bmw-m5-competition';
  select id into v_audi    from public.vehicles where slug = 'audi-rs7-sportback';
  select id into v_rover   from public.vehicles where slug = 'range-rover-autobiography';

  insert into public.bookings
    (reference, vehicle_id, customer_id, status, start_date, end_date,
     daily_price, total_amount, deposit_amount, payment_status)
  values
    ('DEMO-BOOK-1', v_porsche, cust, 'completed', current_date - 20, current_date - 16,
     950, 4750, 1900, 'paid'),
    ('DEMO-BOOK-2', v_bmw, cust, 'completed', current_date - 8, current_date - 6,
     350, 1050, 700, 'paid'),
    ('DEMO-BOOK-3', v_audi, cust, 'active', current_date, current_date + 2,
     310, 930, 620, 'partial')
  on conflict (reference) do nothing;

  insert into public.vehicle_sales
    (reference, vehicle_id, customer_id, customer_name, customer_email,
     status, asking_price, agreed_price, deposit, payment_status, sold_at)
  select 'DEMO-SALE-1', v_rover, cust, 'Aya Koffi', 'aya.koffi@exemple.ci',
         'delivered', v.sale_price, v.sale_price, 5000, 'paid',
         now() - interval '5 days'
  from public.vehicles v
  where v.id = v_rover
  on conflict (reference) do nothing;
end $$;
