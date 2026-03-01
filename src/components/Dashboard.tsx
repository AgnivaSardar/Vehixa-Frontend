import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useInView } from '../hooks/useInView';

const mockHistory = [
  { time: '00:00', score: 88, engine: 90, battery: 12.6, oil: 80, brake: 70 },
  { time: '04:00', score: 85, engine: 93, battery: 12.5, oil: 78, brake: 68 },
  { time: '08:00', score: 82, engine: 96, battery: 12.4, oil: 75, brake: 65 },
  { time: '12:00', score: 79, engine: 98, battery: 12.3, oil: 72, brake: 62 },
  { time: '16:00', score: 76, engine: 101, battery: 12.2, oil: 68, brake: 58 },
  { time: '20:00', score: 78, engine: 97, battery: 12.4, oil: 70, brake: 60 },
  { time: '24:00', score: 81, engine: 94, battery: 12.5, oil: 73, brake: 63 },
];

function GaugeChart({ score }: { score: number }) {
  const angle = (score / 100) * 180;
  const color = score >= 80 ? '#00ff88' : score >= 60 ? '#4ade80' : score >= 35 ? '#ffaa00' : '#ff3344';

  return (
    <div className="relative w-48 h-28 mx-auto">
      <svg viewBox="0 0 200 110" className="w-full h-full">
        {/* Background arc */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round" />
        {/* Value arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 251.3} 251.3`}
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 1s ease' }}
        />
        {/* Needle */}
        <line
          x1="100" y1="100"
          x2={100 + 60 * Math.cos(Math.PI - (angle * Math.PI) / 180)}
          y2={100 - 60 * Math.sin(Math.PI - (angle * Math.PI) / 180)}
          stroke={color} strokeWidth="2.5" strokeLinecap="round"
          style={{ transition: 'all 1s ease' }}
        />
        <circle cx="100" cy="100" r="5" fill={color} />
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <span className="font-[Orbitron] text-2xl font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

const paramCards = [
  { label: 'Engine Temp', value: '94°C', icon: '🌡️', status: 'normal' },
  { label: 'Oil Level', value: '73%', icon: '🛢️', status: 'normal' },
  { label: 'Battery', value: '12.5V', icon: '🔋', status: 'normal' },
  { label: 'Tire Pressure', value: '32 PSI', icon: '🛞', status: 'normal' },
  { label: 'Brake Pads', value: '63%', icon: '🛑', status: 'warning' },
  { label: 'RPM', value: '850', icon: '🔄', status: 'normal' },
];

export default function Dashboard() {
  const { ref, isInView } = useInView(0.05);
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const update = () => setTimestamp(new Date().toLocaleString());
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="dashboard" className="relative py-24 px-4" style={{ background: '#0a0a0f' }}>
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00ff88] mb-3 block">Dashboard</span>
          <h2 className="font-[Orbitron] text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Vehicle <span className="neon-text">Dashboard</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Real-time monitoring and analytics at a glance.
          </p>
        </div>

        {/* Top row: Gauge + Vehicle Info */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}
        >
          {/* Vehicle Info */}
          <div className="glass-card p-6">
            <h3 className="font-[Orbitron] text-xs uppercase tracking-wider text-gray-500 mb-4">Vehicle Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Vehicle ID</span>
                <span className="text-white font-mono">AV-2024-X7R</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Model</span>
                <span className="text-white">Tesla Model S</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mileage</span>
                <span className="text-white font-mono">42,850 km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Service</span>
                <span className="text-white">2024-11-15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Updated</span>
                <span className="text-[#00ff88] font-mono text-xs">{timestamp}</span>
              </div>
            </div>
          </div>

          {/* Health Gauge */}
          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <h3 className="font-[Orbitron] text-xs uppercase tracking-wider text-gray-500 mb-4">Health Score</h3>
            <GaugeChart score={81} />
            <span className="inline-block mt-4 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider font-[Orbitron] bg-[#00ff8820] text-[#00ff88] border border-[#00ff8840]">
              GOOD
            </span>
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-6">
            <h3 className="font-[Orbitron] text-xs uppercase tracking-wider text-gray-500 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Overall Health</span>
                  <span className="text-[#00ff88]">81%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00ff88] rounded-full transition-all duration-1000" style={{ width: isInView ? '81%' : '0%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Engine Health</span>
                  <span className="text-[#4ade80]">76%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4ade80] rounded-full transition-all duration-1000" style={{ width: isInView ? '76%' : '0%', transitionDelay: '200ms' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Brake System</span>
                  <span className="text-[#ffaa00]">63%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ffaa00] rounded-full transition-all duration-1000" style={{ width: isInView ? '63%' : '0%', transitionDelay: '400ms' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Battery Health</span>
                  <span className="text-[#00ff88]">88%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00ff88] rounded-full transition-all duration-1000" style={{ width: isInView ? '88%' : '0%', transitionDelay: '600ms' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
          style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease 0.3s' }}
        >
          <div className="glass-card p-6">
            <h3 className="font-[Orbitron] text-xs uppercase tracking-wider text-gray-500 mb-4">Health Score Trend (24h)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={mockHistory}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#555" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 100]} stroke="#555" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '12px', fontSize: 12 }}
                  labelStyle={{ color: '#00ff88' }}
                />
                <Area type="monotone" dataKey="score" stroke="#00ff88" fill="url(#scoreGrad)" strokeWidth={2} dot={{ fill: '#00ff88', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-[Orbitron] text-xs uppercase tracking-wider text-gray-500 mb-4">Parameter Trends (24h)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#555" tick={{ fontSize: 11 }} />
                <YAxis stroke="#555" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '12px', fontSize: 12 }}
                  labelStyle={{ color: '#00ff88' }}
                />
                <Line type="monotone" dataKey="oil" stroke="#00ff88" strokeWidth={2} dot={false} name="Oil %" />
                <Line type="monotone" dataKey="brake" stroke="#ffaa00" strokeWidth={2} dot={false} name="Brake %" />
                <Line type="monotone" dataKey="engine" stroke="#ff3344" strokeWidth={2} dot={false} name="Eng °C" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parameter Cards */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease 0.5s' }}
        >
          {paramCards.map((p, i) => (
            <div
              key={i}
              className="glass-card p-4 text-center transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-2xl mb-2">{p.icon}</div>
              <div className="font-[Orbitron] text-lg font-bold text-white">{p.value}</div>
              <div className="text-xs text-gray-500 mt-1">{p.label}</div>
              <div className={`w-2 h-2 rounded-full mx-auto mt-2 ${p.status === 'warning' ? 'bg-[#ffaa00]' : 'bg-[#00ff88]'}`}
                style={{ boxShadow: p.status === 'warning' ? '0 0 8px #ffaa00' : '0 0 8px #00ff88' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
