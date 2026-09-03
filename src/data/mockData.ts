import { Room, Device, HistoryEvent } from '../types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: '317',
    name: 'Salón 317',
    type: 'Lab Redes y Telecom',
    capacity: 30,
    activeCount: 27,
    faultCount: 3,
    operativity: 90,
    statusTag: 'fallas',
    priorityAlert: true,
    rackLocation: 'Rack Cisco A-4',
    lastSync: 'hace 10s',
    description: 'Capacidad: 30 Equipos All-in-One · Vista Planta'
  },
  {
    id: '318',
    name: 'Salón 318',
    type: 'Lab Inteligencia Artificial',
    capacity: 30,
    activeCount: 29,
    faultCount: 1,
    operativity: 96,
    statusTag: 'fallas',
    priorityAlert: false,
    rackLocation: '30 GPUs RTX',
    lastSync: 'hace 1m',
    description: '1 falla menor: Periférico mouse'
  },
  {
    id: '319',
    name: 'Salón 319',
    type: 'Lab Desarrollo de Software',
    capacity: 30,
    activeCount: 30,
    faultCount: 0,
    operativity: 100,
    statusTag: 'operativos',
    priorityAlert: false,
    rackLocation: 'IDE & Docker Ready',
    lastSync: 'hace 30s',
    description: 'Todo en línea sin alertas'
  },
  {
    id: '204',
    name: 'Salón 204',
    type: 'Lab Multimedia y Diseño',
    capacity: 25,
    activeCount: 22,
    faultCount: 3,
    operativity: 88,
    statusTag: 'fallas',
    priorityAlert: false,
    rackLocation: 'Estaciones Mac & PC',
    lastSync: 'hace 2m',
    description: '3 fallas en GPU Render'
  },
  {
    id: '205',
    name: 'Salón 205',
    type: 'Taller de Mantenimiento',
    capacity: 20,
    activeCount: 18,
    faultCount: 2,
    operativity: 90,
    statusTag: 'fallas',
    priorityAlert: false,
    rackLocation: 'Herramientas ESD',
    lastSync: 'hace 4m',
    description: '2 bancos en calibración'
  },
  {
    id: '102',
    name: 'Salón 102',
    type: 'Lab Fundamentos de Programación',
    capacity: 24,
    activeCount: 24,
    faultCount: 0,
    operativity: 100,
    statusTag: 'operativos',
    priorityAlert: false,
    rackLocation: 'Aforo Completo',
    lastSync: 'hace 15s',
    description: 'Sin anomalías'
  }
];

export const INITIAL_DEVICES_317: Device[] = Array.from({ length: 30 }, (_, index) => {
  const num = index + 1;
  const numStr = num < 10 ? `0${num}` : `${num}`;
  const id = `PC-317-${numStr}`;
  const shortId = `PC-${numStr}`;
  const subId = `317-${numStr}`;

  // Known issues from screenshots:
  if (num === 4) {
    return {
      id,
      shortId,
      roomId: '317',
      subId,
      status: 'falla',
      issueTitle: 'Sin señal de video / Monitor parpadea',
      issueDescription: 'Sin señal HDMI hacia monitor auxiliar',
      specs: 'Core i7 12th Gen / 16GB RAM',
      location: 'Fila 2, Puesto 4',
      reportedBy: 'Prof. Carlos Mendoza (Clase de Redes II · Turno Mañana)',
      reportedAt: 'Hace 14 min',
      subsystem: 'Monitor',
      priority: 'Bloqueante',
      iconName: 'error'
    };
  }
  if (num === 12) {
    return {
      id,
      shortId,
      roomId: '317',
      subId,
      status: 'falla',
      issueTitle: 'Falla Periférico',
      issueDescription: 'Teclado/Mouse - Puertos frontales sin responder',
      specs: 'Core i7 12th Gen / 16GB RAM',
      location: 'Fila C, Puesto 12',
      reportedBy: 'Prof. Diana Romero',
      reportedAt: 'Hace 32 min',
      subsystem: 'Periféricos',
      priority: 'Media',
      iconName: 'mouse'
    };
  }
  if (num === 22) {
    return {
      id,
      shortId,
      roomId: '317',
      subId,
      status: 'falla',
      issueTitle: 'Falla Crítica: Fuente de poder',
      issueDescription: 'No enciende - Equipo no responde al pulso de encendido',
      specs: 'Core i7 12th Gen / 16GB RAM',
      location: 'Fila 4, Puesto 22',
      reportedBy: 'Técnico Laura V.',
      reportedAt: 'Hace 1 hora',
      subsystem: 'Hardware',
      priority: 'Bloqueante',
      iconName: 'power_off'
    };
  }

  return {
    id,
    shortId,
    roomId: '317',
    subId,
    status: 'operativo',
    issueTitle: undefined,
    issueDescription: 'Sin anomalías detectadas en periféricos ni red.',
    specs: 'All-in-One Core i7 / 16GB',
    location: `Puesto ${num}`,
    iconName: 'desktop_windows'
  };
});

export const INITIAL_EVENTS: HistoryEvent[] = [
  {
    id: 'evt-1',
    deviceId: 'PC-317-04',
    type: 'status_change',
    title: "Estado cambiado a 'Con Falla'",
    description: 'Reporte manual generado en terminal por Prof. Carlos M. durante sesión lectiva.',
    timestamp: '10:42 AM',
    author: 'Prof. Carlos Mendoza',
    badge: 'CON FALLA',
    badgeType: 'error',
    logId: '7f83b2-cdc'
  },
  {
    id: 'evt-2',
    deviceId: 'PC-317-04',
    type: 'maintenance',
    title: 'Mantenimiento preventivo',
    description: 'Limpieza de ductos térmicos y actualización del paquete de controladores de red. Operativo confirmado.',
    timestamp: 'Ayer, 18:30',
    author: 'Técnico: Laura V.',
    badge: 'OPERATIVO',
    badgeType: 'success'
  },
  {
    id: 'evt-3',
    deviceId: 'PC-317-04',
    type: 'resolution',
    title: 'Falla de periférico resuelta',
    description: 'Sustitución de teclado mecánico en puerto USB posterior 02. Reemplazo validado.',
    timestamp: 'Hace 3 días',
    author: 'Técnico: José Mendiola',
    badge: 'RESUELTO',
    badgeType: 'info'
  }
];
