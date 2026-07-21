// Placeholder — replace with real VPN provisioning API when ready
export type Device = {
  id: string;
  name: string;
  createdAt: string;
};

export async function listDevices(_userId: string): Promise<Device[]> {
  void _userId;
  // TODO: query Supabase devices table scoped to userId
  return [];
}

export async function addDevice(_userId: string, _name: string): Promise<Device> {
  void _userId;
  void _name;
  // TODO: call VPN provisioning API, store peer in Supabase
  throw new Error('Device provisioning not yet implemented');
}

export async function downloadConfig(_deviceId: string): Promise<void> {
  void _deviceId;
  // TODO: fetch WireGuard config from provisioning API
  throw new Error('Configuration download not yet implemented');
}
