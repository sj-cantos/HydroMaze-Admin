name: Hydromaze-Admin

services:

  backend:
    image: shannonjohn/hydromaze-admin-backend
    ports:
      - "4001:4001"
    environment:
      - VITE_DATABASE_URI=${VITE_DATABASE_URI}
      - ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}
      - REFRESH_TOKEN=${REFRESH_TOKEN}
      - NODE_ENV=${NODE_ENV:-development}
  

  frontend:
    image: shannonjohn/hydromaze-admin-frontend
    ports:
      - "8080:80"
