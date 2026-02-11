import React from 'react';
import Button from '../components/Button';

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(120deg, #0f172a 0%, #111827 100%)',
  color: '#e5e7eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 24px'
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '960px',
  background: '#0b1224',
  border: '1px solid #1f2937',
  borderRadius: '16px',
  boxShadow: '0 25px 80px rgba(0,0,0,0.35)',
  padding: '32px',
  display: 'grid',
  gap: '24px'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '12px'
};

const titleStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 700,
  letterSpacing: '0.01em',
  color: '#f8fafc',
  margin: 0
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#cbd5e1',
  margin: 0
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '10px',
  background: '#111827',
  color: '#f8fafc',
  border: '1px solid #1f2937',
  boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
  fontSize: '15px',
  fontWeight: 600,
  textAlign: 'center',
  transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease'
};

function Home() {
  const links = [
    { text: 'Person Permit', route: '/person' },
    { text: 'Vehicle Permit', route: '/vehicle' },
    { text: 'Ship Permit', route: '/ship' },
    { text: 'Photography Permit', route: '/photography' },
    { text: 'Registered People', route: '/registered-people' },
    { text: 'Registered Mission', route: '/mission' },
    { text: 'Dashboard', route: '/dashboard' }
  ];

  return (
    <main style={containerStyle}>
      <section style={cardStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>Permit Console</h1>
          <p style={subtitleStyle}>Choose a workflow to get started.</p>
        </header>
        <div style={gridStyle}>
          {links.map((link) => (
            <div key={link.text} style={{ width: '100%' }}>
              <Button
                text={link.text}
                route={link.route}
                style={buttonStyle}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;



