# ---- Builder ----
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY .sequelizerc ./
COPY src/ ./src/

RUN npm run build

# ---- Production ----
FROM node:24-alpine AS production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./dist
COPY .sequelizerc ./
COPY src/infrastructure/config/database.js ./src/infrastructure/config/database.js
COPY src/infrastructure/database/migrations ./src/infrastructure/database/migrations
COPY src/infrastructure/database/seeders ./src/infrastructure/database/seeders

USER appuser

EXPOSE 3000

CMD ["node", "dist/main.js"]
