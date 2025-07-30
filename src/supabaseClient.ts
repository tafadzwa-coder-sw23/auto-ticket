import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xuxvaabyhauobygmfvyx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1eHZhYWJ5aGF1b2J5Z21mdnl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTcwODgsImV4cCI6MjA2ODgzMzA4OH0.NpcXJ4q34YIUBTzomfpRc9MlhrOHcBSpdK_AWVZ6gVQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
