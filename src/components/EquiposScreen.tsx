import React, { useState } from 'react';
import { Device, Room } from '../types';

interface EquiposScreenProps {
  devices: Device[];
  room?: Room;
  onSelectDevice: (deviceId: string) => void;
  onReportIncident: (deviceId?: string) => void;
  onRefreshTelemetry: () => void;
  isRefreshing: boolean;
}

export const EquiposScreen: React.FC<EquiposScreenProps> = ({
  devices,
  room,
  onSelectDevice,
  onReportIncident,
  onRefreshTelemetry,
  isRefreshing
}) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const activeCount = devices.filter((d) => d.status === 'operativo').length;
  const faultCount = devices.filter((d) => d.status === 'falla').length;
  const operativityPct = Math.round((activeCount / (devices.length || 1)) * 100);

  const getDeviceIcon = (device: Device) => {
    if (device.status === 'operativo') {
      return 'desktop_windows';
    }
    if (device.iconName) {
      return device.iconName;
    }
    return 'warning';
  };

  return (
    <div className="flex flex-col w-full gap-4 relative pb-28">
      {/* Ambient Backdrop Glow Spots */}
      <div className="absolute -top-10 left-1/4 w-72 h-72 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-80 right-2 w-64 h-64 bg-[#4ae176]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-[520px] left-4 w-60 h-60 bg-[#ffb4ab]/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Top Summary Glass Card */}
      <div className="w-full rounded-2xl bg-[#161a33]/70 backdrop-blur-xl border border-white/15 p-4 shadow-[0_12px_32px_rgba(0,0,0,0.45)] relative overflow-hidden flex flex-col gap-3">
        {/* Subtle specular top highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4cd7f6]/40 to-transparent"></div>

        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#06b6d4]/20 border border-[#4cd7f6]/30 text-[#4cd7f6] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">meeting_room</span>
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#dee0ff] tracking-tight font-bold truncate">
                {room?.name || 'Salón 317'}
              </span>
            </div>
            <p className="text-[12px] text-[#bcc9cd] font-medium mt-0.5">
              Capacidad: {devices.length} Equipos All-in-One · Vista Planta
            </p>
          </div>

          {/* Quick Room Health Gauge Mini-badge */}
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#4ae176]">
              {operativityPct}%
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#bcc9cd] font-semibold">
              Operatividad
            </span>
          </div>
        </div>

        {/* Quick Metric Badges Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Operativos Chip */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#14bf59]/15 border border-[#4ae176]/30 shadow-[0_0_18px_-2px_rgba(74,225,118,0.25)]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ae176] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4ae176]"></span>
              </span>
              <span className="text-[13px] font-semibold text-[#6bff8f]">
                {activeCount} Activos
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4ae176]/20 border border-[#4ae176]/40 text-[#4ae176]">
              OK
            </span>
          </div>

          {/* Con Falla Chip with pulsing halo */}
          <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#93000a]/40 border border-[#ffb4ab]/40 shadow-[0_0_22px_0px_rgba(255,180,171,0.35)] ${faultCount > 0 ? 'animate-pulse' : ''}`}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#ffb4ab]">warning</span>
              <span className="text-[13px] font-semibold text-[#ffb4ab]">
                {faultCount} Con Falla
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffb4ab]/25 border border-[#ffb4ab]/50 text-[#ffb4ab]">
              CRIT
            </span>
          </div>
        </div>

        {/* Real-time Live Stream Metatag */}
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[#bcc9cd]">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4cd7f6] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4cd7f6]"></span>
            </span>
            <span className="text-[12px] truncate text-[#bcc9cd]">
              Supabase Live Stream · Sincronizado hace 2s
            </span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#4cd7f6] flex-shrink-0 opacity-80">
            sensors
          </span>
        </div>
      </div>

      {/* Telemetry Filter / Quick legend bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] tracking-wider uppercase text-[#bcc9cd] font-semibold">
            Mapeo de Terminales
          </span>
          <span className="px-2 py-0.5 rounded bg-[#2f334e] text-[11px] font-mono font-bold text-[#dee0ff]">
            {devices.length} / {devices.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#4ae176] shadow-[0_0_6px_#4ae176]"></div>
            <span className="text-[11px] text-[#bcc9cd]">Online</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#ffb4ab] shadow-[0_0_6px_#ffb4ab]"></div>
            <span className="text-[11px] text-[#bcc9cd]">Incidente</span>
          </div>
        </div>
      </div>

      {/* Grid View: Exactly 30 Devices */}
      <div className="grid grid-cols-3 gap-2.5 w-full">
        {devices.map((device) => {
          const isFalla = device.status === 'falla';
          const icon = getDeviceIcon(device);

          return (
            <button
              key={device.id}
              type="button"
              onClick={() => setSelectedDevice(device)}
              className={`group text-left p-2.5 rounded-2xl backdrop-blur-md active:scale-95 transition-all min-h-[72px] flex flex-col justify-between border ${
                isFalla
                  ? 'bg-[#93000a]/50 border-[#ffb4ab]/50 shadow-[0_0_24px_0px_rgba(255,180,171,0.4)] animate-pulse'
                  : 'bg-[#1a1e37]/75 border-white/10 hover:border-[#4ae176]/50 shadow-[0_0_14px_-2px_rgba(74,225,118,0.22)]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`material-symbols-outlined text-[19px] ${
                    isFalla ? 'text-[#ffb4ab] font-bold' : 'text-[#4ae176]'
                  }`}
                >
                  {icon}
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isFalla
                      ? 'bg-[#ffb4ab]/30 border border-[#ffb4ab]/50 text-[#ffb4ab]'
                      : 'bg-[#14bf59]/30 border border-[#4ae176]/40 text-[#6bff8f]'
                  }`}
                >
                  {isFalla ? 'FALLA' : 'OK'}
                </span>
              </div>

              <div className="mt-1 min-w-0">
                <p
                  className={`text-[13px] leading-tight font-bold truncate ${
                    isFalla ? 'text-[#ffb4ab]' : 'text-[#dee0ff]'
                  }`}
                >
                  {device.shortId}
                </p>
                <p
                  className={`text-[10px] truncate ${
                    isFalla ? 'text-[#ffb4ab] font-medium' : 'text-[#bcc9cd]'
                  }`}
                >
                  {device.issueDescription && isFalla ? device.issueDescription.split('-')[0] : device.subId}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Quick Sheet Modal for Selected Device */}
      {selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#1a1e37]/95 border border-white/20 backdrop-blur-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-3.5 mb-14">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    selectedDevice.status === 'falla' ? 'text-[#ffb4ab]' : 'text-[#4cd7f6]'
                  }`}
                >
                  {getDeviceIcon(selectedDevice)}
                </span>
                <div>
                  <h4 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dee0ff]">
                    {selectedDevice.id}
                  </h4>
                  <span
                    className={`text-[11px] uppercase font-bold tracking-wider ${
                      selectedDevice.status === 'falla' ? 'text-[#ffb4ab]' : 'text-[#4ae176]'
                    }`}
                  >
                    {selectedDevice.status === 'falla' ? 'Estado: Con Falla Crítica' : 'Estado: Operativo'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDevice(null)}
                className="w-8 h-8 rounded-full bg-[#2f334e] flex items-center justify-center text-[#bcc9cd] hover:text-[#dee0ff]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="bg-[#080c25]/80 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-[#bcc9cd] uppercase tracking-wider">
                DIAGNÓSTICO TELEMETRÍA
              </span>
              <p className="text-[13px] text-[#dee0ff] font-medium leading-relaxed">
                {selectedDevice.specs} · {selectedDevice.issueDescription || 'Sin anomalías en periféricos ni red.'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onSelectDevice(selectedDevice.id)}
                className="flex-1 h-11 rounded-xl bg-[#2f334e] hover:bg-[#343752] border border-white/10 text-[#dee0ff] text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                Ver Detalle
              </button>

              <button
                type="button"
                onClick={() => {
                  const devId = selectedDevice.id;
                  setSelectedDevice(null);
                  onReportIncident(devId);
                }}
                className="flex-1 h-11 rounded-xl bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(6,182,212,0.4)] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">build</span>
                Gestionar Falla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lower Third Floating Action Bar */}
      <div className="sticky bottom-20 z-30 w-full pt-2">
        <div className="w-full p-1.5 rounded-full bg-[#080c25]/85 border border-white/15 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.65)] flex items-center gap-2">
          {/* Main Action: Report Failure in this Room */}
          <button
            type="button"
            onClick={() => onReportIncident('PC-317-12')}
            className="flex-1 min-h-[48px] h-12 px-4 rounded-full bg-gradient-to-r from-[#06b6d4] via-[#4cd7f6] to-[#4ae176] text-[#003640] text-[13px] font-bold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(76,215,246,0.45)] active:scale-95 transition-transform hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[20px]">add_alert</span>
            <span className="truncate">+ Reportar falla en este salón</span>
          </button>

          {/* Tactical Pulse Refresh Button */}
          <button
            type="button"
            onClick={onRefreshTelemetry}
            aria-label="Actualizar pulso de sala"
            className="w-12 h-12 flex-shrink-0 rounded-full bg-[#242842]/90 border border-[#4cd7f6]/40 text-[#4cd7f6] flex items-center justify-center shadow-[0_0_16px_rgba(76,215,246,0.25)] active:scale-90 transition-all hover:bg-[#343752]"
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
