import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ExportButtons() {
  const exportExcel = () => {
    const data = [{ nombre: 'Paciente 1', edad: 34 }, { nombre: 'Paciente 2', edad: 40 }];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, 'datos.xlsx');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ head: [['Nombre', 'Edad']], body: [['Paciente 1', 34], ['Paciente 2', 40]] });
    doc.save('datos.pdf');
  };

  return (
    <div className="flex gap-2 mb-4">
      <button onClick={exportExcel}>Exportar Excel</button>
      <button onClick={exportPDF}>Exportar PDF</button>
    </div>
  );
}
