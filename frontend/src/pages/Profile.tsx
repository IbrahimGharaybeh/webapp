import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { logout } from '../lib/auth';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  padding: '72px 24px',
  backgroundColor: '#f5efe6',
  backgroundImage:
    'radial-gradient(circle at 20% 0%, rgba(255,255,255,0.9), rgba(255,255,255,0) 55%), radial-gradient(circle at 85% 15%, rgba(222,237,248,0.9), rgba(222,237,248,0) 50%)',
  color: '#1f2937',
  fontFamily:
    '"Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif'
};

const shellStyle: React.CSSProperties = {
  maxWidth: '1100px',
  margin: '0 auto',
  display: 'grid',
  gap: '24px'
};

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(120deg, #ffffff 0%, #f8fbff 100%)',
  borderRadius: '24px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 24px 60px rgba(15, 23, 42, 0.12)',
  padding: '28px',
  display: 'grid',
  gap: '20px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  alignItems: 'center'
};

const avatarStyle: React.CSSProperties = {
  width: '96px',
  height: '96px',
  borderRadius: '28px',
  background: 'linear-gradient(140deg, #0f4c81, #2b8aa6)',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '34px',
  fontWeight: 700,
  letterSpacing: '0.02em',
  overflow: 'hidden'
};

const infoStyle: React.CSSProperties = {
  display: 'grid',
  gap: '6px'
};

const nameStyle: React.CSSProperties = {
  fontSize: '30px',
  fontWeight: 700,
  margin: 0
};

const emailStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#475569',
  margin: 0
};

const chipRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '8px'
};

const chipStyle = (tone: 'success' | 'warning'): React.CSSProperties => ({
  padding: '6px 12px',
  borderRadius: '999px',
  fontSize: '13px',
  fontWeight: 600,
  backgroundColor: tone === 'success' ? '#dcfce7' : '#fef3c7',
  color: tone === 'success' ? '#166534' : '#92400e'
});

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gap: '20px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'
};

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: '20px',
  border: '1px solid #e2e8f0',
  padding: '20px',
  display: 'grid',
  gap: '12px',
  minHeight: '170px'
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#64748b',
  margin: 0
};

const valueStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 600,
  margin: 0
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px'
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 18px',
  borderRadius: '12px',
  border: '1px solid #0f4c81',
  background: '#0f4c81',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'transform 120ms ease, box-shadow 120ms ease'
};

const ghostButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: '#ffffff',
  color: '#0f4c81'
};

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <main style={pageStyle}>
        <section style={shellStyle}>
          <div style={heroStyle}>
            <p style={emailStyle}>Loading profile...</p>
          </div>
        </section>
      </main>
    );
  }

  const fullName = user?.name || 'Unknown User';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <header style={heroStyle}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={avatarStyle}>
              {user?.image ? (
                <img
                  src={user.image}
                  alt={fullName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div style={infoStyle}>
              <h1 style={nameStyle}>{fullName}</h1>
              <p style={emailStyle}>{user?.email || 'No email on file'}</p>
              <div style={chipRowStyle}>
                <span style={chipStyle(user?.emailVerified ? 'success' : 'warning')}>
                  {user?.emailVerified ? 'Email verified' : 'Email not verified'}
                </span>
              </div>
            </div>
          </div>
          <div style={buttonRowStyle}>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <span style={ghostButtonStyle}>Back to dashboard</span>
            </Link>
            <button style={buttonStyle} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div style={gridStyle}>
          <section style={cardStyle}>
            <p style={labelStyle}>Account</p>
            <p style={valueStyle}>{user?.email || 'No email'}</p>
            <p style={{ margin: 0, color: '#475569' }}>
              Keep this email current to receive status updates and approvals.
            </p>
          </section>

          <section style={cardStyle}>
            <p style={labelStyle}>Identity</p>
            <p style={valueStyle}>{fullName}</p>
            <p style={{ margin: 0, color: '#475569' }}>
              Your profile name appears on permits and team communications.
            </p>
          </section>

          <section style={cardStyle}>
            <p style={labelStyle}>User ID</p>
            <p style={valueStyle}>{user?.id || 'Unknown'}</p>
            <p style={{ margin: 0, color: '#475569' }}>
              Reference this ID when requesting support or account changes.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
