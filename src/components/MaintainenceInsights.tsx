import { useInView } from "../hooks/useInView";

interface Insight {
  icon: string;
  component: string;
  condition: string;
  conditionColor: string;
  recommendation: string;
  urgency: 'High' | 'Medium' | 'Low';
  timeline: string;
}

const insights: Insight[] = [
  {
    icon: '🛑',
    component: 'Brake Pads',
    condition: 'Worn — 18% remaining',
    conditionColor: '#ff3344',
    recommendation: 'Brake pad replacement recommended within 5 days. Continued use risks reduced braking efficiency and rotor damage.',
    urgency: 'High',
    timeline: '2–5 days',
  },
  {
    icon: '🛢️',
    component: 'Engine Oil',
    condition: 'Low — 22% level',
    conditionColor: '#ffaa00',
    recommendation: 'Engine oil change required. Degraded oil reduces lubrication efficiency and accelerates engine wear.',
    urgency: 'High',
    timeline: '1–3 days',
  },
  {
    icon: '🔋',
    component: 'Battery',
    condition: 'Aging — 12.1V',
    conditionColor: '#ffaa00',
    recommendation: 'Battery showing signs of degradation. Test battery capacity and consider replacement within 2 weeks.',
    urgency: 'Medium',
    timeline: '1–2 weeks',
  },
  {
    icon: '🛞',
    component: 'Tires',
    condition: 'Pressure low — 27 PSI',
    conditionColor: '#ffaa00',
    recommendation: 'Inflate tires to manufacturer-recommended 32 PSI. Check for slow leaks or valve stem issues.',
    urgency: 'Medium',
    timeline: 'Immediate',
  },
  {
    icon: '❄️',
    component: 'Coolant System',
    condition: 'Temperature elevated',
    conditionColor: '#ffaa00',
    recommendation: 'Inspect coolant level and radiator. Flush cooling system if coolant is older than 2 years.',
    urgency: 'Low',
    timeline: '1 month',
  },
  {
    icon: '🔧',
    component: 'Transmission',
    condition: 'Normal — Monitored',
    conditionColor: '#00ff88',
    recommendation: 'Transmission fluid change recommended at 60,000 km. Current mileage: 42,850 km. Schedule ahead.',
    urgency: 'Low',
    timeline: '~17,000 km',
  },
];

const urgencyColors: Record<string, string> = {
  High: '#ff3344',
  Medium: '#ffaa00',
  Low: '#00ff88',
};

export default function MaintenanceInsights() {
  const { ref, isInView } = useInView(0.05);

  return (
    <section className="relative py-24 px-4" style={{ background: '#0a0a0f' }}>
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00ff88] mb-3 block">AI Insights</span>
          <h2 className="font-[Orbitron] text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Maintenance <span className="neon-text">Insights</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            AI-powered maintenance recommendations based on real-time sensor data and predictive models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {insights.map((ins, i) => (
            <div
              key={i}
              className="glass-card p-6 transition-all duration-500 hover:-translate-y-1 group"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">{ins.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <h3 className="font-[Orbitron] text-sm font-semibold text-white group-hover:text-[#00ff88] transition-colors">
                      {ins.component}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: `${urgencyColors[ins.urgency]}15`,
                        color: urgencyColors[ins.urgency],
                        border: `1px solid ${urgencyColors[ins.urgency]}30`,
                      }}
                    >
                      {ins.urgency} Priority
                    </span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: ins.conditionColor }}>
                    {ins.condition}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    💡 {ins.recommendation}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>⏰ Timeline:</span>
                    <span className="font-mono text-gray-300">{ins.timeline}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
