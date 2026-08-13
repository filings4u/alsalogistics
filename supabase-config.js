// Set up global environment keys directly on the browser window object context layer
window.SUPABASE_URL = "ailzwppwsdvxtctryapb";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbHp3cHB3c2R2eHRjdHJ5YXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NzI1MzgsImV4cCI6MjEwMjE0ODUzOH0.dwAVbg1eNLplb5oTB-P_YpypOM70hZYfOdppugwK7Es";

// Initialize the database client only if the credentials are valid production keys
if (window.SUPABASE_URL && !window.SUPABASE_URL.includes("ailzwppwsdvxtctryapb")) {
    try {
        if (typeof window.supabase !== 'undefined') {
            window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
            console.log("ALSA Core System Connect: Active.");
        }
    } catch (err) {
        console.warn("Supabase library connection skipped:", err.message);
    }
} else {
    window.supabaseClient = null;
    console.log("ALSA Core System Simulator: Enabled.");
}
