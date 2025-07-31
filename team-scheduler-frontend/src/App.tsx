import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
    <nav className="bg-white shadow-md rounded-b-lg px-6 py-3 flex justify-center md:justify-start gap-8 md:gap-12 sticky top-0 z-50">
      {isLoggedIn ? (
        <>
          <NavLink to="/leaves">Leaves</NavLink>
          <NavLink to="/apply">Apply Leave</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </>
      )}
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="
        text-indigo-700 font-semibold text-lg
        hover:text-indigo-900
        transition-colors duration-200
        relative
        after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-indigo-700 after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100
      "
    >
      {children}
    </Link>
  );
}

export default Nav;
