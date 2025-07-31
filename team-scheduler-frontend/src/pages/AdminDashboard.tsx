import { useEffect, useState } from 'react';
import axios from 'axios';

type Leave = {
  id: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
};

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [msg, setMsg] = useState('');

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leaves', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
      setMsg('Failed to fetch leaves.');
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await axios.patch(
        `http://localhost:5000/api/leaves/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchLeaves();
    } catch (err) {
      console.error(err);
      setMsg('Failed to update status.');
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Admin Panel - Manage Leaves</h2>
      {msg && <p className="text-red-600 font-semibold mb-2">{msg}</p>}
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Employee</th>
            <th className="border px-4 py-2">Reason</th>
            <th className="border px-4 py-2">Dates</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id} className="text-center">
              <td className="border px-4 py-2">{leave.user.name} ({leave.user.email})</td>
              <td className="border px-4 py-2">{leave.reason}</td>
              <td className="border px-4 py-2">
                {leave.startDate.slice(0, 10)} → {leave.endDate.slice(0, 10)}
              </td>
              <td className="border px-4 py-2 capitalize">{leave.status}</td>
              <td className="border px-4 py-2 space-x-2">
                {leave.status === 'pending' && (
                  <>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => updateStatus(leave.id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => updateStatus(leave.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
