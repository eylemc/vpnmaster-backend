import { Shield, Zap, Lock, Activity, CheckCircle, ArrowRight, ChevronRight, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import { startCheckout } from '../services/billing';

// Placeholder handler — connect to Stripe when ready
function handleStartSubscription() {
  startCheckout('').catch(() => {
    alert('Subscription not yet available. Check back soon.');
  });
}

const features = [
  {
    icon: Zap,
    title: 'AI Connection Intelligence',
    description:
      'Our AI monitors connection-quality signals — latency, packet loss, and stability — and surfaces health insights in your dashboard. It works with aggregate metadata only and never inspects your browsing content.',
  },
  {
    icon: Shield,
    title: 'Modern VPN Protection',
    description:
      'Powered by WireGuard, a modern, audited VPN protocol built for speed and simplicity. Your traffic is encrypted end-to-end from your device to the VPN server.',
  },
  {
    icon: Lock,
    title: 'Privacy-First Architecture',
    description:
      'AI features are designed to operate with limited connection-quality metadata. Your browsing content, DNS queries, and application data are not analyzed or stored.',
  },
  {
    icon: Activity,
    title: 'Connection Health Insights',
    description:
      'View historical latency, uptime, and stability trends for your devices. No raw traffic data is captured — only aggregated connection metrics.',
  },
];

const steps = [
  { number: '01', title: 'Create your account', body: 'Sign up with your email address.' },
  { number: '02', title: 'Activate your subscription', body: 'Start a $7.99/month plan — cancel anytime, no commitment.' },
  { number: '03', title: 'Add your devices', body: 'Register up to 3 devices from your dashboard.' },
  { number: '04', title: 'Connect via WireGuard', body: 'Download a WireGuard configuration file or scan a QR code to connect.' },
];

const trustLabels = [
  'No traffic inspection',
  'Cancel anytime',
  'Up to 3 devices',
];

export default function LandingPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle grid background */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
        />
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-16">
          {/* Copy */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs text-cyan-300 font-medium">Powered by WireGuard</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-5">
              Intelligent privacy.<br />
              <span className="text-cyan-400">Secure by design.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              AI-assisted connection intelligence and modern VPN protection — without inspecting your private traffic.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Link to="/signup">
                <Button size="lg" variant="primary">
                  Get Protected <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="secondary">
                  How It Works
                </Button>
              </a>
            </div>

            {/* Trust labels */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start">
              {trustLabels.map((label) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-500/70" strokeWidth={2} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Connection status panel */}
          <div className="flex-shrink-0 w-full max-w-sm">
            <ConnectionStatusPanel />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel>Features</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 mt-3 tracking-tight">
            Built for people who take privacy seriously
          </h2>
          <p className="text-slate-400 max-w-xl mb-14">
            VPNMaster AI VPN combines WireGuard's proven security with AI-powered connection health monitoring — designed to give you insight, not surveillance.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title}>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-cyan-400" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 mt-3 tracking-tight">
            Up and running in minutes
          </h2>
          <p className="text-slate-400 max-w-xl mb-14">
            No software to install beyond WireGuard. Generate a config file, scan a QR code, and connect.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.number} className="relative">
                <div className="text-4xl font-bold text-white/5 mb-3 tabular-nums">{s.number}</div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>
                {i < steps.length - 1 && (
                  <ChevronRight
                    className="hidden lg:block absolute -right-3 top-8 w-5 h-5 text-white/10"
                    strokeWidth={1.5}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 mt-3 tracking-tight">
            One plan. No surprises.
          </h2>
          <p className="text-slate-400 max-w-xl mb-14">
            Everything you need to protect your connection, for one straightforward price.
          </p>

          <div className="max-w-sm">
            <Card className="border-cyan-500/20">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-white">$7.99</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <div className="text-sm font-medium text-cyan-400 mb-6">VPNMaster AI VPN</div>
              <ul className="space-y-3 mb-8">
                {[
                  'Up to 3 devices',
                  'Secure WireGuard connection',
                  'AI-assisted connection health insights',
                  'QR code and configuration download',
                  'Customer billing portal',
                  'Cancel anytime',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleStartSubscription}
              >
                Start Subscription
              </Button>
              <p className="text-xs text-slate-500 text-center mt-3">Cancel anytime from your billing portal.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy statement */}
      <section id="privacy-note" className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel>Privacy</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 mt-3 tracking-tight">
            AI that respects your privacy
          </h2>
          <div className="max-w-2xl">
            <p className="text-slate-400 leading-relaxed mb-4">
              Our AI features are designed to work with limited connection-quality metadata — signals like latency, packet loss, and connection stability. This information is used to generate health insights and surface trends in your dashboard.
            </p>
            <p className="text-slate-400 leading-relaxed mb-4">
              The AI does not have access to your browsing activity, DNS queries, application data, or the content of any traffic passing through the VPN tunnel.
            </p>
            <p className="text-slate-400 leading-relaxed">
              We believe privacy tools should themselves be private. Read our{' '}
              <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
                Privacy Policy
              </Link>{' '}
              for full details.
            </p>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Ready to get protected?</h2>
          <p className="text-slate-400 mb-8">Start for $7.99/month. Cancel anytime.</p>
          <Link to="/signup">
            <Button size="lg" variant="primary">
              Get Protected <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
      {children}
    </span>
  );
}

function ConnectionStatusPanel() {
  return (
    <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Connection Status</span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          Not connected
        </span>
      </div>

      {/* Status card */}
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-700/50 border border-white/10 flex items-center justify-center">
          <Wifi className="w-5 h-5 text-slate-500" strokeWidth={1.5} />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-300">No active connection</div>
          <div className="text-xs text-slate-500">Add a device to get started</div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Latency', value: '—' },
          { label: 'Packet Loss', value: '—' },
          { label: 'Uptime', value: '—' },
        ].map((m) => (
          <div key={m.label} className="bg-white/[0.03] rounded-lg p-3 text-center">
            <div className="text-lg font-mono font-semibold text-slate-400">{m.value}</div>
            <div className="text-xs text-slate-600 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Device count */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <span className="text-xs text-slate-500">Devices registered</span>
        <span className="text-xs font-mono text-slate-400">0 / 3</span>
      </div>

      {/* WireGuard badge */}
      <div className="flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-cyan-500/60" strokeWidth={1.75} />
        <span className="text-xs text-slate-600">WireGuard encrypted tunnel</span>
      </div>
    </div>
  );
}
