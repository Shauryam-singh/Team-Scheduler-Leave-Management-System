import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LandingNav() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem("user") || "null"));

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

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          LeaveFlow
        </Link>

        {/* Scroll Links */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <button onClick={() => scrollToSection("features")} className="hover:text-indigo-600 cursor-pointer transition">
            Features
          </button>
          <button onClick={() => scrollToSection("screens")} className="hover:text-indigo-600 cursor-pointer transition">
            Screens
          </button>
          <button onClick={() => scrollToSection("contact")} className="hover:text-indigo-600 cursor-pointer transition">
            Contact
          </button>
        </nav>

        {/* Right Buttons / User */}
        <div className="flex gap-3">
          {isLoggedIn && user ? (
            <>
              <Link
                to="/profile"
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
              >
                {user.name || "Profile"}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:border-gray-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:border-gray-400 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
