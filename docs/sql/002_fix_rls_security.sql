-- ==============================================================================
-- FIX SECURITY VULNERABILITIES (RLS)
-- Jalankan script ini di SQL Editor Supabase untuk memperbaiki peringatan keamanan.
-- Script ini akan mengaktifkan Row Level Security (RLS) untuk semua tabel
-- dan menerapkan policy standar: Public Read, Admin Write.
-- ==============================================================================

-- 1. Tabel DEPARTMENTS (Kemungkinan besar ini penyebab utama error)
alter table if exists public.departments enable row level security;

-- Hapus policy lama jika ada untuk menghindari duplikasi
drop policy if exists "Enable read access for all users" on public.departments;
drop policy if exists "Enable insert for authenticated users only" on public.departments;
drop policy if exists "Enable update for authenticated users only" on public.departments;
drop policy if exists "Enable delete for authenticated users only" on public.departments;

-- Buat policy baru
create policy "Enable read access for all users" on public.departments for select to public using (true);
create policy "Enable insert for authenticated users only" on public.departments for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.departments for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.departments for delete to authenticated using (true);


-- 2. Pastikan tabel MEMBERS aman
alter table if exists public.members enable row level security;

drop policy if exists "Enable read access for all users" on public.members;
drop policy if exists "Enable insert for authenticated users only" on public.members;
drop policy if exists "Enable update for authenticated users only" on public.members;
drop policy if exists "Enable delete for authenticated users only" on public.members;

create policy "Enable read access for all users" on public.members for select to public using (true);
create policy "Enable insert for authenticated users only" on public.members for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.members for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.members for delete to authenticated using (true);


-- 3. Pastikan tabel LPP aman
alter table if exists public.lpp enable row level security;

drop policy if exists "Enable read access for all users" on public.lpp;
drop policy if exists "Enable insert for authenticated users only" on public.lpp;
drop policy if exists "Enable update for authenticated users only" on public.lpp;
drop policy if exists "Enable delete for authenticated users only" on public.lpp;

create policy "Enable read access for all users" on public.lpp for select to public using (true);
create policy "Enable insert for authenticated users only" on public.lpp for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.lpp for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.lpp for delete to authenticated using (true);


-- 4. Pastikan tabel NEWS aman
alter table if exists public.news enable row level security;

drop policy if exists "Enable read access for all users" on public.news;
drop policy if exists "Enable insert for authenticated users only" on public.news;
drop policy if exists "Enable update for authenticated users only" on public.news;
drop policy if exists "Enable delete for authenticated users only" on public.news;

create policy "Enable read access for all users" on public.news for select to public using (true);
create policy "Enable insert for authenticated users only" on public.news for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.news for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.news for delete to authenticated using (true);


-- 5. Pastikan tabel EVENTS aman
alter table if exists public.events enable row level security;

drop policy if exists "Enable read access for all users" on public.events;
drop policy if exists "Enable insert for authenticated users only" on public.events;
drop policy if exists "Enable update for authenticated users only" on public.events;
drop policy if exists "Enable delete for authenticated users only" on public.events;

create policy "Enable read access for all users" on public.events for select to public using (true);
create policy "Enable insert for authenticated users only" on public.events for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.events for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.events for delete to authenticated using (true);


-- 6. Pastikan tabel TRAININGS aman
alter table if exists public.trainings enable row level security;

drop policy if exists "Enable read access for all users" on public.trainings;
drop policy if exists "Enable insert for authenticated users only" on public.trainings;
drop policy if exists "Enable update for authenticated users only" on public.trainings;
drop policy if exists "Enable delete for authenticated users only" on public.trainings;

create policy "Enable read access for all users" on public.trainings for select to public using (true);
create policy "Enable insert for authenticated users only" on public.trainings for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.trainings for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.trainings for delete to authenticated using (true);


-- 7. Pastikan tabel GALLERY aman
alter table if exists public.gallery enable row level security;

drop policy if exists "Enable read access for all users" on public.gallery;
drop policy if exists "Enable insert for authenticated users only" on public.gallery;
drop policy if exists "Enable update for authenticated users only" on public.gallery;
drop policy if exists "Enable delete for authenticated users only" on public.gallery;

create policy "Enable read access for all users" on public.gallery for select to public using (true);
create policy "Enable insert for authenticated users only" on public.gallery for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.gallery for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.gallery for delete to authenticated using (true);


-- 8. Pastikan tabel CHAIRMEN aman
alter table if exists public.chairmen enable row level security;

drop policy if exists "Enable read access for all users" on public.chairmen;
drop policy if exists "Enable insert for authenticated users only" on public.chairmen;
drop policy if exists "Enable update for authenticated users only" on public.chairmen;
drop policy if exists "Enable delete for authenticated users only" on public.chairmen;

create policy "Enable read access for all users" on public.chairmen for select to public using (true);
create policy "Enable insert for authenticated users only" on public.chairmen for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.chairmen for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.chairmen for delete to authenticated using (true);
