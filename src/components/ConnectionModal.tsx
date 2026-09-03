import React, { useState } from 'react';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReconnect: () => void;
  onWorkOffline: () => void;
  isRealSupabaseConnected: boolean;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  onReconnect,
  onWorkOffline,
  isRealSupabaseConnected
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [pingMs, setPingMs] = useState(24);

  if (!isOpen) return null;

  const handleManualReconnect = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      setPingMs(Math.floor(Math.random() * 15) + 18);
      onReconnect();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0d112a] border border-white/20 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col gap-4 overflow-hidden my-auto">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-52 h-52 rounded-full bg-[#4cd7f6]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-[#2f3aa3]/30 blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1a1e37] border border-white/10 flex items-center justify-center text-[#bcc9cd] hover:text-[#dee0ff] z-20"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#161a33] border border-[#4cd7f6]/40">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">hub</span>
              <span className="absolute w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping opacity-75"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#bcc9cd] uppercase tracking-wider">
                Nodo Telemetría
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-bold text-[#dee0ff]">
                Salón 317 · Control Maestro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161a33] border border-[#4ae176]/30 shadow-inner mr-8">
            <span className="w-2 h-2 rounded-full bg-[#4ae176] shadow-[0_0_8px_rgba(74,225,118,0.8)]"></span>
            <span className="text-[10px] font-bold text-[#4ae176] uppercase tracking-wider">
              {isRealSupabaseConnected ? 'SUPABASE CLOUD' : 'EN VIVO'}
            </span>
          </div>
        </div>

        {/* Radar and ECG Monitor Circle */}
        <div className="relative flex flex-col items-center text-center z-10 py-3">
          <div className="relative flex items-center justify-center w-36 h-36 mb-4">
            {/* Pulsing concentric rings */}
            <div className="absolute inset-0 rounded-full bg-[#06b6d4]/10 animate-ping"></div>
            <div className="absolute inset-3 rounded-full bg-[#2f3aa3]/20 border border-[#4cd7f6]/20"></div>
            <div className="absolute inset-6 rounded-full bg-[#4ae176]/10 border border-[#4ae176]/30"></div>

            {/* Glowing Core */}
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#2f334e]/90 via-[#1a1e37]/80 to-[#080c25]/90 border border-[#4cd7f6]/60 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.45)]">
              {/* ECG SVG */}
              <svg className="absolute inset-0 w-full h-full p-2 pointer-events-none" viewBox="0 0 100 100">
                <path
                  d="M 10 50 L 30 50 L 37 36 L 44 64 L 50 24 L 57 72 L 64 50 L 71 44 L 76 50 L 90 50"
                  fill="none"
                  stroke="#4cd7f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-pulse"
                />
              </svg>
              <span className="material-symbols-outlined text-[#4cd7f6] text-[32px] animate-pulse">
                desktop_windows
              </span>
            </div>
          </div>

          <h2 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl text-[#dee0ff] font-bold mb-1 tracking-tight">
            Conectando canal en tiempo real...
          </h2>
          <p className="text-xs text-[#bcc9cd] max-w-[280px] leading-relaxed mb-4">
            Estableciendo WebSocket con Supabase · Escuchando cambios en la tabla{' '}
            <span className="text-[#4cd7f6] font-mono font-semibold">equipos_salon_317</span>
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080c25]/90 border border-white/10 backdrop-blur-md shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ae176] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ae176]"></span>
            </span>
            <span className="text-[11px] font-mono text-[#bcc9cd] font-medium tracking-wide">
              Latencia: <strong className="text-[#dee0ff] font-semibold">{pingMs}ms</strong> · Reintentos:{' '}
              <strong className="text-[#dee0ff] font-semibold">0</strong> ·{' '}
              <span className="text-[#4cd7f6] font-semibold">Sincronizado</span>
            </span>
          </div>
        </div>

        {/* Shimmer Equipment Scanning Bars */}
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-[#bcc9cd] tracking-wider uppercase">
              ESCANEO DE EQUIPAMIENTO SALÓN
            </span>
            <span className="text-[10px] font-bold text-[#4cd7f6] animate-pulse uppercase tracking-wider">
              SONDEANDO
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="relative w-full h-11 rounded-xl bg-[#161a33]/60 border border-white/5 overflow-hidden flex items-center px-3 gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-[#242842] flex-shrink-0 animate-pulse"></div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-2 w-2/5 rounded bg-[#242842] animate-pulse"></div>
                  <div className="h-1.5 w-1/4 rounded bg-[#1a1e37] animate-pulse"></div>
                </div>
                <div className="h-3 w-12 rounded-full bg-[#14bf59]/20"></div>
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[#4cd7f6]/10 to-transparent"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2 relative z-10">
          <button
            type="button"
            onClick={handleManualReconnect}
            className="w-full h-12 rounded-xl bg-[#06b6d4]/20 border border-[#4cd7f6]/40 hover:bg-[#06b6d4]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(6,182,212,0.35)]"
          >
            <span
              className={`material-symbols-outlined text-[#4cd7f6] text-[20px] ${
                isSpinning ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
            <span className="text-xs font-bold text-[#4cd7f6] tracking-wide">
              Reconectar manualmente
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onWorkOffline();
              onClose();
            }}
            className="w-full h-11 rounded-xl bg-[#161a33] hover:bg-[#1a1e37] border border-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[#bcc9cd] text-[18px]">
              cloud_off
            </span>
            <span className="text-xs font-semibold text-[#dee0ff]">
              Trabajar en modo offline (Caché local)
            </span>
          </button>

          <p className="text-center text-[10px] font-mono text-[#bcc9cd]/60 mt-1">
            ID de Instancia: SUPA-RT-317-ALPHA · Protocolo v2.4
          </p>
        </div>
      </div>
    </div>
  );
};
