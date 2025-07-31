import { useEffect, useState } from 'react';
import { getLeaves } from '../api/leaveService';

export default function LeaveList() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getLeaves();
        setLeaves(res.data);
      } catch (err) {
        console.error('Failed to load leaves', err);
        setError('Failed to load leave requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">
        Loading leave requests...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-6 mt-8 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Leave Requests</h2>
      {leaves.length === 0 ? (
        <p className="text-gray-600">No leave requests found.</p>
      ) : (
        <ul className="space-y-3">
          {leaves.map((leave) => (
            <li
              key={leave.id}
              className="border border-gray-300 p-4 rounded hover:shadow transition"
            >
              <p>
                <strong>Reason:</strong> {leave.reason}
              </p>
              <p>
                <strong>From:</strong> {new Date(leave.startDate).toLocaleDateString()}{' '}
                <strong>To:</strong> {new Date(leave.endDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
