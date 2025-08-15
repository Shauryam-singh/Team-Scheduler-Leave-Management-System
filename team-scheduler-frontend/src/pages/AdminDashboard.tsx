import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

type Leave = {
  id: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: string;
  user: { name: string; email: string };
};

const PAGE_SIZE = 5;

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [msg, setMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [page, setPage] = useState(1);
  const [selectedLeaves, setSelectedLeaves] = useState<Set<string>>(new Set());

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leaves', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLeaves(res.data);
      setMsg('');
      setPage(1);
      setSelectedLeaves(new Set());
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
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchLeaves();
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to update status.');
    }
  };

  const bulkUpdate = async (status: 'approved' | 'rejected') => {
    try {
      await Promise.all(
        Array.from(selectedLeaves).map((id) => updateStatus(id, status))
      );
      setSelectedLeaves(new Set());
      fetchLeaves();
    } catch {
      setMsg('❌ Failed to perform bulk action.');
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filteredLeaves = useMemo(() => {
    let filtered = leaves;
    if (statusFilter !== 'all') filtered = filtered.filter((l) => l.status === statusFilter);
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (l) => l.user.name.toLowerCase().includes(term) || l.user.email.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [leaves, statusFilter, searchTerm]);

  const totalPages = Math.ceil(filteredLeaves.length / PAGE_SIZE);
  const paginatedLeaves = filteredLeaves.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedLeaves);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedLeaves(newSet);
  };

  // Summary counts
  const totalLeaves = leaves.length;
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const approvedLeaves = leaves.filter(l => l.status === 'approved').length;
  const rejectedLeaves = leaves.filter(l => l.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-3 text-indigo-800">📋 Admin Dashboard</h2>
        <p className="text-gray-600 mb-6">Manage and review employee leave requests.</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
            <span className="text-gray-500">Total Leaves</span>
            <span className="text-2xl font-bold text-indigo-600">{totalLeaves}</span>
          </div>
          <div className="bg-yellow-50 shadow rounded-lg p-4 flex flex-col items-center">
            <span className="text-gray-500">Pending</span>
            <span className="text-2xl font-bold text-yellow-800">{pendingLeaves}</span>
          </div>
          <div className="bg-green-50 shadow rounded-lg p-4 flex flex-col items-center">
            <span className="text-gray-500">Approved</span>
            <span className="text-2xl font-bold text-green-700">{approvedLeaves}</span>
          </div>
          <div className="bg-red-50 shadow rounded-lg p-4 flex flex-col items-center">
            <span className="text-gray-500">Rejected</span>
            <span className="text-2xl font-bold text-red-700">{rejectedLeaves}</span>
          </div>
        </div>

        {msg && <div className="mb-4 text-red-600 font-medium">{msg}</div>}

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label htmlFor="status" className="font-semibold text-gray-700">Status:</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
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
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Bulk Actions */}
        {selectedLeaves.size > 0 && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => bulkUpdate('approved')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Approve Selected
            </button>
            <button
              onClick={() => bulkUpdate('rejected')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Reject Selected
            </button>
          </div>
        )}

        {/* Table */}
        {paginatedLeaves.length === 0 ? (
          <div className="text-center py-10 text-gray-500 border rounded-lg bg-white shadow">
            <p className="text-xl font-semibold">No leave requests found.</p>
            <p className="text-sm mt-2">Try changing your filters or search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 text-left text-sm uppercase tracking-wider">
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedLeaves.size === paginatedLeaves.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeaves(new Set(paginatedLeaves.map(l => l.id)));
                        } else {
                          setSelectedLeaves(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Date Range</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeaves.map((leave) => (
                  <tr key={leave.id} className="border-t hover:bg-gray-50 transition flex flex-col md:table-row mb-2 md:mb-0">
                    <td className="px-6 py-4" data-label="Select">
                      <input
                        type="checkbox"
                        checked={selectedLeaves.has(leave.id)}
                        onChange={() => toggleSelect(leave.id)}
                      />
                    </td>
                    <td className="px-6 py-4" data-label="Employee">
                      <div className="font-semibold">{leave.user.name}</div>
                      <div className="text-gray-500 text-xs">{leave.user.email}</div>
                    </td>
                    <td className="px-6 py-4" data-label="Reason">{leave.reason}</td>
                    <td className="px-6 py-4" data-label="Date Range">
                      {leave.startDate.slice(0, 10)} → {leave.endDate.slice(0, 10)}
                    </td>
                    <td className="px-6 py-4" data-label="Status">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        leave.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : leave.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex flex-col md:flex-row gap-2" data-label="Actions">
                      {leave.status === 'pending' ? (
                        <>
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
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {paginatedLeaves.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-2">
            <button
              onClick={goPrev}
              disabled={page === 1}
              className={`px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous
            </button>
            <div className="text-gray-700 font-semibold">Page {page} of {totalPages}</div>
            <button
              onClick={goNext}
              disabled={page === totalPages || totalPages === 0}
              className={`px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${page === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">🕒 Recent Activity</h3>
          {leaves.slice(0, 5).map((l) => (
            <div key={l.id} className="bg-white shadow rounded-lg p-4 mb-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">{l.user.name}</span> requested leave for <span className="italic">{l.reason}</span>
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  l.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : l.status === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {l.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
