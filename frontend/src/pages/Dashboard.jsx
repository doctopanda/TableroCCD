import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import Navbar from "../components/Navbar";

export default function Dashboard({ user, onLogout }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiFetch("/.netlify/functions/getRecords");
        setRecords(data);
      } catch (err) {
        console.error("Error cargando registros:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <Navbar user={user} onLogout={onLogout} />

      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.length > 0 ? (
            records.map((r, i) => (
              <div
                key={i}
                className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
              >
                <h2 className="text-lg font-semibold mb-2">{r.titulo}</h2>
                <p className="text-sm text-gray-600">{r.descripcion}</p>
              </div>
            ))
          ) : (
            <p>No hay registros disponibles.</p>
          )}
        </div>
      </main>
    </div>
  );
}
