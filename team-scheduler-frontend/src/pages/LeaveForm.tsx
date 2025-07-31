import { useState } from 'react';
import { createLeave } from '../api/leaveService';

const LeaveForm = () => {
  const [form, setForm] = useState({ reason: '', startDate: '', endDate: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLeave(form);
      setMessage('Leave request submitted successfully!');
      setForm({ reason: '', startDate: '', endDate: '' });
    } catch (err) {
      console.error(err);
      setMessage('Error submitting leave request.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-semibold mb-4">Apply for Leave</h2>
      {message && <p className="mb-4 text-green-600 font-medium">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reason" className="block font-semibold mb-1">
            Reason
          </label>
          <textarea
            id="reason"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block font-semibold mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block font-semibold mb-1">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LeaveForm;
