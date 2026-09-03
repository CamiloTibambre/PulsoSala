import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/supabase_config.dart';
import '../models/models.dart';

class SupabaseService {
  final SupabaseClient _client = SupabaseConfig.client;

  // Stream de equipos en tiempo real mediante Supabase Realtime CDC
  Stream<List<DeviceModel>> streamDevices(String roomId) {
    return _client
        .from('equipos_salon_$roomId')
        .stream(primaryKey: ['id'])
        .map((maps) => maps.map((m) => DeviceModel.fromJson(m)).toList());
  }

  // Stream de salones en tiempo real
  Stream<List<RoomModel>> streamRooms() {
    return _client
        .from('salones')
        .stream(primaryKey: ['id'])
        .map((maps) => maps.map((m) => RoomModel.fromJson(m)).toList());
  }

  // Actualizar estado de equipo
  Future<void> updateDeviceStatus({
    required String roomId,
    required String deviceId,
    required DeviceStatus status,
    String? title,
    String? description,
  }) async {
    await _client.from('equipos_salon_$roomId').update({
      'estado': status == DeviceStatus.falla ? 'falla' : 'operativo',
      'falla_titulo': title,
      'falla_desc': description,
      'updated_at': DateTime.now().toIso8601String(),
    }).eq('id', deviceId);
  }

  // Registrar nuevo incidente
  Future<void> createIncident({
    required String roomId,
    required String deviceId,
    required String subsystem,
    required String observation,
    required String priority,
    required bool pushAlert,
  }) async {
    // 1. Marcar equipo con falla
    await _client.from('equipos_salon_$roomId').update({
      'estado': 'falla',
      'falla_titulo': 'Incidencia: $subsystem',
      'falla_desc': observation,
      'subsistema': subsystem,
      'prioridad': priority,
      'updated_at': DateTime.now().toIso8601String(),
    }).eq('id', deviceId);

    // 2. Insertar en bitácora de incidentes
    await _client.from('incidentes').insert({
      'salon_id': roomId,
      'equipo_id': deviceId,
      'subsistema': subsystem,
      'observacion': observation,
      'prioridad': priority,
      'alerta_push': pushAlert,
      'creado_en': DateTime.now().toIso8601String(),
    });
  }
}
