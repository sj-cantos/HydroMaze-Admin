FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Remove Cypress from package.json before install
RUN npm pkg delete devDependencies.cypress

# Install dependencies and build
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the server block into conf.d so nginx loads it
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the standard nginx container port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]