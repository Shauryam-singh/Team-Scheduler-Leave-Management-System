import { useEffect, useState, useMemo } from 'react';
import { getLeaves } from '../api/leaveService';

const PAGE_SIZE = 5;

export default function LeaveList() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getLeaves();
        setLeaves(res.data);
        setError('');
        setPage(1);
      } catch (err) {
        console.error('Failed to load leaves', err);
        setError('Failed to load leave requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter and search leaves
  const filteredLeaves = useMemo(() => {
    let filtered = leaves;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((l) => l.reason.toLowerCase().includes(term));
    }

    return filtered;
  }, [leaves, statusFilter, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredLeaves.length / PAGE_SIZE);
  const paginatedLeaves = filteredLeaves.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">Loading leave requests...</div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto mt-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">Leave Requests</h2>

      {/* Filters and Search */}
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
          placeholder="Search by reason"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {paginatedLeaves.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No leave requests found. Try changing filters or search.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-indigo-100 text-indigo-700">
                  <th className="border border-gray-300 px-6 py-3 text-left">Reason</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Start Date</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">End Date</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="hover:bg-indigo-50 transition cursor-default"
                  >
                    <td className="border border-gray-300 px-6 py-4">{leave.reason}</td>
                    <td className="border border-gray-300 px-6 py-4">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-6 py-4">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td
                      className={`border border-gray-300 px-6 py-4 font-semibold capitalize ${
                        leave.status === 'approved'
                          ? 'text-green-600'
                          : leave.status === 'rejected'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {leave.status}
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
              Page {page} of {totalPages || 1}
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
  );
}
