# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build
RUN npm ci --production

ENV PORT=8080
EXPOSE 8080
CMD ["node", "build"]
