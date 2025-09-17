import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Páginas
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Formulario from './pages/Formulario';
import Estadisticas from './pages/Estadisticas';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando…</div>;

  const PrivateRoute = ({ children }) => {
    return session ? children : <Navigate to="/auth" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Rutas privadas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/formulario"
          element={
            <PrivateRoute>
              <Formulario />
            </PrivateRoute>
          }
        />
        <Route
          path="/estadisticas"
          element={
            <PrivateRoute>
              <Estadisticas />
            </PrivateRoute>
          }
        />

        {/* Ruta comodín */}
        <Route path="*" element={<Navigate to={session ? "/" : "/auth"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
