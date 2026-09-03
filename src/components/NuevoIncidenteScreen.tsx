import React, { useState } from 'react';
import { Device } from '../types';

interface NuevoIncidenteScreenProps {
  device?: Device;
  onBack: () => void;
  onSaveIncident: (data: {
    deviceId: string;
    status: 'operativo' | 'falla';
    subsystem: 'Hardware' | 'Monitor' | 'Periféricos' | 'Red LAN';
    observation: string;
    priority: 'Baja' | 'Media' | 'Bloqueante';
    pushAlert: boolean;
  }) => void;
}

export const NuevoIncidenteScreen: React.FC<NuevoIncidenteScreenProps> = ({
  device,
  onBack,
  onSaveIncident
}) => {
  const [selectedState, setSelectedState] = useState<'operativo' | 'falla'>('falla');
  const [subsystem, setSubsystem] = useState<'Hardware' | 'Monitor' | 'Periféricos' | 'Red LAN'>('Monitor');
  const [observation, setObservation] = useState('Pantalla secundaria no recibe señal DisplayPort tras reinicio de nodo.');
  const [priority, setPriority] = useState<'Baja' | 'Media' | 'Bloqueante'>('Bloqueante');
  const [pushAlert, setPushAlert] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  const deviceId = device?.id || 'PC-317-12';
  const location = device?.location || 'Fila C';
  const roomName = device?.roomId ? `SALA ${device.roomId}` : 'SALA 03';

  const handleSave = () => {
    setShowSyncSuccess(true);
    setTimeout(() => {
      onSaveIncident({
        deviceId,
        status: selectedState,
        subsystem,
        observation,
        priority,
        pushAlert
      });
    }, 1200);
  };

  const handleDictationToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setObservation((prev) => prev + ' Intermitencia detectada en bus de video.');
        setIsListening(false);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col w-full relative pb-32">
      {/* Subtle Ambient Glow Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#4cd7f6]/10 rounded-full blur-[110px]"></div>
        <div
          className={`absolute top-1/4 right-0 w-80 h-80 ${
            selectedState === 'falla' ? 'bg-[#93000a]/20' : 'bg-[#14bf59]/20'
          } rounded-full blur-[130px] transition-all duration-700`}
        ></div>
      </div>

      {/* Main Glass Content Container */}
      <div className="relative z-10 flex flex-col gap-4 pt-1">
        {/* Breadcrumb row */}
        <div className="flex items-center justify-between pb-1">
          <button
            type="button"
            onClick={onBack}
            className="h-10 px-3.5 rounded-full bg-[#1a1e37]/80 hover:bg-[#242842] border border-white/10 backdrop-blur-xl flex items-center gap-1.5 text-[#dee0ff] transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">arrow_back</span>
            <span className="text-[13px] font-semibold">Volver</span>
          </button>
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#4cd7f6] px-2.5 py-1 rounded-full bg-[#161a33] border border-white/10">
            Formulario Rápido
          </span>
        </div>

        {/* Terminal Spec Header Block */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1a1e37]/80 border border-white/15 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#242842] border border-[#4cd7f6]/30 flex items-center justify-center text-[#4cd7f6] shadow-inner">
              <span className="material-symbols-outlined text-[22px]">desktop_windows</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#4cd7f6] tracking-wider uppercase">
                  Puesto Telemetría
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
              </div>
              <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dee0ff] truncate">
                {deviceId} · {location}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#080c25]/90 border border-white/10 text-[#bcc9cd] text-[10px] font-bold font-mono">
            <span className="material-symbols-outlined text-[14px] text-[#4ae176]">wifi_tethering</span>
            {roomName}
          </div>
        </div>

        {/* Section 1: Visual State Toggle (Semáforo Táctil) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] uppercase font-bold text-[#bcc9cd] tracking-wider">
              Estado Operativo Principal
            </label>
            <span
              className={`text-[11px] font-bold tracking-wide ${
                selectedState === 'falla' ? 'text-[#ffb4ab]' : 'text-[#4ae176]'
              }`}
            >
              ESTADO: {selectedState === 'falla' ? 'CON FALLA' : 'OPERATIVO'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#080c25]/85 border border-white/10 backdrop-blur-2xl shadow-inner">
            {/* Option: Operativo */}
            <button
              type="button"
              onClick={() => setSelectedState('operativo')}
              className={`min-h-[64px] flex flex-col items-center justify-center gap-1 py-3 px-3 rounded-xl transition-all duration-300 relative group overflow-hidden border ${
                selectedState === 'operativo'
                  ? 'bg-[#14bf59]/25 border-[#4ae176] text-[#6bff8f] shadow-[0_0_24px_rgba(74,225,118,0.4)]'
                  : 'bg-[#1a1e37]/40 border-transparent text-[#bcc9cd] hover:bg-[#242842]/50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[22px] text-[#4ae176]">check_circle</span>
                <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold tracking-tight">Operativo</span>
              </div>
              <span className="text-[11px] opacity-80">Apto para sesión</span>
            </button>

            {/* Option: Con Falla */}
            <button
              type="button"
              onClick={() => setSelectedState('falla')}
              className={`min-h-[64px] flex flex-col items-center justify-center gap-1 py-3 px-3 rounded-xl transition-all duration-300 relative group overflow-hidden border ${
                selectedState === 'falla'
                  ? 'bg-[#93000a]/70 border-[#ffb4ab] text-[#ffdad6] shadow-[0_0_24px_rgba(239,68,68,0.4)]'
                  : 'bg-[#1a1e37]/40 border-transparent text-[#bcc9cd] hover:bg-[#242842]/50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[22px] text-[#ffb4ab]">error</span>
                <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold tracking-tight">Con Falla</span>
              </div>
              <span className="text-[11px] opacity-90">Requiere asistencia</span>
            </button>
          </div>
        </div>

        {/* Section 2: Problem Category Pill Selectors */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase font-bold text-[#bcc9cd] tracking-wider px-1">
            Subsistema Afectado
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'Hardware', icon: 'memory', label: 'Hardware' },
              { id: 'Monitor', icon: 'tv', label: 'Monitor' },
              { id: 'Periféricos', icon: 'chromecast_2', label: 'Periféricos' },
              { id: 'Red LAN', icon: 'lan', label: 'Red LAN' }
            ].map((cat) => {
              const isSelected = subsystem === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSubsystem(cat.id as any)}
                  className={`h-12 flex items-center gap-2.5 px-3 rounded-xl transition-all active:scale-98 border ${
                    isSelected
                      ? 'bg-[#242842] border-[#4cd7f6] text-[#4cd7f6] shadow-[0_0_16px_rgba(6,182,212,0.3)]'
                      : 'bg-[#1a1e37]/70 border-white/10 text-[#dee0ff] hover:bg-[#242842]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#06b6d4]/20 text-[#4cd7f6]' : 'bg-[#080c25]/80 text-[#4cd7f6]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  </div>
                  <span className="text-xs font-semibold">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Diagnostic Observation Area */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] uppercase font-bold text-[#bcc9cd] tracking-wider">
              Bitácora de Observación Técnica
            </label>
            <span className="text-[11px] font-mono text-[#bcc9cd]">
              {observation.length} / 280
            </span>
          </div>

          <div className="relative rounded-2xl bg-[#080c25]/90 border border-white/15 backdrop-blur-2xl p-3 shadow-inner focus-within:border-[#4cd7f6] focus-within:shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all">
            <textarea
              rows={4}
              maxLength={280}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Describe brevemente el problema detectado..."
              className="w-full min-h-[90px] bg-transparent text-[#dee0ff] text-sm placeholder:text-[#bcc9cd]/40 focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={handleDictationToggle}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                  isListening
                    ? 'bg-[#ffb4ab]/30 text-[#ffb4ab] animate-pulse border border-[#ffb4ab]/50'
                    : 'text-[#bcc9cd] hover:text-[#4cd7f6]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">mic</span>
                <span className="uppercase text-[10px] tracking-wider">
                  {isListening ? 'Escuchando voz...' : 'Dictado activo'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setObservation('')}
                className="text-xs text-[#bcc9cd] hover:text-[#ffb4ab] flex items-center gap-1 font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">backspace</span>
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Urgency Chips */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase font-bold text-[#bcc9cd] tracking-wider px-1">
            Nivel de Prioridad en Sala
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Baja', 'Media', 'Bloqueante'] as const).map((p) => {
              const isSelected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`h-11 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-semibold border ${
                    isSelected
                      ? p === 'Bloqueante'
                        ? 'bg-[#93000a]/80 border-[#ffb4ab] text-[#ffdad6] shadow-[0_0_16px_rgba(239,68,68,0.4)]'
                        : p === 'Media'
                        ? 'bg-[#06b6d4]/25 border-[#4cd7f6] text-[#4cd7f6]'
                        : 'bg-[#2f3aa3]/40 border-[#bdc2ff] text-[#bdc2ff]'
                      : 'bg-[#1a1e37]/70 border-white/10 text-[#bcc9cd] hover:bg-[#242842]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      p === 'Bloqueante'
                        ? 'bg-[#ffb4ab] animate-ping'
                        : p === 'Media'
                        ? 'bg-[#4cd7f6]'
                        : 'bg-[#bdc2ff]'
                    }`}
                  ></span>
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Dispatch Toggle Control */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1a1e37]/80 border border-white/15 backdrop-blur-2xl shadow-md">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/20 border border-[#4cd7f6]/30 flex items-center justify-center text-[#4cd7f6] flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[#dee0ff] leading-tight">
                Alerta Push al Técnico
              </span>
              <span className="text-[11px] text-[#bcc9cd]">
                Despacho inmediato a guardia técnica
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={pushAlert}
            onClick={() => setPushAlert(!pushAlert)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center flex-shrink-0 border ${
              pushAlert
                ? 'bg-[#06b6d4] border-[#4cd7f6] justify-end shadow-[0_0_14px_rgba(6,182,212,0.4)]'
                : 'bg-[#242842] border-white/10 justify-start'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-[#080c25] shadow-md transition-transform duration-300"></div>
          </button>
        </div>

        {/* Telemetry Snapshot Micro-Card */}
        <div className="p-3 rounded-xl bg-[#161a33]/60 border border-white/10 flex items-center justify-between text-[#bcc9cd]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[17px] text-[#4cd7f6]">sensors</span>
            <span className="text-[11px] font-mono uppercase font-semibold">
              Última lectura: 24.1°C · Ping: 8ms
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#4ae176] px-2 py-0.5 rounded bg-[#4ae176]/10">
            OK
          </span>
        </div>

        {/* Thumb Zone Action Dock */}
        <div className="flex flex-col gap-2 pt-2">
          {/* Primary Save Action Button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full min-h-[52px] h-[52px] rounded-xl bg-gradient-to-r from-[#14bf59] via-[#06b6d4] to-[#4cd7f6] text-[#003640] font-['Plus_Jakarta_Sans'] text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(76,215,246,0.35)] active:scale-[0.98] transition-all hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[22px]">sync_saved_locally</span>
            <span>Guardar y Sincronizar</span>
          </button>

          {/* Secondary Discard Action Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-full h-11 rounded-xl bg-[#1a1e37]/70 hover:bg-[#242842] border border-white/10 text-[#bcc9cd] hover:text-[#dee0ff] transition-all active:scale-[0.98] text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span>Descartar cambios</span>
          </button>
        </div>
      </div>

      {/* Sync Success Notification Overlay */}
      {showSyncSuccess && (
        <div className="fixed inset-x-4 bottom-24 z-50 p-4 rounded-2xl bg-[#161a33]/95 border border-[#4ae176] shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex items-center gap-3 backdrop-blur-2xl animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-[#14bf59]/20 flex items-center justify-center text-[#4ae176] flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-[#dee0ff]">
              Estado sincronizado con Supabase
            </span>
            <span className="text-xs text-[#bcc9cd] truncate">
              Incidencia registrada en tiempo real en tabla <code className="text-[#4cd7f6]">equipos_salon_317</code>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
