import { useState } from 'react';
import { AUTH_BASE_URL } from '../lib/auth-client';

type VerifyEmailButtonProps = {
  email: string;
};

export default function VerifyEmailButton({ email }: VerifyEmailButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!email) {
      setError('Enter your email first.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${AUTH_BASE_URL}/api/auth/send-verification-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          callbackURL: `${window.location.origin}/login`
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.message || 'Unable to send verification email.');
      } else {
        setMessage('Verification email sent. Check your inbox.');
      }
    } catch (err: any) {
      setError(err?.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-verify">
      <button type="button" onClick={handleVerify} disabled={loading || !email}>
        {loading ? 'Sending...' : 'Verify email'}
      </button>
      {error && <p className="auth-error">{error}</p>}
      {message && <p className="auth-success">{message}</p>}
    </div>
  );
}
