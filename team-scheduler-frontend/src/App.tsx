import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LeaveList from './pages/LeaveList';
import LeaveForm from './pages/LeaveForm';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

function Nav() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Listen for login/logout events
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    // Listen to localStorage changes (in other tabs/windows)
    window.addEventListener('storage', handleStorageChange);

    // Custom event to update login state on same tab
    window.addEventListener('loginStatusChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStatusChanged', handleStorageChange);
    };
  }, []);

  // Don't show nav on LandingPage (path = '/')
  if (location.pathname === '/') return null;

  return (
    <nav className="bg-gray-200 p-4 flex gap-4">
      {isLoggedIn ? (
        <>
          <Link to="/leaves" className="text-blue-600 font-semibold">Leaves</Link>
          <Link to="/apply" className="text-blue-600 font-semibold">Apply Leave</Link>
          <Link to="/profile" className="text-blue-600 font-semibold">Profile</Link>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
