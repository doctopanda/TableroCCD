import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Estadisticas from './pages/Estadisticas';
import Login from './components/Login';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />

        <Route
          path="/dashboard"
          element={
            user?.role === 'admin' ? <Dashboard /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/estadisticas"
          element={
            user && (user.role === 'admin' || user.role === 'viewer') ? (
              <Estadisticas />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="*"
          element={<Navigate to={user ? (user.role === 'admin' ? "/dashboard" : "/estadisticas") : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
