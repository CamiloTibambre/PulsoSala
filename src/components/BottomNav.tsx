import React from 'react';

interface BottomNavProps {
  activeTab: 'salones' | 'equipos' | 'reportar' | 'actividad';
  onTabChange: (tab: 'salones' | 'equipos' | 'reportar' | 'actividad') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#080c25]/85 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-8px_32px_rgba(0,0,0,0.6)]">
      <div className="max-w-md mx-auto h-18 px-4 flex items-center justify-around">
        {/* Salones */}
        <button
          type="button"
          onClick={() => onTabChange('salones')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] gap-1 transition-all duration-200 ${
            activeTab === 'salones'
              ? 'text-[#4cd7f6] font-semibold drop-shadow-[0_0_10px_rgba(76,215,246,0.6)]'
              : 'text-[#bcc9cd] hover:text-[#dee0ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">meeting_room</span>
          <span className="text-[12px] tracking-normal font-medium">Salones</span>
        </button>

        {/* Equipos */}
        <button
          type="button"
          onClick={() => onTabChange('equipos')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] gap-1 transition-all duration-200 ${
            activeTab === 'equipos'
              ? 'text-[#4cd7f6] font-semibold drop-shadow-[0_0_10px_rgba(76,215,246,0.6)]'
              : 'text-[#bcc9cd] hover:text-[#dee0ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">grid_view</span>
          <span className="text-[12px] tracking-normal font-medium">Equipos</span>
        </button>

        {/* Reportar (Prominent Callout Button) */}
        <button
          type="button"
          onClick={() => onTabChange('reportar')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] gap-1 transition-all duration-200 group ${
            activeTab === 'reportar'
              ? 'text-[#4cd7f6] font-semibold drop-shadow-[0_0_10px_rgba(76,215,246,0.6)]'
              : 'text-[#bcc9cd] hover:text-[#dee0ff]'
          }`}
        >
          <div className="w-10 h-10 -mt-2.5 rounded-full bg-[#06b6d4]/20 border border-[#4cd7f6]/40 flex items-center justify-center text-[#4cd7f6] shadow-[0_0_16px_rgba(76,215,246,0.35)] group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[22px]">warning</span>
          </div>
          <span className="text-[12px] tracking-normal font-medium">Reportar</span>
        </button>

        {/* Actividad */}
        <button
          type="button"
          onClick={() => onTabChange('actividad')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] gap-1 transition-all duration-200 ${
            activeTab === 'actividad'
              ? 'text-[#4cd7f6] font-semibold drop-shadow-[0_0_10px_rgba(76,215,246,0.6)]'
              : 'text-[#bcc9cd] hover:text-[#dee0ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">stream</span>
          <span className="text-[12px] tracking-normal font-medium">Actividad</span>
        </button>
      </div>
    </nav>
  );
};
