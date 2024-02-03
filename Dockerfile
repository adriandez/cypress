# Start from the Node.js version 20.11.0 image
FROM node:20.11.0

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json into the Docker image
COPY package*.json ./

# Install project dependencies
RUN npm install

# Install additional necessary dependencies for Cypress
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        xvfb \
        libgtk2.0-0 \
        libgtk-3-0 \
        libgbm-dev \
        libnotify-dev \
        libgconf-2-4 \
        libnss3 \
        libxss1 \
        libasound2 \
        libxtst6 \
        xauth \
        xvfb \
        && rm -rf /var/lib/apt/lists/*

# Copy the rest of your project files into the Docker image
COPY . .

# Run Cypress tests in headless mode with the specified pattern
CMD ["npx", "cypress", "run", "--headless", "--browser", "electron", "--spec", "cypress/e2e/*.cy.js"]




