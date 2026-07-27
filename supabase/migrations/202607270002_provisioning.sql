alter table public.devices
  add column wg_client_id bigint,
  add column ipv4_address inet,
  add column ipv6_address inet,
  add column provisioned_at timestamptz,
  add column provisioning_error text;

create unique index devices_wg_client_id_unique
  on public.devices (wg_client_id)
  where wg_client_id is not null;

drop policy "Users can rename their own devices" on public.devices;
drop policy "Users can remove their own devices" on public.devices;

revoke insert on public.devices from authenticated;
revoke update on public.devices from authenticated;
revoke delete on public.devices from authenticated;

grant insert (user_id, name) on public.devices to authenticated;
grant update (name) on public.devices to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_devices_updated_at
  before update on public.devices
  for each row execute procedure public.set_updated_at();
