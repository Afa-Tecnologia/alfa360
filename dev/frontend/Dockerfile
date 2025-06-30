# Estágio de build
FROM node:23-alpine AS builder
WORKDIR /app

# Copiar arquivos de configuração
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

# Copiar o restante do código
COPY frontend/ .

# Variáveis de ambiente em tempo de build (apenas ARG, não ENV)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ACCESS_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
ARG NEXT_PUBLIC_CLOUDINARY_HIDE_SESSION

# Build da aplicação Next.js no modo standalone
RUN npm run build

# Estágio de produção
FROM node:23-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copiar arquivos da build do estágio anterior
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Mudar para o usuário não-root
USER nextjs

EXPOSE 3001

# Rodar o app no modo standalone
CMD ["node", "server.js"]
