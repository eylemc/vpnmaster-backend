import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { completeOAuthCallback } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return;

    completeOAuthCallback(code)
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => setError('Google sign-in could not be completed. Please try again.'));
  }, [navigate]);

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-navy-950 grid place-items-center px-4 text-center">
      <div>
        <p className="text-sm text-slate-300">{error || 'Completing secure sign-in…'}</p>
        {error && <button className="mt-4 text-sm text-cyan-400" onClick={() => navigate('/login')}>Back to sign in</button>}
      </div>
    </div>
  );
}
