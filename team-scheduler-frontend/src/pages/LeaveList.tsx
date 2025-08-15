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

  const filteredLeaves = useMemo(() => {
    let filtered = leaves;

    if (statusFilter !== 'all') filtered = filtered.filter((l) => l.status === statusFilter);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((l) => l.reason.toLowerCase().includes(term));
    }

    return filtered;
  }, [leaves, statusFilter, searchTerm]);

  const totalPages = Math.ceil(filteredLeaves.length / PAGE_SIZE);
  const paginatedLeaves = filteredLeaves.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 animate-pulse">
        Loading leave requests...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto mt-12">
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 text-center">
        Leave Requests
      </h2>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="status" className="font-semibold text-gray-700">
            Status:
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 backdrop-blur-sm"
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
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 backdrop-blur-sm"
        />
      </div>

      {paginatedLeaves.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No leave requests found. Try changing filters or search.
        </p>
      ) : (
        <div className="grid gap-6">
          {paginatedLeaves.map((leave) => (
            <div
              key={leave.id}
              className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-6 transition hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-indigo-600">{leave.reason}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    leave.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : leave.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {leave.status}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 text-gray-700">
                <div>
                  <span className="font-semibold">Start:</span> {new Date(leave.startDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">End:</span> {new Date(leave.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={goPrev}
          disabled={page === 1}
          className={`px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${
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
          className={`px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${
            page === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
