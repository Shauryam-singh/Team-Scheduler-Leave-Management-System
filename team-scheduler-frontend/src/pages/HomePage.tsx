import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <p>You are not logged in</p>;

  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
