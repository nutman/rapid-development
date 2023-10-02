# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your Nest.js application listens on (default is 3000)
EXPOSE 3000

# Start the Nest.js application
CMD ["npm", "run", "start:prod"]

