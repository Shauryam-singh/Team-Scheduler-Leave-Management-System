import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LeaveList from './pages/LeaveList';
import LeaveForm from './pages/LeaveForm';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <nav className="bg-gray-200 p-4 flex gap-4">
        {isLoggedIn ? (
          <>
            <Link to="/" className="text-blue-600 font-semibold">Leaves</Link>
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
      <Routes>
        <Route path="/" element={<LeaveList />} />
        <Route path="/apply" element={<LeaveForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
