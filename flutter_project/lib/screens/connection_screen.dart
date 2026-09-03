import 'package:flutter/material.dart';

class ConnectionScreen extends StatelessWidget {
  const ConnectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D112A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF080C25).withValues(alpha: 0.85),
        title: const Text('Canal en Tiempo Real', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF06B6D4).withValues(alpha: 0.2),
                  border: Border.all(color: const Color(0xFF4CD7F6), width: 2),
                ),
                child: const Icon(Icons.hub, size: 48, color: Color(0xFF4CD7F6)),
              ),
              const SizedBox(height: 24),
              const Text(
                'Conectando canal en tiempo real...',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFFDEE0FF)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'Estableciendo WebSocket con Supabase · Escuchando cambios en la tabla equipos_salon_317',
                style: TextStyle(fontSize: 12, color: Color(0xFFBCC9CD)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFF161A33),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF4AE176).withValues(alpha: 0.4)),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.check_circle, color: Color(0xFF4AE176), size: 16),
                    SizedBox(width: 8),
                    Text('Latencia: 24ms · Reintentos: 0 · Sincronizado', style: TextStyle(fontSize: 11, color: Color(0xFFDEE0FF))),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
