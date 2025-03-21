import { createClient } from '@supabase/supabase-js';

// Fetch Supabase URL and Key from environment variables
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure the values are available before creating the client
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is missing');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
