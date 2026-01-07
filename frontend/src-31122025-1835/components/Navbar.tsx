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
    <nav>
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/dashboard">
        <button>Dashboard</button>
      </Link>
      <button>Translate</button>
      <Link to="/landing">
        <button>Landing</button>
      </Link>
      <Link to="/member-control">
        <button>Member Control</button>
      </Link>

      {user ? (
        <>
          <span>{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
