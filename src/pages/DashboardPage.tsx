import { FormEvent, useEffect, useState } from 'react';
import { Wifi, Monitor, Download, QrCode, Activity, CreditCard, LogOut, PlusCircle, Info, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { signOut } from '../services/auth';
import { openBillingPortal } from '../services/billing';
import { addDevice, downloadConfig, listDevices, type Device } from '../services/vpn';
import { useAuth } from '../context/AuthContext';

function handleBillingPortal() {
  openBillingPortal().catch(() => {
    alert('Billing portal is not yet connected.');
  });
}

function handleDownloadConfig() {
  downloadConfig('').catch(() => {
    alert('Configuration download is not yet available.');
  });
}

function handleShowQR() {
  alert('QR code generation is not yet implemented.');
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
      const device = await addDevice(user.id, deviceName);
      setDevices((current) => [...current, device]);
      setDeviceName('');
      setAddDeviceOpen(false);
    } catch (error) {
      setDevicesError(error instanceof Error ? error.message : 'Device could not be added.');
    } finally {
      setAddingDevice(false);
    }
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
            Once a device is provisioned, download its WireGuard configuration file or display a QR code to import it directly into the WireGuard app.
          </p>
          {devices.length === 0 ? (
            <EmptyState message="Add a device to generate a configuration." />
          ) : (
            <div className="space-y-2">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">{device.name}</p>
                    <p className="mt-0.5 text-xs capitalize text-slate-500">{device.status}</p>
                  </div>
                  <span className="ml-3 h-2 w-2 flex-shrink-0 rounded-full bg-amber-400/70" />
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3 mt-5">
            <Button variant="secondary" size="sm" onClick={handleDownloadConfig} disabled>
              <Download className="w-3.5 h-3.5" />
              Download Config
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShowQR} disabled>
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
