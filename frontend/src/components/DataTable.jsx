import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function DataTable() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      let { data } = await supabase.from('pacientes').select('*');
      setRecords(data || []);
    };
    fetchData();
  }, []);

  const filtered = records.filter(r => r.nombre.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-1 mb-2"
      />
      <table className="w-full border">
        <thead>
          <tr><th>Nombre</th><th>Edad</th></tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={i}>
              <td>{r.nombre}</td>
              <td>{r.edad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
