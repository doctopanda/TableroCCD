import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Estadisticas from "./pages/Estadisticas";
import { useTheme } from "./hooks/useTheme";

function App() {
  const [user, setUser] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              user.rol === "admin" ? (
                <Dashboard
                  user={user}
                  onLogout={handleLogout}
                  onToggleTheme={toggleTheme}
                  theme={theme}
                />
              ) : (
                <Navigate to="/estadisticas" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/estadisticas"
          element={
            user ? (
              <Estadisticas
                user={user}
                onLogout={handleLogout}
                onToggleTheme={toggleTheme}
                theme={theme}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            user ? (
              user.rol === "admin" ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/estadisticas" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
