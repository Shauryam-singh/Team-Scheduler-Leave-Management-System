import { useNavigate } from 'react-router-dom';
import { FaRegCalendarAlt, FaUsers, FaUserShield, FaUserCircle } from 'react-icons/fa';
import preview1 from '/preview1.png';
import preview2 from '/preview2.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleCTA = () => {
    navigate(isLoggedIn ? '/profile' : '/login');
  };

  const handleDemoLogin = () => {
    // Hardcoded demo token + user
    const demoUser = {
      email: 'admin@demo.com',
      role: 'admin',
      name: 'Demo Admin',
    };
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('user', JSON.stringify(demoUser));
    window.dispatchEvent(new Event('loginStatusChanged'));
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-500 text-white flex flex-col">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          Seamless Leave & Team Management
        </h1>
        <p className="max-w-2xl text-lg mb-8 text-blue-100 leading-relaxed">
          Empower your teams with effortless leave tracking, role-based approvals, and real-time schedule visibility.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={handleCTA}
            className="bg-white text-indigo-700 font-bold py-3 px-8 rounded shadow-lg hover:bg-gray-100 transition"
          >
            Get Started
          </button>
          <button
            onClick={handleDemoLogin}
            className="bg-yellow-400 text-indigo-900 font-bold py-3 px-6 rounded shadow hover:bg-yellow-300 transition"
          >
            Try Demo
          </button>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-white text-gray-800 py-20 px-6 rounded-t-3xl shadow-inner">
        <h2 className="text-4xl font-bold text-center mb-12 text-indigo-700">Why Choose Us?</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<FaRegCalendarAlt size={36} className="text-indigo-600" />}
            title="Smart Leave Requests"
            description="Apply and manage leaves in seconds. Clear, fast, and mobile-friendly interface."
          />
          <FeatureCard
            icon={<FaUsers size={36} className="text-indigo-600" />}
            title="Team View & Insights"
            description="See your team’s availability and past requests at a glance — plan ahead easily."
          />
          <FeatureCard
            icon={<FaUserShield size={36} className="text-indigo-600" />}
            title="Role-Based Control"
            description="Admins, managers, and employees all have tailored access and capabilities."
          />
        </div>
      </section>

      {/* UI Preview Screenshots */}
      <section className="bg-gray-100 py-20 px-6 text-center">
        <h2 className="text-4xl font-bold text-indigo-700 mb-8">Product Screens</h2>
        <div className="flex flex-col md:flex-row gap-10 justify-center items-center max-w-5xl mx-auto">
          <img src={preview1} alt="UI preview 1" className="rounded-lg shadow-md w-full md:w-1/2" />
          <img src={preview2} alt="UI preview 2" className="rounded-lg shadow-md w-full md:w-1/2" />
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">Have Questions?</h2>
        <p className="max-w-xl mx-auto text-gray-700 mb-6">
          Reach out to us at <a href="mailto:support@leaveflow.app" className="text-blue-600 font-semibold">support@leaveflow.app</a>
        </p>
        <div className="flex justify-center items-center gap-3 text-indigo-600">
          <FaUserCircle size={28} />
          <p className="text-sm text-gray-600">Built by LeaveFlow Team • Made with ❤️</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-white/70">
        &copy; {new Date().getFullYear()} LeaveFlow. All rights reserved.
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
    <div className="p-6 rounded-xl shadow-md bg-white hover:shadow-xl transition text-left">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
