import React from 'react';
import { Room, Device } from '../types';

interface CampusSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  devices: Device[];
}

export const CampusSummaryModal: React.FC<CampusSummaryModalProps> = ({
  isOpen,
  onClose,
  rooms,
  devices
}) => {
  if (!isOpen) return null;

  const totalRooms = rooms.length;
  const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalActive = rooms.reduce((acc, r) => acc + r.activeCount, 0);
  const totalFaults = rooms.reduce((acc, r) => acc + r.faultCount, 0);
  const globalOperativity = Math.round((totalActive / (totalCapacity || 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d112a] border border-white/20 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col gap-4 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2f3aa3]/40 border border-[#bdc2ff]/40 flex items-center justify-center text-[#bdc2ff]">
              <span className="material-symbols-outlined text-[24px]">analytics</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dee0ff]">
                Resumen Telemetría Campus
              </h3>
              <p className="text-xs text-[#bcc9cd]">
                Edificio Tecnológico · 6 Laboratorios de Cómputo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1a1e37] flex items-center justify-center text-[#bcc9cd] hover:text-[#dee0ff]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Global Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#161a33]/80 border border-white/10 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#bcc9cd] uppercase tracking-wider">
              Operatividad Global
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#4ae176]">
              {globalOperativity}%
            </span>
            <span className="text-xs text-[#bcc9cd]">
              {totalActive} de {totalCapacity} terminales
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#161a33]/80 border border-white/10 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#bcc9cd] uppercase tracking-wider">
              Fallas Activas
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#ffb4ab]">
              {totalFaults} Nodos
            </span>
            <span className="text-xs text-[#bcc9cd]">
              En {rooms.filter((r) => r.faultCount > 0).length} salones
            </span>
          </div>
        </div>

        {/* Breakdown by room */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-[#4cd7f6] uppercase tracking-wider px-1">
            Desglose por Salón
          </span>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            {rooms.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#161a33]/50 border border-white/5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${r.faultCount > 0 ? 'bg-[#ffb4ab]' : 'bg-[#4ae176]'}`}></span>
                  <span className="font-semibold text-[#dee0ff]">{r.name}</span>
                  <span className="text-[10px] text-[#bcc9cd] truncate max-w-[120px]">{r.type}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className={r.faultCount > 0 ? 'text-[#ffb4ab]' : 'text-[#4ae176]'}>
                    {r.activeCount}/{r.capacity}
                  </span>
                  <span className="text-[#bcc9cd]">({r.operativity}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#242842] hover:bg-[#2f334e] text-xs font-semibold text-[#dee0ff] transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
