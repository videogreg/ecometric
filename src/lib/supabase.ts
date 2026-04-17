import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgkcnkhbnecdzpffppfq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna2Nua2hibmVjZHpwZmZwcGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzODM2MDAsImV4cCI6MjA5MTk1OTYwMH0.Hfq8QxrZy6lPj0dBqpOi00HTfYF4dUzJTGNhJX1cDaw';

export const supabase = createClient(supabaseUrl, supabaseKey);