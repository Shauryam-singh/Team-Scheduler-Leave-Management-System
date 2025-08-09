import { useState, useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LeaveList from './pages/LeaveList';
import LeaveForm from './pages/LeaveForm';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';

function Nav() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState<any>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("loginStatusChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStatusChanged", handleStorageChange);
    };
  }, []);

  if (location.pathname === "/") return null;

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-200
     ${
       isActive
         ? "bg-blue-600 text-white shadow-md"
         : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
     }`;

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg rounded-b-xl px-6 py-3 flex justify-center md:justify-start gap-4 md:gap-6 sticky top-0 z-50 border-b border-gray-200">
      {isLoggedIn ? (
        <>
          <NavLink to="/leaves" className={linkClasses}>
            Leaves
          </NavLink>
          <NavLink to="/apply" className={linkClasses}>
            Apply Leave
          </NavLink>
          <NavLink to="/profile" className={linkClasses}>
            Profile
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClasses}>
              Admin
            </NavLink>
          )}
        </>
      ) : (
        <>
          <NavLink to="/login" className={linkClasses}>
            Login
          </NavLink>
          <NavLink to="/register" className={linkClasses}>
            Register
          </NavLink>
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