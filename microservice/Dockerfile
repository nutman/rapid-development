# Use an appropriate Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the microservice code to the container
COPY . .

# Expose the port your microservice listens on
EXPOSE 4000

# Start your microservice
CMD ["npm", "run", "start:prod"]
