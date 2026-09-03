import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Room, Device, HistoryEvent, SupabaseConfig } from '../types';
import { INITIAL_ROOMS, INITIAL_DEVICES_317, INITIAL_EVENTS } from '../data/mockData';

const STORAGE_KEY_CONFIG = 'pulsosala_supabase_config';
const STORAGE_KEY_DEVICES = 'pulsosala_devices_cache';
const STORAGE_KEY_ROOMS = 'pulsosala_rooms_cache';
const STORAGE_KEY_EVENTS = 'pulsosala_events_cache';

class SupabaseService {
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig;
  private listeners: Array<() => void> = [];

  constructor() {
    const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
      } catch {
        this.config = this.getDefaultConfig();
      }
    } else {
      this.config = this.getDefaultConfig();
    }

    if (this.config.url && this.config.anonKey) {
      this.initClient();
    }
  }

  private getDefaultConfig(): SupabaseConfig {
    return {
      url: '',
      anonKey: '',
      isConnected: false,
      tableName: 'equipos_salon_317',
    };
  }

  public getConfig(): SupabaseConfig {
    return { ...this.config };
  }

  public setConfig(url: string, anonKey: string): boolean {
    this.config.url = url.trim();
    this.config.anonKey = anonKey.trim();
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(this.config));

    if (this.config.url && this.config.anonKey) {
      return this.initClient();
    } else {
      this.client = null;
      this.config.isConnected = false;
      this.notify();
      return true;
    }
  }

  private initClient(): boolean {
    try {
      this.client = createClient(this.config.url, this.config.anonKey, {
        auth: { persistSession: true },
        realtime: { params: { eventsPerSecond: 10 } }
      });
      this.config.isConnected = true;
      this.notify();
      return true;
    } catch (e) {
      console.warn('Could not initialize real Supabase client:', e);
      this.client = null;
      this.config.isConnected = false;
      this.notify();
      return false;
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // Devices CRUD
  public getDevices(): Device[] {
    const cached = localStorage.getItem(STORAGE_KEY_DEVICES);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // fallback
      }
    }
    return INITIAL_DEVICES_317;
  }

  public saveDevices(devices: Device[]) {
    localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(devices));
    this.notify();
  }

  public async updateDeviceStatus(deviceId: string, newStatus: 'operativo' | 'falla', issueTitle?: string, issueDesc?: string): Promise<Device> {
    const devices = this.getDevices();
    const index = devices.findIndex(d => d.id === deviceId);
    if (index === -1) throw new Error('Dispositivo no encontrado');

    const updated: Device = {
      ...devices[index],
      status: newStatus,
      issueTitle: newStatus === 'falla' ? (issueTitle || 'Falla Notificada') : undefined,
      issueDescription: newStatus === 'falla' ? (issueDesc || 'Requiere asistencia técnica') : 'Sin fallas detectadas',
      reportedAt: newStatus === 'falla' ? 'Hace unos momentos' : undefined
    };

    devices[index] = updated;
    this.saveDevices(devices);

    // Sync room statistics
    this.recalculateRoomStats();

    // If connected to real Supabase, try to sync
    if (this.client) {
      try {
        await this.client.from(this.config.tableName).upsert({
          id: deviceId,
          status: newStatus,
          issue_title: updated.issueTitle,
          issue_desc: updated.issueDescription,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Failed to upsert device in Supabase:', err);
      }
    }

    return updated;
  }

  // Rooms CRUD
  public getRooms(): Room[] {
    const cached = localStorage.getItem(STORAGE_KEY_ROOMS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // fallback
      }
    }
    return INITIAL_ROOMS;
  }

  public recalculateRoomStats() {
    const devices = this.getDevices();
    const rooms = this.getRooms();
    const r317 = rooms.find(r => r.id === '317');
    if (r317) {
      const activeCount = devices.filter(d => d.status === 'operativo').length;
      const faultCount = devices.length - activeCount;
      r317.activeCount = activeCount;
      r317.faultCount = faultCount;
      r317.operativity = Math.round((activeCount / devices.length) * 100);
      r317.statusTag = faultCount > 0 ? 'fallas' : 'operativos';
      r317.priorityAlert = faultCount > 0;
      r317.lastSync = 'hace instantes';
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
      this.notify();
    }
  }

  // Events CRUD
  public getEvents(deviceId?: string): HistoryEvent[] {
    const cached = localStorage.getItem(STORAGE_KEY_EVENTS);
    let events = INITIAL_EVENTS;
    if (cached) {
      try {
        events = JSON.parse(cached);
      } catch {}
    }
    if (deviceId) {
      return events.filter(e => e.deviceId === deviceId);
    }
    return events;
  }

  public addEvent(event: Omit<HistoryEvent, 'id'>): HistoryEvent {
    const events = this.getEvents();
    const newEvent: HistoryEvent = {
      ...event,
      id: `evt-${Date.now()}`
    };
    events.unshift(newEvent);
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    this.notify();
    return newEvent;
  }
}

export const supabaseService = new SupabaseService();
