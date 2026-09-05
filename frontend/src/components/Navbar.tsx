import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { logout } from '../lib/auth';

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="top-nav">
      <div className="top-nav__brand">
        <Link to="/" className="top-nav__logo">Permit Console</Link>
      </div>

      <div className="top-nav__links">
        <Link to="/" className="top-nav__link">Home</Link>
        <Link to="/dashboard" className="top-nav__link">Dashboard</Link>
        <Link to="/landing" className="top-nav__link">Landing</Link>
        <Link to="/member-control" className="top-nav__link">Member Control</Link>
        <Link to="/make-company" className="top-nav__link">Create Company</Link>
        <Link to="/user-controls" className="top-nav__link">User Controls</Link>
      </div>

      <div className="top-nav__auth">
        {user ? (
          <>
            <span className="top-nav__user">{user.email}</span>
            <button onClick={handleLogout} className="top-nav__btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="top-nav__btn top-nav__btn--ghost">Login</Link>
            <Link to="/signup" className="top-nav__btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
