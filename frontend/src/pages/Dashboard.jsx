// frontend/src/pages/Dashboard.jsx
import { useEffect, useState, useRef } from "react";
import ExportButtons from "../components/ExportButtons";
import UploadPDF from "../components/UploadPDF";

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const tableRef = useRef();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.access_token;

        const res = await fetch("/.netlify/functions/getRecords", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error("Error al cargar registros:", err);
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      <ExportButtons tableData={records} tableRef={tableRef} />

      <div className="overflow-x-auto mt-4">
        <table
          ref={tableRef}
          className="min-w-full border border-gray-300 bg-white shadow rounded-lg"
        >
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">PDF</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="text-center">
                <td className="border px-4 py-2">{record.id}</td>
                <td className="border px-4 py-2">{record.nombre}</td>
                <td className="border px-4 py-2">{record.email}</td>
                <td className="border px-4 py-2">
                  {record.pdfUrl ? (
                    <a
                      href={record.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Ver PDF
                    </a>
                  ) : (
                    <UploadPDF
                      onUpload={(data) => {
                        // ⚡ aquí deberías actualizar el registro en tu DB con el URL
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
