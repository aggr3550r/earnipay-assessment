# Use the official Node.js 14 image as the base
FROM node:lts-slim AS base

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --legacy-peer-deps


# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript source code
RUN npm run build

# Generate Prisma Client
RUN npx prisma generate

# Remove development dependencies (optional)
# RUN npm prune --production

# Use a lightweight Node.js image for the final image
FROM node:lts-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built application code from the previous stage
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules

# Set the container port
EXPOSE 3000

# Define the command to start the application
CMD ["node", "dist/main.js"]

