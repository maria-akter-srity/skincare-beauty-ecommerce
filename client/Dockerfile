# FROM node:18
# WORKDIR /app
# COPY . .
# RUN npm install --force -y
# CMD ["npm","run","dev"]
# ---- Stage 1: Build ----
FROM node:18 AS builder
WORKDIR /app

# Copy only package files first for better layer caching
COPY package*.json ./
RUN npm install --force

# Copy the rest of the source and build (skip if you have no build step)
COPY . .

RUN npm run build 2>/dev/null || echo "No build script found, skipping"

# ---- Stage 2: Runtime ----
FROM node:18-slim AS runner
WORKDIR /app

# Copy only what's needed to run the app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app .

# Use a non-root user for safety
USER node

EXPOSE 5173
CMD ["npm", "run", "dev"]