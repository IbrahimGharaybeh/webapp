import { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

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
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          name,
          is_company: isCompany
        }
      }
    });

    if (error) setError(error.message);
    else setMessage('Check your email for confirmation link');
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