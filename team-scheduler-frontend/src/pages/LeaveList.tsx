import { useEffect, useState } from 'react';
import { getLeaves } from '../api/leaveService';

export default function LeaveList() {
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getLeaves();
        setLeaves(res.data);
      } catch (err) {
        console.error('Failed to load leaves', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Leave Requests</h2>
      <ul className="space-y-2">
        {leaves.map((leave) => (
          <li key={leave.id} className="p-2 border rounded">
            <p><strong>Reason:</strong> {leave.reason}</p>
            <p><strong>From:</strong> {leave.startDate} <strong>To:</strong> {leave.endDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
