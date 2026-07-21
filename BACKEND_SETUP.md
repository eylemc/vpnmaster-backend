# VPNMaster backend setup

1. Create a Supabase project.
2. Run `supabase/migrations/202607210001_initial_saas.sql` in the Supabase SQL editor.
3. In Authentication > Providers, enable Google and disable all other providers.
4. Create Google OAuth credentials and use the callback URL shown by Supabase.
5. In Authentication > URL Configuration, set the production Site URL and add:
   - `http://localhost:5173/auth/callback`
   - `https://YOUR_DOMAIN/auth/callback`
6. Copy `.env.example` to `.env` and fill in the project URL and anon key.

The anon key is intended for browser use. Never place the Supabase service-role key in the frontend.
