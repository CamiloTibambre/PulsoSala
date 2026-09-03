import 'package:flutter/material.dart';

class NuevoIncidenteScreen extends StatefulWidget {
  final String deviceId;
  const NuevoIncidenteScreen({super.key, this.deviceId = 'PC-317-12'});

  @override
  State<NuevoIncidenteScreen> createState() => _NuevoIncidenteScreenState();
}

class _NuevoIncidenteScreenState extends State<NuevoIncidenteScreen> {
  String _state = 'falla';
  String _subsystem = 'Monitor';
  final TextEditingController _obsController = TextEditingController(
    text:
        'Pantalla secundaria no recibe señal DisplayPort tras reinicio de nodo.',
  );
  bool _pushAlert = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D112A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF080C25).withValues(alpha: 0.85),
        title: const Text('Nuevo Incidente',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFF161A33),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white10),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.desktop_windows, color: Color(0xFF4CD7F6)),
                    const SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('PUESTO TELEMETRÍA',
                            style: TextStyle(
                                fontSize: 10,
                                color: Color(0xFF4CD7F6),
                                fontWeight: FontWeight.bold)),
                        Text('${widget.deviceId} · Fila C',
                            style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFDEE0FF))),
                      ],
                    ),
                  ],
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                      color: const Color(0xFF080C25),
                      borderRadius: BorderRadius.circular(12)),
                  child: const Text('SALA 03',
                      style: TextStyle(fontSize: 10, color: Color(0xFFBCC9CD))),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Semáforo Táctil
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _state = 'operativo'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      color: _state == 'operativo'
                          ? const Color(0xFF14BF59).withValues(alpha: 0.3)
                          : const Color(0xFF161A33),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                          color: _state == 'operativo'
                              ? const Color(0xFF4AE176)
                              : Colors.white10),
                    ),
                    child: const Column(
                      children: [
                        Icon(Icons.check_circle, color: Color(0xFF4AE176)),
                        SizedBox(height: 4),
                        Text('Operativo',
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFDEE0FF))),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _state = 'falla'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      color: _state == 'falla'
                          ? const Color(0xFF93000A).withValues(alpha: 0.5)
                          : const Color(0xFF161A33),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                          color: _state == 'falla'
                              ? const Color(0xFFFFB4AB)
                              : Colors.white10),
                    ),
                    child: const Column(
                      children: [
                        Icon(Icons.error, color: Color(0xFFFFB4AB)),
                        SizedBox(height: 4),
                        Text('Con Falla',
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFDEE0FF))),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text('SUBSISTEMA AFECTADO',
              style: TextStyle(
                  fontSize: 11,
                  color: Color(0xFFBCC9CD),
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children:
                ['Hardware', 'Monitor', 'Periféricos', 'Red LAN'].map((sub) {
              final isSel = _subsystem == sub;
              return ChoiceChip(
                label: Text(sub),
                selected: isSel,
                onSelected: (_) => setState(() => _subsystem = sub),
                selectedColor: const Color(0xFF06B6D4).withValues(alpha: 0.3),
                backgroundColor: const Color(0xFF161A33),
                labelStyle: TextStyle(
                    color: isSel
                        ? const Color(0xFF4CD7F6)
                        : const Color(0xFFBCC9CD),
                    fontWeight: FontWeight.bold),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),
          const Text('BITÁCORA DE OBSERVACIÓN TÉCNICA',
              style: TextStyle(
                  fontSize: 11,
                  color: Color(0xFFBCC9CD),
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          TextField(
            controller: _obsController,
            maxLines: 4,
            style: const TextStyle(color: Color(0xFFDEE0FF), fontSize: 13),
            decoration: InputDecoration(
              filled: true,
              fillColor: const Color(0xFF080C25),
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Colors.white10)),
            ),
          ),
          const SizedBox(height: 16),
          SwitchListTile(
            title: const Text('Alerta Push al Técnico',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            subtitle: const Text('Despacho inmediato a guardia técnica',
                style: TextStyle(fontSize: 11, color: Color(0xFFBCC9CD))),
            value: _pushAlert,
            onChanged: (val) => setState(() => _pushAlert = val),
            activeThumbColor: const Color(0xFF4CD7F6),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                    content: Text('Guardado y sincronizado con Supabase')),
              );
              Navigator.pop(context);
            },
            icon: const Icon(Icons.sync, color: Color(0xFF003640)),
            label: const Text('Guardar y Sincronizar',
                style: TextStyle(
                    color: Color(0xFF003640), fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4CD7F6),
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
