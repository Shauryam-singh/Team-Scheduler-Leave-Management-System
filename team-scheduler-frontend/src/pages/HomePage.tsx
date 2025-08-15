import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api/userService';
import { getLeaves } from '../api/leaveService';

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', password: '' });
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  useEffect(() => {
    getProfile()
      .then(res => {
        setUser(res.data);
        setForm({ name: res.data.name, password: '' });
      })
      .catch(() => {
        navigate('/login');
      });

    // Fetch user's leave requests
    const fetchLeaves = async () => {
      try {
        const res = await getLeaves();
        setLeaves(res.data);
      } catch (err) {
        console.error('Failed to load leaves', err);
      } finally {
        setLoadingLeaves(false);
      }
    };
    fetchLeaves();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSave = async () => {
    try {
      // Mock updateProfile call
      const updated = { ...user, name: form.name };
      setUser(updated);
      setEditMode(false);
    } catch {
      alert('Failed to update profile');
    }
  };

  if (!user) return <div className="text-center mt-10 text-gray-600 animate-pulse">Loading profile...</div>;

  // Stats
  const totalLeaves = leaves.length;
  const approvedLeaves = leaves.filter(l => l.status === 'approved').length;
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600 mt-2">Manage your profile and leave requests easily</p>
        </div>

        {/* Profile & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-6 flex flex-col justify-between">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">My Profile</h2>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    className="w-full border border-gray-300 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <button onClick={handleSave} className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition">
                  Save
                </button>
                <button onClick={() => setEditMode(false)} className="w-full bg-gray-400 text-white py-2 rounded-xl font-semibold hover:bg-gray-500 transition">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>

                <button onClick={() => setEditMode(true)} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition">
                  Edit Profile
                </button>
                <button onClick={logout} className="w-full bg-red-600 text-white py-2 rounded-xl font-semibold hover:bg-red-700 transition">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-6 flex flex-col justify-between">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">My Leaves</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-indigo-100 rounded-xl p-4">
                <p className="text-gray-600">Total</p>
                <p className="text-2xl font-bold">{totalLeaves}</p>
              </div>
              <div className="bg-green-100 rounded-xl p-4">
                <p className="text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{approvedLeaves}</p>
              </div>
              <div className="bg-yellow-100 rounded-xl p-4">
                <p className="text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{pendingLeaves}</p>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-6 flex flex-col justify-center items-center space-y-4">
            <h2 className="text-xl font-bold text-indigo-700 mb-2">Quick Actions</h2>
            <button onClick={() => navigate('/apply')} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition">
              Apply Leave
            </button>
            <button onClick={() => navigate('/leaves')} className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
              View Leaves
            </button>
          </div>
        </div>

        {/* Recent Leaves */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Recent Leave Requests</h2>
          {loadingLeaves ? (
            <div className="text-gray-500 animate-pulse">Loading...</div>
          ) : leaves.length === 0 ? (
            <p className="text-gray-600">You have no leave requests yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leaves.slice(0, 4).map((leave) => (
                <div key={leave.id} className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-md rounded-xl p-4 hover:shadow-lg transition">
                  <p className="font-semibold">{leave.reason}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </p>
                  <p className={`mt-2 font-semibold capitalize ${
                    leave.status === 'approved' ? 'text-green-600' :
                    leave.status === 'rejected' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {leave.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
