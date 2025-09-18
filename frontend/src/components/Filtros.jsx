import { useState } from 'react';

export default function Filtros({ onChange }) {
  const [filtroSexo, setFiltroSexo] = useState('todos');
  const [filtroEdad, setFiltroEdad] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Cada vez que cambia un filtro, notificamos al padre
  const notifyChange = (updated) => {
    const filtros = {
      sexo: updated?.sexo ?? filtroSexo,
      edad: updated?.edad ?? filtroEdad,
      fecha: updated?.fecha ?? filtroFecha,
      fechaInicio: updated?.fechaInicio ?? fechaInicio,
      fechaFin: updated?.fechaFin ?? fechaFin,
    };
    onChange(filtros);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Filtro sexo */}
      <select
        value={filtroSexo}
        onChange={(e) => {
          setFiltroSexo(e.target.value);
          notifyChange({ sexo: e.target.value });
        }}
        className="border p-1"
      >
        <option value="todos">Todos los sexos</option>
        <option value="H">Hombres</option>
        <option value="M">Mujeres</option>
      </select>

      {/* Filtro edad */}
      <select
        value={filtroEdad}
        onChange={(e) => {
          setFiltroEdad(e.target.value);
          notifyChange({ edad: e.target.value });
        }}
        className="border p-1"
      >
        <option value="todos">Todas las edades</option>
        <option value="menor30">&lt; 30 años</option>
        <option value="30a60">30-60 años</option>
        <option value="mayor60">&gt; 60 años</option>
      </select>

      {/* Filtro fechas */}
      <select
        value={filtroFecha}
        onChange={(e) => {
          setFiltroFecha(e.target.value);
          notifyChange({ fecha: e.target.value });
        }}
        className="border p-1"
      >
        <option value="todos">Todas las fechas</option>
        <option value="7d">Últimos 7 días</option>
        <option value="30d">Últimos 30 días</option>
        <option value="custom">Rango personalizado</option>
      </select>

      {filtroFecha === 'custom' && (
        <div className="flex gap-2">
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => {
              setFechaInicio(e.target.value);
              notifyChange({ fechaInicio: e.target.value });
            }}
            className="border p-1"
          />
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => {
              setFechaFin(e.target.value);
              notifyChange({ fechaFin: e.target.value });
            }}
            className="border p-1"
          />
        </div>
      )}
    </div>
  );
}
