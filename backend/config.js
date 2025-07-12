// Configuration file for Supabase integration
// Replace these with your actual Supabase project URL and anon public key

window.SUPABASE_CONFIG = {
    url: 'https://xvhwjewpwgtwaopicnpk.supabase.co', // Replace with your actual project URL from Supabase Settings → API
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aHdqZXdwd2d0d2FvcGljbnBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzQ1MTMsImV4cCI6MjA2Nzg1MDUxM30.laenKKIe0AGyPhZtEdJGoHiTGIWFTkmFLIKLYAiP0Fc' // Replace with the "anon public" key from Supabase Settings → API
};

// Note: The anon public key is safe to expose in client-side code
// Make sure to set up Row Level Security (RLS) on your Supabase table for security 