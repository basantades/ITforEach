#!/bin/bash
echo "Creando environment.ts en Vercel..."

cat <<EOT > src/environments/environment.ts
export const environment = {
  production: true,
  supabaseUrl: '${SUPABASE_URL}',
  supabaseAnonKey: '${SUPABASE_ANON_KEY}',
  redirectUrl: '${REDIRECT_URL}'
};
EOT
