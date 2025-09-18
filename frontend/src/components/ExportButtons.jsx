import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ExportButtons({ tableData = [], tableRef }) {
  // Exportar a Excel
  const exportExcel = () => {
    if (!tableData || !tableData.length) return;
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, 'datos_export.xlsx');
  };

  // Exportar a PDF
  const exportPDF = () => {
    if (!tableRef?.current) return;
    const doc = new jsPDF();
    autoTable(doc, { html: tableRef.current });
    doc.save('datos_export.pdf');
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportExcel}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Excel
      </button>
      <button
        onClick={exportPDF}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        PDF
      </button>
    </div>
  );
}
