import Dashboard from '../components/Dashboard';
import Alerts from '../components/Alerts';
import MaintenanceInsights from '../components/MaintainenceInsights';

export default function DashboardPage() {
  return (
    <div className="pt-20">
      <Dashboard />
      <Alerts />
      <MaintenanceInsights />
    </div>
  );
}
