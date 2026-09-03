import React, { useState } from 'react';
import { Device, HistoryEvent } from '../types';

interface DetalleEquipoScreenProps {
  device: Device;
  events: HistoryEvent[];
  onBack: () => void;
  onToggleStatus: (deviceId: string) => void;
  onEditReport: (deviceId: string) => void;
  onCallSupport: () => void;
}

export const DetalleEquipoScreen: React.FC<DetalleEquipoScreenProps> = ({
  device,
  events,
  onBack,
  onToggleStatus,
  onEditReport,
  onCallSupport
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isFalla = device.status === 'falla';

  const handleResolveClick = () => {
    onToggleStatus(device.id);
    const msg = isFalla
      ? `Equipo ${device.id} marcado como OPERATIVO en Supabase`
      : `Incidencia reabierta para ${device.id}`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col w-full relative pb-36">
      {/* Subtle Ambient Refraction Spotlights */}
      <div className={`absolute -top-10 -right-10 w-64 h-64 ${isFalla ? 'bg-[#ffb4ab]/20' : 'bg-[#4ae176]/15'} rounded-full blur-3xl pointer-events-none -z-10 animate-pulse`}></div>
      <div className="absolute top-72 -left-12 w-56 h-56 bg-[#4cd7f6]/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Breadcrumb & Context Navigation */}
      <div className="flex items-center justify-between pt-1 pb-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver a Salón 317"
          className="h-10 px-4 rounded-full bg-[#1a1e37]/80 hover:bg-[#242842] border border-white/10 backdrop-blur-xl flex items-center gap-1.5 text-[#dee0ff] transition-all active:scale-95 shadow-md"
        >
          <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">arrow_back</span>
          <span className="text-[13px] font-semibold">Salón {device.roomId || '317'}</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#080c25]/80 border border-white/10 backdrop-blur-md">
          <span className={`inline-block w-2 h-2 rounded-full ${isFalla ? 'bg-[#ffb4ab] animate-ping' : 'bg-[#4ae176]'}`}></span>
          <span className="text-[10px] font-bold text-[#bcc9cd] tracking-wider uppercase">
            Enlace Telemetría
          </span>
        </div>
      </div>

      {/* Equipment Identity Header */}
      <div className="flex flex-col gap-0.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#4cd7f6] tracking-widest uppercase">
            Estación de Trabajo
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#3d494c]"></span>
          <span className="text-[11px] font-medium text-[#bcc9cd]">
            Nodo #{device.subId}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-[#dee0ff] tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.08)]">
            {device.id}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-[#242842] border border-white/10 text-[#bcc9cd] text-[10px] font-mono uppercase font-bold">
            Rev. 2.4
          </span>
        </div>
      </div>

      {/* 1. Current State Hero Card (High Impact Glassmorphism) */}
      <section
        className={`relative rounded-2xl p-5 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden border ${
          isFalla
            ? 'bg-gradient-to-br from-[#93000a]/40 via-[#242842]/70 to-[#161a33]/90 border-[#ffb4ab]/40 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
            : 'bg-gradient-to-br from-[#14bf59]/30 via-[#242842]/70 to-[#161a33]/90 border-[#4ae176]/40 shadow-[0_0_30px_rgba(74,225,118,0.25)]'
        }`}
      >
        {/* Top Light Incidence Highlight */}
        <div
          className={`absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent ${
            isFalla ? 'via-[#ffb4ab]/60' : 'via-[#4ae176]/60'
          } to-transparent`}
        ></div>

        <div className="flex flex-col gap-3">
          {/* Status Badge Row */}
          <div className="flex items-center justify-between">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border shadow-md ${
                isFalla
                  ? 'bg-[#93000a]/80 border-[#ffb4ab]/60 text-[#ffdad6] shadow-[0_0_16px_rgba(239,68,68,0.4)]'
                  : 'bg-[#14bf59]/30 border-[#4ae176]/60 text-[#6bff8f] shadow-[0_0_16px_rgba(74,225,118,0.3)]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">
                {isFalla ? 'warning' : 'check_circle'}
              </span>
              <span>{isFalla ? 'CON FALLA' : 'OPERATIVO'}</span>
            </div>

            <span className={`text-[12px] flex items-center gap-1 font-medium ${isFalla ? 'text-[#ffb4ab]' : 'text-[#4ae176]'}`}>
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {device.reportedAt || 'Tiempo real'}
            </span>
          </div>

          {/* Incident Title & Core Diagnostic */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold text-[#bcc9cd] uppercase tracking-wider">
              Incidencia Notificada
            </span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dee0ff] tracking-normal flex items-start gap-1.5">
              <span className={`material-symbols-outlined text-[20px] mt-0.5 ${isFalla ? 'text-[#ffb4ab]' : 'text-[#4ae176]'}`}>
                {isFalla ? 'desktop_access_disabled' : 'task_alt'}
              </span>
              <span>{device.issueTitle || 'Equipo funcionando en parámetros normales'}</span>
            </h3>
          </div>

          {/* Reporter Metadata Plate */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#080c25]/70 border border-white/5 backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-[#2f3aa3] border border-[#bdc2ff]/40 flex items-center justify-center text-[#dee0ff] text-sm font-bold shadow-inner flex-shrink-0">
              CM
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] text-[#dee0ff] font-semibold truncate">
                {device.reportedBy || 'Prof. Carlos Mendoza'}
              </span>
              <span className="text-[11px] text-[#bcc9cd] truncate">
                Clase de Redes II · Turno Mañana
              </span>
            </div>
          </div>

          {/* Station Telemetry / Specs Strip */}
          <div className="pt-1 flex flex-wrap gap-2 text-[#bcc9cd]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#dee0ff] text-[12px]">
              <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">memory</span>
              Core i7 12th Gen
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#dee0ff] text-[12px]">
              <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">speed</span>
              16GB RAM
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#dee0ff] text-[12px]">
              <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">grid_view</span>
              {device.location || 'Fila 2, Puesto 4'}
            </div>
          </div>
        </div>
      </section>

      {/* Realtime Telemetry Waveform Visualizer Decorator */}
      <div className="mt-3.5 rounded-2xl p-3.5 bg-[#161a33]/70 border border-white/10 backdrop-blur-md flex items-center justify-between shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">equalizer</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#bcc9cd] uppercase tracking-wider">
              Señal HDMI / Bus DVI
            </span>
            <span className={`text-[12px] font-semibold ${isFalla ? 'text-[#ffb4ab]' : 'text-[#4ae176]'}`}>
              {isFalla ? 'Intermitencia crítica (0.3 Hz)' : 'Transmisión estable (60.0 Hz)'}
            </span>
          </div>
        </div>

        {/* Mini SVG Signal Waveform */}
        <svg
          className={`w-24 h-6 ${isFalla ? 'text-[#ffb4ab]' : 'text-[#4ae176]'} opacity-90`}
          fill="none"
          viewBox="0 0 96 24"
        >
          <path
            d="M0 12h12l3-8 4 16 3-8h8l3-11 3 20 4-9h10l3-5 3 10 3-5h12l2-3 2 6 2-3h16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* 2. Real-time Event Log (CDC / Supabase Style Stream) */}
      <section className="mt-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">dynamic_feed</span>
            <h4 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dee0ff]">
              Historial de Eventos
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4ae176] shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
            <span className="text-[10px] font-bold text-[#4ae176] uppercase tracking-wider">
              CDC Sincronizado
            </span>
          </div>
        </div>

        {/* Timeline Wafer Stack */}
        <div className="relative flex flex-col gap-2.5 mt-1">
          {/* Connecting Neon Line */}
          <div className="absolute left-6 top-5 bottom-5 w-0.5 bg-gradient-to-b from-[#ffb4ab] via-[#4ae176] to-white/10 opacity-40"></div>

          {events.map((evt, idx) => {
            const isError = evt.badgeType === 'error';
            const isSuccess = evt.badgeType === 'success';

            return (
              <div
                key={evt.id || idx}
                className="relative flex items-start gap-3 p-3 rounded-xl bg-[#1a1e37]/60 border border-white/10 backdrop-blur-xl transition-all shadow-md"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border ${
                    isError
                      ? 'bg-[#93000a] border-[#ffb4ab] text-[#ffb4ab] shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                      : isSuccess
                      ? 'bg-[#14bf59]/30 border-[#4ae176] text-[#4ae176] shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                      : 'bg-[#242842] border-[#4cd7f6] text-[#4cd7f6]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {isError ? 'report_problem' : isSuccess ? 'build_circle' : 'task_alt'}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[13px] font-bold ${
                        isError ? 'text-[#ffb4ab]' : isSuccess ? 'text-[#4ae176]' : 'text-[#dee0ff]'
                      }`}
                    >
                      {evt.title}
                    </span>
                    <span className="text-[11px] text-[#bcc9cd] font-mono">
                      {evt.timestamp}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#bcc9cd] leading-snug">
                    {evt.description}
                  </p>
                  <span className="text-[10px] font-mono text-[#bcc9cd]/70 mt-0.5">
                    {evt.logId ? `Log ID: ${evt.logId}` : evt.author}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Thumb-Zone Floating Action Dock */}
      <aside className="fixed bottom-0 inset-x-0 z-40 px-4 pb-safe pt-2 bg-gradient-to-t from-[#0d112a] via-[#080c25]/95 to-transparent backdrop-blur-2xl">
        <div className="max-w-md mx-auto flex flex-col gap-2 mb-3">
          {/* Primary Resolution Trigger */}
          <button
            type="button"
            onClick={handleResolveClick}
            className={`w-full min-h-[52px] h-[52px] px-4 rounded-2xl font-['Plus_Jakarta_Sans'] text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              isFalla
                ? 'bg-[#4ae176] text-[#003915] shadow-[0_0_24px_rgba(74,222,128,0.45)] hover:brightness-110'
                : 'bg-[#2f334e] text-[#dee0ff] border border-white/20 hover:bg-[#343752]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isFalla ? 'check_circle' : 'replay'}
            </span>
            <span>{isFalla ? 'Marcar como Operativo / Resuelto' : 'Reabrir Incidencia'}</span>
          </button>

          {/* Secondary Split Control Deck */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onEditReport(device.id)}
              className="h-12 px-3 rounded-xl bg-[#242842]/90 border border-white/10 text-[#dee0ff] text-xs font-semibold flex items-center justify-center gap-1.5 backdrop-blur-xl active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[19px] text-[#bdc2ff]">edit_note</span>
              <span className="truncate">Editar Reporte</span>
            </button>

            <button
              type="button"
              onClick={onCallSupport}
              className="h-12 px-3 rounded-xl bg-[#06b6d4]/20 border border-[#4cd7f6]/40 text-[#4cd7f6] text-xs font-bold flex items-center justify-center gap-1.5 backdrop-blur-xl active:scale-95 transition-all shadow-[0_0_16px_rgba(6,182,212,0.25)]"
            >
              <span className="material-symbols-outlined text-[19px]">support_agent</span>
              <span className="truncate">Llamar Soporte TI</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#2f334e]/95 border border-[#4cd7f6]/50 text-[#dee0ff] shadow-[0_12px_32px_rgba(0,0,0,0.6)] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[20px] text-[#4ae176]">verified</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
