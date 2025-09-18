import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import DataTable from '../components/DataTable';
import ExportButtons from '../components/ExportButtons';
import ChartPanel from '../components/ChartPanel';
import Filtros from '../components/Filtros';

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [filtros, setFiltros] = useState({
    sexo: 'todos',
    edad: 'todos',
    fecha: 'todos',
    fechaInicio: '',
    fechaFin: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase.from('pacientes').select('*');
      if (error) console.error(error);
      else setRecords(data || []);
    };
    fetchData();
  }, []);

  // Aplicar filtros
  const filtered = records.filter(r => {
    let pass = true;

    if (filtros.sexo !== 'todos') pass = pass && r.sexo === filtros.sexo;

    if (filtros.edad !== 'todos') {
      if (filtros.edad === 'menor30') pass = pass && r.edad < 30;
      if (filtros.edad === '30a60') pass = pass && r.edad >= 30 && r.edad <= 60;
      if (filtros.edad === 'mayor60') pass = pass && r.edad > 60;
    }

    if (filtros.fecha !== 'todos' && r.fecha) {
      const fechaRegistro = new Date(r.fecha);
      const hoy = new Date();
      if (filtros.fecha === '7d') {
        const hace7 = new Date();
        hace7.setDate(hoy.getDate() - 7);
        pass = pass && fechaRegistro >= hace7 && fechaRegistro <= hoy;
      }
      if (filtros.fecha === '30d') {
        const hace30 = new Date();
        hace30.setDate(hoy.getDate() - 30);
        pass = pass && fechaRegistro >= hace30 && fechaRegistro <= hoy;
      }
      if (filtros.fecha === 'custom' && filtros.fechaInicio && filtros.fechaFin) {
        pass = pass && fechaRegistro >= new Date(filtros.fechaInicio) && fechaRegistro <= new Date(filtros.fechaFin);
      }
    }

    return pass;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Filtros reutilizables */}
      <Filtros onChange={(f) => setFiltros(f)} />

      {/* Botones de exportación */}
      <ExportButtons tableData={filtered} />

      {/* Gráficas generales */}
      <ChartPanel records={filtered} />

      {/* Tabla dinámica */}
      <DataTable records={filtered} />
    </div>
  );
}
