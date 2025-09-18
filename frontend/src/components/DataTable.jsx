import { useState, useMemo, useRef } from 'react';
import ExportButtons from './ExportButtons';

export default function DataTable({ records = [], rowsPerPage = 10 }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef(null);

  // Ordenar registros
  const sortedRecords = useMemo(() => {
    let sortable = [...records];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [records, sortConfig]);

  // Paginación
  const totalPages = Math.ceil(sortedRecords.length / rowsPerPage);
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Exportar CSV (rápido, aparte de ExportButtons)
  const exportCSV = () => {
    if (!records.length) return;
    const headers = Object.keys(records[0]);
    const csvRows = [
      headers.join(','), // encabezados
      ...records.map(r =>
        headers.map(h => `"${r[h] !== null ? r[h] : ''}"`).join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tabla_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Manejar ordenamiento
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="border rounded shadow mt-6 p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Tabla de registros</h2>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            CSV rápido
          </button>
          {/* ExportButtons recibe los datos y la tabla */}
          <ExportButtons tableData={records} tableRef={tableRef} />
        </div>
      </div>

      <div ref={tableRef}>
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              {records.length > 0 &&
                Object.keys(records[0]).map((key) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="border px-2 py-1 cursor-pointer hover:bg-gray-200"
                  >
                    {key}{' '}
                    {sortConfig.key === key
                      ? sortConfig.direction === 'asc'
                        ? '⬆️'
                        : '⬇️'
                      : ''}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {Object.values(row).map((val, j) => (
                  <td key={j} className="border px-2 py-1">
                    {val !== null ? val.toString() : ''}
                  </td>
                ))}
              </tr>
            ))}
            {paginatedRecords.length === 0 && (
              <tr>
                <td colSpan={records[0] ? Object.keys(records[0]).length : 1} className="text-center py-4">
                  No hay registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-between items-center mt-3 text-sm">
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            ⏮
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            ◀
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            ▶
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            ⏭
          </button>
        </div>
      </div>
    </div>
  );
}
