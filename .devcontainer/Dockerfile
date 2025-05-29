# This Dockerfile can be used for additional customizations
# Currently using the base image directly in devcontainer.json

FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# Install additional tools if needed
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set up Node.js environment
USER node
WORKDIR /workspace

# Copy package files for better caching
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install && cd client && npm install

# Default command
CMD ["npm", "run", "dev"]
