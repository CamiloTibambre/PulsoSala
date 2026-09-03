import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  // Reemplaza con las credenciales de tu proyecto de Supabase
  // https://supabase.com/dashboard/project/_/settings/api
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://sadeqzcwusrgrgdgmcfz.supabase.co',
  );

  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'sb_publishable_OqpdFiLJJPD_NN4klFoAIg_7Hil1EM_',
  );

  static Future<void> initialize() async {
  await Supabase.initialize(
    url: supabaseUrl,
    publishableKey: supabaseAnonKey, // antes: anonKey: supabaseAnonKey,
    realtimeClientOptions: const RealtimeClientOptions(
      eventsPerSecond: 10,
    ),
  );
}

  static SupabaseClient get client => Supabase.instance.client;
}
