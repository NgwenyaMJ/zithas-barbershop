-- Zithas Barbershop starter database schema.
-- Run this in Supabase SQL Editor. Keep the service-role key server-side only.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'customer' check (role in ('customer','barber','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_minutes integer not null default 30,
  price_zar numeric(10,2) not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.barbers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  display_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  customer_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  phone text not null,
  service_id uuid references public.services(id) on delete set null,
  service_name text not null,
  barber_id uuid references public.barbers(id) on delete set null,
  barber_name text not null,
  booking_date date not null,
  booking_time time not null,
  status text not null default 'pending' check (status in ('pending','confirmed','in_progress','completed','cancelled')),
  price numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.queue_entries (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  ticket_number text not null unique,
  customer_name text not null,
  service_name text not null,
  barber_name text,
  status text not null default 'waiting' check (status in ('waiting','called','in_chair','completed','left')),
  position integer not null,
  joined_at timestamptz not null default now(),
  called_at timestamptz,
  completed_at timestamptz
);

create index if not exists bookings_date_time_idx on public.bookings (booking_date, booking_time);
create index if not exists queue_status_position_idx on public.queue_entries (status, position);
create index if not exists bookings_reference_idx on public.bookings (reference);

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.barbers enable row level security;
alter table public.bookings enable row level security;
alter table public.queue_entries enable row level security;

-- Public can read active services and barbers.
create policy "Public can view active services" on public.services for select using (active = true);
create policy "Public can view active barbers" on public.barbers for select using (active = true);

-- Do not enable public direct writes to bookings/queue.
-- Booking creation and staff operations in this starter use a server-only service role.
-- Before production, add authenticated staff authorization checks to API routes.
-- The service role bypasses RLS and must NEVER be exposed in NEXT_PUBLIC variables.

insert into public.services (name, description, duration_minutes, price_zar)
select v.name, v.description, v.duration, v.price
from (values
 ('Fade Haircut','A clean fade tailored to your style.',35,100),
 ('Classic Haircut','A timeless cut with a polished finish.',30,80),
 ('Beard Trim','Shape, detail and line-up.',20,60),
 ('Haircut & Beard','The complete fresh look.',50,150),
 ('Kids Haircut','A neat, comfortable cut for kids.',30,70),
 ('Haircut with Design','A custom look with detailed finishing.',45,170)
) as v(name,description,duration,price)
where not exists (select 1 from public.services s where s.name = v.name);
