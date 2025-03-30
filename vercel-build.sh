#!/bin/bash
echo "Creando environment.ts en Vercel..."

mkdir -p src/environments

cat <<EOT > src/environments/environment.ts
export const environment = {
  production: true,
  supabaseUrl: '${SUPABASE_URL}',
  supabaseAnonKey: '${SUPABASE_ANON_KEY}',
  redirectUrl: '${REDIRECT_URL}',
  cloudinaryUploadUrl: '${CLOUDINARY_UPLOAD_URL}'
};
EOT
