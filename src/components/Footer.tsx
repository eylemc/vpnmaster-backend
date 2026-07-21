import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Acceptable Use', to: '/acceptable-use' },
  { label: 'Refund Policy', to: '/refund-policy' },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-cyan-400" strokeWidth={1.75} />
              </div>
              <span className="text-white font-semibold text-sm tracking-tight">
                VPNMaster <span className="text-cyan-400">AI VPN</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Intelligent privacy. Secure by design.
            </p>
            <p className="text-xs text-slate-600">
              VPNMASTER, INC. &mdash; A Delaware corporation, United States
            </p>
            <a
              href="https://vpnmaster.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-cyan-400 transition-colors w-fit"
            >
              vpnmaster.com &rarr;
            </a>
          </div>

          {/* Legal links */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">Legal</p>
            {legalLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-slate-500 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-xs text-slate-600">
          &copy; {new Date().getFullYear()} VPNMASTER, INC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
