import type { CSSProperties } from 'react';

import type { Representative } from './types';

type RepresentativeListProps = {
  representatives: Representative[];
  loading: boolean;
  error: string;
  onRemove: (repId: string) => void;
  onMakeAdmin: (repId: string) => void;
};

const repRowStyle: CSSProperties = {
  background: '#0b1224',
  border: '1px solid #1f2937',
  borderRadius: '10px',
  padding: '10px 12px',
  display: 'grid',
  gap: '4px',
};

const memberActionsStyle: CSSProperties = {
  display: 'flex',
  gap: '8px',
  marginTop: '6px',
};

const memberButtonStyle: CSSProperties = {
  padding: '6px 10px',
  borderRadius: '8px',
  border: '1px solid #1f2937',
  background: '#0f172a',
  color: '#e2e8f0',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};

const dangerButtonStyle: CSSProperties = {
  ...memberButtonStyle,
  border: '1px solid #3f1d2e',
  background: '#2b111d',
  color: '#fda4af',
};

function RepresentativeList({
  representatives,
  loading,
  error,
  onRemove,
  onMakeAdmin,
}: RepresentativeListProps) {
  if (loading) {
    return (
      <p style={{ margin: 0, color: '#94a3b8' }}>
        Loading representatives...
      </p>
    );
  }

  if (!loading && error) {
    return (
      <p style={{ margin: 0, color: '#fda4af' }}>{error}</p>
    );
  }

  if (!loading && !error && representatives.length === 0) {
    return (
      <p style={{ margin: 0, color: '#94a3b8' }}>
        No representatives found.
      </p>
    );
  }

  return (
    <>
      {representatives.map((rep) => {
        const label = rep.name || rep.username || rep.email || rep.id;
        return (
          <div key={rep.id} style={repRowStyle}>
            <span style={{ fontWeight: 600 }}>{label}</span>
            {rep.email && (
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                {rep.email}
              </span>
            )}
            <div style={memberActionsStyle}>
              <button
                style={dangerButtonStyle}
                onClick={() => onRemove(rep.id)}
              >
                Remove
              </button>
              <button
                style={memberButtonStyle}
                disabled={Boolean(rep.is_admin)}
                onClick={() => onMakeAdmin(rep.id)}
              >
                {rep.is_admin ? 'Admin' : 'Make admin'}
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default RepresentativeList;
