FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source
COPY . .

# Create auth directory for session persistence
RUN mkdir -p auth_info

EXPOSE 3001

CMD ["node", "index.js"]
