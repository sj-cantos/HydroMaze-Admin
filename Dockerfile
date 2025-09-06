FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Remove Cypress from package.json before install
RUN npm pkg delete devDependencies.cypress

# Install all dependencies except Cypress
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080:80
CMD ["nginx", "-g", "daemon off;"]