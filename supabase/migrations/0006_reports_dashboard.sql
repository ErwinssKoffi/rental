-- 0006_reports_dashboard.sql
-- Fonctions d'agrégation pour le tableau de bord administrateur.
-- Toutes sont SECURITY DEFINER avec garde is_staff() : les données
-- commerciales ne sont jamais exposées aux visiteurs anonymes.
-- Exécution accordée au rôle authenticated uniquement.

-- ============ KPI CONSOLIDÉS ============
create or replace function public.admin_dashboard_kpis()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_staff() then
    raise exception 'Accès réservé au personnel' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'fleet', jsonb_build_object(
      'total',             (select count(*) from public.vehicles),
      'published',         (select count(*) from public.vehicles where is_published),
      'featured',          (select count(*) from public.vehicles where is_featured),
      'trackers_linked',   (select count(*) from public.vehicles where tracker_device_id is not null),
      'by_status',         coalesce((
        select jsonb_object_agg(status, c)
        from (select status, count(*) as c from public.vehicles group by status) s
      ), '{}'::jsonb)
    ),
    'bookings', jsonb_build_object(
      'total',             (select count(*) from public.bookings),
      'active',            (select count(*) from public.bookings where status = 'active'),
      'pending',           (select count(*) from public.bookings where status = 'pending'),
      'by_status',         coalesce((
        select jsonb_object_agg(status, c)
        from (select status, count(*) as c from public.bookings group by status) s
      ), '{}'::jsonb),
      'rental_revenue_all_time', coalesce((
        select sum(total_amount) from public.bookings where status = 'completed'
      ), 0),
      'rental_revenue_30d', coalesce((
        select sum(total_amount) from public.bookings
        where status = 'completed'
          and start_date >= current_date - 30
      ), 0),
      'occupancy_30d_pct', coalesce((
        select round(
          100.0 * sum(
            greatest(0, least(b.end_date, current_date)
                       - greatest(b.start_date, current_date - 30) + 1)
          ) / nullif((select count(*) from public.vehicles) * 30, 0), 1)
        from public.bookings b
        where b.status in ('confirmed', 'active', 'completed')
          and b.start_date <= current_date
          and b.end_date >= current_date - 30
      ), 0)
    ),
    'sales', jsonb_build_object(
      'total',             (select count(*) from public.vehicle_sales),
      'open',              (select count(*) from public.vehicle_sales where status not in ('delivered', 'cancelled')),
      'delivered',         (select count(*) from public.vehicle_sales where status = 'delivered'),
      'by_status',         coalesce((
        select jsonb_object_agg(status, c)
        from (select status, count(*) as c from public.vehicle_sales group by status) s
      ), '{}'::jsonb),
      'revenue_all_time',  coalesce((
        select sum(coalesce(agreed_price, asking_price, 0))
        from public.vehicle_sales where status = 'delivered'
      ), 0),
      'revenue_90d',       coalesce((
        select sum(coalesce(agreed_price, asking_price, 0))
        from public.vehicle_sales
        where status = 'delivered'
          and coalesce(sold_at, created_at) >= now() - interval '90 days'
      ), 0),
      'pipeline_value',    coalesce((
        select sum(coalesce(agreed_price, asking_price, 0))
        from public.vehicle_sales
        where status in ('lead', 'negotiation', 'ordered', 'invoiced', 'paid')
      ), 0)
    ),
    'leads', jsonb_build_object(
      'total',             (select count(*) from public.leads),
      'new',               (select count(*) from public.leads where status = 'new'),
      'converted',         (select count(*) from public.leads where status = 'converted')
    ),
    'tracking', jsonb_build_object(
      'positions_24h',     (select count(distinct vehicle_id) from public.vehicle_locations
                            where recorded_at >= now() - interval '24 hours')
    ),
    'generated_at', now()
  ) into result;

  return result;
end;
$$;

-- ============ SÉRIE DE REVENUS JOURNALIERS ============
create or replace function public.admin_revenue_series(p_days int default 30)
returns table (day date, rental numeric, sales numeric)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'Accès réservé au personnel' using errcode = '42501';
  end if;

  return query
  with bounds as (
    select current_date - p_days as win_start, current_date as win_end
  ),
  days as (
    select generate_series(
      (select win_start from bounds),
      (select win_end from bounds),
      interval '1 day'
    )::date as d
  ),
  rental_by_day as (
    select b.start_date::date as d, sum(b.total_amount) as amt
    from public.bookings b, bounds
    where b.status <> 'cancelled'
      and b.start_date between bounds.win_start and bounds.win_end
    group by 1
  ),
  sales_by_day as (
    select coalesce(s.sold_at, s.created_at)::date as d,
           sum(coalesce(s.agreed_price, s.asking_price, 0)) as amt
    from public.vehicle_sales s, bounds
    where s.status <> 'cancelled'
      and coalesce(s.sold_at, s.created_at)::date
          between bounds.win_start and bounds.win_end
    group by 1
  )
  select days.d,
         coalesce(rental_by_day.amt, 0)::numeric as rental,
         coalesce(sales_by_day.amt, 0)::numeric  as sales
  from days
  left join rental_by_day on rental_by_day.d = days.d
  left join sales_by_day  on sales_by_day.d  = days.d
  order by days.d;
end;
$$;

-- ============ TAUX D'OCCUPATION PAR VÉHICULE ============
create or replace function public.admin_fleet_utilization(p_days int default 30)
returns table (
  vehicle_id       uuid,
  brand            text,
  model            text,
  slug             text,
  status           text,
  bookings_count   bigint,
  booked_days      integer,
  occupancy_pct    numeric,
  rental_revenue   numeric,
  last_position_at timestamptz,
  tracker_linked   boolean
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'Accès réservé au personnel' using errcode = '42501';
  end if;

  return query
  with bounds as (
    select current_date - p_days as win_start, current_date as win_end
  ),
  computed as (
    select
      v.id as vehicle_id,
      v.brand,
      v.model,
      v.slug,
      v.status::text as status,
      (select count(*) from public.bookings b
        where b.vehicle_id = v.id and b.status <> 'cancelled') as bookings_count,
      coalesce((
        select sum(
          greatest(
            0,
            least(b.end_date, bounds.win_end)
              - greatest(b.start_date, bounds.win_start) + 1
          )
        )
        from public.bookings b
        where b.vehicle_id = v.id
          and b.status in ('confirmed', 'active', 'completed')
          and b.start_date <= bounds.win_end
          and b.end_date >= bounds.win_start
      ), 0) as booked_days,
      coalesce((
        select sum(b.total_amount) from public.bookings b
        where b.vehicle_id = v.id and b.status = 'completed'
      ), 0) as rental_revenue,
      (select max(l.recorded_at) from public.vehicle_locations l
        where l.vehicle_id = v.id) as last_position_at,
      (v.tracker_device_id is not null) as tracker_linked
    from public.vehicles v, bounds
  )
  select
    vehicle_id, brand, model, slug, status, bookings_count,
    booked_days::integer,
    round(100.0 * booked_days / greatest(p_days, 1), 1) as occupancy_pct,
    rental_revenue,
    last_position_at,
    tracker_linked
  from computed
  order by booked_days desc, brand, model;
end;
$$;

-- ============ PERMISSIONS ============
-- Les rôles Supabase anon/authenticated reçoivent l'EXECUTE par défaut :
-- on révoque explicitement depuis public ET anon (garde is_staff en second rideau).
revoke all on function public.admin_dashboard_kpis() from public, anon;
revoke all on function public.admin_revenue_series(int) from public, anon;
revoke all on function public.admin_fleet_utilization(int) from public, anon;

grant execute on function public.admin_dashboard_kpis() to authenticated;
grant execute on function public.admin_revenue_series(int) to authenticated;
grant execute on function public.admin_fleet_utilization(int) to authenticated;
