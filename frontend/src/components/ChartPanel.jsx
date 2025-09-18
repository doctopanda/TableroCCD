import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

export default function ChartPanel({ records = [] }) {
  // Totales
  const total = records.length;
  const hombres = records.filter(r => r.sexo === 'H').length;
  const mujeres = records.filter(r => r.sexo === 'M').length;

  // Datos para pie chart por sexo
  const sexoData = [
    { name: 'Hombres', value: hombres },
    { name: 'Mujeres', value: mujeres },
  ];

  // Datos para bar chart por edad
  const edadData = [
    { name: '<30', value: records.filter(r => r.edad < 30).length },
    { name: '30-60', value: records.filter(r => r.edad >= 30 && r.edad <= 60).length },
    { name: '>60', value: records.filter(r => r.edad > 60).length },
  ];

  // Datos para línea temporal (asumiendo r.fecha)
  const fechasAgrupadas = {};
  records.forEach(r => {
    if (r.fecha) {
      const fecha = new Date(r.fecha).toISOString().split('T')[0]; // YYYY-MM-DD
      fechasAgrupadas[fecha] = (fechasAgrupadas[fecha] || 0) + 1;
    }
  });
  const lineaData = Object.entries(fechasAgrupadas).map(([fecha, count]) => ({
    fecha,
    registros: count,
  }));

  const COLORS = ['#0088FE', '#FF69B4'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Pie Chart - Sexo */}
      <div className="border p-4 rounded shadow">
        <h2 className="text-lg mb-2">Distribución por Sexo</h2>
        <PieChart width={250} height={220}>
          <Pie data={sexoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
            {sexoData.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Bar Chart - Edades */}
      <div className="border p-4 rounded shadow">
        <h2 className="text-lg mb-2">Distribución por Edad</h2>
        <BarChart width={280} height={220} data={edadData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </div>

      {/* Line Chart - Evolución temporal */}
      <div className="border p-4 rounded shadow">
        <h2 className="text-lg mb-2">Registros en el tiempo</h2>
        <LineChart width={300} height={220} data={lineaData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="registros" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </div>
    </div>
  );
}
