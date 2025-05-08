import { createClient } from '@supabase/supabase-js';

// Estas variables deberían estar en un archivo .env
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
