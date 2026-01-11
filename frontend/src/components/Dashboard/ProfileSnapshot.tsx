import type { CSSProperties } from 'react';

type UserSnapshot = {
  name?: string | null;
  email?: string | null;
  emailVerified?: boolean | null;
};

type ProfileSnapshotProps = {
  displayName: string;
  user: UserSnapshot | null;
  loading: boolean;
  cardStyle: CSSProperties;
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 700,
  color: '#f8fafc',
};

const labelStyle: CSSProperties = {
  margin: 0,
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#94a3b8',
};

const valueStyle: CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 600,
  color: '#e2e8f0',
};

const chipStyle = (verified: boolean): CSSProperties => ({
  alignSelf: 'flex-start',
  padding: '6px 12px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 600,
  backgroundColor: verified ? 'rgba(34,197,94,0.18)' : 'rgba(251,191,36,0.2)',
  color: verified ? '#4ade80' : '#fbbf24',
  border: `1px solid ${verified ? 'rgba(34,197,94,0.4)' : 'rgba(251,191,36,0.5)'}`,
});

function ProfileSnapshot({ displayName, user, loading, cardStyle }: ProfileSnapshotProps) {
  return (
    <section style={cardStyle}>
      <h2 style={sectionTitleStyle}>Profile snapshot</h2>
      <p style={labelStyle}>Signed in as</p>
      <p style={valueStyle}>{displayName}</p>
      <p style={{ margin: 0, color: '#94a3b8' }}>{user?.email || 'No email on file'}</p>
      {!loading && (
        <span style={chipStyle(Boolean(user?.emailVerified))}>
          {user?.emailVerified ? 'Email verified' : 'Email not verified'}
        </span>
      )}
    </section>
  );
}

export default ProfileSnapshot;
