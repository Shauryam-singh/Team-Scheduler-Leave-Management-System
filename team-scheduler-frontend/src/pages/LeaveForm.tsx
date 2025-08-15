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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 md:p-10 border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-6 text-center">
          Apply for Leave
        </h1>

        {message && <p className="mb-4 text-green-600 font-medium text-center">{message}</p>}
        {error && <p className="mb-4 text-red-600 font-medium text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block font-semibold text-gray-700 mb-2">
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={4}
              placeholder="E.g., Family trip, personal health, urgent travel..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white/70 backdrop-blur-sm"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white/70 backdrop-blur-sm"
                min={today}
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white/70 backdrop-blur-sm"
                min={form.startDate || today}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white text-lg transition ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-600 shadow-lg'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
