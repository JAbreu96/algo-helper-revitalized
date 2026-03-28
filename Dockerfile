# Stage 1: Build client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Build server
FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine
WORKDIR /app

# Install production server dependencies
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

# Copy built server
COPY --from=server-build /app/server/dist ./dist

# Copy built client into the path the server expects
COPY --from=client-build /app/client/dist ./client-dist

# Create data directory for SQLite databases
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# SQLite databases persist in /app/data
VOLUME ["/app/data"]

CMD ["node", "dist/index.js"]
