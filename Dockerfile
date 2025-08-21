# Stage 1 - Build Angular App
FROM node:22-alpine AS build
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm ci

# Copy source and build Angular project
COPY . .
RUN npm run build -- --configuration production

# Stage 2 - Serve with Nginx
FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output
COPY --from=build /app/dist/WiFi-Controller-UI/browser /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
