
import { createClient } from '@supabase/supabase-js';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = async (SupabaseAccessToken) => {
    const supabase = createClient(supabaseUrl, supabaseKey, {
        global:{
            headers: {
                Authorization : `Bearer ${SupabaseAccessToken}`
            }
        }
    })
    return supabase;
}

export default supabaseClient;
        