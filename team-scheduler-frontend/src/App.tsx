import { useState, useEffect } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LeaveList from "./pages/LeaveList";
import LeaveForm from "./pages/LeaveForm";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import LandingNav from "./components/LandingNav";

function Nav() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem("user") || "null"));
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Show LandingNav on public routes
  const onLandingRoutes = ["/", "/login", "/register"].includes(location.pathname);
  if (onLandingRoutes) return <LandingNav />;

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-full font-medium transition duration-300
     ${
       isActive
         ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg"
         : "text-gray-600 hover:text-white hover:bg-indigo-500/70 hover:backdrop-blur-md"
     }`;

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/60 border-b border-gray-200 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-6 py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          LeaveFlow
        </Link>

        {/* Hamburger button for mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 hover:text-indigo-600 focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {isLoggedIn ? (
            <>
              <NavLink to="/leaves" className={linkClasses}>Leaves</NavLink>
              <NavLink to="/apply" className={linkClasses}>Apply Leave</NavLink>
              <NavLink to="/profile" className={linkClasses}>Profile</NavLink>
              {user?.role?.toLowerCase() === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `${linkClasses({ isActive })} text-red-600 hover:text-white hover:bg-red-500`
                  }
                >
                  Admin
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClasses}>Login</NavLink>
              <NavLink to="/register" className={linkClasses}>Register</NavLink>
            </>
          )}
        </div>

        {/* User avatar dropdown */}
        {isLoggedIn && user?.name && (
          <div className="hidden md:block ml-4 relative group">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold cursor-pointer">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
              <p className="px-4 py-2 text-gray-700 border-b">{user.name}</p>
              <NavLink to="/profile" className="block px-4 py-2 hover:bg-indigo-50">
                Profile
              </NavLink>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.dispatchEvent(new Event("loginStatusChanged"));
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg flex flex-col px-4 py-4 space-y-2">
          {isLoggedIn ? (
            <>
              <NavLink to="/leaves" className={linkClasses} onClick={() => setMenuOpen(false)}>Leaves</NavLink>
              <NavLink to="/apply" className={linkClasses} onClick={() => setMenuOpen(false)}>Apply Leave</NavLink>
              <NavLink to="/profile" className={linkClasses} onClick={() => setMenuOpen(false)}>Profile</NavLink>
              {user?.role?.toLowerCase() === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `${linkClasses({ isActive })} text-red-600 hover:text-white hover:bg-red-500`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </NavLink>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.dispatchEvent(new Event("loginStatusChanged"));
                  setMenuOpen(false);
                }}
                className="text-red-600 font-semibold px-4 py-2 hover:bg-red-50 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClasses} onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className={linkClasses} onClick={() => setMenuOpen(false)}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="pt-24">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/leaves" element={<LeaveList />} />
          <Route path="/apply" element={<LeaveForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
