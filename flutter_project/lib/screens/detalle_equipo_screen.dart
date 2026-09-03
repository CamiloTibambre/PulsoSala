import 'package:flutter/material.dart';
import '../models/models.dart';

class DetalleEquipoScreen extends StatefulWidget {
  final DeviceModel device;
  const DetalleEquipoScreen({super.key, required this.device});

  @override
  State<DetalleEquipoScreen> createState() => _DetalleEquipoScreenState();
}

class _DetalleEquipoScreenState extends State<DetalleEquipoScreen> {
  late bool _isFalla;

  @override
  void initState() {
    super.initState();
    _isFalla = widget.device.status == DeviceStatus.falla;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D112A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF080C25).withValues(alpha: 0.8),
        title: const Text('Detalle Equipo',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('NODO #${widget.device.subId}',
                  style: const TextStyle(
                      fontSize: 11,
                      color: Color(0xFF4CD7F6),
                      fontWeight: FontWeight.bold)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                    color: const Color(0xFF242842),
                    borderRadius: BorderRadius.circular(10)),
                child: const Text('REV. 2.4',
                    style: TextStyle(fontSize: 10, color: Color(0xFFBCC9CD))),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(widget.device.id,
              style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFDEE0FF))),
          const SizedBox(height: 16),
          // Hero card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _isFalla
                  ? const Color(0xFF93000A).withValues(alpha: 0.3)
                  : const Color(0xFF14BF59).withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                  color: _isFalla
                      ? const Color(0xFFFFB4AB).withValues(alpha: 0.4)
                      : const Color(0xFF4AE176).withValues(alpha: 0.4)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: _isFalla
                            ? const Color(0xFF93000A)
                            : const Color(0xFF14BF59),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(_isFalla ? 'CON FALLA' : 'OPERATIVO',
                          style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: Colors.white)),
                    ),
                    const Text('Hace 14 min',
                        style:
                            TextStyle(fontSize: 12, color: Color(0xFFBCC9CD))),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  widget.device.issueTitle ??
                      'Sin señal de video / Monitor parpadea',
                  style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFDEE0FF)),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF080C25).withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Row(
                    children: [
                      CircleAvatar(
                          backgroundColor: Color(0xFF2F3AA3),
                          child: Text('CM',
                              style: TextStyle(
                                  color: Colors.white, fontSize: 12))),
                      SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Prof. Carlos Mendoza',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                  color: Color(0xFFDEE0FF))),
                          Text('Clase de Redes II · Turno Mañana',
                              style: TextStyle(
                                  fontSize: 11, color: Color(0xFFBCC9CD))),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              setState(() => _isFalla = !_isFalla);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                    content: Text(_isFalla
                        ? 'Incidencia reabierta'
                        : 'Equipo marcado como Operativo')),
              );
            },
            icon: Icon(_isFalla ? Icons.check_circle : Icons.replay,
                color: const Color(0xFF003640)),
            label: Text(
                _isFalla
                    ? 'Marcar como Operativo / Resuelto'
                    : 'Reabrir Incidencia',
                style: const TextStyle(
                    color: Color(0xFF003640), fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor:
                  _isFalla ? const Color(0xFF4AE176) : const Color(0xFF4CD7F6),
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
            ),
          ),
        ],
      ),
    );
  }
}
