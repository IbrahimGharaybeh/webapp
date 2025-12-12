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
      <Link to="login">
      <button>Login</button>
      </Link>
      <Link to="signup">
      <button>Sign Up</button>
      </Link>
      <Link to="/landing">
        <button>Landing</button>
      </Link>
    </nav>
  );
}

export default Navbar;