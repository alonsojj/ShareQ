# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Install LibreOffice for file conversion
RUN apk add --no-cache libreoffice

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Define the command to run the app
CMD ["node", "server.js"]
