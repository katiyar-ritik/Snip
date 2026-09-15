# --- Stage 1: build the frontend ---
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- Stage 2: install backend dependencies ---
FROM node:22-alpine AS backend-deps
RUN apk add --no-cache python3 make g++
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev

# --- Stage 3: runtime image ---
FROM node:22-alpine
ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/app/data
WORKDIR /app/backend

COPY --from=backend-deps /app/backend/node_modules ./node_modules
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./public

VOLUME ["/app/data"]
EXPOSE 3000

CMD ["node", "src/index.js"]
