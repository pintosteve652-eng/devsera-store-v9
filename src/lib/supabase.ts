import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Lovable does not support runtime VITE_* env vars in the browser.
// Use the project's Supabase URL + anon key directly.
const supabaseUrl = 'https://cechkvznlmzelmhpftcl.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlY2hrdnpubG16ZWxtaHBmdGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODc3NDEsImV4cCI6MjA4MTM2Mzc0MX0.0mM7CkfH22Mn8uiqU2WhvRbDyt1XCOQfkbN486niEAY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = true;

