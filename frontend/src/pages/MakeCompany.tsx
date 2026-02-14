import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getApiUrl } from '../lib/api';

function MakeCompany() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setStatus('You must be logged in.');
      return;
    }
    if (!name.trim()) {
      setStatus('Company name is required.');
      return;
    }
    if (!code.trim()) {
      setStatus('Company code is required.');
      return;
    }

    try {
      setLoading(true);
      setStatus(null);
      const res = await fetch(getApiUrl('/api/members/makeCompany'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, code }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Request failed');
      }
      const data = await res.json();
      const createdName = data?.[0]?.name || name;
      setStatus(`Created company "${createdName}".`);
      setName('');
      setCode('');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #0b1224 100%)',
    color: '#e5e7eb',
    padding: '48px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '560px',
    background: '#0b1224',
    border: '1px solid #1f2937',
    borderRadius: '14px',
    padding: '28px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.28)',
    display: 'grid',
    gap: '16px',
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '24px',
    fontWeight: 700,
    color: '#f8fafc',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#cbd5e1',
    marginBottom: '6px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #1f2937',
    background: '#111827',
    color: '#f8fafc',
    fontSize: '15px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: '10px',
    background: '#2563eb',
    color: '#f8fafc',
    border: 'none',
    fontWeight: 700,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.8 : 1,
  };

  const statusStyle: React.CSSProperties = {
    fontSize: '14px',
    color: status?.startsWith('Error') ? '#fca5a5' : '#a5f3fc',
  };

  return (
    <main style={pageStyle}>
      <form style={cardStyle} onSubmit={handleSubmit}>
        <h1 style={titleStyle}>Create Company</h1>
        <div style={{ display: 'grid', gap: '8px' }}>
          <label style={labelStyle} htmlFor="company-code">Company Code</label>
          <input
            id="company-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter company code"
            style={inputStyle}
            disabled={loading}
          />
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <label style={labelStyle} htmlFor="company-name">Company Name</label>
          <input
            id="company-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter company name"
            style={inputStyle}
            disabled={loading}
          />
        </div>
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Creating...' : 'Create Company'}
        </button>
        {status && <div style={statusStyle}>{status}</div>}
      </form>
    </main>
  );
}

export default MakeCompany;
