import { useAuth } from '../lib/AuthContext';
import { logout } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user?.email}</p>
      <p>Username: {user?.user_metadata?.username}</p>
      <p>Name: {user?.user_metadata?.name}</p>
      <p>Company: {user?.user_metadata?.is_company ? 'Yes' : 'No'}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}