import DataTable from '../components/DataTable';
import ExportButtons from '../components/ExportButtons';
import ChartPanel from '../components/ChartPanel';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ExportButtons />
      <ChartPanel />
      <DataTable />
    </div>
  );
}
