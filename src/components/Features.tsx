import { useInView } from '../hooks/useInView';

const features = [
  { icon: '📝', title: 'Vehicle Registration', desc: 'Register and manage multiple vehicles with unique IDs, specs, and service history.' },
  { icon: '📡', title: 'Real-Time Sensor Monitoring', desc: 'Live telemetry from engine, brakes, battery, and tire sensors at millisecond intervals.' },
  { icon: '🤖', title: 'ML-Based Health Prediction', desc: 'Deep learning models analyze patterns to predict failures before they happen.' },
  { icon: '⚖️', title: 'Weighted Health Score', desc: 'Proprietary scoring engine weighing each parameter by criticality and historical trends.' },
  { icon: '🟢', title: 'Health Classification', desc: 'Excellent • Good • Warning • Critical — instant status with color-coded indicators.' },
  { icon: '🔔', title: 'Predictive Maintenance Alerts', desc: 'Smart notifications pushed before critical thresholds are reached.' },
  { icon: '📈', title: 'Historical Trend Monitoring', desc: 'Track degradation curves and component aging over weeks and months.' },
  { icon: '🖥️', title: 'Smart Dashboard', desc: 'Tesla-inspired dark dashboard with real-time gauges, charts, and analytics.' },
];

export default function Features() {
  const { ref, isInView } = useInView(0.05);

  return (
    <section id="features" className="relative py-24 px-4" style={{ background: '#0a0a0f' }}>
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00ff88] mb-3 block">Features</span>
          <h2 className="font-[Orbitron] text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful <span className="neon-text">Capabilities</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need to monitor, evaluate, and maintain vehicle health at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card p-6 text-center group cursor-default transition-all duration-500 hover:-translate-y-2"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
              <h3 className="font-[Orbitron] text-sm font-semibold text-white mb-2 group-hover:text-[#00ff88] transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
