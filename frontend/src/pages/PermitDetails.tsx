import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { getApiUrl } from '../lib/api';

type PermitResponse = {
  permitType: number;
  permitId: number;
  companyId: string;
  isDraft: boolean;
  permit: unknown;
};

const permitTypeLabels: Record<number, string> = {
  1: 'Person',
  2: 'Vehicle',
  3: 'Ship',
  4: 'Photography',
};

function PermitDetails() {
  const { permitId } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState<PermitResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericPermitId = useMemo(() => Number(permitId), [permitId]);

  useEffect(() => {
    if (!user?.id || !Number.isInteger(numericPermitId)) return;

    const fetchPermit = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(getApiUrl('/api/members/permitById'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ permitId: numericPermitId })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error('Failed to load permit', err);
        setError('Unable to load permit.');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchPermit();
  }, [numericPermitId, user?.id]);

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #0b1224 100%)',
    color: '#e5e7eb',
    padding: '48px 24px',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'grid',
    gap: '20px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    margin: 0,
    color: '#f8fafc',
  };

  const jsonStyle: React.CSSProperties = {
    margin: 0,
    background: '#0a1020',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '16px',
    color: '#cbd5f5',
    fontSize: '12px',
    lineHeight: 1.45,
    whiteSpace: 'pre-wrap',
  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Permit {Number.isInteger(numericPermitId) ? `#${numericPermitId}` : ''}</h1>
        {loading && <p style={{ margin: 0, color: '#94a3b8' }}>Loading permit...</p>}
        {!loading && error && <p style={{ margin: 0, color: '#fda4af' }}>{error}</p>}
        {!loading && !error && data && (
          <>
            <p style={{ margin: 0, color: '#94a3b8' }}>
              {permitTypeLabels[data.permitType] || 'Permit'} {data.isDraft ? '(Draft)' : ''}
            </p>
            <pre style={jsonStyle}>{JSON.stringify(data, null, 2)}</pre>
          </>
        )}
        {!loading && !error && !data && (
          <p style={{ margin: 0, color: '#94a3b8' }}>No permit data found.</p>
        )}
      </div>
    </main>
  );
}

export default PermitDetails;
