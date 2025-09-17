import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import FormCreator from '../components/FormCreator';

export default function Dashboard(){
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user || null);
      // Fetch role from backend that will use service-role key
      if(data.session?.user) {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/role`, {
          headers: { 'Authorization': `Bearer ${data.session.access_token}` }
        }).then(r => r.json()).then(j => setRole(j.role)).catch(()=>setRole('visualizador'));
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen p-6">
      <header className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold text-gobVino">DashBash</h1><p className="text-sm text-gray-600">Panel</p></div>
        <div>
          {user && <div className="text-sm text-gray-700">{user.email} <button className="ml-3 text-red-600" onClick={()=>supabase.auth.signOut()}>Cerrar</button></div>}
          <div className="text-xs text-gray-500">Rol: {role || '—'}</div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Acciones</h3>
          <p className="text-sm text-gray-600">Crear y gestionar formularios PDF.</p>
        </section>
        <section className="lg:col-span-2 bg-white p-4 rounded shadow">
          <FormCreator backendUrl={import.meta.env.VITE_BACKEND_URL} />
        </section>
      </main>
    </div>
  );
}
