// Placeholder — replace with real VPN provisioning API when ready
export type Device = {
  id: string;
  name: string;
  createdAt: string;
};

export async function listDevices(_userId: string): Promise<Device[]> {
  // TODO: query Supabase devices table scoped to userId
  return [];
}

export async function addDevice(_userId: string, _name: string): Promise<Device> {
  // TODO: call VPN provisioning API, store peer in Supabase
  throw new Error('Device provisioning not yet implemented');
}

export async function downloadConfig(_deviceId: string): Promise<void> {
  // TODO: fetch WireGuard config from provisioning API
  throw new Error('Configuration download not yet implemented');
}
