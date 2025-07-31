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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-700 font-medium">You are not logged in.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">👤 Your Profile</h2>
          <p className="text-gray-600 mb-6">Manage your session and view your role.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500">Email</label>
            <div className="px-4 py-2 border rounded bg-gray-50 text-gray-700 font-medium">
              {user.email}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500">Role</label>
            <div className="px-4 py-2 border rounded bg-gray-50 text-gray-700 font-medium capitalize">
              {user.role}
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold text-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
