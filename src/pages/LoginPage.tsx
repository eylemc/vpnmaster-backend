import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import { signInWithGoogle } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setError('Google sign-in could not be started. Please try again.');
      setLoading(false);
    }
  }

  if (!authLoading && user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">VPNMaster <span className="text-cyan-400">AI VPN</span></span>
        </Link>

        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-1">Sign in</h1>
          <p className="text-sm text-slate-400 mb-6">Use your Google account to continue.</p>
          {error && <div className="flex gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5"><AlertCircle className="w-4 h-4 text-red-400" /><p className="text-xs text-red-300">{error}</p></div>}
          <Button type="button" fullWidth size="lg" disabled={loading} onClick={handleGoogleSignIn}>
            <span className="w-5 h-5 rounded bg-white text-slate-800 grid place-items-center font-bold text-sm">G</span>
            {loading ? 'Opening Google…' : 'Continue with Google'}
          </Button>
          <p className="text-xs text-slate-500 text-center mt-5">New users are registered automatically.</p>
        </div>
        <p className="text-xs text-slate-600 text-center mt-6"><Link to="/" className="hover:text-slate-400">&larr; Back to home</Link></p>
      </div>
    </div>
  );
}
