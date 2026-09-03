import React, { useState } from 'react';
import { supabaseService } from '../services/supabaseClient';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const currentConfig = supabaseService.getConfig();
  const [url, setUrl] = useState(currentConfig.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey || '');
  const [statusMsg, setStatusMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const success = supabaseService.setConfig(url, anonKey);
    if (success) {
      setStatusMsg({
        text: url && anonKey ? 'Configuración guardada y cliente Supabase inicializado' : 'Modo local activo sin credenciales externas',
        success: true
      });
      setTimeout(() => {
        onConfigSaved();
        onClose();
      }, 1000);
    } else {
      setStatusMsg({ text: 'Error al inicializar cliente con esas credenciales', success: false });
    }
  };

  const sqlSchema = `-- SQL para Supabase (Crear en el SQL Editor de tu proyecto):
create table if not exists salones (
  id text primary key,
  nombre text not null,
  tipo text not null,
  capacidad int not null default 30,
  activos int not null default 27,
  fallas int not null default 3,
  operatividad int not null default 90,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists equipos_salon_317 (
  id text primary key,
  salon_id text default '317',
  numero text not null,
  estado text not null check (estado in ('operativo', 'falla')),
  falla_titulo text,
  falla_desc text,
  subsistema text,
  prioridad text,
  especificaciones text,
  ubicacion text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar Realtime para suscripciones en vivo
alter publication supabase_realtime add table equipos_salon_317;
alter publication supabase_realtime add table salones;
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d112a] border border-white/20 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col gap-4 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/20 border border-[#4cd7f6]/40 flex items-center justify-center text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[24px]">database</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#dee0ff]">
                Conexión a Supabase
              </h3>
              <p className="text-xs text-[#bcc9cd]">
                Sincronización en tiempo real de terminales y salones
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

        {statusMsg && (
          <div
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              statusMsg.success
                ? 'bg-[#14bf59]/20 border-[#4ae176] text-[#6bff8f]'
                : 'bg-[#93000a]/30 border-[#ffb4ab] text-[#ffdad6]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {statusMsg.success ? 'check_circle' : 'error'}
            </span>
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-bold text-[#bcc9cd] uppercase tracking-wider block mb-1">
              SUPABASE PROJECT URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full h-11 px-3.5 rounded-xl bg-[#161a33] border border-white/10 text-[#dee0ff] text-xs font-mono placeholder:text-[#bcc9cd]/40 focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#bcc9cd] uppercase tracking-wider block mb-1">
              SUPABASE ANON / PUBLIC KEY
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full h-11 px-3.5 rounded-xl bg-[#161a33] border border-white/10 text-[#dee0ff] text-xs font-mono placeholder:text-[#bcc9cd]/40 focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#161a33]/60 border border-white/5 flex items-start gap-2 text-xs text-[#bcc9cd]">
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6] mt-0.5 flex-shrink-0">
              info
            </span>
            <p className="leading-relaxed">
              Si dejas los campos vacíos, la app funciona en <strong>modo local autónomo</strong> simulando
              telemetría en vivo, CDC (Change Data Capture) y persistencia en navegador.
            </p>
          </div>
        </div>

        {/* SQL Schema Preview Accordion */}
        <div className="border-t border-white/10 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#4cd7f6] uppercase tracking-wider">
              Esquema SQL para Supabase
            </span>
            <button
              type="button"
              onClick={copySql}
              className="px-2.5 py-1 rounded-lg bg-[#242842] border border-white/10 text-[#dee0ff] text-[11px] font-semibold flex items-center gap-1 hover:border-[#4cd7f6]"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copiedSql ? 'check' : 'content_copy'}
              </span>
              <span>{copiedSql ? 'Copiado!' : 'Copiar SQL'}</span>
            </button>
          </div>
          <pre className="p-2.5 rounded-xl bg-[#080c25] border border-white/5 text-[10px] font-mono text-[#bcc9cd] overflow-x-auto max-h-32">
            {sqlSchema}
          </pre>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] text-[#003640] font-['Plus_Jakarta_Sans'] text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(6,182,212,0.4)]"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Guardar y Conectar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-4 rounded-xl bg-[#1a1e37] border border-white/10 text-[#bcc9cd] text-xs font-semibold hover:text-[#dee0ff]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
