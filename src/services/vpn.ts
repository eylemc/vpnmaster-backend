import { supabase } from '../lib/supabase';

export type Device = {
  id: string;
  name: string;
  status: 'pending' | 'provisioning' | 'active' | 'disabled' | 'error';
  ipv4_address: string | null;
  ipv6_address: string | null;
  created_at: string;
};

export async function listDevices(userId: string): Promise<Device[]> {
  const { data, error } = await supabase
    .from('devices')
    .select('id, name, status, ipv4_address, ipv6_address, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data as Device[];
}

export async function addDevice(userId: string, name: string): Promise<Device> {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error('Enter a device name.');
  }

  const { data, error } = await supabase
    .from('devices')
    .insert({ user_id: userId, name: normalizedName })
    .select('id, name, status, ipv4_address, ipv6_address, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('You already have a device with this name.');
    }

    if (error.message.includes('Device limit reached')) {
      throw new Error('You can add up to 3 devices.');
    }

    throw error;
  }

  return data as Device;
}

export async function provisionDevice(deviceId: string): Promise<Device> {
  const response = await provisioningRequest(
    `/v1/devices/${deviceId}/provision`,
    { method: 'POST' },
  );

  return response.json() as Promise<Device>;
}

export async function downloadConfig(device: Device): Promise<void> {
  const response = await provisioningRequest(
    `/v1/devices/${device.id}/configuration`,
  );
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = device.name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');

  link.href = url;
  link.download = `${safeName || 'vpnmaster-device'}.conf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function getQrCodeUrl(deviceId: string): Promise<string> {
  const response = await provisioningRequest(
    `/v1/devices/${deviceId}/qrcode.svg`,
  );
  return URL.createObjectURL(await response.blob());
}

async function provisioningRequest(path: string, init?: RequestInit) {
  const { data, error } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  if (error || !accessToken) {
    throw new Error('Your session expired. Please sign in again.');
  }

  const apiUrl =
    import.meta.env.VITE_PROVISIONING_API_URL ?? 'https://nl1.vpnmaster.com';
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `VPN service request failed (${response.status}).`);
  }

  return response;
}
