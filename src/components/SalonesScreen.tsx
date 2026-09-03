import React, { useState } from 'react';
import { Room } from '../types';

interface SalonesScreenProps {
  rooms: Room[];
  onSelectRoom: (roomId: string) => void;
  onOpenCampusSummary: () => void;
  onOpenNewRoomModal: () => void;
}

export const SalonesScreen: React.FC<SalonesScreenProps> = ({
  rooms,
  onSelectRoom,
  onOpenCampusSummary,
  onOpenNewRoomModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'todos' | 'fallas' | 'operativos'>('todos');

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      !searchQuery ||
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.rackLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === 'todos' ||
      (filter === 'fallas' && room.statusTag === 'fallas') ||
      (filter === 'operativos' && room.statusTag === 'operativos');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col w-full relative pb-28">
      {/* Dynamic Atmospheric Glow Bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#4cd7f6]/10 blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-[#2f3aa3]/20 blur-[120px]"></div>
        <div className="absolute bottom-24 left-1/4 w-72 h-72 rounded-full bg-[#4ae176]/10 blur-[90px]"></div>
      </div>

      {/* Header Context & Quick Search Section */}
      <header className="flex flex-col gap-3 pt-2 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#bcc9cd]">
            <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">domain</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Campus Central · Edificio Tecnológico
            </span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl text-[#dee0ff] font-bold tracking-tight">
              Salones de Cómputo
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-[#242842] border border-[#4cd7f6]/30 text-[#4cd7f6] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ae176] animate-ping"></span>
              {rooms.length} Espacios
            </span>
          </div>
        </div>

        {/* Glass Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4cd7f6]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar salón, tecnología, IP o falla..."
            className="w-full h-11 pl-11 pr-10 rounded-xl bg-[#080c25]/70 backdrop-blur-xl border border-white/10 text-[#dee0ff] text-[14px] placeholder:text-[#bcc9cd]/50 focus:outline-none focus:bg-[#161a33]/90 focus:border-[#4cd7f6] focus:shadow-[0_0_16px_rgba(76,215,246,0.3)] transition-all duration-200"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#bcc9cd] hover:text-[#dee0ff]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Horizontal Filtering Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setFilter('todos')}
            className={`px-3.5 h-9 rounded-full text-[13px] font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
              filter === 'todos'
                ? 'bg-[#4cd7f6]/25 border border-[#4cd7f6]/60 text-[#4cd7f6] shadow-[0_0_14px_rgba(76,215,246,0.35)]'
                : 'bg-[#242842]/60 border border-white/5 text-[#bcc9cd] hover:text-[#dee0ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">apps</span>
            <span>Todos ({rooms.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('fallas')}
            className={`px-3.5 h-9 rounded-full text-[13px] font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
              filter === 'fallas'
                ? 'bg-[#ffb4ab]/20 border border-[#ffb4ab]/60 text-[#ffb4ab] shadow-[0_0_14px_rgba(255,180,171,0.35)]'
                : 'bg-[#242842]/60 border border-white/5 text-[#bcc9cd] hover:text-[#dee0ff]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ffb4ab] shadow-[0_0_6px_rgba(255,180,171,0.6)]"></span>
            <span>Con fallas ({rooms.filter((r) => r.statusTag === 'fallas').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('operativos')}
            className={`px-3.5 h-9 rounded-full text-[13px] font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
              filter === 'operativos'
                ? 'bg-[#4ae176]/20 border border-[#4ae176]/60 text-[#4ae176] shadow-[0_0_14px_rgba(74,225,118,0.35)]'
                : 'bg-[#242842]/60 border border-white/5 text-[#bcc9cd] hover:text-[#dee0ff]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4ae176] shadow-[0_0_6px_rgba(74,225,118,0.6)]"></span>
            <span>100% Operativos ({rooms.filter((r) => r.statusTag === 'operativos').length})</span>
          </button>
        </div>
      </header>

      {/* Rooms List Container */}
      <div className="flex flex-col gap-3.5">
        {filteredRooms.map((room) => {
          const isFeatured = room.priorityAlert;
          const isFullOperativo = room.operativity === 100;

          return (
            <article
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`group relative flex flex-col p-4 rounded-2xl backdrop-blur-2xl transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                isFeatured
                  ? 'bg-gradient-to-br from-[#2f334e]/60 to-[#242842]/40 border border-[#ffb4ab]/30 shadow-[0_12px_36px_rgba(0,0,0,0.45)] hover:border-[#ffb4ab]/60'
                  : 'bg-[#1a1e37]/70 border border-white/10 shadow-lg hover:bg-[#242842]/80 hover:border-[#4cd7f6]/40'
              }`}
            >
              {/* Priority Attention Badge */}
              {isFeatured && (
                <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-[#93000a]/90 border border-[#ffb4ab]/50 text-[#ffdad6] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_14px_rgba(239,68,68,0.4)]">
                  <span className="material-symbols-outlined text-[13px] text-[#ffb4ab]">priority_high</span>
                  ! ATENCIÓN PRIORITARIA
                </div>
              )}

              <div className="flex items-start justify-between gap-3 pt-1">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Room Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                      isFullOperativo
                        ? 'bg-[#14bf59]/20 border-[#4ae176]/40 text-[#4ae176] shadow-[0_0_16px_rgba(74,225,118,0.25)]'
                        : isFeatured
                        ? 'bg-[#06b6d4]/20 border-[#4cd7f6]/40 text-[#4cd7f6] shadow-[0_0_18px_rgba(6,182,212,0.3)]'
                        : 'bg-[#2f3aa3]/30 border-[#bdc2ff]/30 text-[#bdc2ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {room.id === '317' ? 'router' : room.id === '318' ? 'psychology' : room.id === '319' ? 'terminal' : room.id === '204' ? 'palette' : room.id === '205' ? 'build_circle' : 'school'}
                    </span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#dee0ff] tracking-tight truncate">
                        {room.name}
                      </span>
                      {isFullOperativo && (
                        <span className="w-2 h-2 rounded-full bg-[#4ae176] shadow-[0_0_8px_#4ae176]"></span>
                      )}
                    </div>
                    <span className="text-[12px] text-[#bcc9cd] truncate">{room.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 text-[#4cd7f6] group-hover:translate-x-1 transition-transform duration-200">
                  <span className="text-[13px] font-semibold">Detalle</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </div>
              </div>

              {/* Live Telemetry Deck */}
              <div className="mt-3.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className={`${isFullOperativo ? 'text-[#6bff8f]' : 'text-[#bcc9cd]'} uppercase tracking-wider`}>
                    {isFullOperativo ? '100% OPERATIVO ÓPTIMO' : room.id === '204' ? 'RENDIMIENTO GRÁFICO' : room.id === '205' ? 'MESAS DE BANCO' : 'DISPONIBILIDAD DE NODOS'}
                  </span>
                  <span className="text-[#dee0ff] font-mono tracking-normal">
                    {room.activeCount} / {room.capacity} Operativos{' '}
                    <span className={`font-bold ${isFullOperativo ? 'text-[#4ae176]' : room.faultCount > 0 ? 'text-[#4cd7f6]' : 'text-[#dee0ff]'}`}>
                      ({room.operativity}%)
                    </span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#080c25] overflow-hidden flex border border-white/5">
                  <div
                    className="h-full bg-[#4ae176] shadow-[0_0_8px_#4ae176] transition-all duration-500"
                    style={{ width: `${room.operativity}%` }}
                  ></div>
                  {room.faultCount > 0 && (
                    <div
                      className="h-full bg-[#ffb4ab] animate-pulse transition-all duration-500"
                      style={{ width: `${100 - room.operativity}%` }}
                    ></div>
                  )}
                </div>
              </div>

              {/* Quick Context Badges */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {room.faultCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#93000a]/40 border border-[#ffb4ab]/30 text-[#ffb4ab] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(255,180,171,0.2)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
                      {room.faultCount === 1 ? '1 falla menor' : `${room.faultCount} fallas activas`}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#4ae176] text-[11px] font-semibold">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      Todo en línea sin alertas
                    </span>
                  )}

                  <span className="px-2 py-0.5 rounded-md bg-[#161a33] text-[#bcc9cd] text-[11px] font-mono flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#4cd7f6]">sync</span>
                    {room.lastSync}
                  </span>
                </div>

                <span className="text-[#bcc9cd]/80 text-[11px] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">desktop_windows</span>
                  {room.rackLocation}
                </span>
              </div>
            </article>
          );
        })}

        {filteredRooms.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-2xl bg-[#080c25]/60 border border-white/10 backdrop-blur-md">
            <div className="w-14 h-14 rounded-full bg-[#4cd7f6]/10 flex items-center justify-center text-[#4cd7f6] mb-3 shadow-[0_0_20px_rgba(76,215,246,0.2)]">
              <span className="material-symbols-outlined text-[28px]">travel_explore</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-lg text-[#dee0ff] font-semibold">
              Ningún salón coincide
            </h3>
            <p className="text-sm text-[#bcc9cd] max-w-xs mt-1">
              Revisa el término ingresado o restablece los filtros activos.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilter('todos');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-[#4cd7f6]/20 border border-[#4cd7f6]/40 text-[#4cd7f6] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#4cd7f6]/30 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              Restablecer lista
            </button>
          </div>
        )}
      </div>

      {/* Floating Lower Third Command Dock */}
      <aside className="sticky bottom-20 z-30 w-full pt-4">
        <div className="p-1.5 rounded-2xl bg-[#161a33]/90 border border-white/15 backdrop-blur-3xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex items-center gap-2">
          {/* Quick Campus Telemetry Summary */}
          <button
            type="button"
            onClick={onOpenCampusSummary}
            className="flex-1 h-12 px-3.5 rounded-xl bg-[#080c25]/80 hover:bg-[#080c25] border border-white/10 text-[#dee0ff] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px] text-[#bdc2ff]">analytics</span>
            <span className="truncate">Resumen Campus</span>
          </button>

          {/* Primary Action: Register New Room */}
          <button
            type="button"
            onClick={onOpenNewRoomModal}
            className="flex-[1.2] h-12 px-3.5 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] text-[#003640] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.45)] transition-all duration-150 active:scale-[0.98] hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="truncate">+ Nuevo Salón</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
