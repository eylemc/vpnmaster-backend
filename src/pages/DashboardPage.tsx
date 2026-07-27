import { FormEvent, useEffect, useState } from 'react';
import { Wifi, Monitor, Download, QrCode, Activity, CreditCard, LogOut, PlusCircle, Info, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { signOut } from '../services/auth';
import { openBillingPortal } from '../services/billing';
import {
  addDevice,
  downloadConfig,
  getQrCodeUrl,
  listDevices,
  provisionDevice,
  type Device,
} from '../services/vpn';
import { useAuth } from '../context/AuthContext';

function handleBillingPortal() {
  openBillingPortal().catch(() => {
    alert('Billing portal is not yet connected.');
  });
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [devicesError, setDevicesError] = useState('');
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [addingDevice, setAddingDevice] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [provisioningDeviceId, setProvisioningDeviceId] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const selectedDevice =
    devices.find((device) => device.id === selectedDeviceId) ?? devices[0] ?? null;

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;
    setDevicesLoading(true);
    setDevicesError('');

    listDevices(user.id)
      .then((result) => {
        if (!cancelled) {
          setDevices(result);
          setSelectedDeviceId((current) => current ?? result[0]?.id ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDevicesError('Devices could not be loaded.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDevicesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleAddDevice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    setAddingDevice(true);
    setDevicesError('');

    try {
      const pendingDevice = await addDevice(user.id, deviceName);
      setDevices((current) => [...current, pendingDevice]);
      setSelectedDeviceId(pendingDevice.id);
      setDeviceName('');
      setAddDeviceOpen(false);
      await activateDevice(pendingDevice);
    } catch (error) {
      setDevicesError(error instanceof Error ? error.message : 'Device could not be added.');
    } finally {
      setAddingDevice(false);
    }
  }

  async function activateDevice(device: Device) {
    setProvisioningDeviceId(device.id);
    setDevicesError('');
    setDevices((current) =>
      current.map((item) =>
        item.id === device.id ? { ...item, status: 'provisioning' } : item,
      ),
    );

    try {
      const activeDevice = await provisionDevice(device.id);
      setDevices((current) =>
        current.map((item) =>
          item.id === activeDevice.id ? { ...item, ...activeDevice } : item,
        ),
      );
    } catch (error) {
      setDevices((current) =>
        current.map((item) =>
          item.id === device.id ? { ...item, status: 'error' } : item,
        ),
      );
      setDevicesError(error instanceof Error ? error.message : 'Device activation failed.');
    } finally {
      setProvisioningDeviceId(null);
    }
  }

  async function handleDownloadConfig() {
    if (!selectedDevice) {
      return;
    }

    try {
      await downloadConfig(selectedDevice);
    } catch (error) {
      setDevicesError(error instanceof Error ? error.message : 'Configuration download failed.');
    }
  }

  async function handleShowQR() {
    if (!selectedDevice) {
      return;
    }

    try {
      setQrCodeUrl(await getQrCodeUrl(selectedDevice.id));
    } catch (error) {
      setDevicesError(error instanceof Error ? error.message : 'QR code could not be loaded.');
    }
  }

  function closeQrCode() {
    if (qrCodeUrl) {
      URL.revokeObjectURL(qrCodeUrl);
    }
    setQrCodeUrl(null);
  }

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch {
      alert('Sign-out failed. Please try again.');
    }
  }
  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage your VPN account and devices.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Subscription status */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Subscription</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            <span className="text-sm font-semibold text-slate-300">Inactive</span>
          </div>
          <p className="text-xs text-slate-500 mb-5">No active subscription. Start one to get connected.</p>
          <Button variant="primary" size="sm" onClick={() => alert('Stripe Checkout not yet connected.')}>
            Start Subscription
          </Button>
        </Card>

        {/* Connection status */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Wifi className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Connection</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            <span className="text-sm font-semibold text-slate-300">Not connected</span>
          </div>
          <p className="text-xs text-slate-500">
            Add a device and activate a subscription to connect via WireGuard.
          </p>
        </Card>

        {/* Devices */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Devices</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-bold text-white font-mono">
              {devicesLoading ? '—' : devices.length}
            </span>
            <span className="text-slate-500 text-sm">/ 3</span>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            {devices.length === 0
              ? 'No devices registered yet.'
              : `${devices.length} device${devices.length === 1 ? '' : 's'} registered.`}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setAddDeviceOpen(true)}
            disabled={devicesLoading || devices.length >= 3}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Device
          </Button>
          {devicesError && <p className="mt-3 text-xs text-red-400">{devicesError}</p>}
        </Card>
      </div>

      {/* Actions row */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {/* Configuration */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Download className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Configuration</span>
          </div>
          <p className="text-sm text-slate-400 mb-5 leading-relaxed">
            Set up WireGuard on this device in three steps.
          </p>
          {devices.length === 0 ? (
            <EmptyState message="Add a device to generate a configuration." />
          ) : (
            <div className="space-y-2">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                    selectedDevice?.id === device.id
                      ? 'border-cyan-400/30 bg-cyan-400/[0.04]'
                      : 'border-white/10 bg-white/[0.02]'
                  }`}
                  onClick={() => setSelectedDeviceId(device.id)}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">{device.name}</p>
                    <p className="mt-0.5 text-xs capitalize text-slate-500">
                      {device.status}
                      {device.ipv4_address ? ` · ${device.ipv4_address}` : ''}
                    </p>
                  </div>
                  <span
                    className={`ml-3 h-2 w-2 flex-shrink-0 rounded-full ${
                      device.status === 'active'
                        ? 'bg-emerald-400'
                        : device.status === 'error'
                          ? 'bg-red-400'
                          : 'bg-amber-400/70'
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
          {selectedDevice && selectedDevice.status !== 'active' && (
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => activateDevice(selectedDevice)}
              disabled={provisioningDeviceId === selectedDevice.id}
            >
              {provisioningDeviceId === selectedDevice.id && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {selectedDevice.status === 'error' ? 'Retry Activation' : 'Activate Device'}
            </Button>
          )}
          <div className="mt-5 space-y-3">
            <SetupStep number="1" title="Download the WireGuard app">
              <div className="flex flex-wrap gap-2">
                <AppStoreLinks />
              </div>
            </SetupStep>
            <SetupStep number="2" title="Download and import your configuration">
              <p className="mb-3 text-xs leading-relaxed text-slate-500">
                Open the downloaded <span className="font-mono text-slate-400">.conf</span> file
                with WireGuard.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadConfig}
                disabled={selectedDevice?.status !== 'active'}
              >
                <Download className="w-3.5 h-3.5" />
                Download Config
              </Button>
            </SetupStep>
            <SetupStep number="3" title="Enable the VPN">
              <p className="text-xs leading-relaxed text-slate-500">
                Open WireGuard and switch the imported tunnel on.
              </p>
            </SetupStep>
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="mb-3 text-xs text-slate-500">
              Setting up another device? Scan its QR code instead.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShowQR}
              disabled={selectedDevice?.status !== 'active'}
            >
              <QrCode className="w-3.5 h-3.5" />
              Show QR Code
            </Button>
          </div>
        </Card>

        {/* Connection health */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Connection Health</span>
          </div>
          <p className="text-sm text-slate-400 mb-5 leading-relaxed">
            AI-assisted connection health insights will appear here once your device is active. Metrics include latency, packet loss, and uptime trends.
          </p>
          <EmptyState message="No health data yet. Connect a device to start collecting metrics." />
          <div className="flex items-center gap-1.5 mt-5 text-xs text-slate-600">
            <Info className="w-3.5 h-3.5" strokeWidth={1.75} />
            Health insights are based on connection-quality metadata only — not browsing content.
          </div>
        </Card>
      </div>

      {/* Billing */}
      <div className="mt-5">
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Billing</span>
              </div>
              <p className="text-sm text-slate-400">
                Manage your subscription, view invoices, or cancel through the customer billing portal.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleBillingPortal} className="flex-shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
              Manage Billing
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer note */}
      <p className="text-xs text-slate-600 text-center mt-8">
        Need help?{' '}
        <a href="https://vpnmaster.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">
          Contact support at vpnmaster.com
        </a>
      </p>

      {/* Back to home */}
      <p className="text-xs text-slate-600 text-center mt-2">
        <Link to="/" className="hover:text-slate-400 transition-colors">
          &larr; Back to home
        </Link>
      </p>

      {addDeviceOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-device-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !addingDevice) {
              setAddDeviceOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="add-device-title" className="text-lg font-semibold text-white">Add a device</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Give this device a name you will recognize.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setAddDeviceOpen(false)}
                disabled={addingDevice}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddDevice}>
              <label htmlFor="device-name" className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                Device name
              </label>
              <input
                id="device-name"
                value={deviceName}
                onChange={(event) => setDeviceName(event.target.value)}
                maxLength={50}
                autoFocus
                placeholder="e.g. MacBook Pro"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none"
              />
              {devicesError && <p className="mt-2 text-xs text-red-400">{devicesError}</p>}
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAddDeviceOpen(false)}
                  disabled={addingDevice}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addingDevice || !deviceName.trim()}>
                  {addingDevice && <Loader2 className="h-4 w-4 animate-spin" />}
                  Add Device
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {qrCodeUrl && selectedDevice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-code-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeQrCode();
            }
          }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111827] p-6 text-center shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4 text-left">
              <div>
                <h2 id="qr-code-title" className="text-lg font-semibold text-white">
                  {selectedDevice.name}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Scan on another device, or download the config on this one.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
                onClick={closeQrCode}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <img
              src={qrCodeUrl}
              alt={`WireGuard QR code for ${selectedDevice.name}`}
              className="mx-auto w-full max-w-[300px] rounded-xl bg-white p-3"
            />
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left">
              <p className="text-sm font-medium text-slate-200">Using this phone?</p>
              <div className="mt-4 space-y-4">
                <SetupStep number="1" title="Download the WireGuard app">
                  <div className="flex flex-wrap gap-2">
                    <AppStoreLinks />
                  </div>
                </SetupStep>
                <SetupStep number="2" title="Download and import your configuration">
                  <p className="mb-3 text-xs leading-relaxed text-slate-500">
                    Open the downloaded <span className="font-mono text-slate-400">.conf</span> file
                    with WireGuard.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={handleDownloadConfig}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Config
                  </Button>
                </SetupStep>
                <SetupStep number="3" title="Enable the VPN">
                  <p className="text-xs leading-relaxed text-slate-500">
                    Open WireGuard and switch the imported tunnel on.
                  </p>
                </SetupStep>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-xl px-4 py-6 text-center">
      <p className="text-xs text-slate-600">{message}</p>
    </div>
  );
}

function SetupStep({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-xs font-bold text-cyan-300">
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-xs font-semibold text-slate-200">{title}</p>
        {children}
      </div>
    </div>
  );
}

function AppStoreLinks() {
  const linkClasses =
    'inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10';

  return (
    <>
      <a
        href="https://apps.apple.com/us/app/wireguard/id1441195209"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        iOS App Store
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.wireguard.android"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        Google Play
      </a>
    </>
  );
}
