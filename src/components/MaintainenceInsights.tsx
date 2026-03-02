import { useInView } from "../hooks/useInView";
import { useState, useEffect } from "react";
import { Lightbulb, Clock } from "lucide-react";
import { recommendationsService } from "../services";
import type { Recommendation } from "../services";

const urgencyColors: Record<string, string> = {
  high: '#ff3344',
  medium: '#ffaa00',
  low: '#00ff88',
};

export default function MaintenanceInsights() {
  const { ref, isInView } = useInView(0.05);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const { vehiclesService } = await import('../services');
        const vehicles = await vehiclesService.getAllVehicles();
        if (vehicles.length > 0) {
          const recs = await recommendationsService.getRecommendations(vehicles[0].vehicleId);
          setRecommendations(recs);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recommendations');
        console.error('Recommendations error:', err);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <section className="relative py-24 px-4" style={{ background: '#0a0a0f' }}>
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00ff88] mb-3 block">AI Insights</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Maintenance <span className="neon-text">Insights</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            AI-powered maintenance recommendations based on real-time sensor data and predictive models.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-gray-500">
            <p>Loading recommendations...</p>
          </div>
        )}

        {!loading && recommendations.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No maintenance recommendations at this time.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendations.map((rec, i) => (
            <div
              key={rec.id}
              className="glass-card p-6 transition-all duration-500 hover:-translate-y-1 group"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-[#00ff88]">
                  <Lightbulb size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#00ff88] transition-colors">
                      {rec.title}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: `${urgencyColors[rec.severity]}15`,
                        color: urgencyColors[rec.severity],
                        border: `1px solid ${urgencyColors[rec.severity]}30`,
                      }}
                    >
                      {rec.severity}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    {rec.description}
                  </p>
                  {rec.estimatedCost && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>Estimated Cost: </span>
                      <span className="font-mono text-gray-300">${rec.estimatedCost}</span>
                    </div>
                  )}
                  {rec.recommendedDate && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={14} />
                      <span>Recommended by: </span>
                      <span className="font-mono text-gray-300">{new Date(rec.recommendedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
