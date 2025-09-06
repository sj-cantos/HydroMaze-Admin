FROM node:20-alpine

WORKDIR /app

# Install runtime deps only
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Expose the server port (adjust if your server listens on a different port)
EXPOSE 4001

# Start the server (uses package.json "start" script or adjust to node index.js)
CMD ["npm", "start"]
