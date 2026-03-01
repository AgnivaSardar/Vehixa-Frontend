import { useInView } from '../hooks/useInView';

interface Alert {
  id: number;
  type: 'critical' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  icon: string;
}

const mockAlerts: Alert[] = [
  {
    id: 1,
    type: 'critical',
    title: 'Engine Overheating',
    message: 'Engine temperature exceeded 115°C. Immediate cooldown required. Possible coolant leak or radiator malfunction.',
    timestamp: '2 min ago',
    icon: '🔥',
  },
  {
    id: 2,
    type: 'critical',
    title: 'Brake Wear Critical',
    message: 'Front brake pad thickness below 15%. Urgent replacement needed to ensure safe braking performance.',
    timestamp: '8 min ago',
    icon: '🛑',
  },
  {
    id: 3,
    type: 'warning',
    title: 'Low Oil Level',
    message: 'Engine oil level at 22%. Schedule an oil change within the next 500 km to prevent engine damage.',
    timestamp: '25 min ago',
    icon: '🛢️',
  },
  {
    id: 4,
    type: 'warning',
    title: 'Low Battery Voltage',
    message: 'Battery voltage at 12.1V, below optimal range. Consider testing battery health and alternator output.',
    timestamp: '1 hr ago',
    icon: '🔋',
  },
  {
    id: 5,
    type: 'warning',
    title: 'Tire Pressure Low',
    message: 'Rear-left tire pressure at 27 PSI. Inflate to recommended 32 PSI for optimal performance.',
    timestamp: '2 hr ago',
    icon: '🛞',
  },
];

export default function Alerts() {
  const { ref, isInView } = useInView(0.05);

  return (
    <section id="alerts" className="relative py-24 px-4" style={{ background: 'linear-gradient(180deg, #0a0a0f, #0d1117, #0a0a0f)' }}>
      <div ref={ref} className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00ff88] mb-3 block">Alerts</span>
          <h2 className="font-[Orbitron] text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            System <span className="neon-text">Alerts</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Real-time alerts and notifications for vehicle health anomalies.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8"
          style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}
        >
          <div className="glass-card p-4 text-center">
            <div className="font-[Orbitron] text-2xl font-bold text-white">{mockAlerts.length}</div>
            <div className="text-xs text-gray-500">Total Alerts</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="font-[Orbitron] text-2xl font-bold text-[#ff3344]">{mockAlerts.filter(a => a.type === 'critical').length}</div>
            <div className="text-xs text-gray-500">Critical</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="font-[Orbitron] text-2xl font-bold text-[#ffaa00]">{mockAlerts.filter(a => a.type === 'warning').length}</div>
            <div className="text-xs text-gray-500">Warnings</div>
          </div>
        </div>

        {/* Alert cards */}
        <div className="space-y-4">
          {mockAlerts.map((alert, i) => (
            <div
              key={alert.id}
              className="glass-card p-5 flex items-start gap-4 transition-all duration-500"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateX(0)' : 'translateX(-30px)',
                transitionDelay: `${i * 120}ms`,
                borderLeftWidth: '3px',
                borderLeftColor: alert.type === 'critical' ? '#ff3344' : '#ffaa00',
                animation: alert.type === 'critical' ? 'blink-red 2s infinite' : 'none',
              }}
            >
              <div className="flex-shrink-0 text-3xl mt-0.5">{alert.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="font-[Orbitron] text-sm font-semibold text-white">{alert.title}</h3>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: alert.type === 'critical' ? 'rgba(255,51,68,0.15)' : 'rgba(255,170,0,0.15)',
                      color: alert.type === 'critical' ? '#ff3344' : '#ffaa00',
                      border: `1px solid ${alert.type === 'critical' ? 'rgba(255,51,68,0.3)' : 'rgba(255,170,0,0.3)'}`,
                    }}
                  >
                    {alert.type}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{alert.message}</p>
                <span className="text-xs text-gray-600 mt-2 inline-block">⏱ {alert.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
