# Start from the Node.js base image
FROM node:20.11.0

# Set the working directory in the Docker image
WORKDIR /app

# Install Xvfb, D-Bus, and other necessary dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    xvfb \
    dbus-x11 \
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
    xvfb && \
    dbus-uuidgen > /var/lib/dbus/machine-id && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g npm@latest && \
    # Verify that npm and node are correctly installed
    node --version && npm --version

# Copy package.json and package-lock.json into the Docker image
COPY package*.json ./

# Install project dependencies, including Cypress
RUN npm ci

# Set up the Xvfb display and add environment variable for D-Bus
ENV DISPLAY=:
ENV DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus

# Set TERM environment variable to avoid terminal-related warnings
ENV TERM xterm

# Copy custom scripts into the Docker image and make them executable
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY verify-cypress.sh /usr/local/bin/verify-cypress.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh /usr/local/bin/verify-cypress.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Copy the rest of your project files into the Docker image
COPY . .

# The CMD instruction should be used to run Cypress
# This is the default command that runs when the container starts
CMD ["npx", "cypress", "run", "--headless", "--browser", "electron"]

