import { useState } from 'react';
import { createLeave } from '../api/leaveService';

export default function LeaveForm() {
  const [form, setForm] = useState({ reason: '', startDate: '', endDate: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.reason.trim() || !form.startDate || !form.endDate) {
      setError('All fields are required.');
      return;
    }

    if (new Date(form.startDate) < new Date(today)) {
      setError('Start date cannot be in the past.');
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('End date cannot be before start date.');
      return;
    }

    setLoading(true);
    try {
      await createLeave(form);
      setMessage('✅ Leave request submitted successfully!');
      setForm({ reason: '', startDate: '', endDate: '' });
    } catch (err) {
      console.error(err);
      setError('❌ Error submitting leave request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">Apply for Leave</h1>

        {message && <p className="mb-4 text-green-600 font-medium text-center">{message}</p>}
        {error && <p className="mb-4 text-red-600 font-medium text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="reason" className="block font-semibold text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={4}
              placeholder="E.g., Family trip, personal health, urgent travel..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block font-semibold text-gray-700 mb-1">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min={today}
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block font-semibold text-gray-700 mb-1">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min={form.startDate || today}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-md font-bold transition ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
