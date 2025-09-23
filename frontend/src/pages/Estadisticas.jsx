// frontend/src/pages/Estadisticas.jsx
import { useEffect, useState, useRef } from "react";
import ExportButtons from "../components/ExportButtons";
import UploadPDF from "../components/UploadPDF";

export default function Estadisticas() {
  const [tableData, setTableData] = useState([]);
  const tableRef = useRef();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.access_token;

        const res = await fetch("/.netlify/functions/getStatistics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTableData(data);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📈 Estadísticas</h1>

      <ExportButtons tableData={tableData} tableRef={tableRef} />

      <div className="overflow-x-auto mt-4">
        <table
          ref={tableRef}
          className="min-w-full border border-gray-300 bg-white shadow rounded-lg"
        >
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Categoría</th>
              <th className="border px-4 py-2">Valor</th>
              <th className="border px-4 py-2">PDF</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{row.categoria}</td>
                <td className="border px-4 py-2">{row.valor}</td>
                <td className="border px-4 py-2">
                  {row.pdfUrl ? (
                    <a
                      href={row.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Ver PDF
                    </a>
                  ) : (
                    <UploadPDF
                      onUpload={(data) => {
                        // ⚡ aquí deberías actualizar la estadística en tu DB con el URL
                        console.log("PDF subido:", data.url);
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
