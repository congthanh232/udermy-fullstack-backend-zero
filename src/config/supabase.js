const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mlpytfbnpfdpqsbbpbou.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scHl0ZmJucGZkcHFzYmJwYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTA1NzIsImV4cCI6MjA4OTE2NjU3Mn0.1Jfy5VMXMNrMUuhzr44yuYXCwxeOqefB6x8aRv-HKkI";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
