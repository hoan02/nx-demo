# Multi-stage build for Users app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy source code
COPY apps/users ./apps/users
COPY libs ./libs

# Install dependencies
RUN npm ci

# Build the application
RUN npx nx build users --prod

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist/apps/users /usr/share/nginx/html

# Copy nginx configuration
COPY apps/users/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 