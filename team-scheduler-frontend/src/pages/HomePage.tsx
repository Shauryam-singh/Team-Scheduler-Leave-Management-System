import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.dispatchEvent(new Event('loginStatusChanged'));

    navigate('/login');
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">You are not logged in.</p>
      </div>
    );

  return (
    <div className="max-w-md mx-auto p-6 mt-8 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Welcome, {user.email}</h2>
      <p className="mb-2 text-gray-700">
        <strong>Role:</strong> {user.role}
      </p>
      <button
        onClick={logout}
        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition"
      >
        Logout
      </button>
    </div>
  );
}
