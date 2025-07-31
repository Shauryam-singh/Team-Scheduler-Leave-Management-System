import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LeaveList from './pages/LeaveList';
import LeaveForm from './pages/LeaveForm';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';

function Nav() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginStatusChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStatusChanged', handleStorageChange);
    };
  }, []);

  if (location.pathname === '/') return null;

  return (
    <nav className="bg-gray-200 p-4 flex gap-4">
      {isLoggedIn ? (
        <>
          <Link to="/leaves" className="text-blue-600 font-semibold">Leaves</Link>
          <Link to="/apply" className="text-blue-600 font-semibold">Apply Leave</Link>
          <Link to="/profile" className="text-blue-600 font-semibold">Profile</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-blue-600 font-semibold">Admin</Link>
          )}
        </>
      ) : (
        <>
          <Link to="/login" className="text-blue-600 font-semibold">Login</Link>
          <Link to="/register" className="text-blue-600 font-semibold">Register</Link>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/leaves" element={<LeaveList />} />
        <Route path="/apply" element={<LeaveForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
