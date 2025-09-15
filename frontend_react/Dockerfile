FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY . .

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY index.html ./

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "preview", "--", "--host", "--port", "3000"]
