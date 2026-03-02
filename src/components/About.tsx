import { useInView } from '../hooks/useInView';
import { Search, Brain, BarChart3, Sparkles } from 'lucide-react';

const cards = [
  {
    icon: Search,
    title: 'Vehicle Health Evaluation',
    desc: 'Comprehensive real-time assessment of vehicle operational condition using multi-parameter sensor data analysis and intelligent scoring algorithms.',
  },
  {
    icon: Brain,
    title: 'Rule-Based & ML-Driven',
    desc: 'Hybrid evaluation engine combining deterministic rule-based logic with machine learning models trained on millions of vehicle health data points.',
  },
  {
    icon: BarChart3,
    title: 'Health Classification System',
    desc: 'Dynamic classification into Excellent, Good, Warning, and Critical states with weighted scoring across engine, battery, brakes, and more.',
  },
  {
    icon: Sparkles,
    title: 'Predictive Maintenance',
    desc: 'Anticipate failures before they occur. Our predictive models forecast component degradation and recommend maintenance schedules proactively.',
  },
];

export default function About() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="about" className="relative py-24 px-4" style={{ background: 'linear-gradient(180deg, #0a0a0f, #0d1117, #0a0a0f)' }}>
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00ff88] mb-3 block">About</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Intelligent <span className="neon-text">Health</span> Monitoring
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Vehixa combines cutting-edge machine learning with automotive telemetry to deliver real-time vehicle health intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="glass-card p-8 transition-all duration-500 cursor-default group"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div className="text-[#00ff88] mb-4">
                <card.icon size={40} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#00ff88] transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
