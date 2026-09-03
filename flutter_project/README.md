# PulsoSala - Flutter & Supabase Realtime

Sistema de telemetría y monitoreo en tiempo real de salones de cómputo y estaciones de trabajo universitarias o empresariales.

## Requisitos
- Flutter 3.16 o superior
- Dart 3.2 o superior
- Cuenta en [Supabase](https://supabase.com)

## Configuración de Supabase
1. En tu proyecto de Supabase, ve al **SQL Editor** y ejecuta:

```sql
create table if not exists salones (
  id text primary key,
  nombre text not null,
  tipo text not null,
  capacidad int not null default 30,
  activos int not null default 27,
  fallas int not null default 3,
  operatividad int not null default 90,
  rack_ubicacion text default 'Rack Cisco A-4',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists equipos_salon_317 (
  id text primary key,
  salon_id text default '317',
  numero text not null,
  estado text not null check (estado in ('operativo', 'falla')),
  falla_titulo text,
  falla_desc text,
  subsistema text,
  prioridad text,
  especificaciones text default 'Core i7 12th Gen / 16GB RAM',
  ubicacion text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar replicación Realtime
alter publication supabase_realtime add table equipos_salon_317;
alter publication supabase_realtime add table salones;
```

2. Configura las variables en `lib/config/supabase_config.dart` o pásalas al correr la app:
```bash
flutter run --dart-define=SUPABASE_URL="https://xyz.supabase.co" --dart-define=SUPABASE_ANON_KEY="eyJhbG..."
```

## Estructura de Pantallas
1. `SalonesScreen`: Vista general de salones, estado de red y filtros.
2. `EquiposScreen`: Mapa de 30 terminales con telemetría en tiempo real y detección de fallas.
3. `DetalleEquipoScreen`: Inspección profunda de terminal, curva de osciloscopio HDMI y bitácora de eventos.
4. `NuevoIncidenteScreen`: Formulario táctil de despacho con prioridades y alerta push.
5. `ConnectionScreen`: Radar de sincronización WebSocket y estado de enlace Supabase.
