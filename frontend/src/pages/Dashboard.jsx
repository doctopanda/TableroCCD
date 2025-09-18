import { useEffect, useRef, useState } from 'react';
import ExportButtons from '../components/ExportButtons';

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const res = await fetch('/.netlify/functions/getRecords');
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error('Error fetching records:', err);
      }
    }
    fetchRecords();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <ExportButtons tableData={records} tableRef={tableRef} />

      <table ref={tableRef} className="min-w-full mt-4 border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Email</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td className="border px-2 py-1">{r.id}</td>
              <td className="border px-2 py-1">{r.name}</td>
              <td className="border px-2 py-1">{r.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
