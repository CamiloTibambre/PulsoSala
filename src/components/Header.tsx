import React from 'react';

interface HeaderProps {
  currentTab: string;
  onOpenConnectionModal: () => void;
  onOpenFlutterModal: () => void;
  onOpenSupabaseModal: () => void;
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenConnectionModal,
  onOpenFlutterModal,
  onOpenSupabaseModal,
  isConnected
}) => {
  const getSubheaderTitle = () => {
    switch (currentTab) {
      case 'salones': return '| Salones';
      case 'equipos': return '| Equipos';
      case 'reportar': return '| Incidente';
      case 'actividad': return '| Telemetría';
      default: return '| Salones';
    }
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-[#080c25]/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Logo icon with glowing ECG pulse */}
          <div 
            onClick={onOpenConnectionModal}
            className="w-9 h-9 rounded-xl bg-[#161a33]/90 border border-[#4cd7f6]/40 flex items-center justify-center text-[#4cd7f6] shadow-[0_0_15px_rgba(76,215,246,0.3)] cursor-pointer hover:border-[#4cd7f6] transition-all"
            title="Ver estado de conexión Supabase"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="12" x="3" y="4" rx="2" />
              <path d="M7 10h2l1-2 2 4 1-2h4" stroke="#4ae176" strokeWidth="2" />
              <line x1="12" x2="12" y1="16" y2="20" />
              <line x1="8" x2="16" y1="20" y2="20" />
            </svg>
          </div>

          <div className="flex flex-col min-w-0 cursor-pointer" onClick={onOpenConnectionModal}>
            <div className="flex items-center gap-1.5">
              <span className="font-['Plus_Jakarta_Sans'] text-[17px] leading-tight text-[#dee0ff] tracking-tight font-bold truncate">
                PulsoSala
              </span>
              <span className="text-[11px] font-semibold text-[#bcc9cd] opacity-75 hidden sm:inline-block tracking-wider uppercase">
                {getSubheaderTitle()}
              </span>
            </div>
            
            {/* Live Indicator pill */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ae176] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ae176] shadow-[0_0_8px_#4ae176]"></span>
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[#6bff8f] font-semibold truncate hover:underline">
                {isConnected ? 'En vivo · Supabase Realtime' : 'En vivo · Supabase'}
              </span>
            </div>
          </div>
        </div>

        {/* Right actions: Supabase Config, Flutter Code & Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Supabase config button */}
          <button
            onClick={onOpenSupabaseModal}
            className="px-2.5 py-1.5 rounded-lg bg-[#1a1e37]/90 hover:bg-[#242842] border border-[#4cd7f6]/30 text-[#4cd7f6] text-[12px] font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Configurar credenciales Supabase"
          >
            <span className="material-symbols-outlined text-[17px]">database</span>
            <span className="hidden md:inline">Supabase</span>
          </button>

          {/* Flutter project viewer button */}
          <button
            onClick={onOpenFlutterModal}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#06b6d4]/20 to-[#2f3aa3]/30 hover:from-[#06b6d4]/30 hover:to-[#2f3aa3]/40 border border-[#4cd7f6]/40 text-[#4cd7f6] text-[12px] font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(76,215,246,0.15)] active:scale-95"
            title="Ver código fuente en Flutter"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.314 0L2.3 12 6 15.7 21.684 0h-7.37zm.07 11.087l-5.63 5.626 5.63 5.631h7.37L16.07 16.713l5.684-5.626h-7.37z" />
            </svg>
            <span className="hidden sm:inline">Código Flutter</span>
          </button>

          {/* Profile Avatar */}
          <div 
            onClick={onOpenSupabaseModal}
            className="p-0.5 rounded-full bg-gradient-to-tr from-[#4cd7f6]/50 to-[#2f3aa3]/40 shadow-[0_0_12px_rgba(76,215,246,0.25)] cursor-pointer hover:scale-105 transition-transform"
            title="Técnico de Guardia: José Mendiola"
          >
            <img 
              alt="José Mendiola - Soporte TI" 
              className="w-8 h-8 rounded-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1etFQehWlGkVkHZthAbkG2N54_pzodq8uKpsKpBOD2gHQXmSpYKo8SiL4jO5m3PGud1CJJVgHpc7g0mrLc8yuECg7IduY5kSO183c7njkbQneVE1ijsg8hX_daUnTkhvrAozc94vameCwi88nj20_nyZPOGQM6RfYTFddOYpdqAK8iPrGXHyqwdD6ioHt4YoZnd1l1BQZUWwJMpBeav_n4RZQbY4--7tJ9qVXsRlHfbXHEDfcMiV5" 
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
