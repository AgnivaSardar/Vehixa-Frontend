import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { vehiclesService, healthService } from '../services';

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
        <span className="text-2xl font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { ref, isInView } = useInView(0.05);
  const [timestamp, setTimestamp] = useState('');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [vehicle, setVehicle] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPredictionId, setExpandedPredictionId] = useState<string | null>(null);

  const formatDiagnosticAnalysis = (text: string) => {
    // Split by "Potential issues:" to separate parameter info from issues
    const parts = text.split('Potential issues:');
    const parameterInfo = parts[0]?.replace('Out-of-range parameters:', '').trim();
    const issueInfo = parts[1]?.trim();

    // Extract out-of-range parameter names
    const outOfRangeParams: string[] = [];
    if (parameterInfo) {
      // Match patterns like "engine_rpm (8000) is high" or "coolant_pressure (7) is low"
      const matches = parameterInfo.matchAll(/(\w+)\s*\([^)]+\)\s*is\s*(high|low)/g);
      for (const match of matches) {
        if (match[1]) outOfRangeParams.push(match[1]);
      }
    }

    return { parameterInfo, issueInfo, outOfRangeParams };
  };

  useEffect(() => {
    const update = () => setTimestamp(new Date().toLocaleString());
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch all vehicles on mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const allVehicles = await vehiclesService.getAllVehicles();
        setVehicles(allVehicles);
        if (allVehicles.length > 0) {
          setSelectedVehicleId(allVehicles[0].vehicleId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vehicles');
        console.error('Vehicles error:', err);
      }
    };
    fetchVehicles();
  }, []);

  // Fetch data when selected vehicle changes
  useEffect(() => {
    if (!selectedVehicleId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Find selected vehicle
        const currentVehicle = vehicles.find(v => v.vehicleId === selectedVehicleId);
        setVehicle(currentVehicle);
        
        // Fetch all health predictions for this vehicle only
        const allPredictions = await healthService.getAllPredictions(selectedVehicleId);
        setPredictions(allPredictions);
        
        // Set latest prediction as current health
        if (allPredictions.length > 0) {
          const latest = allPredictions[0];
          setHealth({
            overallHealth: latest.healthScore,
            riskLevel: latest.riskLevel,
            components: {
              engine: 85, // These could be extracted from telemetry if needed
              battery: 90,
            }
          });
        } else {
          setHealth(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedVehicleId, vehicles]);

  return (
    <section id="dashboard" className="relative py-24 px-4" style={{ background: '#0a0a0f' }}>
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Vehicle Selector */}
        {vehicles.length > 0 && (
          <div className="mb-8 max-w-md mx-auto">
            <label className="block text-sm font-semibold text-gray-300 mb-2 text-center">
              Select Vehicle
            </label>
            <div className="flex gap-2">
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
              >
                {vehicles.map((v) => (
                  <option key={v.vehicleId} value={v.vehicleId}>
                    {v.vehicleNumber || 'Unknown'} - {v.manufacturer} {v.model} ({v.year})
                  </option>
                ))}
              </select>
              <Link
                to="/register-vehicle"
                className="px-4 py-3 bg-[#00ff88] text-black font-semibold rounded-lg hover:bg-[#00dd77] transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <span>+</span> Add
              </Link>
            </div>
          </div>
        )}

        {/* Top row: Gauge + Vehicle Info */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}
        >
          {/* Vehicle Info */}
          <div className="glass-card p-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Vehicle Info</h3>
            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {vehicle && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Vehicle ID</span>
                  <span className="text-white font-mono">{vehicle.vehicleId?.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Model</span>
                  <span className="text-white">{vehicle.manufacturer} {vehicle.model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Year</span>
                  <span className="text-white font-mono">{vehicle.year}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-[#00ff88] font-mono text-xs">{timestamp}</span>
                </div>
              </div>
            )}
          </div>

          {/* Health Gauge */}
          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Health Score</h3>
            {loading && <p className="text-gray-500">Loading...</p>}
            {health && (
              <>
                <GaugeChart score={health.overallHealth || 0} />
                <span className="inline-block mt-4 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider bg-[#00ff8820] text-[#00ff88] border border-[#00ff8840]">
                  {health.riskLevel?.toUpperCase() || 'UNKNOWN'}
                </span>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Quick Stats</h3>
            {loading && <p className="text-gray-500">Loading...</p>}
            {health && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Overall Health</span>
                    <span className="text-[#00ff88]">{health.overallHealth}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00ff88] rounded-full transition-all duration-1000" style={{ width: isInView ? `${health.overallHealth}%` : '0%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Engine Health</span>
                    <span className="text-[#4ade80]">{health.components?.engine || 0}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#4ade80] rounded-full transition-all duration-1000" style={{ width: isInView ? `${health.components?.engine || 0}%` : '0%', transitionDelay: '200ms' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Battery Health</span>
                    <span className="text-[#ffaa00]">{health.components?.battery || 0}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ffaa00] rounded-full transition-all duration-1000" style={{ width: isInView ? `${health.components?.battery || 0}%` : '0%', transitionDelay: '400ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Health History Analytics */}
        <div
          className="glass-card p-6"
          style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.9s ease 0.2s' }}
        >
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-6">Evaluation History</h3>
          {loading && <p className="text-gray-500">Loading...</p>}
          {!loading && predictions.length === 0 && (
            <p className="text-gray-500 text-center py-8">No evaluations yet. Try the Live Evaluation feature!</p>
          )}
          {predictions.length > 0 && (
            <div className="space-y-4">
              {predictions.slice(0, 10).map((pred, idx) => {
                const date = new Date(pred.createdAt);
                const scoreColor = pred.healthScore >= 80 ? '#00ff88' : pred.healthScore >= 60 ? '#ffaa00' : '#ff3344';
                const riskColor = 
                  pred.riskLevel === 'LOW' ? 'bg-green-500/20 text-green-400' :
                  pred.riskLevel === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400' :
                  pred.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400';
                const isExpanded = expandedPredictionId === pred.predictionId;

                return (
                  <div key={pred.predictionId} className="bg-white/5 rounded-lg border border-white/10 hover:border-[#00ff88]/30 transition-all">
                    <button
                      onClick={() => setExpandedPredictionId(isExpanded ? null : pred.predictionId)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-gray-500 text-xs font-mono w-32">
                          {date.toLocaleDateString()} <br />
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xl font-bold" style={{ color: scoreColor }}>
                              {pred.healthScore}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${riskColor}`}>
                              {pred.riskLevel}
                            </span>
                            <span className="text-xs text-gray-500">{pred.status}</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-1000" 
                              style={{ 
                                width: `${pred.healthScore}%`,
                                backgroundColor: scoreColor,
                                transitionDelay: `${idx * 50}ms`
                              }} 
                            />
                          </div>
                        </div>
                      </div>
                      {pred.predictedFailureDays !== null && (
                        <div className="text-right ml-4">
                          <div className="text-xs text-gray-500">Predicted Service</div>
                          <div className="text-sm text-[#00ff88] font-semibold">
                            {pred.predictedFailureDays > 0 ? `${pred.predictedFailureDays} days` : 'Now'}
                          </div>
                        </div>
                      )}
                      <div className="ml-4 text-gray-400">
                        <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-white/10 p-4 space-y-4 bg-black/20">
                        {/* Failure Probability */}
                        <div className="bg-white/5 rounded p-3">
                          <div className="text-xs text-gray-400 mb-1">Failure Probability</div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-orange-400">
                              {(pred.failureProbability * 100).toFixed(1)}%
                            </span>
                            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500" 
                                style={{ 
                                  width: `${pred.failureProbability * 100}%`,
                                  backgroundColor: pred.failureProbability > 0.75 ? '#ff3344' : pred.failureProbability > 0.5 ? '#ffaa00' : '#4ade80'
                                }} 
                              />
                            </div>
                          </div>
                        </div>

                        {/* Diagnostic Analysis */}
                        {pred.diagnosticAnalysis && (() => {
                          const { parameterInfo, issueInfo } = formatDiagnosticAnalysis(pred.diagnosticAnalysis);
                          return (
                            <div className="relative bg-gradient-to-br from-[#00ff88]/5 via-transparent to-transparent border border-[#00ff88]/20 rounded-lg p-4 overflow-hidden">
                              <div className="absolute top-0 left-0 w-24 h-24 bg-[#00ff88]/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                              <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex items-center justify-center w-6 h-6 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 flex-shrink-0">
                                    <span className="text-sm">🔬</span>
                                  </div>
                                  <div className="text-xs text-[#00ff88] font-bold tracking-wide">Diagnostic Analysis</div>
                                </div>
                                
                                <div className="space-y-2">
                                  {/* Parameter Info */}
                                  {parameterInfo && (
                                    <div className="bg-orange-500/10 border border-orange-500/30 rounded p-2">
                                      <div className="text-[10px] font-semibold text-orange-400 mb-1 flex items-center gap-1.5">
                                        <span>⚠️</span>
                                        <span>Out-of-range Parameters</span>
                                      </div>
                                      <p className="text-xs text-orange-200 leading-relaxed font-mono">{parameterInfo}</p>
                                    </div>
                                  )}
                                  
                                  {/* Issue Info */}
                                  {issueInfo && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                                      <div className="text-[10px] font-semibold text-red-400 mb-1 flex items-center gap-1.5">
                                        <span>🚨</span>
                                        <span>Potential Issues</span>
                                      </div>
                                      <p className="text-xs text-red-200 leading-relaxed font-semibold">{issueInfo}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Top Influential Features */}
                        {pred.topInfluentialFeatures && pred.topInfluentialFeatures.length > 0 && (() => {
                          const { outOfRangeParams } = pred.diagnosticAnalysis ? formatDiagnosticAnalysis(pred.diagnosticAnalysis) : { outOfRangeParams: [] as string[] };
                          return (
                            <div className="relative bg-gradient-to-br from-[#00ff88]/5 via-transparent to-transparent border border-[#00ff88]/20 rounded-lg p-4 overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff88]/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                              <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex items-center justify-center w-6 h-6 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 flex-shrink-0">
                                    <span className="text-sm">📊</span>
                                  </div>
                                  <div className="text-xs text-[#00ff88] font-bold tracking-wide">Key Influencing Factors</div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {pred.topInfluentialFeatures.map((feature: string, i: number) => {
                                    const isOutOfRange = outOfRangeParams.includes(feature);
                                    const bgColor = isOutOfRange ? 'from-orange-500/15 to-orange-500/5' : 'from-[#00ff88]/15 to-[#00ff88]/5';
                                    const textColor = isOutOfRange ? 'text-orange-400' : 'text-[#00ff88]';
                                    const borderColor = isOutOfRange ? 'border-orange-500/40' : 'border-[#00ff88]/40';
                                    const shadowColor = isOutOfRange ? 'hover:shadow-orange-500/20' : 'hover:shadow-[#00ff88]/20';
                                    
                                    return (
                                      <span 
                                        key={i} 
                                        className={`bg-gradient-to-r ${bgColor} ${textColor} text-[10px] font-semibold px-3 py-1.5 rounded-full border ${borderColor} shadow-sm ${shadowColor} hover:scale-105 transition-all duration-200`}
                                      >
                                        {isOutOfRange && <span className="mr-1">⚠️</span>}
                                        {feature.replace(/_/g, ' ')}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Model Info */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          <div className="bg-white/5 rounded p-2">
                            <div className="text-gray-400">Confidence</div>
                            <div className="text-[#00ff88] font-semibold">{(pred.confidenceScore * 100).toFixed(1)}%</div>
                          </div>
                          <div className="bg-white/5 rounded p-2">
                            <div className="text-gray-400">Model</div>
                            <div className="text-purple-400 font-semibold text-[10px]">{pred.modelVersion}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {predictions.length > 10 && (
            <div className="text-center mt-6">
              <button 
                onClick={() => navigate('/live-evaluation')}
                className="text-[#00ff88] text-sm hover:underline cursor-pointer"
              >
                View All {predictions.length} Evaluations →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
