import { useState } from 'react';
import { register } from '../api/auth';

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      setMsg('Registration successful! Please log in.');
      setForm({ name: '', email: '', password: '' });
    } catch (err: any) {
      setMsg(err.response?.data?.error || 'Error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 space-y-6"
        aria-label="Register Form"
      >
        <h2 className="text-3xl font-extrabold text-emerald-700 text-center">Create Your Account</h2>

        {msg && (
          <p
            className={`text-center font-semibold ${
              msg.toLowerCase().includes('error') ? 'text-red-600' : 'text-green-600'
            }`}
            role="alert"
          >
            {msg}
          </p>
        )}

        <div>
          <label htmlFor="name" className="block text-emerald-700 font-semibold mb-1">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="John Doe"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-emerald-700 font-semibold mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-emerald-700 font-semibold mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="********"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold text-lg transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
