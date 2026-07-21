import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Privacy', href: '/privacy' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400/60 transition-colors">
            <Shield className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">
            VPNMaster <span className="text-cyan-400">AI VPN</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isDashboard ? (
            <span className="text-sm text-slate-400">Dashboard</span>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-navy-950 px-4 py-1.5 rounded-lg transition-colors"
              >
                Get Protected
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-950 border-t border-white/5 px-4 py-4 flex flex-col gap-4">
          {!isDashboard &&
            navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-navy-950 px-4 py-2 rounded-lg transition-colors text-center"
            >
              Get Protected
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
