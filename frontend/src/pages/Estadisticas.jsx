import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Filtros from '../components/Filtros';
import ExportButtons from '../components/ExportButtons';

export default function Estadisticas() {
  const [records, setRecords] = useState([]);
  const [filtros, setFiltros] = useState({
    sexo: 'todos',
    edad: 'todos',
    fecha: 'todos',
    fechaInicio: '',
    fechaFin: ''
  });
  const tableRef = useRef(null);

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

  // Totales
  const total = filtered.length;
  const hombres = filtered.filter(r => r.sexo === 'H').length;
  const mujeres = filtered.filter(r => r.sexo === 'M').length;

  // Datos para gráficas
  const sexoData = [
    { name: 'Hombres', value: hombres },
    { name: 'Mujeres', value: mujeres },
  ];

  const edadData = [
    { name: '<30', value: filtered.filter(r => r.edad < 30).length },
    { name: '30-60', value: filtered.filter(r => r.edad >= 30 && r.edad <= 60).length },
    { name: '>60', value: filtered.filter(r => r.edad > 60).length },
  ];

  const COLORS = ['#0088FE', '#FF69B4'];

  // Datos de tabla para exportación
  const tableData = [
    { categoria: 'Total registros', cantidad: total, porcentaje: '100%' },
    { categoria: 'Hombres', cantidad: hombres, porcentaje: total ? ((hombres / total) * 100).toFixed(1) + '%' : '-' },
    { categoria: 'Mujeres', cantidad: mujeres, porcentaje: total ? ((mujeres / total) * 100).toFixed(1) + '%' : '-' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Estadísticas</h1>

      {/* Filtros reutilizables */}
      <Filtros onChange={(f) => setFiltros(f)} />

      {/* Gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-lg mb-2">Distribución por Sexo</h2>
          <PieChart width={300} height={250}>
            <Pie data={sexoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {sexoData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Bar Chart */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-lg mb-2">Distribución por Edad</h2>
          <BarChart width={400} height={250} data={edadData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      {/* Botones de exportación */}
      <ExportButtons tableData={tableData} tableRef={tableRef} />

      {/* Tabla resumen */}
      <div className="border p-4 rounded shadow mt-4" ref={tableRef}>
        <h2 className="text-lg mb-2">Resumen de Datos</h2>
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Categoría</th>
              <th className="border px-2 py-1">Cantidad</th>
              <th className="border px-2 py-1">Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{row.categoria}</td>
                <td className="border px-2 py-1">{row.cantidad}</td>
                <td className="border px-2 py-1">{row.porcentaje}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
