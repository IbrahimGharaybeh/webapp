import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { signUp } from '../../lib/auth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [isCompany, setIsCompany] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if username/email available first
    const checkRes = await fetch('http://localhost:5000/api/users/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email })
    });
    const checkData = await checkRes.json();
    if (!checkData.available) {
      setError(checkData.error);
      return;
    }

    // Create Better Auth user
    const { data, error: signUpError } = await signUp(email, password, name);
    if (signUpError) {
      setError(signUpError.message || 'Signup failed');
      return;
    }

    // Sync to local users table
    await fetch('http://localhost:5000/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: data.user.id,
        email,
        username,
        name,
        is_company: isCompany
      })
    });

    setMessage('Account created successfully');
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isCompany}
            onChange={(e) => setIsCompany(e.target.checked)}
          />
          Company account
        </label>
        {error && <p>{error}</p>}
        {message && <p>{message}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}