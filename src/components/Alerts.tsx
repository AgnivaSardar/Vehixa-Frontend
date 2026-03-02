import { useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';
import { AlertOctagon, Clock } from 'lucide-react';
import { alertsService } from '../services';
import type { Alert as AlertType } from '../services';

export default function Alerts() {
  const { ref, isInView } = useInView(0.05);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Get all vehicles first to fetch alerts
        const { vehiclesService } = await import('../services');
        const vehicles = await vehiclesService.getAllVehicles();
        if (vehicles.length > 0) {
          const vehicleAlerts = await alertsService.getAlerts(vehicles[0].vehicleId);
          setAlerts(vehicleAlerts);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
        console.error('Alerts error:', err);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <section id="alerts" className="relative py-24 px-4" style={{ background: 'linear-gradient(180deg, #0a0a0f, #0d1117, #0a0a0f)' }}>
      <div ref={ref} className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00ff88] mb-3 block">Alerts</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            System <span className="neon-text">Alerts</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Real-time alerts and notifications for vehicle health anomalies.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8"
          style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}
        >
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white">{alerts.length}</div>
            <div className="text-xs text-gray-500">Total Alerts</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-[#ff3344]">{alerts.filter(a => a.severity === 'critical').length}</div>
            <div className="text-xs text-gray-500">Critical</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-[#ffaa00]">{alerts.filter(a => a.severity === 'high').length}</div>
            <div className="text-xs text-gray-500">High Priority</div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-500">
            <p>Loading alerts...</p>
          </div>
        )}

        {/* Alert cards */}
        <div className="space-y-4">
          {alerts.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400">
              <p>No alerts at the moment. Your vehicle is operating normally.</p>
            </div>
          )}
          {alerts.map((alert, i) => {
            const severityColor = alert.severity === 'critical' ? '#ff3344' : alert.severity === 'high' ? '#ffaa00' : '#4ade80';
            return (
              <div
                key={alert.id}
                className="glass-card p-5 flex items-start gap-4 transition-all duration-500"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? 'translateX(0)' : 'translateX(-30px)',
                  transitionDelay: `${i * 120}ms`,
                  borderLeftWidth: '3px',
                  borderLeftColor: severityColor,
                }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <AlertOctagon size={32} color={severityColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">{alert.title}</h3>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                      style={{
                        background: `${severityColor}15`,
                        color: severityColor,
                        border: `1px solid ${severityColor}30`,
                      }}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{alert.description}</p>
                  <span className="text-xs text-gray-600 mt-2 inline-flex items-center gap-1">
                    <Clock size={12} /> {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
