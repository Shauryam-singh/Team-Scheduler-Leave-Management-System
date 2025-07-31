import { useEffect, useState } from 'react';
import { fetchLeaves } from '../api/leaveService';

const LeaveList = () => {
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaves()
      .then((res) => setLeaves(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Leaves</h1>
      <ul className="space-y-2">
        {leaves.map((leave) => (
          <li key={leave.id} className="border p-2 rounded">
            {leave.reason} | {leave.startDate} to {leave.endDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveList;
