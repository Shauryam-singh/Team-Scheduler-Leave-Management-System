import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleCTA = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-700 text-white px-4 text-center">
      <h1 className="text-5xl font-extrabold mb-6">Team Scheduler & Leave Management</h1>
      <p className="max-w-xl text-lg mb-8 leading-relaxed">
        Manage your team's schedules, leave requests, and approvals easily with our intuitive platform.
        Track leave history, apply in seconds, and keep everyone in sync.
      </p>
      <button
        onClick={handleCTA}
        className="bg-white text-blue-700 font-bold py-3 px-8 rounded shadow-lg hover:bg-gray-100 transition"
      >
        Get Started
      </button>

      <section className="mt-20 max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-10">
        <FeatureCard
          title="Easy Leave Applications"
          description="Submit leave requests quickly with detailed reasons and dates."
        />
        <FeatureCard
          title="Team Schedule Overview"
          description="View team members' leaves and schedules in one place."
        />
        <FeatureCard
          title="Role-based Access"
          description="Admins and team members have different access levels."
        />
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white bg-opacity-20 rounded-lg p-6 shadow-lg backdrop-blur-sm">
      <h3 className="text-2xl text-blue-500 font-semibold mb-2">{title}</h3>
      <p className="text-blue-500/90">{description}</p>
    </div>
  );
}
