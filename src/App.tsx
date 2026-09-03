import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SalonesScreen } from './components/SalonesScreen';
import { EquiposScreen } from './components/EquiposScreen';
import { DetalleEquipoScreen } from './components/DetalleEquipoScreen';
import { NuevoIncidenteScreen } from './components/NuevoIncidenteScreen';
import { ActividadScreen } from './components/ActividadScreen';
import { ConnectionModal } from './components/ConnectionModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { FlutterCodeViewerModal } from './components/FlutterCodeViewerModal';
import { CampusSummaryModal } from './components/CampusSummaryModal';
import { NewRoomModal } from './components/NewRoomModal';
import { supabaseService } from './services/supabaseClient';
import { Room, Device, HistoryEvent } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'salones' | 'equipos' | 'reportar' | 'actividad'>('equipos');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('317');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [reportTargetDeviceId, setReportTargetDeviceId] = useState<string>('PC-317-12');

  // Modals
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState(false);
  const [isCampusSummaryOpen, setIsCampusSummaryOpen] = useState(false);
  const [isNewRoomModalOpen, setIsNewRoomModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deviceFrameMode, setDeviceFrameMode] = useState(true);

  // Data from service
  const [rooms, setRooms] = useState<Room[]>(() => supabaseService.getRooms());
  const [devices, setDevices] = useState<Device[]>(() => supabaseService.getDevices());
  const [events, setEvents] = useState<HistoryEvent[]>(() => supabaseService.getEvents());
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(
    () => supabaseService.getConfig().isConnected
  );

  // Subscribe to service updates
  useEffect(() => {
    const unsubscribe = supabaseService.subscribe(() => {
      setRooms(supabaseService.getRooms());
      setDevices(supabaseService.getDevices());
      setEvents(supabaseService.getEvents());
      setIsSupabaseConnected(supabaseService.getConfig().isConnected);
    });
    return unsubscribe;
  }, []);

  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  const currentDevice = devices.find((d) => d.id === selectedDeviceId);

  // Actions
  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setSelectedDeviceId(null);
    setActiveTab('equipos');
  };

  const handleSelectDevice = (devId: string) => {
    setSelectedDeviceId(devId);
  };

  const handleOpenReport = (devId?: string) => {
    if (devId) {
      setReportTargetDeviceId(devId);
    }
    setActiveTab('reportar');
    setSelectedDeviceId(null);
  };

  const handleToggleDeviceStatus = async (devId: string) => {
    const dev = devices.find((d) => d.id === devId);
    if (!dev) return;

    const newStatus = dev.status === 'operativo' ? 'falla' : 'operativo';
    await supabaseService.updateDeviceStatus(
      devId,
      newStatus,
      newStatus === 'falla' ? 'Falla Notificada' : undefined,
      newStatus === 'falla' ? 'Requiere asistencia técnica' : 'Sin fallas detectadas'
    );

    // Add event to timeline
    supabaseService.addEvent({
      deviceId: devId,
      type: newStatus === 'operativo' ? 'resolution' : 'status_change',
      title: newStatus === 'operativo' ? "Estado cambiado a 'Operativo'" : "Estado cambiado a 'Con Falla'",
      description: newStatus === 'operativo' ? 'Incidencia resuelta satisfactoriamente.' : 'Reporte manual generado.',
      timestamp: 'Hace unos momentos',
      author: 'Técnico: José Mendiola',
      badge: newStatus === 'operativo' ? 'RESUELTO' : 'CON FALLA',
      badgeType: newStatus === 'operativo' ? 'success' : 'error'
    });
  };

  const handleSaveIncident = async (data: {
    deviceId: string;
    status: 'operativo' | 'falla';
    subsystem: 'Hardware' | 'Monitor' | 'Periféricos' | 'Red LAN';
    observation: string;
    priority: 'Baja' | 'Media' | 'Bloqueante';
    pushAlert: boolean;
  }) => {
    await supabaseService.updateDeviceStatus(
      data.deviceId,
      data.status,
      `Falla en ${data.subsystem}`,
      data.observation
    );

    supabaseService.addEvent({
      deviceId: data.deviceId,
      type: 'status_change',
      title: `Incidencia en ${data.subsystem}`,
      description: data.observation,
      timestamp: 'Ahora mismo',
      author: 'Técnico: José Mendiola',
      badge: data.priority === 'Bloqueante' ? 'CRIT' : 'INCIDENTE',
      badgeType: 'error'
    });

    setActiveTab('equipos');
    setSelectedDeviceId(data.deviceId);
  };

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      supabaseService.recalculateRoomStats();
      setIsRefreshing(false);
    }, 800);
  };

  const handleAddNewRoom = (newRoom: Room) => {
    const updated = [newRoom, ...rooms];
    localStorage.setItem('pulsosala_rooms_cache', JSON.stringify(updated));
    setRooms(updated);
    handleSelectRoom(newRoom.id);
  };

  return (
    <div className="min-h-screen bg-[#0d112a] text-[#dee0ff] flex flex-col items-center justify-start antialiased selection:bg-[#4cd7f6] selection:text-[#003640]">
      {/* Top Banner Toolbar for Frame toggle and quick tips */}
      <div className="w-full bg-[#080c25] border-b border-white/[0.08] px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-50">
        <div className="flex items-center gap-2">
          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[#4cd7f6] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4ae176] animate-pulse"></span>
            PulsoSala
          </span>
          <span className="text-[#bcc9cd]/80 hidden md:inline">
            · Telemetría y Monitoreo en Tiempo Real (Supabase Realtime)
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile frame toggle */}
          <button
            type="button"
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="px-2.5 py-1 rounded-lg bg-[#161a33] hover:bg-[#242842] border border-white/10 text-[#dee0ff] text-[11px] font-semibold flex items-center gap-1.5 transition-all"
            title="Alternar vista de marco móvil / pantalla completa"
          >
            <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">
              {deviceFrameMode ? 'fit_screen' : 'smartphone'}
            </span>
            <span>{deviceFrameMode ? 'Vista Expandida' : 'Marco Móvil'}</span>
          </button>

          {/* Quick flutter button */}
          <button
            type="button"
            onClick={() => setIsFlutterModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-[#06b6d4]/20 hover:bg-[#06b6d4]/30 border border-[#4cd7f6]/40 text-[#4cd7f6] text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(76,215,246,0.15)]"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>Proyecto Flutter</span>
          </button>
        </div>
      </div>

      {/* Main Container Wrapper (Respects frame mode) */}
      <div
        className={`w-full transition-all duration-300 ${
          deviceFrameMode
            ? 'max-w-[440px] my-4 sm:my-8 rounded-[40px] border-[8px] border-[#1a1e37] shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(76,215,246,0.15)] overflow-hidden min-h-[884px] bg-[#0d112a] flex flex-col relative'
            : 'max-w-7xl mx-auto flex-1 flex flex-col'
        }`}
      >
        {/* If in frame mode, render realistic phone speaker & camera notch */}
        {deviceFrameMode && (
          <div className="w-full h-5 bg-[#080c25] flex items-center justify-center relative z-50">
            <div className="w-20 h-3 rounded-full bg-black/80 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#161a33] mr-2"></div>
              <div className="w-8 h-1 rounded-full bg-white/20"></div>
            </div>
          </div>
        )}

        {/* Persistent App Header */}
        <Header
          currentTab={selectedDeviceId ? 'detalle' : activeTab}
          onOpenConnectionModal={() => setIsConnectionModalOpen(true)}
          onOpenFlutterModal={() => setIsFlutterModalOpen(true)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          isConnected={isSupabaseConnected}
        />

        {/* Screen Content Render */}
        <main className="flex-1 w-full px-4 sm:px-6 pt-3 relative flex flex-col">
          {selectedDeviceId && currentDevice ? (
            <DetalleEquipoScreen
              device={currentDevice}
              events={events.filter((e) => e.deviceId === selectedDeviceId)}
              onBack={() => setSelectedDeviceId(null)}
              onToggleStatus={handleToggleDeviceStatus}
              onEditReport={(devId) => handleOpenReport(devId)}
              onCallSupport={() => setIsConnectionModalOpen(true)}
            />
          ) : activeTab === 'salones' ? (
            <SalonesScreen
              rooms={rooms}
              onSelectRoom={handleSelectRoom}
              onOpenCampusSummary={() => setIsCampusSummaryOpen(true)}
              onOpenNewRoomModal={() => setIsNewRoomModalOpen(true)}
            />
          ) : activeTab === 'equipos' ? (
            <EquiposScreen
              devices={devices}
              room={currentRoom}
              onSelectDevice={handleSelectDevice}
              onReportIncident={handleOpenReport}
              onRefreshTelemetry={handleRefreshTelemetry}
              isRefreshing={isRefreshing}
            />
          ) : activeTab === 'reportar' ? (
            <NuevoIncidenteScreen
              device={devices.find((d) => d.id === reportTargetDeviceId) || devices[3]}
              onBack={() => setActiveTab('equipos')}
              onSaveIncident={handleSaveIncident}
            />
          ) : (
            <ActividadScreen
              events={events}
              onSelectDevice={handleSelectDevice}
            />
          )}
        </main>

        {/* Persistent Bottom Navigation (Hidden only on deep detail screen to maximize thumb zone) */}
        {!selectedDeviceId && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setSelectedDeviceId(null);
            }}
          />
        )}
      </div>

      {/* Global Modals */}
      <ConnectionModal
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        onReconnect={handleRefreshTelemetry}
        onWorkOffline={() => setIsConnectionModalOpen(false)}
        isRealSupabaseConnected={isSupabaseConnected}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigSaved={() => setIsSupabaseConnected(supabaseService.getConfig().isConnected)}
      />

      <FlutterCodeViewerModal
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
      />

      <CampusSummaryModal
        isOpen={isCampusSummaryOpen}
        onClose={() => setIsCampusSummaryOpen(false)}
        rooms={rooms}
        devices={devices}
      />

      <NewRoomModal
        isOpen={isNewRoomModalOpen}
        onClose={() => setIsNewRoomModalOpen(false)}
        onAddRoom={handleAddNewRoom}
      />
    </div>
  );
}
