import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LeaveList from './pages/LeaveList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LeaveList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
