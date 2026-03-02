import { useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';
import { healthService } from '../services/healthService';
import { vehiclesService } from '../services/vehiclesService';
import AlertModal from './AlertModal';
import type { Vehicle } from '../services/vehiclesService';

interface TelemetryInput {
  engine_rpm: number;
  lub_oil_pressure: number;
  fuel_pressure: number;
  coolant_pressure: number;
  lub_oil_temp: number;
  coolant_temp: number;
}

interface EvaluationResult {
  overallHealth: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  failureProbability: number;
  confidenceScore: number;
  predictedFailureDays: number;
  modelVersion: string;
  components: {
    engine: number;
    transmission: number;
    battery: number;
    cooling: number;
    suspension: number;
  };
  recommendations: string[];
  diagnosticAnalysis?: string;
  topInfluentialFeatures?: string[];
  alert?: {
    alertType: string;
    severity: string;
    title: string;
    message: string;
  } | null;
}

export default function LiveEvaluation() {
  const { ref, isInView } = useInView(0.05);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [telemetry, setTelemetry] = useState<TelemetryInput>({
    engine_rpm: 1000,
    lub_oil_pressure: 4.0,
    fuel_pressure: 15.0,
    coolant_pressure: 2.5,
    lub_oil_temp: 80,
    coolant_temp: 82,
  });

  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<any>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehiclesList = await vehiclesService.getAllVehicles();
        setVehicles(vehiclesList);
        if (vehiclesList.length > 0) {
          setSelectedVehicleId(vehiclesList[0].vehicleId);
        }
      } catch (err) {
        console.error('Failed to fetch vehicles:', err);
      }
    };
    fetchVehicles();
  }, []);

  const handleSliderChange = (key: keyof TelemetryInput, value: number) => {
    setTelemetry((prev) => ({ ...prev, [key]: value }));
  };

  const formatDiagnosticAnalysis = (text: string) => {
    // Handle new backend format: "⚠️ Warning: X parameter(s) out of safe range:\n• param details"
    // or "All parameters within safe operating range."
    
    const outOfRangeParams: string[] = [];
    let parameterInfo = '';

    if (text.includes('All parameters within safe operating range')) {
      // All good - no issues
      parameterInfo = 'All parameters within safe operating range.';
      return { parameterInfo: null, issueInfo: null, outOfRangeParams };
    }

    // Parse new format with bullet points
    if (text.includes('⚠️ Warning:')) {
      const lines = text.split('\n');
      const paramLines = lines.slice(1).filter(line => line.trim().startsWith('•')); // Bullet point lines

      // Extract parameter details
      parameterInfo = paramLines.join('\n');

      // Extract parameter names (e.g., "engine_rpm", "lub_oil_pressure")
      for (const line of paramLines) {
        // Match patterns like "• Engine RPM (2500) above safe range (500-1500)"
        const match = line.match(/•\s*([^(]+)\s*\(/);
        if (match && match[1]) {
          // Convert display name back to parameter name
          const displayName = match[1].trim();
          const paramMap: { [key: string]: string } = {
            'Engine RPM': 'engine_rpm',
            'Oil Pressure': 'lub_oil_pressure',
            'Fuel Pressure': 'fuel_pressure',
            'Coolant Pressure': 'coolant_pressure',
            'Oil Temperature': 'lub_oil_temp',
            'Coolant Temperature': 'coolant_temp'
          };
          const paramName = paramMap[displayName];
          if (paramName) {
            outOfRangeParams.push(paramName);
          }
        }
      }
    }

    return { parameterInfo, issueInfo: null, outOfRangeParams };
  };

  const handleEvaluate = async () => {
    if (!selectedVehicleId) {
      setError('Please select a vehicle');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Call backend ML API for health evaluation
      const evaluation = await healthService.evaluateLive(selectedVehicleId, telemetry);
      setResult(evaluation);
      
      // Show alert modal if alert exists in response
      if (evaluation.alert) {
        setCurrentAlert(evaluation.alert);
        setShowAlertModal(true);
      }
    } catch (err) {
      console.error('Evaluation failed:', err);
      setError('Failed to evaluate vehicle health. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return 'text-green-400';
      case 'MODERATE':
        return 'text-yellow-400';
      case 'HIGH':
        return 'text-orange-400';
      case 'SEVERE':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRiskBgColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return 'bg-green-500/10 border-green-500/30';
      case 'MODERATE':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 border-orange-500/30';
      case 'SEVERE':
        return 'bg-red-500/10 border-red-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#00ff88';
    if (score >= 60) return '#ffaa00';
    if (score >= 40) return '#ff6600';
    return '#ff3333';
  };

  return (
    <section
      id="evaluation"
      className="relative py-24 px-4"
      style={{ background: 'linear-gradient(180deg, #0a0a0f, #0d1420, #0a0a0f)' }}
    >
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00ff88] mb-3 block">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Live Health <span className="neon-text">Evaluation</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Manually input vehicle sensor readings to get real-time health assessment.
          </p>
        </div>

        <div
          className="glass-card p-8 transition-all duration-700 max-w-4xl mx-auto"
          style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(40px)' }}
        >
          {!result ? (
            <>
              <h3 className="text-xl font-semibold text-white mb-8">Input Vehicle Parameters</h3>

              {/* Vehicle Selector */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Select Vehicle
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                >
                  {vehicles.length === 0 ? (
                    <option value="">No vehicles available</option>
                  ) : (
                    vehicles.map((vehicle) => (
                      <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                        {vehicle.vehicleNumber} - {vehicle.manufacturer} {vehicle.model}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Engine RPM */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Engine RPM: <span className="text-[#00ff88]">{Math.round(telemetry.engine_rpm).toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="10"
                    value={telemetry.engine_rpm}
                    onChange={(e) => handleSliderChange('engine_rpm', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-gray-400 mt-1">Safe Range: 500-1500 RPM</div>
                </div>

                {/* Lubrication Oil Pressure */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Oil Pressure: <span className="text-[#00ff88]">{telemetry.lub_oil_pressure.toFixed(1)} bar</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={telemetry.lub_oil_pressure}
                    onChange={(e) => handleSliderChange('lub_oil_pressure', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-gray-400 mt-1">Safe Range: 2.0-6.0 bar</div>
                </div>

                {/* Fuel Pressure */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Fuel Pressure: <span className="text-[#00ff88]">{telemetry.fuel_pressure.toFixed(1)} bar</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.1"
                    value={telemetry.fuel_pressure}
                    onChange={(e) => handleSliderChange('fuel_pressure', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-gray-400 mt-1">Safe Range: 10.0-20.0 bar</div>
                </div>

                {/* Coolant Pressure */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Coolant Pressure: <span className="text-[#00ff88]">{telemetry.coolant_pressure.toFixed(1)} bar</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.1"
                    value={telemetry.coolant_pressure}
                    onChange={(e) => handleSliderChange('coolant_pressure', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-gray-400 mt-1">Safe Range: 1.0-4.0 bar</div>
                </div>

                {/* Lubrication Oil Temperature */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Oil Temperature: <span className="text-[#00ff88]">{telemetry.lub_oil_temp.toFixed(1)}°C</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    step="0.1"
                    value={telemetry.lub_oil_temp}
                    onChange={(e) => handleSliderChange('lub_oil_temp', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-gray-400 mt-1">Safe Range: 60-95°C</div>
                </div>

                {/* Coolant Temperature */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Coolant Temp: <span className="text-[#00ff88]">{telemetry.coolant_temp.toFixed(1)}°C</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    step="0.1"
                    value={telemetry.coolant_temp}
                    onChange={(e) => handleSliderChange('coolant_temp', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-gray-400 mt-1">Safe Range: 75-90°C</div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              <button
                onClick={handleEvaluate}
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#00ff88] to-[#00cc6f] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00ff88]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Evaluating with ML Model...' : '🤖 Evaluate with AI Model'}
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">ML Health Assessment Result</h3>

                <div className={`inline-block px-6 py-4 rounded-lg border ${getRiskBgColor(result.riskLevel)} mb-4`}>
                  <div className="flex items-center justify-center gap-4">
                    <div>
                      <div
                        className="text-5xl font-bold mb-2"
                        style={{ color: getScoreColor(result.overallHealth) }}
                      >
                        {result.overallHealth.toFixed(1)}%
                      </div>
                      <div className={`text-lg font-semibold ${getRiskColor(result.riskLevel)}`}>
                        {result.riskLevel} RISK
                      </div>
                      <div className="text-sm text-gray-400 mt-2">Status: {result.status}</div>
                    </div>
                  </div>
                </div>

                {/* ML Model Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 text-sm">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-gray-400 text-xs">Confidence</div>
                    <div className="text-[#00ff88] font-bold">
                      {(result.confidenceScore * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-gray-400 text-xs">Failure Risk</div>
                    <div className="text-orange-400 font-bold">
                      {(result.failureProbability * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-gray-400 text-xs">Predicted Days</div>
                    <div className="text-blue-400 font-bold">{result.predictedFailureDays}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-gray-400 text-xs">Model</div>
                    <div className="text-purple-400 font-bold text-[10px]">{result.modelVersion}</div>
                  </div>
                </div>

                {/* Diagnostic Analysis */}
                {result.diagnosticAnalysis && (() => {
                  const { parameterInfo } = formatDiagnosticAnalysis(result.diagnosticAnalysis);
                  
                  // If all parameters are safe, show success message
                  if (!parameterInfo) {
                    return (
                      <div className="relative bg-gradient-to-br from-green-500/5 via-transparent to-transparent border border-green-500/20 rounded-lg p-5 mb-6 overflow-hidden shadow-lg">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/30 flex-shrink-0">
                              <span className="text-lg">✅</span>
                            </div>
                            <h4 className="text-base font-bold text-green-400 tracking-wide">Diagnostic Analysis</h4>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                            <p className="text-sm text-green-200 leading-relaxed font-semibold">All parameters within safe operating range.</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Show out-of-range parameters
                  return (
                    <div className="relative bg-gradient-to-br from-[#00ff88]/5 via-transparent to-transparent border border-[#00ff88]/20 rounded-lg p-5 mb-6 overflow-hidden shadow-lg">
                      {/* Background glow effect */}
                      <div className="absolute top-0 left-0 w-32 h-32 bg-[#00ff88]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30 flex-shrink-0">
                            <span className="text-lg">🔬</span>
                          </div>
                          <h4 className="text-base font-bold text-[#00ff88] tracking-wide">Diagnostic Analysis</h4>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Parameter Info */}
                          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                            <div className="text-xs font-semibold text-orange-400 mb-2 flex items-center gap-2">
                              <span>⚠️</span>
                              <span>Out-of-range Parameters</span>
                            </div>
                            <div className="text-sm text-orange-200 leading-relaxed space-y-1.5 whitespace-pre-line">
                              {parameterInfo}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Top Influential Features */}
                {result.topInfluentialFeatures && result.topInfluentialFeatures.length > 0 && (() => {
                  const { outOfRangeParams } = result.diagnosticAnalysis ? formatDiagnosticAnalysis(result.diagnosticAnalysis) : { outOfRangeParams: [] as string[] };
                  return (
                    <div className="relative bg-gradient-to-br from-[#00ff88]/5 via-transparent to-transparent border border-[#00ff88]/20 rounded-lg p-5 mb-6 overflow-hidden shadow-lg">
                      {/* Background glow effect */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff88]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30 flex-shrink-0">
                            <span className="text-lg">📊</span>
                          </div>
                          <h4 className="text-base font-bold text-[#00ff88] tracking-wide">Key Influencing Factors</h4>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {result.topInfluentialFeatures.map((feature, idx) => {
                            const isOutOfRange = outOfRangeParams.includes(feature);
                            const bgColor = isOutOfRange ? 'from-orange-500/15 to-orange-500/5' : 'from-[#00ff88]/15 to-[#00ff88]/5';
                            const textColor = isOutOfRange ? 'text-orange-400' : 'text-[#00ff88]';
                            const borderColor = isOutOfRange ? 'border-orange-500/40' : 'border-[#00ff88]/40';
                            const shadowColor = isOutOfRange ? 'hover:shadow-orange-500/20' : 'hover:shadow-[#00ff88]/20';
                            
                            return (
                              <span 
                                key={idx} 
                                className={`bg-gradient-to-r ${bgColor} ${textColor} text-xs font-semibold px-4 py-2 rounded-full border ${borderColor} shadow-sm ${shadowColor} hover:scale-105 transition-all duration-200`}
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
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {Object.entries(result.components).map(([component, score]) => (
                  <div key={component} className="bg-white/5 p-4 rounded-lg text-center">
                    <div className="text-sm font-semibold text-gray-300 uppercase capitalize mb-2">{component}</div>
                    <div style={{ color: getScoreColor(score) }} className="text-2xl font-bold">
                      {Math.round(score)}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      <div
                        className="w-full h-1 bg-gray-700 rounded-full mt-2"
                        style={{
                          background: `linear-gradient(to right, ${getScoreColor(score)}, transparent)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
                <h4 className="text-lg font-semibold text-white mb-4">🔍 AI Recommendations</h4>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="text-[#00ff88] font-bold mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setError(null);
                  }}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-[#00ff88] to-[#00cc6f] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00ff88]/50 transition-all"
                >
                  New Evaluation
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <AlertModal 
        isOpen={showAlertModal} 
        onClose={() => setShowAlertModal(false)} 
        alert={currentAlert} 
      />
    </section>
  );
}
