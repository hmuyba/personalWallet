# Stage 1: Build the Angular app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Angular app (Angular 19 syntax)
RUN npm run build -- --configuration=production

# Stage 2: Serve the app with nginx
FROM nginx:alpine

# Copy built app to nginx (ruta correcta para Angular 19)
COPY --from=build /app/dist/personalWallet/browser /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

