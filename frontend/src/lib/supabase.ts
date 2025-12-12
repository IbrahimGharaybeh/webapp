import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ghbwuiiefddfqmgiboww.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYnd1aWllZmRkZnFtZ2lib3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjE2NDUsImV4cCI6MjA4MTA5NzY0NX0.PoefSHZMlMG9RrVNVmyDFQOPHk0Plykm3cCuwHveNwk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);