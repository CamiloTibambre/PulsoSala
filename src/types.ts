export type DeviceStatus = 'operativo' | 'falla';

export interface Device {
  id: string; // e.g. "PC-317-04"
  shortId: string; // e.g. "PC-04"
  roomId: string; // e.g. "317"
  subId: string; // e.g. "317-04"
  status: DeviceStatus;
  issueTitle?: string;
  issueDescription?: string;
  specs: string; // e.g. "Core i7 12th Gen / 16GB RAM"
  location: string; // e.g. "Fila 2, Puesto 4"
  reportedBy?: string;
  reportedAt?: string;
  iconName?: string;
  subsystem?: 'Hardware' | 'Monitor' | 'Periféricos' | 'Red LAN';
  priority?: 'Baja' | 'Media' | 'Bloqueante';
}

export interface Room {
  id: string; // "317"
  name: string; // "Salón 317"
  type: string; // "Lab Redes y Telecom"
  capacity: number; // 30
  activeCount: number; // 27
  faultCount: number; // 3
  operativity: number; // 90
  statusTag: 'fallas' | 'operativos';
  priorityAlert?: boolean;
  rackLocation?: string;
  lastSync: string;
  description: string;
}

export interface HistoryEvent {
  id: string;
  deviceId: string;
  type: 'status_change' | 'maintenance' | 'resolution';
  title: string;
  description: string;
  timestamp: string;
  author: string;
  badge: string;
  badgeType: 'error' | 'success' | 'info';
  logId?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  tableName: string;
}
