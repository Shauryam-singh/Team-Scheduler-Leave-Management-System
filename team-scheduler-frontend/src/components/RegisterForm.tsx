import { useState } from "react";
import { register } from "../api/auth";

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      setMsg("Registration successful! Please log in.");
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      setMsg(err.response?.data?.error || "Error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 relative overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/40 space-y-6"
        aria-label="Register Form"
      >
        <h2 className="text-4xl font-extrabold text-center text-emerald-700 tracking-tight">
          Create Your Account
        </h2>
        <p className="text-center text-gray-600">
          Join us and start managing your account effortlessly.
        </p>

        {msg && (
          <p
            className={`text-center font-semibold ${
              msg.toLowerCase().includes("error")
                ? "text-red-600"
                : "text-green-600"
            }`}
            role="alert"
          >
            {msg}
          </p>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-emerald-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            placeholder="John Doe"
            autoComplete="name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-emerald-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-emerald-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            placeholder="********"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
