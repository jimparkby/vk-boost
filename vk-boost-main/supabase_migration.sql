-- Таблица профилей пользователей
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  provider text default 'google',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Включаем Row Level Security
alter table public.profiles enable row level security;

-- Политики: пользователь видит и редактирует только свой профиль
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
