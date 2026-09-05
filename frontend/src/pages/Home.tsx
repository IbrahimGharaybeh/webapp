import Button from '../components/Button';
import './Home.css';

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
    <main className="home-shell">
      <section className="home-panel">
        <header className="home-top">
          <h1 className="home-title">Permit Console</h1>
          <p className="home-subtitle">Choose a page to continue.</p>
        </header>

        <div className="home-actions">
          {links.map((link) => (
            <div key={link.text} className="home-action-item">
              <Button
                text={link.text}
                route={link.route}
                className="home-action-btn"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;




