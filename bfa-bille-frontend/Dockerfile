# ============================================================
# BFA Bille Academy — Frontend (React + Vite)
# Dockerisation la plus simple possible :
#   1) build des assets statiques (dist/)
#   2) serveur web nginx léger qui sert dist/ avec fallback SPA
# ============================================================

# ---------- Étape 1 : build ----------
FROM node:22-alpine AS build
WORKDIR /app

# Dépendances d'abord (meilleur cache Docker)
COPY package.json package-lock.json ./
RUN npm ci

# Code source puis build
COPY . .
RUN npm run build

# ---------- Étape 2 : serveur web ----------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
