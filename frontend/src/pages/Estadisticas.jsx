import { useEffect, useRef, useState } from 'react';
import ExportButtons from './ExportButtons';

export default function Estadisticas() {
  const [stats, setStats] = useState({});
  const tableRef = useRef(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/.netlify/functions/getStatistics');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching statistics:', err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Estadísticas</h1>

      <ExportButtons tableData={[stats]} tableRef={tableRef} />

      <table ref={tableRef} className="min-w-full mt-4 border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Total Forms</th>
            <th className="border px-2 py-1">Total Records</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1">{stats.totalForms}</td>
            <td className="border px-2 py-1">{stats.totalRecords}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
