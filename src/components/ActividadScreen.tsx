import React, { useState } from 'react';
import { HistoryEvent } from '../types';

interface ActividadScreenProps {
  events: HistoryEvent[];
  onSelectDevice: (deviceId: string) => void;
}

export const ActividadScreen: React.FC<ActividadScreenProps> = ({ events, onSelectDevice }) => {
  const [filter, setFilter] = useState<'all' | 'faults' | 'maintenance'>('all');

  const filteredEvents = events.filter((e) => {
    if (filter === 'faults') return e.badgeType === 'error';
    if (filter === 'maintenance') return e.badgeType === 'success' || e.badgeType === 'info';
    return true;
  });

  return (
    <div className="flex flex-col w-full relative pb-28 gap-4">
      {/* Header */}
      <header className="flex flex-col gap-1 pt-2">
        <div className="flex items-center gap-1.5 text-[#bcc9cd]">
          <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">stream</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Telemetría y Registro CDC
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl text-[#dee0ff] font-bold tracking-tight">
            Actividad en Tiempo Real
          </h1>
          <span className="px-2.5 py-1 rounded-full bg-[#14bf59]/20 border border-[#4ae176]/40 text-[#4ae176] text-[11px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ae176] animate-ping"></span>
            Escuchando WebSocket
          </span>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-[#4cd7f6]/25 border border-[#4cd7f6] text-[#4cd7f6]'
              : 'bg-[#161a33] text-[#bcc9cd] border border-white/5'
          }`}
        >
          Todos ({events.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('faults')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'faults'
              ? 'bg-[#ffb4ab]/25 border border-[#ffb4ab] text-[#ffb4ab]'
              : 'bg-[#161a33] text-[#bcc9cd] border border-white/5'
          }`}
        >
          Incidentes ({events.filter((e) => e.badgeType === 'error').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('maintenance')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'maintenance'
              ? 'bg-[#4ae176]/25 border border-[#4ae176] text-[#4ae176]'
              : 'bg-[#161a33] text-[#bcc9cd] border border-white/5'
          }`}
        >
          Mantenimientos
        </button>
      </div>

      {/* Events Timeline */}
      <div className="flex flex-col gap-2.5">
        {filteredEvents.map((evt) => {
          const isError = evt.badgeType === 'error';
          const isSuccess = evt.badgeType === 'success';

          return (
            <div
              key={evt.id}
              onClick={() => onSelectDevice(evt.deviceId)}
              className="p-3.5 rounded-2xl bg-[#161a33]/80 border border-white/10 hover:border-[#4cd7f6]/40 backdrop-blur-xl shadow-md transition-all cursor-pointer flex items-start gap-3 active:scale-[0.99]"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                  isError
                    ? 'bg-[#93000a]/70 border-[#ffb4ab] text-[#ffb4ab] shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                    : isSuccess
                    ? 'bg-[#14bf59]/25 border-[#4ae176] text-[#4ae176]'
                    : 'bg-[#2f3aa3]/40 border-[#bdc2ff] text-[#bdc2ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isError ? 'report_problem' : isSuccess ? 'build_circle' : 'task_alt'}
                </span>
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#4cd7f6]">{evt.deviceId}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        isError ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#14bf59]/20 text-[#6bff8f]'
                      }`}
                    >
                      {evt.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#bcc9cd]">{evt.timestamp}</span>
                </div>

                <p className="text-xs text-[#dee0ff] font-semibold mt-0.5">{evt.title}</p>
                <p className="text-[11px] text-[#bcc9cd] leading-snug">{evt.description}</p>
                <span className="text-[10px] text-[#bcc9cd]/60 mt-1 font-mono">
                  Por: {evt.author} {evt.logId ? `· ID: ${evt.logId}` : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
