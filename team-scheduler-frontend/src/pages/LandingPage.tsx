import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegCalendarAlt, FaUsers, FaUserShield, FaQuoteLeft } from "react-icons/fa";
import preview1 from "/preview1.png";
import preview2 from "/preview2.png";
import LandingNav from "../components/LandingNav";

export default function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleCTA = () => {
    navigate(isLoggedIn ? "/profile" : "/login");
  };

  const handleDemoLogin = () => {
    const demoUser = {
      email: "admin@demo.com",
      role: "admin",
      name: "Demo Admin",
    };
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify(demoUser));
    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate("/profile");
  };

  return (
    <div className="bg-white text-gray-900 font-sans">
      <LandingNav />

      {/* Hero */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center max-w-6xl mx-auto"
      >
        {/* Background blob */}
        <svg
          className="absolute top-0 left-0 w-full h-full -z-10 opacity-20"
          viewBox="0 0 800 400"
        >
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <path
            fill="url(#grad)"
            d="M0,100 C200,200 400,0 800,150 L800,0 L0,0 Z"
          ></path>
        </svg>

        <motion.h1
          className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Smarter Leave & Team Management
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 max-w-2xl mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Manage leave requests, approvals, and team schedules seamlessly —
          all in one clean, easy-to-use dashboard.
        </motion.p>
        <motion.div
          className="flex gap-4 flex-wrap justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <button
            onClick={handleCTA}
            className="bg-indigo-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-indigo-500 transition"
          >
            Get Started
          </button>
          <button
            onClick={handleDemoLogin}
            className="border border-gray-300 text-gray-700 font-medium py-3 px-8 rounded-lg hover:border-gray-400 transition"
          >
            Try Demo
          </button>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-purple-50 to-indigo-50">
        <h2 className="text-3xl font-bold text-center mb-14">Why Teams Choose Us</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<FaRegCalendarAlt size={34} className="text-indigo-600" />}
            title="Fast Leave Requests"
            description="Submit and approve requests instantly from any device."
          />
          <FeatureCard
            icon={<FaUsers size={34} className="text-indigo-600" />}
            title="Clear Team View"
            description="See availability and schedules in a clean, unified calendar."
          />
          <FeatureCard
            icon={<FaUserShield size={34} className="text-indigo-600" />}
            title="Role-Based Access"
            description="Ensure the right people have the right permissions."
          />
        </div>
      </section>

      {/* Screens */}
      <section id="screens" className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          A Glimpse Into Our Dashboard
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-5xl mx-auto">
          <motion.img
            src={preview1}
            alt="UI preview 1"
            className="rounded-xl shadow-lg w-full md:w-1/2"
            whileHover={{ scale: 1.02 }}
          />
          <motion.img
            src={preview2}
            alt="UI preview 2"
            className="rounded-xl shadow-lg w-full md:w-1/2"
            whileHover={{ scale: 1.02 }}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-14">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto grid gap-10 md:grid-cols-2">
          <Testimonial
            text="LeaveFlow transformed how our team manages leave — it's fast, intuitive, and saves us hours every week!"
            author="Sarah Johnson, HR Manager"
          />
          <Testimonial
            text="As an admin, the role-based access makes it so easy to control permissions without confusion."
            author="Michael Chen, Operations Lead"
          />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-indigo-600 text-white py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
        <p className="mb-6">
          Email us at{" "}
          <a href="mailto:support@leaveflow.app" className="underline">
            support@leaveflow.app
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} LeaveFlow — All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition hover:-translate-y-1"
      whileHover={{ scale: 1.03 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
}

function Testimonial({ text, author }: { text: string; author: string }) {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md"
      whileHover={{ scale: 1.02 }}
    >
      <FaQuoteLeft className="text-indigo-500 mb-3" size={20} />
      <p className="text-gray-700 mb-4">{text}</p>
      <p className="text-sm font-semibold text-indigo-600">{author}</p>
    </motion.div>
  );
}
