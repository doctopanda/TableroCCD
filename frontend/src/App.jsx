import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './routes/Dashboard';
import Formulario from './routes/Formulario';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listener de cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando…</div>;

  // Componente que protege rutas privadas
  const PrivateRoute = ({ children }) => {
    return session ? children : <Navigate to="/auth" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de autenticación */}
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

        {/* Redirigir cualquier otra ruta a "/" o a "/auth" según sesión */}
        <Route
          path="*"
          element={session ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
