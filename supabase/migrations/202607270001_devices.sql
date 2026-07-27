create table public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  status text not null default 'pending'
    check (status in ('pending', 'provisioning', 'active', 'disabled', 'error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint devices_name_length check (char_length(trim(name)) between 1 and 50),
  constraint devices_user_name_unique unique (user_id, name)
);

create index devices_user_id_created_at_idx
  on public.devices (user_id, created_at);

alter table public.devices enable row level security;

create policy "Users can view their own devices"
  on public.devices for select
  using (auth.uid() = user_id);

create policy "Users can add their own devices"
  on public.devices for insert
  with check (auth.uid() = user_id);

create policy "Users can rename their own devices"
  on public.devices for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can remove their own devices"
  on public.devices for delete
  using (auth.uid() = user_id);

create or replace function public.enforce_device_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtext(new.user_id::text));

  if (
    select count(*)
    from public.devices
    where user_id = new.user_id
  ) >= 3 then
    raise exception 'Device limit reached'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create trigger enforce_device_limit_before_insert
  before insert on public.devices
  for each row execute procedure public.enforce_device_limit();
