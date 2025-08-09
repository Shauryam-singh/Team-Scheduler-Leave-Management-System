import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../api/userService';

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', password: '' });

  useEffect(() => {
    getProfile()
      .then(res => {
        setUser(res.data);
        setForm({ name: res.data.name, password: '' });
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSave = async () => {
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      setEditMode(false);
    } catch {
      alert('Failed to update profile');
    }
  };

  if (!user) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">👤 My Profile</h2>
        </div>

        {editMode ? (
          <>
            <div className="mb-4">
              <label className="block text-sm">Name</label>
              <input
                className="w-full border px-3 py-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Password</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full bg-green-600 text-white py-2 rounded mb-2"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="w-full bg-gray-400 text-white py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="mb-2">
              <label className="block text-sm">Name</label>
              <div className="px-4 py-2 border rounded bg-gray-50">{user.name}</div>
            </div>
            <div className="mb-2">
              <label className="block text-sm">Email</label>
              <div className="px-4 py-2 border rounded bg-gray-50">{user.email}</div>
            </div>
            <div className="mb-2">
              <label className="block text-sm">Role</label>
              <div className="px-4 py-2 border rounded bg-gray-50 capitalize">{user.role}</div>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="w-full bg-indigo-600 text-white py-2 rounded mb-2"
            >
              Edit Profile
            </button>
            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-2 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
