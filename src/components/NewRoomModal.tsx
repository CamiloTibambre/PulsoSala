import React, { useState } from 'react';
import { Room } from '../types';

interface NewRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (room: Room) => void;
}

export const NewRoomModal: React.FC<NewRoomModalProps> = ({
  isOpen,
  onClose,
  onAddRoom
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Laboratorio de Cómputo General');
  const [capacity, setCapacity] = useState('30');
  const [rack, setRack] = useState('Rack Cisco A-5');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const capNum = parseInt(capacity) || 30;
    const newRoom: Room = {
      id: `${Date.now()}`.slice(-3),
      name: name.trim(),
      type: type.trim(),
      capacity: capNum,
      activeCount: capNum,
      faultCount: 0,
      operativity: 100,
      statusTag: 'operativos',
      priorityAlert: false,
      rackLocation: rack.trim() || 'Rack Central',
      lastSync: 'hace instantes',
      description: 'Capacidad total operativa'
    };

    onAddRoom(newRoom);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0d112a] border border-white/20 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col gap-4 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/20 border border-[#4cd7f6]/40 flex items-center justify-center text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[22px]">add_business</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dee0ff]">
                Registrar Nuevo Salón
              </h3>
              <p className="text-xs text-[#bcc9cd]">
                Alta de nuevo laboratorio en Supabase
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-bold text-[#bcc9cd] uppercase tracking-wider block mb-1">
              Nombre del Salón / Espacio
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Salón 320"
              className="w-full h-11 px-3.5 rounded-xl bg-[#161a33] border border-white/10 text-[#dee0ff] text-xs focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#bcc9cd] uppercase tracking-wider block mb-1">
              Especialidad / Tipo de Laboratorio
            </label>
            <input
              type="text"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Ej: Lab Ciberseguridad"
              className="w-full h-11 px-3.5 rounded-xl bg-[#161a33] border border-white/10 text-[#dee0ff] text-xs focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#bcc9cd] uppercase tracking-wider block mb-1">
                Capacidad (Equipos)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#161a33] border border-white/10 text-[#dee0ff] text-xs focus:outline-none focus:border-[#4cd7f6]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#bcc9cd] uppercase tracking-wider block mb-1">
                Ubicación Rack / Switch
              </label>
              <input
                type="text"
                value={rack}
                onChange={(e) => setRack(e.target.value)}
                placeholder="Ej: Rack Cisco B-1"
                className="w-full h-11 px-3.5 rounded-xl bg-[#161a33] border border-white/10 text-[#dee0ff] text-xs focus:outline-none focus:border-[#4cd7f6]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] text-[#003640] font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(6,182,212,0.4)] hover:brightness-110"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              Guardar Salón
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-xl bg-[#1a1e37] border border-white/10 text-[#bcc9cd] text-xs font-semibold hover:text-[#dee0ff]"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
