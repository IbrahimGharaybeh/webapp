import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/dashboard">
        <button>Dashboard</button>
      </Link>
      <button>Translate</button>
      <button>Login</button>
      <button>Sign Up</button>
      <Link to="/landing">
        <button>Landing</button>
      </Link>
    </nav>
  );
}

export default Navbar;