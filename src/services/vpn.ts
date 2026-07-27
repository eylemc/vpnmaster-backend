import { supabase } from '../lib/supabase';

export type Device = {
  id: string;
  name: string;
  status: 'pending' | 'provisioning' | 'active' | 'disabled' | 'error';
  created_at: string;
};

export async function listDevices(userId: string): Promise<Device[]> {
  const { data, error } = await supabase
    .from('devices')
    .select('id, name, status, created_at')
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
    .select('id, name, status, created_at')
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

export async function downloadConfig(_deviceId: string): Promise<void> {
  void _deviceId;
  // TODO: fetch WireGuard config from provisioning API
  throw new Error('Configuration download not yet implemented');
}
