enum DeviceStatus { operativo, falla }

class DeviceModel {
  final String id;
  final String shortId;
  final String roomId;
  final String subId;
  final DeviceStatus status;
  final String? issueTitle;
  final String? issueDescription;
  final String specs;
  final String location;
  final String? reportedBy;
  final String? reportedAt;
  final String? subsystem;
  final String? priority;

  DeviceModel({
    required this.id,
    required this.shortId,
    required this.roomId,
    required this.subId,
    required this.status,
    this.issueTitle,
    this.issueDescription,
    required this.specs,
    required this.location,
    this.reportedBy,
    this.reportedAt,
    this.subsystem,
    this.priority,
  });

  factory DeviceModel.fromJson(Map<String, dynamic> json) {
    return DeviceModel(
      id: json['id'] as String,
      shortId: json['short_id'] ?? json['id'].toString().split('-').last,
      roomId: json['salon_id'] ?? '317',
      subId: json['sub_id'] ?? '317-01',
      status: json['estado'] == 'falla' ? DeviceStatus.falla : DeviceStatus.operativo,
      issueTitle: json['falla_titulo'],
      issueDescription: json['falla_desc'],
      specs: json['especificaciones'] ?? 'Core i7 12th Gen / 16GB RAM',
      location: json['ubicacion'] ?? 'Fila 1, Puesto 1',
      reportedBy: json['reportado_por'],
      reportedAt: json['reportado_en'],
      subsystem: json['subsistema'],
      priority: json['prioridad'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'salon_id': roomId,
      'estado': status == DeviceStatus.falla ? 'falla' : 'operativo',
      'falla_titulo': issueTitle,
      'falla_desc': issueDescription,
      'especificaciones': specs,
      'ubicacion': location,
      'subsistema': subsystem,
      'prioridad': priority,
    };
  }
}

class RoomModel {
  final String id;
  final String name;
  final String type;
  final int capacity;
  final int activeCount;
  final int faultCount;
  final int operativity;
  final bool priorityAlert;
  final String rackLocation;
  final String lastSync;

  RoomModel({
    required this.id,
    required this.name,
    required this.type,
    required this.capacity,
    required this.activeCount,
    required this.faultCount,
    required this.operativity,
    required this.priorityAlert,
    required this.rackLocation,
    required this.lastSync,
  });

  factory RoomModel.fromJson(Map<String, dynamic> json) {
    return RoomModel(
      id: json['id'] as String,
      name: json['nombre'] as String,
      type: json['tipo'] as String,
      capacity: json['capacidad'] ?? 30,
      activeCount: json['activos'] ?? 27,
      faultCount: json['fallas'] ?? 3,
      operativity: json['operatividad'] ?? 90,
      priorityAlert: (json['fallas'] ?? 0) > 2,
      rackLocation: json['rack_ubicacion'] ?? 'Rack Cisco A-4',
      lastSync: json['last_sync'] ?? 'hace 10s',
    );
  }
}
