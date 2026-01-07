import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import VerifyEmailButton from './VerifyEmailButton';

export default function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password
      });

      if (signInError) {
        if (signInError.status === 403) {
          setError('Please verify your email before signing in.');
        } else {
          setError(signInError.message ?? 'Unable to sign in.');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      if (err?.status === 403) {
        setError('Please verify your email before signing in.');
      } else {
        setError(err?.message || 'Something went wrong while signing in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <VerifyEmailButton email={email} />
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
}
