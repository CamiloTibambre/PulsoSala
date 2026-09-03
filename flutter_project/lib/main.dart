import 'package:flutter/material.dart';
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
  int _currentIndex = 1; // Default to Equipos screen

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
          color: const Color(0xFF080C25).withValues(alpha: 0.85),
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
}
