#!/bin/sh
set -e

echo "==> Ajustando permissões do volume de uploads..."
mkdir -p ./public/uploads
chown -R nextjs:nodejs ./public/uploads

echo "==> Aplicando migrations do Prisma..."
su-exec nextjs node ./node_modules/prisma/build/index.js migrate deploy

echo "==> Iniciando aplicação Next.js..."
exec su-exec nextjs "$@"
