# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the built files using Nginx
FROM nginx:1.25-alpine
# Copy the built static files from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]