import { useState } from 'react';
import { useInView } from '../hooks/useInView';

interface EvalResult {
  healthScore: number;
  healthStatus: string;
  statusColor: string;
  alerts: string[];
  suggestions: string[];
}

function CircularProgress({ score, color }: { score: number; color: string }) {
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-52 h-52 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <circle
          cx="100" cy="100" r={radius} fill="none"
          stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.5s ease-in-out',
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-[Orbitron] text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-gray-400 text-sm mt-1">/ 100</span>
      </div>
    </div>
  );
}

function mockEvaluate(data: Record<string, number>): EvalResult {
  const { engineTemp, oilLevel, batteryVoltage, tirePressure, brakeCondition, rpm } = data;
  const alerts: string[] = [];
  const suggestions: string[] = [];

  let score = 100;

  // Engine temp (normal: 85-105°C)
  if (engineTemp > 110) { score -= 25; alerts.push('⚠️ Engine Overheating Detected'); suggestions.push('Allow engine to cool. Check coolant levels and radiator fan.'); }
  else if (engineTemp > 105) { score -= 10; alerts.push('🌡️ Engine temperature elevated'); suggestions.push('Monitor engine temperature closely.'); }
  else if (engineTemp < 50) { score -= 5; }

  // Oil level (0-100%)
  if (oilLevel < 15) { score -= 25; alerts.push('🛢️ Critical Oil Level'); suggestions.push('Immediate engine oil change required.'); }
  else if (oilLevel < 30) { score -= 12; alerts.push('🛢️ Low Oil Level Warning'); suggestions.push('Schedule oil change within 3 days.'); }

  // Battery (normal: 12.4-14.7V)
  if (batteryVoltage < 11.5) { score -= 25; alerts.push('🔋 Critical Battery Voltage'); suggestions.push('Battery replacement required immediately.'); }
  else if (batteryVoltage < 12.2) { score -= 12; alerts.push('🔋 Low Battery Voltage'); suggestions.push('Have battery tested and consider replacement.'); }

  // Tire pressure (normal: 30-35 PSI)
  if (tirePressure < 22) { score -= 20; alerts.push('🛞 Critical Tire Pressure'); suggestions.push('Inflate tires immediately. Check for punctures.'); }
  else if (tirePressure < 28) { score -= 8; alerts.push('🛞 Low Tire Pressure'); suggestions.push('Inflate tires to recommended PSI.'); }

  // Brake condition (0-100%)
  if (brakeCondition < 15) { score -= 30; alerts.push('🛑 Brake Wear Critical'); suggestions.push('Brake pad replacement required within 2 days.'); }
  else if (brakeCondition < 30) { score -= 15; alerts.push('🛑 Brake Pads Worn'); suggestions.push('Brake pad replacement recommended within 5 days.'); }

  // RPM (normal idle: 600-1000)
  if (rpm > 6000) { score -= 15; alerts.push('🔄 Excessive RPM'); suggestions.push('Reduce engine RPM to prevent damage.'); }
  else if (rpm > 4500) { score -= 5; }

  score = Math.max(0, Math.min(100, score));

  let healthStatus: string;
  let statusColor: string;
  if (score >= 80) { healthStatus = 'Excellent'; statusColor = '#00ff88'; }
  else if (score >= 60) { healthStatus = 'Good'; statusColor = '#4ade80'; }
  else if (score >= 35) { healthStatus = 'Warning'; statusColor = '#ffaa00'; }
  else { healthStatus = 'Critical'; statusColor = '#ff3344'; }

  if (alerts.length === 0) alerts.push('✅ All systems operating normally');
  if (suggestions.length === 0) suggestions.push('Continue regular maintenance schedule.');

  return { healthScore: score, healthStatus, statusColor, alerts, suggestions };
}

export default function LiveEvaluation() {
  const { ref, isInView } = useInView(0.05);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [form, setForm] = useState({
    engineTemp: 92,
    oilLevel: 75,
    batteryVoltage: 12.6,
    tirePressure: 32,
    brakeCondition: 65,
    rpm: 800,
  });

  const handleChange = (key: string, value: string) => {
    setForm(p => ({ ...p, [key]: parseFloat(value) || 0 }));
  };

  const handleEvaluate = () => {
    setLoading(true);
    setResult(null);
    // Simulate API call
    setTimeout(() => {
      const res = mockEvaluate(form);
      setResult(res);
      setLoading(false);
    }, 1800);
  };

  const fields = [
    { key: 'engineTemp', label: 'Engine Temperature', unit: '°C', min: 0, max: 200, step: 1 },
    { key: 'oilLevel', label: 'Oil Level', unit: '%', min: 0, max: 100, step: 1 },
    { key: 'batteryVoltage', label: 'Battery Voltage', unit: 'V', min: 0, max: 16, step: 0.1 },
    { key: 'tirePressure', label: 'Tire Pressure', unit: 'PSI', min: 0, max: 50, step: 1 },
    { key: 'brakeCondition', label: 'Brake Condition', unit: '%', min: 0, max: 100, step: 1 },
    { key: 'rpm', label: 'RPM', unit: 'rpm', min: 0, max: 8000, step: 100 },
  ];

  return (
    <section id="evaluation" className="relative py-24 px-4" style={{ background: 'linear-gradient(180deg, #0a0a0f, #0d1420, #0a0a0f)' }}>
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00ff88] mb-3 block">Live Evaluation</span>
          <h2 className="font-[Orbitron] text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Vehicle Health <span className="neon-text">Assessment</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Enter sensor readings and get an instant AI-powered health evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div
            className="glass-card p-8 transition-all duration-700"
            style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateX(0)' : 'translateX(-40px)' }}
          >
            <h3 className="font-[Orbitron] text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff88]" /> Sensor Input
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-400 mb-1 block">{f.label} ({f.unit})</label>
                  <input
                    type="number"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => handleChange(f.key, e.target.value)}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#00ff88] focus:shadow-[0_0_15px_rgba(0,255,136,0.15)] transition-all"
                  />
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => handleChange(f.key, e.target.value)}
                    className="w-full mt-1 accent-[#00ff88] h-1"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleEvaluate}
              disabled={loading}
              className="gradient-btn w-full mt-6 text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                '🔬 Evaluate Vehicle Health'
              )}
            </button>
          </div>

          {/* Results */}
          <div
            className="glass-card p-8 transition-all duration-700"
            style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateX(0)' : 'translateX(40px)', transitionDelay: '200ms' }}
          >
            <h3 className="font-[Orbitron] text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff88]" /> Evaluation Results
            </h3>

            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-80 text-gray-500">
                <span className="text-5xl mb-4">🔧</span>
                <p className="text-sm">Enter sensor data and click evaluate to see results.</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-80">
                <div className="w-16 h-16 border-4 border-[rgba(0,255,136,0.2)] border-t-[#00ff88] rounded-full animate-spin mb-4" />
                <p className="text-gray-400 text-sm font-[Orbitron]">Processing sensor data...</p>
                <p className="text-gray-600 text-xs mt-2">Running ML evaluation model</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 animate-fade-in">
                <CircularProgress score={result.healthScore} color={result.statusColor} />

                <div className="text-center">
                  <span
                    className="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-wider font-[Orbitron]"
                    style={{
                      background: `${result.statusColor}20`,
                      color: result.statusColor,
                      border: `1px solid ${result.statusColor}40`,
                      boxShadow: `0 0 15px ${result.statusColor}20`,
                    }}
                  >
                    {result.healthStatus}
                  </span>
                </div>

                {/* Alerts */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Alerts</h4>
                  <div className="space-y-2">
                    {result.alerts.map((a, i) => (
                      <div key={i} className="bg-[rgba(255,255,255,0.03)] border border-white/5 rounded-lg px-4 py-2 text-sm text-gray-300">
                        {a}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="bg-[rgba(0,255,136,0.03)] border border-[#00ff88]/10 rounded-lg px-4 py-2 text-sm text-gray-400">
                        💡 {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
