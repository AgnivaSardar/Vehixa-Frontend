import { useEffect, useState } from 'react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: {
    alertType: string;
    severity: string;
    title: string;
    message: string;
  } | null;
}

export default function AlertModal({ isOpen, onClose, alert }: AlertModalProps) {
  const [displayAlert, setDisplayAlert] = useState(alert);

  useEffect(() => {
    if (isOpen && alert) {
      setDisplayAlert(alert);
    }
  }, [isOpen, alert]);

  if (!isOpen || !displayAlert) return null;

  const isCritical = displayAlert.severity === 'critical' || displayAlert.alertType === 'CRITICAL';
  const bgColor = isCritical ? 'from-red-900/20 to-red-950/20' : 'from-orange-900/20 to-orange-950/20';
  const borderColor = isCritical ? 'border-red-500/50' : 'border-orange-500/50';
  const glowColor = isCritical ? 'shadow-[0_0_20px_rgba(255,0,0,0.3)]' : 'shadow-[0_0_20px_rgba(255,165,0,0.3)]';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`bg-gradient-to-br ${bgColor} border ${borderColor} rounded-xl max-w-md w-full ${glowColor} overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${borderColor} bg-gradient-to-r ${
            isCritical ? 'from-red-600/20 to-red-700/20' : 'from-orange-600/20 to-orange-700/20'
          }`}
        >
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isCritical ? 'text-red-300' : 'text-orange-300'}`}>
            {displayAlert.title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-200 text-sm leading-relaxed mb-4">{displayAlert.message}</p>

          <div className="flex items-center gap-2 p-3 bg-black/40 rounded-lg mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase">Status:</span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded ${
                isCritical
                  ? 'bg-red-500/30 text-red-100'
                  : 'bg-orange-500/30 text-orange-100'
              }`}
            >
              {displayAlert.alertType}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/30 flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              isCritical
                ? 'bg-red-600/40 hover:bg-red-600/60 text-red-200'
                : 'bg-orange-600/40 hover:bg-orange-600/60 text-orange-200'
            }`}
          >
            Understand
          </button>
          {isCritical && (
            <button className="flex-1 px-4 py-2 rounded-lg font-semibold bg-red-600/60 hover:bg-red-600/80 text-white transition-all">
              Schedule Service
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
