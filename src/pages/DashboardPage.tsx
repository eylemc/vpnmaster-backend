import { Shield, Wifi, Monitor, Download, QrCode, Activity, CreditCard, LogOut, PlusCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { signOut } from '../services/auth';
import { openBillingPortal } from '../services/billing';
import { downloadConfig } from '../services/vpn';

function handleSignOut() {
  signOut().catch(() => {
    alert('Sign-out is not yet implemented.');
  });
}

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

function handleAddDevice() {
  alert('Device provisioning is not yet implemented.');
}

function handleShowQR() {
  alert('QR code generation is not yet implemented.');
}

export default function DashboardPage() {
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
            <span className="text-2xl font-bold text-white font-mono">0</span>
            <span className="text-slate-500 text-sm">/ 3</span>
          </div>
          <p className="text-xs text-slate-500 mb-5">No devices registered yet.</p>
          <Button variant="secondary" size="sm" onClick={handleAddDevice}>
            <PlusCircle className="w-3.5 h-3.5" />
            Add Device
          </Button>
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
          <EmptyState message="Add a device to generate a configuration." />
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
