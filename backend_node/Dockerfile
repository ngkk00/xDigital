# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY tsoa.json ./ 

RUN npm ci

COPY src/ ./src/

RUN npm run build

# Generate swagger docs, must run after build else will be overwrite
RUN npm run tsoa:build

# Production stage
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Only production dependencies
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["npm", "start"]
