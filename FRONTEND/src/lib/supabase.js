import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvitqvrwaqxghakonmiy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2aXRxdnJ3YXF4Z2hha29ubWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNzg1ODYsImV4cCI6MjA5MjY1NDU4Nn0.2TmVP82N4w1ohI3kLJ7yJpa2VQ5BPKkk4hdjOiZEGO4';

export const supabase = createClient(supabaseUrl, supabaseKey);