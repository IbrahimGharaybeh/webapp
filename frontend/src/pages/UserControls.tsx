import { FormEvent, useState } from 'react';

const API_URL =
  import.meta.env.NEXT_PUBLIC_API_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:3001';

export default function UserControls() {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/dev/delete-user/${encodeURIComponent(userId)}`, {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || 'Failed to delete user');
      } else {
        const tables = data.deletedFrom?.length ? data.deletedFrom.join(', ') : 'none';
        setMessage(`User deleted. Tables affected: ${tables}`);
        setUserId('');
      }
    } catch (err: any) {
      setError(err?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>User Controls (Dev)</h2>
      <form onSubmit={handleDelete}>
        <label htmlFor="userId">User ID to delete</label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="UUID"
          required
          style={{ display: 'block', margin: '0.5rem 0 1rem', width: '320px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Deleting...' : 'Delete user'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
}
