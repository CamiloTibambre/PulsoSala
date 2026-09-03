import 'package:flutter/material.dart';
import '../models/models.dart';
import 'equipos_screen.dart';

class SalonesScreen extends StatefulWidget {
  const SalonesScreen({super.key});

  @override
  State<SalonesScreen> createState() => _SalonesScreenState();
}

class _SalonesScreenState extends State<SalonesScreen> {
  String _filter = 'todos';
  final TextEditingController _searchController = TextEditingController();

  final List<RoomModel> _rooms = [
    RoomModel(
      id: '317',
      name: 'Salón 317',
      type: 'Lab Redes y Telecom',
      capacity: 30,
      activeCount: 27,
      faultCount: 3,
      operativity: 90,
      priorityAlert: true,
      rackLocation: 'Rack Cisco A-4',
      lastSync: 'hace 10s',
    ),
    RoomModel(
      id: '318',
      name: 'Salón 318',
      type: 'Lab Inteligencia Artificial',
      capacity: 30,
      activeCount: 29,
      faultCount: 1,
      operativity: 96,
      priorityAlert: false,
      rackLocation: '30 GPUs RTX',
      lastSync: 'hace 1m',
    ),
    RoomModel(
      id: '319',
      name: 'Salón 319',
      type: 'Lab Desarrollo de Software',
      capacity: 30,
      activeCount: 30,
      faultCount: 0,
      operativity: 100,
      priorityAlert: false,
      rackLocation: 'IDE & Docker Ready',
      lastSync: 'hace 30s',
    ),
    RoomModel(
      id: '204',
      name: 'Salón 204',
      type: 'Lab Multimedia y Diseño',
      capacity: 25,
      activeCount: 22,
      faultCount: 3,
      operativity: 88,
      priorityAlert: false,
      rackLocation: 'Estaciones Mac & PC',
      lastSync: 'hace 2m',
    ),
    RoomModel(
      id: '205',
      name: 'Salón 205',
      type: 'Taller de Mantenimiento',
      capacity: 20,
      activeCount: 18,
      faultCount: 2,
      operativity: 90,
      priorityAlert: false,
      rackLocation: 'Herramientas ESD',
      lastSync: 'hace 4m',
    ),
    RoomModel(
      id: '102',
      name: 'Salón 102',
      type: 'Lab Fundamentos de Programación',
      capacity: 24,
      activeCount: 24,
      faultCount: 0,
      operativity: 100,
      priorityAlert: false,
      rackLocation: 'Aforo Completo',
      lastSync: 'hace 15s',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final query = _searchController.text.toLowerCase();
    final filtered = _rooms.where((r) {
      final matchesSearch = query.isEmpty ||
          r.name.toLowerCase().contains(query) ||
          r.type.toLowerCase().contains(query);
      final matchesFilter = _filter == 'todos' ||
          (_filter == 'fallas' && r.faultCount > 0) ||
          (_filter == 'operativos' && r.faultCount == 0);
      return matchesSearch && matchesFilter;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF0D112A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF080C25).withOpacity(0.8),
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFF161A33),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFF4CD7F6).withOpacity(0.4)),
              ),
              child: const Icon(Icons.desktop_windows, color: Color(0xFF4CD7F6), size: 18),
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('PulsoSala', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: Color(0xFF4AE176),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Text('EN VIVO · SUPABASE', style: TextStyle(fontSize: 9, color: Color(0xFF6BFF8F))),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            'CAMPUS CENTRAL · EDIFICIO TECNOLÓGICO',
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFBCC9CD), letterSpacing: 1.2),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text('Salones de Cómputo', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFFDEE0FF))),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF242842),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF4CD7F6).withOpacity(0.3)),
                ),
                child: const Text('6 ESPACIOS', style: TextStyle(fontSize: 10, color: Color(0xFF4CD7F6), fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Search box
          TextField(
            controller: _searchController,
            onChanged: (_) => setState(() {}),
            style: const TextStyle(color: Color(0xFFDEE0FF), fontSize: 14),
            decoration: InputDecoration(
              hintText: 'Buscar salón, tecnología, IP o falla...',
              hintStyle: const TextStyle(color: Color(0xFFBCC9CD), fontSize: 13),
              prefixIcon: const Icon(Icons.search, color: Color(0xFF4CD7F6), size: 20),
              filled: true,
              fillColor: const Color(0xFF161A33).withOpacity(0.8),
              contentPadding: const EdgeInsets.symmetric(vertical: 0),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            ),
          ),
          const SizedBox(height: 12),
          // Filter chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterChip('todos', 'Todos (${_rooms.length})'),
                const SizedBox(width: 8),
                _buildFilterChip('fallas', 'Con fallas (3)'),
                const SizedBox(width: 8),
                _buildFilterChip('operativos', '100% Operativos (3)'),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Room cards
          ...filtered.map((room) => _buildRoomCard(room)),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String id, String label) {
    final isSelected = _filter == id;
    return GestureDetector(
      onTap: () => setState(() => _filter = id),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF4CD7F6).withOpacity(0.2) : const Color(0xFF242842).withOpacity(0.6),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? const Color(0xFF4CD7F6) : Colors.transparent),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? const Color(0xFF4CD7F6) : const Color(0xFFBCC9CD),
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
        ),
      ),
    );
  }

  Widget _buildRoomCard(RoomModel room) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (ctx) => EquiposScreen(roomId: room.id)),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1A1E37).withOpacity(0.7),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: room.priorityAlert ? const Color(0xFFFFB4AB).withOpacity(0.3) : Colors.white10,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF06B6D4).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.router, color: Color(0xFF4CD7F6)),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(room.name, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Color(0xFFDEE0FF))),
                      Text(room.type, style: const TextStyle(fontSize: 12, color: Color(0xFFBCC9CD))),
                    ],
                  ),
                ),
                const Text('Detalle', style: TextStyle(color: Color(0xFF4CD7F6), fontWeight: FontWeight.bold, fontSize: 13)),
                const Icon(Icons.arrow_forward, color: Color(0xFF4CD7F6), size: 16),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                const Text('DISPONIBILIDAD DE NODOS', style: TextStyle(fontSize: 10, color: Color(0xFFBCC9CD), fontWeight: FontWeight.bold)),
                Text('${room.activeCount} / ${room.capacity} (${room.operativity}%)', style: const TextStyle(fontSize: 11, color: Color(0xFFDEE0FF))),
              ],
            ),
            const SizedBox(height: 6),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: room.operativity / 100,
                backgroundColor: const Color(0xFF080C25),
                valueColor: AlwaysStoppedAnimation<Color>(
                  room.operativity == 100 ? const Color(0xFF4AE176) : const Color(0xFF4CD7F6),
                ),
                minHeight: 6,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
