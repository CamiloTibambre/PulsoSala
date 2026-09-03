import 'package:flutter/material.dart';
import '../models/models.dart';
import 'detalle_equipo_screen.dart';
import 'nuevo_incidente_screen.dart';

class EquiposScreen extends StatefulWidget {
  final String roomId;
  const EquiposScreen({super.key, this.roomId = '317'});

  @override
  State<EquiposScreen> createState() => _EquiposScreenState();
}

class _EquiposScreenState extends State<EquiposScreen> {
  late List<DeviceModel> _devices;

  @override
  void initState() {
    super.initState();
    _devices = List.generate(30, (i) {
      final num = i + 1;
      final numStr = num < 10 ? '0$num' : '$num';
      final isFalla = num == 4 || num == 12 || num == 22;

      return DeviceModel(
        id: 'PC-317-$numStr',
        shortId: 'PC-$numStr',
        roomId: widget.roomId,
        subId: '317-$numStr',
        status: isFalla ? DeviceStatus.falla : DeviceStatus.operativo,
        issueTitle: num == 4 ? 'Sin señal de video / Monitor parpadea' : num == 12 ? 'Falla Teclado/Mouse' : num == 22 ? 'No enciende' : null,
        issueDescription: num == 4 ? 'Sin señal HDMI' : num == 12 ? 'Teclado/Mouse' : num == 22 ? 'No enciende' : 'Sin fallas detectadas',
        specs: 'Core i7 12th Gen / 16GB RAM',
        location: 'Fila ${((num - 1) ~/ 6) + 1}, Puesto $num',
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final activeCount = _devices.where((d) => d.status == DeviceStatus.operativo).length;
    final faultCount = _devices.length - activeCount;
    final operativity = (activeCount / _devices.length * 100).round();

    return Scaffold(
      backgroundColor: const Color(0xFF0D112A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF080C25).withOpacity(0.85),
        elevation: 0,
        title: const Text('Salón 317 · Equipos', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Summary Glass Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF161A33).withOpacity(0.7),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white10),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Salón ${widget.roomId}', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFFDEE0FF))),
                        const Text('Capacidad: 30 Equipos · Vista Planta', style: TextStyle(fontSize: 12, color: Color(0xFFBCC9CD))),
                      ],
                    ),
                    Text('$operativity%', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF4AE176))),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF14BF59).withOpacity(0.15),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFF4AE176).withOpacity(0.3)),
                        ),
                        child: Text('$activeCount Activos OK', style: const TextStyle(color: Color(0xFF6BFF8F), fontWeight: FontWeight.bold, fontSize: 13)),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF93000A).withOpacity(0.4),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFFFB4AB).withOpacity(0.3)),
                        ),
                        child: Text('$faultCount Con Falla CRIT', style: const TextStyle(color: Color(0xFFFFB4AB), fontWeight: FontWeight.bold, fontSize: 13)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // 30 PC Grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollExceptionScroll(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              childAspectRatio: 1.25,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
            ),
            itemCount: _devices.length,
            itemBuilder: (context, index) {
              final dev = _devices[index];
              final isFalla = dev.status == DeviceStatus.falla;

              return GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (ctx) => DetalleEquipoScreen(device: dev),
                    ),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isFalla ? const Color(0xFF93000A).withOpacity(0.4) : const Color(0xFF1A1E37).withOpacity(0.8),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: isFalla ? const Color(0xFFFFB4AB).withOpacity(0.5) : Colors.white10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Icon(isFalla ? Icons.error_outline : Icons.desktop_windows, color: isFalla ? const Color(0xFFFFB4AB) : const Color(0xFF4AE176), size: 18),
                          Text(isFalla ? 'FALLA' : 'OK', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: isFalla ? const Color(0xFFFFB4AB) : const Color(0xFF4AE176))),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(dev.shortId, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: isFalla ? const Color(0xFFFFB4AB) : const Color(0xFFDEE0FF))),
                          Text(isFalla ? dev.issueDescription! : dev.subId, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 10, color: Color(0xFFBCC9CD))),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (ctx) => const NuevoIncidenteScreen()),
              );
            },
            icon: const Icon(Icons.add_alert, color: Color(0xFF003640)),
            label: const Text('+ Reportar falla en este salón', style: TextStyle(color: Color(0xFF003640), fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4CD7F6),
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
            ),
          ),
        ],
      ),
    );
  }
}
