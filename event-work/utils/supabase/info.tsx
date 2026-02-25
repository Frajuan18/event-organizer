// utils/supabase/info.ts
// Use import.meta.env for Vite, not process.env

export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || '';
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`;
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate that the values are set
if (!projectId) {
  console.warn('⚠️ VITE_SUPABASE_PROJECT_ID is not set in .env.local');
}

if (!publicAnonKey) {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY is not set in .env.local');
}

// For debugging (values will be undefined if not set)
console.log('🔧 Supabase Config:', {
  projectId: projectId ? '✅ Set: ' + projectId.substring(0, 5) + '...' : '❌ Missing',
  supabaseUrl: supabaseUrl ? '✅ Set' : '❌ Missing',
  anonKey: publicAnonKey ? '✅ Set: ' + publicAnonKey.substring(0, 5) + '...' : '❌ Missing'
});

// Export a function to check config
export function isSupabaseConfigured(): boolean {
  return !!(projectId && publicAnonKey);
}