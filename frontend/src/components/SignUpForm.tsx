import { FormEvent, useState } from 'react';
import { authClient } from '../lib/auth-client';
import VerifyEmailButton from './VerifyEmailButton';

type SignUpFormState = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpForm() {
  const [form, setForm] = useState<SignUpFormState>({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error: signUpError } = await authClient.signUp.email({
        email: form.email,
        password: form.password,
        name: form.name
      });

      if (signUpError) {
        setError(signUpError.message ?? 'Unable to sign up');
      } else {
        setMessage('Sign up successful! Check your email to verify your account.');
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while signing up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jane Doe"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={8}
            maxLength={128}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>

      <VerifyEmailButton email={form.email} />
      {error && <p className="auth-error">{error}</p>}
      {message && <p className="auth-success">{message}</p>}
    </div>
  );
}
