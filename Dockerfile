# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prepare && npm run build

# Runtime stage
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./
RUN npm ci --omit=dev

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "build"]
