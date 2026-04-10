-- =====================================================
-- 愛犬健康手帳 Supabase スキーマ
-- Supabase SQL Editor で実行してください
-- =====================================================

-- dogs テーブル
create table if not exists public.dogs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  breed       text not null,
  birthdate   date not null,
  size        text not null check (size in ('small', 'medium', 'large')),
  weight      numeric(5, 2),
  created_at  timestamptz not null default now()
);

-- weight_logs テーブル
create table if not exists public.weight_logs (
  id           uuid primary key default gen_random_uuid(),
  dog_id       uuid not null references public.dogs(id) on delete cascade,
  weight       numeric(5, 2) not null,
  recorded_at  timestamptz not null default now()
);

-- vaccinations テーブル
create table if not exists public.vaccinations (
  id             uuid primary key default gen_random_uuid(),
  dog_id         uuid not null references public.dogs(id) on delete cascade,
  name           text not null,
  vaccinated_at  date not null,
  next_due_at    date
);

-- vet_visits テーブル
create table if not exists public.vet_visits (
  id           uuid primary key default gen_random_uuid(),
  dog_id       uuid not null references public.dogs(id) on delete cascade,
  visited_at   date not null,
  clinic_name  text not null,
  diagnosis    text,
  notes        text
);

-- meal_logs テーブル
create table if not exists public.meal_logs (
  id           uuid primary key default gen_random_uuid(),
  dog_id       uuid not null references public.dogs(id) on delete cascade,
  food_name    text not null,
  amount       numeric(7, 2),
  recorded_at  timestamptz not null default now()
);

-- walk_logs テーブル
create table if not exists public.walk_logs (
  id                uuid primary key default gen_random_uuid(),
  dog_id            uuid not null references public.dogs(id) on delete cascade,
  duration_minutes  integer not null,
  distance_km       numeric(6, 2),
  recorded_at       timestamptz not null default now()
);

-- =====================================================
-- Row Level Security (RLS)
-- 自分のデータのみ読み書きできるようにする
-- =====================================================

alter table public.dogs enable row level security;
alter table public.weight_logs enable row level security;
alter table public.vaccinations enable row level security;
alter table public.vet_visits enable row level security;
alter table public.meal_logs enable row level security;
alter table public.walk_logs enable row level security;

-- dogs ポリシー
create policy "dogs: own data only"
  on public.dogs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- weight_logs ポリシー（dogを介して所有者チェック）
create policy "weight_logs: own data only"
  on public.weight_logs for all
  using (
    exists (
      select 1 from public.dogs
      where dogs.id = weight_logs.dog_id
        and dogs.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.dogs
      where dogs.id = weight_logs.dog_id
        and dogs.user_id = auth.uid()
    )
  );

-- vaccinations ポリシー
create policy "vaccinations: own data only"
  on public.vaccinations for all
  using (
    exists (
      select 1 from public.dogs
      where dogs.id = vaccinations.dog_id
        and dogs.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.dogs
      where dogs.id = vaccinations.dog_id
        and dogs.user_id = auth.uid()
    )
  );

-- vet_visits ポリシー
create policy "vet_visits: own data only"
  on public.vet_visits for all
  using (
    exists (
      select 1 from public.dogs
      where dogs.id = vet_visits.dog_id
        and dogs.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.dogs
      where dogs.id = vet_visits.dog_id
        and dogs.user_id = auth.uid()
    )
  );

-- meal_logs ポリシー
create policy "meal_logs: own data only"
  on public.meal_logs for all
  using (
    exists (
      select 1 from public.dogs
      where dogs.id = meal_logs.dog_id
        and dogs.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.dogs
      where dogs.id = meal_logs.dog_id
        and dogs.user_id = auth.uid()
    )
  );

-- walk_logs ポリシー
create policy "walk_logs: own data only"
  on public.walk_logs for all
  using (
    exists (
      select 1 from public.dogs
      where dogs.id = walk_logs.dog_id
        and dogs.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.dogs
      where dogs.id = walk_logs.dog_id
        and dogs.user_id = auth.uid()
    )
  );

-- =====================================================
-- インデックス（パフォーマンス最適化）
-- =====================================================

create index if not exists idx_dogs_user_id on public.dogs(user_id);
create index if not exists idx_weight_logs_dog_id on public.weight_logs(dog_id);
create index if not exists idx_weight_logs_recorded_at on public.weight_logs(recorded_at desc);
create index if not exists idx_vaccinations_dog_id on public.vaccinations(dog_id);
create index if not exists idx_vet_visits_dog_id on public.vet_visits(dog_id);
create index if not exists idx_meal_logs_dog_id on public.meal_logs(dog_id);
create index if not exists idx_walk_logs_dog_id on public.walk_logs(dog_id);
