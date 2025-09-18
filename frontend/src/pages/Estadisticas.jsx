import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import Navbar from "../components/Navbar";

export default function Estadisticas({ user, onLogout }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiFetch("/.netlify/functions/getStatistics");
        setStats(data);
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <Navbar user={user} onLogout={onLogout} />

      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold">Estadísticas</h1>

        {stats ? (
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Resumen</h2>
            <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        ) : (
          <p>Cargando estadísticas...</p>
        )}
      </main>
    </div>
  );
}
