import React, { useState } from 'react';

interface FlutterCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterCodeViewerModal: React.FC<FlutterCodeViewerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('main.dart');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const files: Record<string, { label: string; lang: string; code: string }> = {
    'main.dart': {
      label: 'lib/main.dart',
      lang: 'dart',
      code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/salones_screen.dart';
import 'screens/equipos_screen.dart';
import 'screens/nuevo_incidente_screen.dart';
import 'screens/connection_screen.dart';
import 'config/supabase_config.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await SupabaseConfig.initialize();
  } catch (e) {
    debugPrint('Supabase init warning: $e');
  }
  runApp(const PulsoSalaApp());
}

class PulsoSalaApp extends StatelessWidget {
  const PulsoSalaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PulsoSala',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0D112A),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF4CD7F6),
          secondary: Color(0xFFBDC2FF),
          tertiary: Color(0xFF4AE176),
          error: Color(0xFFFFB4AB),
          surface: Color(0xFF161A33),
          onSurface: Color(0xFFDEE0FF),
        ),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 1; // Default to Equipos (Salón 317)

  final List<Widget> _screens = const [
    SalonesScreen(),
    EquiposScreen(roomId: '317'),
    NuevoIncidenteScreen(deviceId: 'PC-317-12'),
    ConnectionScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF080C25).withOpacity(0.85),
          border: const Border(top: BorderSide(color: Colors.white10)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color(0xFF4CD7F6),
          unselectedItemColor: const Color(0xFFBCC9CD),
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          unselectedLabelStyle: const TextStyle(fontSize: 12),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.meeting_room_outlined),
              activeIcon: Icon(Icons.meeting_room),
              label: 'Salones',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.grid_view_outlined),
              activeIcon: Icon(Icons.grid_view),
              label: 'Equipos',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.warning_amber_rounded),
              activeIcon: Icon(Icons.warning_rounded),
              label: 'Reportar',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.stream),
              activeIcon: Icon(Icons.stream),
              label: 'Actividad',
            ),
          ],
        ),
      ),
    );
  }
}`
    },
    'supabase_service.dart': {
      label: 'lib/services/supabase_service.dart',
      lang: 'dart',
      code: `import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/supabase_config.dart';
import '../models/models.dart';

class SupabaseService {
  final SupabaseClient _client = SupabaseConfig.client;

  // Stream de equipos en tiempo real mediante Supabase Realtime CDC
  Stream<List<DeviceModel>> streamDevices(String roomId) {
    return _client
        .from('equipos_salon_\$roomId')
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
    await _client.from('equipos_salon_\$roomId').update({
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
    await _client.from('equipos_salon_\$roomId').update({
      'estado': 'falla',
      'falla_titulo': 'Incidencia: \$subsystem',
      'falla_desc': observation,
      'subsistema': subsystem,
      'prioridad': priority,
      'updated_at': DateTime.now().toIso8601String(),
    }).eq('id', deviceId);

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
}`
    },
    'supabase_config.dart': {
      label: 'lib/config/supabase_config.dart',
      lang: 'dart',
      code: `import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://xyzcompany.supabase.co',
  );

  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  );

  static Future<void> initialize() async {
    await Supabase.initialize(
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
      realtimeClientOptions: const RealtimeClientOptions(
        eventsPerSecond: 10,
      ),
    );
  }

  static SupabaseClient get client => Supabase.instance.client;
}`
    },
    'models.dart': {
      label: 'lib/models/models.dart',
      lang: 'dart',
      code: `enum DeviceStatus { operativo, falla }

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
}`
    },
    'pubspec.yaml': {
      label: 'pubspec.yaml',
      lang: 'yaml',
      code: `name: pulsosala
description: "PulsoSala - Sistema de telemetría y monitoreo de salones y terminales con Supabase Realtime"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  supabase_flutter: ^2.8.0
  flutter_riverpod: ^2.5.1
  google_fonts: ^6.2.1
  lucide_icons: ^0.263.0
  flutter_animate: ^4.5.0
  intl: ^0.19.0

flutter:
  uses-material-design: true`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(files[selectedFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0d112a] border border-white/20 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col gap-4 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#06b6d4] to-[#4cd7f6] flex items-center justify-center text-[#003640] font-bold shadow-[0_0_15px_rgba(76,215,246,0.3)]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.314 0L2.3 12 6 15.7 21.684 0h-7.37zm.07 11.087l-5.63 5.626 5.63 5.631h7.37L16.07 16.713l5.684-5.626h-7.37z" />
              </svg>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#dee0ff]">
                Proyecto Flutter (PulsoSala)
              </h3>
              <p className="text-xs text-[#bcc9cd]">
                Código fuente completo Flutter con cliente Supabase Realtime integrado
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

        {/* File Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {Object.keys(files).map((fileName) => {
            const isSelected = selectedFile === fileName;
            return (
              <button
                key={fileName}
                type="button"
                onClick={() => setSelectedFile(fileName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#242842] border-[#4cd7f6] text-[#4cd7f6] shadow-[0_0_12px_rgba(76,215,246,0.2)]'
                    : 'bg-[#161a33] border-white/5 text-[#bcc9cd] hover:text-[#dee0ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">code</span>
                <span>{files[fileName].label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content */}
        <div className="relative flex-1 rounded-2xl bg-[#080c25] border border-white/10 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-[#161a33]/80 border-b border-white/5">
            <span className="text-[11px] font-mono text-[#bcc9cd]">
              {files[selectedFile].label}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1 rounded-md bg-[#242842] border border-white/10 text-xs font-semibold text-[#dee0ff] hover:border-[#4cd7f6] flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copiado al portapapeles' : 'Copiar Archivo'}</span>
            </button>
          </div>

          <pre className="flex-1 p-4 text-xs font-mono text-[#dee0ff] overflow-y-auto leading-relaxed max-h-[50vh] selection:bg-[#4cd7f6] selection:text-[#003640]">
            <code>{files[selectedFile].code}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs text-[#bcc9cd]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#4ae176]">check_circle</span>
            <span>Todos los archivos están guardados en la carpeta <code>/flutter_project/</code></span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#242842] hover:bg-[#2f334e] text-xs font-semibold text-[#dee0ff] transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
