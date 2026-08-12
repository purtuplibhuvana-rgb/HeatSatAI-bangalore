# Build Stage
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
# Use a build-time argument for API URL if needed, default to relative for same-domain
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Serve Stage
FROM nginx:alpine

# Copy built assets to NGINX serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
