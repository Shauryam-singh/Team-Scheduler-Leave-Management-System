import { useEffect, useState, useMemo } from 'react';
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

const PAGE_SIZE = 5;

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [msg, setMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [page, setPage] = useState(1);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leaves', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setLeaves(res.data);
      setMsg('');
      setPage(1); // reset page on fetch
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to fetch leaves.');
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
      setMsg('❌ Failed to update status.');
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Filter and search leaves
  const filteredLeaves = useMemo(() => {
    let filtered = leaves;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.user.name.toLowerCase().includes(term) ||
          l.user.email.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [leaves, statusFilter, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredLeaves.length / PAGE_SIZE);
  const paginatedLeaves = filteredLeaves.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-indigo-800">📋 Admin Dashboard</h2>
        <p className="text-gray-600 mb-8">Manage and review employee leave requests.</p>

        {msg && <div className="mb-4 text-red-600 font-medium">{msg}</div>}

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label htmlFor="status" className="font-semibold text-gray-700">
              Filter by Status:
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search by employee name or email"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {paginatedLeaves.length === 0 ? (
          <div className="text-center py-10 text-gray-500 border rounded-lg bg-white shadow">
            <p className="text-xl font-semibold">No leave requests found.</p>
            <p className="text-sm mt-2">
              Try changing your filters or search criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full text-sm text-gray-700">
                <thead>
                  <tr className="bg-indigo-100 text-indigo-800 text-left uppercase text-xs tracking-wider">
                    <th className="px-6 py-3">Employee</th>
                    <th className="px-6 py-3">Reason</th>
                    <th className="px-6 py-3">Date Range</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeaves.map((leave) => (
                    <tr key={leave.id} className="border-t hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold">{leave.user.name}</div>
                        <div className="text-gray-500 text-xs">{leave.user.email}</div>
                      </td>
                      <td className="px-6 py-4">{leave.reason}</td>
                      <td className="px-6 py-4">
                        {leave.startDate.slice(0, 10)} → {leave.endDate.slice(0, 10)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            leave.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : leave.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {leave.status === 'pending' ? (
                          <div className="space-x-2">
                            <button
                              onClick={() => updateStatus(leave.id, 'approved')}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(leave.id, 'rejected')}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={goPrev}
                disabled={page === 1}
                className={`px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${
                  page === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Previous
              </button>

              <div className="text-gray-700 font-semibold">
                Page {page} of {totalPages}
              </div>

              <button
                onClick={goNext}
                disabled={page === totalPages || totalPages === 0}
                className={`px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${
                  page === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
